import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { LogicsService } from '../../shared/logics.service';
import { CommonModule } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { ApiService } from '../../shared/api.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

type PaintData = {
  [key: string]: string | Array<{ pack: string; price: string }> | null;
};
interface TargetData {
  materialCode: string;
  customerId: string;
  pack: string;
  price: string;
  qty: string;
  cdate: string;
  productname: string;
}

@Component({
  selector: 'product-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-view.component.html',
  styleUrl: './product-view.component.scss',
})
export class ProductViewComponent implements OnInit {
  data: any = [];
  @ViewChild('pack') packP!: ElementRef<HTMLButtonElement>;
  @ViewChild('packTwo') packTwo!: ElementRef<HTMLButtonElement>;
  @ViewChild('packThree') packThree!: ElementRef<HTMLButtonElement>;
  ngOnInit(): void {
    this.logic.getcolor().subscribe((res: any) => {
      console.log(res, 'colors');
      this.colors = res;
      this.selectColor('red');
    });
    this.logic.productDetails.subscribe((res: any) => {
      console.log('prodcut', res);
      this.data = res;
    });

    // this.colors.map((item:any)=>{
    //   console.log(item.title);

    // })
  }
  logic = inject(LogicsService);
  fb = inject(FormBuilder);
  api = inject(ApiService);
  router = inject(Router)
  ctnClr = '#ffffff';
  ogColor: any = '';
  selectedColor: any;
  // packDetails: any = [];
  packDetails: any[] = [];
  selectedColors: any = [];
  defaultColors: any = [];
  details: any = []
  cartValues: any
  customerId: any
  quantities: number[] = []; // Array to hold quantities for each pack
  totalPrice: number = 0;
  filteredData: PaintData = {};
  productDetails: any = []
  selectColor(v: any) {
    this.selectedColor = v;
    let index = this.colors.findIndex((item: any) => {
      return v == item.title;
    });
    this.selectedColors = this.colors[index].colors;
    this.defaultColors = this.colors[index].colors;
  }
  selectOg(v: any) {
    this.ogColor = v;
  }
  onMouseEnter(v: any) {
    this.ctnClr = v;
  }

  pack2(v: any, details: any, num: number) {
    console.log(details, "on pack click");

    this.selectedPack = v;
    this.details = details;
    if (typeof details === 'object' && !Array.isArray(details)) {
      this.packDetails = [details]; // Wrap the object in an array
    } else if (Array.isArray(details)) {
      this.packDetails = details; // Assign directly if it's an array
    } else {
      console.error('Expected details to be an object or an array, but received:', details);
      this.packDetails = []; // Reset if unexpected type
    }

    // console.log(this.packDetails, 'packdetails');
    // console.log(v, 'selected');
    // console.log(this.selectedPack, 'selected');

    console.log(this.packDetails, 'packdetails');
    if (num == 1) {
      this.packP.nativeElement.click();
    } else if (num == 2) {
      this.packTwo.nativeElement.click();
    } else if (num == 3) {
      this.packThree.nativeElement.click();
    }
  }
  updateQuantity(index: number, event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.quantities[index] = parseInt(inputElement.value, 10) || 0;
  }

  //change data as per out format
  filterNonEmpty(obj: PaintData): PaintData {
    return Object.entries(obj)
      .filter(([_, value]) => value !== null && !(Array.isArray(value) && value.length === 0))
      .reduce((acc, [key, value]) => {
        if ((key === 'JN_details' || key == 'BERGER_details' || key == 'Asian_detils') && Array.isArray(value)) {
          acc[key] = value.map((item, index) => ({
            ...item,
            quantity: this.quantities[index] || 0
          }));
        } else {
          acc[key] = value;
        }
        return acc;
      }, {} as PaintData);
  }

  // convertData = (data: PaintData[]): TargetData[] => {
  //   console.log(data, "convert data")
  //   return data
  //     .map(item => {
  //       const brandKey = Object.keys(item).find(key => key.includes("_details")) as string;
  //       const productKey = Object.keys(item).find(key => key.includes("_PAINTS")) as string;

  //       if (brandKey && productKey && item[brandKey] && Array.isArray(item[brandKey])) {
  //         const details = item[brandKey] as Array<{ pack: string; price: string; quantity: number }>;
  //         return {
  //           customerId: localStorage.getItem("apCusId"),
  //           pack: details[0].pack,
  //           price: details[0].price,
  //           qty: details[0].quantity.toString(),
  //           cdate: "",
  //           productname: item[productKey] as string
  //         };
  //       }

  //       return undefined; // Return undefined if fields are missing
  //     })
  //     .filter((item): item is TargetData => item !== undefined); // Filter out undefined items
  // };

  convertData = (data: PaintData[]): TargetData[] => {
    return data
      .map(item => {
        console.log(item, "item");

        const brandKey = Object.keys(item).find(key => key.includes("_details")) as string;
        console.log(brandKey, "brandKey");
        const prefix = brandKey.split('_')[0];
        const productKey = Object.keys(item).find(key => key.includes("_PAINTS")) as string;
        const materialCodeKey = Object.keys(item).find(key => key.includes(prefix+"_MaterialCode")) as string; // Get material code key
        console.log(materialCodeKey, "MaterialCode");

        if (brandKey && productKey && materialCodeKey && item[brandKey] && Array.isArray(item[brandKey])) {
          const details = item[brandKey] as Array<{ pack: string; price: string; quantity: number }>;
          return {
            customerId: localStorage.getItem("apCusId"),
            pack: details[0].pack,
            price: details[0].price,
            qty: details[0].quantity.toString(),
            cdate: "",
            productname: item[productKey] as string,
            materialCode: item[materialCodeKey] as string // Add material code to the returned object
          };
        }

        return undefined; // Return undefined if fields are missing
      })
      .filter((item): item is TargetData => item !== undefined); // Filter out undefined items
  };


  addtocart() {
    // Calculate the total price
    this.totalPrice = this.calculateTotalPrice();

    this.filteredData = this.filterNonEmpty(this.data);
    console.log(this.filteredData, "filter");

    const cartItem = [
      this.filteredData
    ]
    this.productDetails = this.convertData(cartItem);
    console.log(this.productDetails[0], "productDetails");

    this.logic.cartItems = [...this.logic.cartItems, cartItem]

    this.logic.cart = {
      "customerId": localStorage.getItem("apCusId"),
      "products": [
        this.logic.cartItems
      ]
    }

    console.log(this.logic.cart, "cart details");

    this.logic.cus('success', '', 'Added to the cart!');

    // Optionally navigate to the cart page
    // this.router.navigate(['/cart']);
  }


  calculateTotalPrice(): number {
    let total = 0;

    this.packDetails.forEach((detail, index) => {
      // Assuming detail.price holds the price for each pack
      const pricePerPack = parseFloat(detail.price) || 0; // Ensure it's a number
      const quantity = this.quantities[index] || 0; // Get the quantity or default to 0
      total += pricePerPack * quantity; // Calculate total price
    });

    return total;
  }

  addCart() {
    console.log(this.productDetails[0]);
    
    this.api.cartCreate(this.productDetails[0]).subscribe({
      next: (res: any) => {
        // Assuming res is a success response
        console.log('Response received:', res);
        this.logic.cus('success', '', 'Cart Updated!');
      },
      error: (err: HttpErrorResponse) => {
        console.log('Error occurred:', err);

        // Check if the status is available in the error
        if (err.status === 200) {
          console.log("test");
          this.logic.cus('success', '', 'Cart Updated!');
        } else {
          // Handle other error statuses
          console.error(`Error Status: ${err.status} - ${err.message}`);
        }
      }
    });
  }

  // addCart(paints: any, paint_details: any, brand: any) {
  //   // this.logic.cart.push({
  //   //   ...this.data,
  //   //   selectedPack: paints,
  //   //   color: this.ogColor,
  //   //   selectDetails: paint_details,
  //   //   brandName: brand
  //   // });

  //   // this.logic.cart.push({
  //   //   customerId: localStorage.getItem("apCusId"),
  //   //   products: [
  //   //     {

  //   //     }
  //   //   ]
  //   // })
  //   console.log(this.logic.cart, 'added to cart');
  //   this.logic.cus('success', '', 'Added to the cart!')
  // }

  // addCart() {
  //   this.api.cartCreate(this.productDetails[0]).subscribe((res: any) => {
  //     console.log(res.status, "response")
  //     console.log();


  //     if (res.status == 200) {
  //       console.log("test");

  //       this.logic.cus('success', '', 'Cart Updated!')
  //     }
  //   }, (err) => {
  //     console.log(err);

  //   })
  // }

  selectedPack: any;
  colors: any = [];
  searchColor(v: any) {
    v = v.trim();
    console.log(v);
    if (!v) {
      this.selectedColors = this.defaultColors;
    }
    let filteredColors = this.defaultColors.filter(
      (color: any) =>
        color.colorname.toLowerCase().includes(v.toLowerCase()) ||
        color.sheenlacode.toLowerCase().includes(v.toLowerCase())
    );
    this.selectedColors = filteredColors;
    // console.log(filteredColors,v);
  }
  // colors:any=[
  //   {
  //     "title": "Red",
  //     "colors": [
  //       "#FF0000", "#E60000", "#CC0000", "#B30000", "#990000", "#800000", "#FF3333", "#FF6666",
  //       "#FF9999", "#FFCCCC", "#E63946", "#DC143C", "#F08080", "#FA8072", "#CD5C5C", "#A52A2A",
  //       "#B22222", "#D32F2F", "#EF5350", "#F44336", "#FF5252", "#FF1744", "#D50000", "#C62828",
  //       "#E53935", "#FF6F61", "#F4511E", "#F4511E", "#B71C1C", "#FF8A80", "#FF1744", "#AD2C2A",
  //       "#E57373", "#FF4500", "#C21807", "#D32F2F", "#E57373", "#FCE4EC", "#F9C7CC", "#FF6D6A",
  //       "#FF2B2B", "#FCA4A6", "#FF8485", "#D40000", "#800020", "#FFA07A", "#FF5C57", "#B23A48",
  //       "#FF0038", "#C41E3A"
  //     ]
  //   },
  //   {
  //     "title": "Green",
  //     "colors": [
  //       "#00FF00", "#00E600", "#00CC00", "#00B300", "#009900", "#008000", "#66FF66", "#99FF99",
  //       "#CCFFCC", "#339933", "#006400", "#228B22", "#32CD32", "#3CB371", "#2E8B57", "#00FA9A",
  //       "#98FB98", "#90EE90", "#8FBC8F", "#9ACD32", "#ADFF2F", "#7FFF00", "#76FF03", "#64DD17",
  //       "#4CAF50", "#81C784", "#66BB6A", "#00FF7F", "#A7FFEB", "#C8E6C9", "#AED581", "#8BC34A",
  //       "#7CB342", "#689F38", "#388E3C", "#00695C", "#00796B", "#004D40", "#1B5E20", "#C0D9AF",
  //       "#DAF7DC", "#E3F9E5", "#99FFB2", "#69F0AE", "#00E676", "#00C853", "#00BFA5", "#00897B",
  //       "#004D40", "#80CBC4", "#9CCC65"
  //     ]
  //   },
  //   {
  //     "title": "Blue",
  //     "colors": [
  //       "#0000FF", "#0000E6", "#0000CC", "#0000B3", "#000099", "#000080", "#3333FF", "#6666FF",
  //       "#9999FF", "#CCCCFF", "#00008B", "#1E90FF", "#6495ED", "#4169E1", "#4682B4", "#5F9EA0",
  //       "#87CEEB", "#87CEFA", "#00BFFF", "#ADD8E6", "#B0C4DE", "#AFEEEE", "#40E0D0", "#48D1CC",
  //       "#00CED1", "#20B2AA", "#008B8B", "#008080", "#00FFFF", "#7FFFD4", "#66CCFF", "#4FC3F7",
  //       "#29B6F6", "#039BE5", "#0288D1", "#0277BD", "#01579B", "#B3E5FC", "#81D4FA", "#03A9F4",
  //       "#0091EA", "#00B0FF", "#40C4FF", "#0097A7", "#00ACC1", "#00BCD4", "#009688", "#00796B",
  //       "#004D40", "#3D5AFE"
  //     ]
  //   },
  //   {
  //     "title": "Pink",
  //     "colors": [
  //       "#FFC0CB", "#FFB6C1", "#FF69B4", "#FF1493", "#DB7093", "#C71585", "#F06292", "#E91E63",
  //       "#F48FB1", "#F8BBD0", "#FF80AB", "#FF4081", "#F50057", "#C2185B", "#AD1457", "#880E4F",
  //       "#FCE4EC", "#F9C7CC", "#F48FB1", "#FF6D6A", "#FFABAB", "#FFB6C1", "#FFC0CB", "#FA8072",
  //       "#FF5470", "#E57373", "#FF5C8D", "#FE6B8B", "#F06292", "#EC407A", "#D81B60", "#C2185B",
  //       "#E91E63", "#F50057", "#FF4081", "#F8BBD0", "#FF80AB", "#FF80AB", "#F06292", "#880E4F",
  //       "#FF1744", "#AD1457", "#FF4081", "#EC407A", "#F50057", "#D81B60", "#C2185B", "#E91E63",
  //       "#F8BBD0", "#FF1744"
  //     ]
  //   },
  //   {
  //     "title": "Orange",
  //     "colors": [
  //       "#FFA500", "#FF8C00", "#FF7F50", "#FF6347", "#FF4500", "#FF7518", "#FFA07A", "#FF5733",
  //       "#FF6F00", "#FF4500", "#FFB347", "#FF7043", "#FF5722", "#FF9800", "#FFA726", "#FFCC80",
  //       "#FFE0B2", "#FFAB40", "#FF6D00", "#FF6F00", "#FF7043", "#FFAB91", "#FFCCBC", "#FB8C00",
  //       "#F57C00", "#E65100", "#FFECB3", "#FF6D00", "#FF3D00", "#FF9100", "#FFC107", "#FFA000",
  //       "#FFB300", "#FFC400", "#FFCA28", "#FFEE58", "#FFEB3B", "#FFEB3B", "#FFD600", "#FFAB00",
  //       "#FFB300", "#FFCC00", "#FFAB91", "#FFE082", "#FFE57F", "#FFC107", "#FF6F00", "#FF9100",
  //       "#FF9F00", "#FF6F00"
  //     ]
  //   },
  //   {
  //     "title": "Gold",
  //     "colors": [
  //       "#FFD700", "#E6BE8A", "#DAA520", "#B8860B", "#FFCF40", "#D4AF37", "#C5B358", "#FFDD99"
  //     ]
  //   },
  //   {
  //     "title": "Silver",
  //     "colors": [
  //       "#C0C0C0", "#D3D3D3", "#A9A9A9", "#B0B0B0", "#E0E0E0", "#778899", "#BFC1C2", "#BCC6CC"
  //     ]
  //   },
  //   {
  //     "title": "Royal Blue",
  //     "colors": [
  //       "#4169E1", "#2B547E", "#23478A", "#0C2D83", "#003366", "#27408B", "#002366", "#1E90FF"
  //     ]
  //   },
  //   {
  //     "title": "Emerald Green",
  //     "colors": [
  //       "#50C878", "#046307", "#00A36C", "#4CBB17", "#01796F", "#2E8B57", "#228B22", "#006400"
  //     ]
  //   },
  //   {
  //     "title": "Crimson Red",
  //     "colors": [
  //       "#DC143C", "#990000", "#B22222", "#8B0000", "#9B111E", "#A40000", "#7E191B", "#D70040"
  //     ]
  //   },
  //   {
  //     "title": "Champagne",
  //     "colors": [
  //       "#F7E7CE", "#F1DDCF", "#FAD6A5", "#DECBA4", "#F5E6C4", "#EED9C4", "#F8ECD5", "#F5DEB3"
  //     ]
  //   },
  //   {
  //     "title": "Deep Purple",
  //     "colors": [
  //       "#673AB7", "#4B0082", "#8A2BE2", "#5D3FD3", "#6A0DAD", "#8E44AD", "#483D8B", "#3A0088"
  //     ]
  //   },
  //   {
  //     "title": "Black",
  //     "colors": [
  //       "#000000", "#2C2C2C", "#333333", "#1C1C1C", "#1E1E1E", "#0D0D0D", "#121212", "#181818"
  //     ]
  //   }
  // ]
}
