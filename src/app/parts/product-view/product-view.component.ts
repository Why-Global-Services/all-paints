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
  distributorcode: string;
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
  @ViewChild('packFour') packFour!: ElementRef<HTMLButtonElement>;


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
  allPacks: any = [];
  details: any = []
  cartValues: any
  customerId: any
  quantities: any; // Array to hold quantities for each pack
  totalPrice: number = 0;
  filteredData: PaintData = {};
  productDetails: any = []
  paint_index: any
  schemes: any[] = [];
  productPriceDetails: any[] = [];
  selectedEcomcode: any = ""
  schemesForm = this.fb.group({
    "filtervalue1": "",
    "filtervalue2": "",
    "filtervalue3": "scheme_v11",
    "filtervalue4": "",
    "filtervalue5": "",
    "filtervalue6": "",
    "filtervalue7": "",
    "filtervalue8": ""
  })

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
    this.api.getAllSchemes(this.schemesForm.value).subscribe((res: any) => {
      const parsedData = JSON.parse(res);
      console.log(parsedData);

      if (Array.isArray(parsedData) && parsedData.length > 0) {
        this.schemes = parsedData;
      }
    });


    // this.colors.map((item:any)=>{
    //   console.log(item.title);

    // })
  }
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

  pack2(data: any, v: any, details: any, num: number) {
    // console.log(num);
    let paintDetails = ""
    let paint_name = ""
    if (num === 1) {
      paintDetails = 'Asian_detils'
      paint_name = 'ASIAN_PAINTS'
    } else if (num === 2) {
      paintDetails = "BERGER_details"
      paint_name = "BERGER_PAINTS"
    } else if (num === 3) {
      paintDetails = "JN_details"
      paint_name = "JN_PAINTS"

    } else if (num === 4) {
      paintDetails = "Sheenlac_details"
      paint_name = "Sheenlac_PAINTS"

    }

    this.selectedEcomcode = data.ecomcode;
    console.log(this.selectedEcomcode);
    let packdetail =
    {
      "filtervalue1": "Packs",
      "filtervalue2": "",
      "filtervalue3": this.selectedEcomcode,
      "filtervalue4": "",
      "filtervalue5": "",
      "filtervalue6": "",
      "filtervalue7": ""
    }
    this.packDetails = [];
    this.api.getAllPacks(packdetail).subscribe({
      next: (responseSessionData: any) => {
        //console.log(responseSessionData, "pack details");
        this.allPacks = responseSessionData;
        this.allPacks.forEach((packD: any) => {
          const product = packD.products[0];


          if (product && product[paintDetails] && product[paintDetails].length > 0) {
            const productname = product[paint_name]
            const { pack, price } = product[paintDetails][0]; // Dynamically access the key
            console.log(`Pack: ${pack}, Price: ${price}`);
            // Push the object directly into this.packDetails
            this.packDetails.push({
              materialCode: packD.MaterialCode,
              pack: pack,
              price: price,
              productname: productname,
              paintName:paint_name
            });
            console.log(this.packDetails, "pack details data");

          } else {
            console.log('No pack or price details available.');
          }
        });

      },
      error: (error) => {
        console.error("Error fetching profile data:", error);
      }
    });

    console.log(this.packDetails, "pack details data");

    this.selectedPack = v;
    this.details = details;
    this.paint_index = num;
    // if (typeof details === 'object' && !Array.isArray(details)) {
    //   this.packDetails = [details]; // Wrap the object in an array
    // } else if (Array.isArray(details)) {
    //   this.packDetails = details; // Assign directly if it's an array
    // } else {
    //   console.error('Expected details to be an object or an array, but received:', details);
    //   this.packDetails = []; // Reset if unexpected type
    // }
    // if (this.packDetails !== null) {
    //   console.log(this.packDetails, 'packdetails');

    // }
    if (num == 1) {
      this.packP.nativeElement.click();
    } else if (num == 2) {
      this.packTwo.nativeElement.click();
    } else if (num == 3) {
      this.packThree.nativeElement.click();
    } else if (num == 4) {
      this.packFour.nativeElement.click();
    }
  }
  getDicountedPrice() {
    console.log("get dis price");

    let result: any[] = [];
    let discountAmount: any = 0;
    this.schemes.forEach((schems: any) => {
      this.packDetails.forEach((product: any) => {
        // console.log(this.packDetails);

        // console.log(product.materialCode);
        // console.log(schems.cproductgroup);
        // console.log(this.quantities, "matched quantities");

        // Ensure we match the product and scheme by both material code and scheme type
        // if (schems.cproductgroup === product.MaterialCode && schems.cschemetype === "Seasoning") {
        //   // Append scheme values to product
        //   product.discounttype = schems.cdistype;
        //   product.cdisdesc = schems.cdisdesc;
        //   product.schno = schems.schno;
        //   product.nmaxqty = schems.nmaxqty;
        //   product.nminqty = schems.nminqty;
        //   product.cdisvalue = schems.cdisvalue;
        //   product.cschemetype = schems.cschemetype;
        //   if (product.qty >= schems.nminqty && product.qty <= schems.nmaxqty) {
        //     console.log("inside condition", schems.cdistype);
        //     if (schems.cdistype === "Rupees") {
        //       console.log(product.qty, schems.cdisvalue, "data");

        //       discountAmount = product.qty * schems.cdisvalue
        //       console.log(discountAmount, 'amt');


        //     } else if (schems.cdistype == "Percentage") {
        //       const discountvalue = (product.price * schems.cdisvalue) / 100;
        //       discountAmount = product.qty * discountvalue
        //       console.log(discountAmount, "else amt");

        //     }
        //   }
        //   product.totaldisamount = discountAmount
        //   // Check if the product has already been added to result to avoid duplicates
        //   const isDuplicate = result.some((item: any) => item.materialCode === product.materialCode);
        //   if (!isDuplicate) {
        //     result.push(product);  // Add the updated product to result
        //   }
        // }
        // First, match the material code
        if (schems.cproductgroup === product.materialCode) {
          // Append scheme values to product (common to all cases)
          console.log("matched");

          product.discounttype = schems.cdistype;
          product.cdisdesc = schems.cdisdesc;
          product.schno = schems.schno;
          product.nmaxqty = schems.nmaxqty;
          product.nminqty = schems.nminqty;
          product.cdisvalue = schems.cdisvalue;
          product.cschemetype = schems.cschemetype;

          // Now handle scheme types
          switch (schems.cschemetype) {
            case "Seasoning":
              // For "Seasoning", no quantity check is required
              // console.log("Inside Seasoning condition", schems.cdistype);

              if (schems.cdistype === "Rupees") {
                discountAmount = schems.cdisvalue;
                // console.log(discountAmount, "amt");
              } else if (schems.cdistype === "Percentage") {
                const discountValue = (product.price * schems.cdisvalue) / 100;
                discountAmount = discountValue;
                // console.log(discountAmount, "else amt");
              }
              break;

            case "Normal":
              if (product.quantity >= schems.nminqty && product.quantity <= schems.nmaxqty) {
                // console.log(`Inside ${schems.cschemetype} condition`, schems.cdistype);

                if (schems.cdistype === "Rupees") {
                  discountAmount = product.quantity * schems.cdisvalue;
                  // console.log(discountAmount, "amt");
                } else if (schems.cdistype === "Percentage") {
                  const discountValue = (product.price * schems.cdisvalue) / 100;
                  discountAmount = product.quantity * discountValue;
                  // console.log(discountAmount, "else amt");
                }
              }
              break;
            case "Monthly":
              // For "Normal" and "Monthly", check the quantity range
              if (product.quantity >= schems.nminqty && product.quantity <= schems.nmaxqty) {
                console.log(`Inside ${schems.cschemetype} condition`, schems.cdistype);

                if (schems.cdistype === "Rupees") {
                  discountAmount = product.quantity * schems.cdisvalue;
                  console.log(discountAmount, "amt");
                } else if (schems.cdistype === "Percentage") {
                  const discountValue = (product.price * schems.cdisvalue) / 100;
                  discountAmount = product.quantity * discountValue;
                  console.log(discountAmount, "else amt");
                }
              }
              break;

            default:
              console.log("Unknown scheme type", schems.cschemetype);
              break;
          }

          // Assign the calculated discount amount to the product
          product.totaldisamount = discountAmount;

          // Check if the product has already been added to result to avoid duplicates
          const isDuplicate = result.some((item: any) => item.materialCode === product.materialCode);
          if (!isDuplicate) {
            result.push(product); // Add the updated product to result
            this.productPriceDetails = result;
            console.log(this.productDetails, "product");
            
          }
        }

      });
    });
    console.log(this.productPriceDetails, "product price");

  }
  // updateQuantity(index: number, event: Event) {
  //   const inputElement = event.target as HTMLInputElement;
  //   const value = parseInt(inputElement.value, 10) || 0;

  //   // Ensure `this.quantities` is properly initialized
  //   if (!Array.isArray(this.quantities)) {
  //     this.quantities = [];
  //   }

  //   // Expand the array if the index exceeds the current length
  //   while (this.quantities.length <= index) {
  //     this.quantities.push(0); // Fill with default values
  //   }

  //   // Set the quantity at the specified index
  //   this.quantities[index] = value;
  //   console.log(this.quantities, "qtys");

  // }

  // updateQuantity(index: number, event: Event) {
  //   const inputElement = event.target as HTMLInputElement;
  //   this.quantities[index] = parseInt(inputElement.value, 10) || 0;
  // }
  // updateQuantityIndividual(index: number, event: Event) {
  //   const inputElement = event.target as HTMLInputElement;
  //   this.quantities = parseInt(inputElement.value, 10) || 0;
  // }

  //change data as per out format
  updateQuantity(index: number, event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const value = parseInt(inputElement.value, 10) || 0;

    // Ensure `this.quantities` is properly initialized
    if (!Array.isArray(this.quantities)) {
      this.quantities = [];
    }

    // Expand the `quantities` array if the index exceeds the current length
    while (this.quantities.length <= index) {
      this.quantities.push(0); // Fill with default values
    }

    // Update `quantities` array
    this.quantities[index] = value;

    // Ensure `packDetails` is properly initialized
    if (!Array.isArray(this.packDetails)) {
      this.packDetails = [];
    }

    // Validate the index and update `packDetails` with the quantity
    if (index >= 0 && index < this.packDetails.length) {
      this.packDetails[index].quantity = value; // Add or update the quantity field
    } else {
      console.warn(`Invalid index: ${index}`);
    }

    console.log(this.quantities, "Quantities array");
    console.log(this.packDetails, "Updated pack details");
  }


  filterNonEmpty(obj: PaintData): PaintData {
    return Object.entries(obj)
      .filter(([_, value]) => value !== null && !(Array.isArray(value) && value.length === 0))
      .reduce((acc, [key, value]) => {
        if ((key === 'JN_details' || key == 'BERGER_details' || key == 'Asian_detils' || key == 'Sheenlac_details') && Array.isArray(value)) {
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

  // convertData = (data: PaintData[], index: any): TargetData[] => {
  //   return data
  //     .map(item => {
  //       console.log(item, "item");

  //       const brandKey = Object.keys(item).find(key => key.includes("_details") || key.includes("_detils")) as string;
  //       console.log(brandKey, "brandKey");
  //       const prefix = brandKey.split('_')[0];
  //       const productKey = Object.keys(item).find(key => key.includes("_PAINTS")) as string;
  //       const materialCodeKey = Object.keys(item).find(key => key.includes(prefix + "_MaterialCode")) as string; // Get material code key
  //       console.log(materialCodeKey, "MaterialCode");

  //       if (brandKey && productKey && materialCodeKey && item[brandKey] && Array.isArray(item[brandKey])) {
  //         const details = item[brandKey] as Array<{ pack: string; price: string; quantity: number }>;
  //         return {
  //           customerId: localStorage.getItem("apCusId"),
  //           pack: details[0].pack,
  //           price: details[0].price,
  //           qty: details[0].quantity.toString(),
  //           cdate: "",
  //           productname: item[productKey] as string,
  //           materialCode: item[materialCodeKey] as string // Add material code to the returned object
  //         };
  //       }

  //       return undefined; // Return undefined if fields are missing
  //     })
  //     .filter((item): item is TargetData => item !== undefined); // Filter out undefined items
  // };

  convertData = (data: PaintData[], index: any): TargetData[] => {
    const brandMapping: { [key: number]: string } = {
      1: "ASIAN",
      2: "BERGER",
      3: "JN",
      4: "Sheenlac",
    };
    let brandKey = "";
    return data
      .map(item => {
        console.log(item, "item");

        const brandPrefix = brandMapping[index];
        if (!brandPrefix) {
          console.error(`Invalid index: ${index}`);
          return undefined;
        }
        const capitalizedBrandPrefix = brandPrefix.charAt(0).toUpperCase() + brandPrefix.slice(1).toLowerCase();
        if (brandPrefix == "ASIAN") {
          brandKey = Object.keys(item).find(key => key.includes(`${capitalizedBrandPrefix}_details`) || key.includes(`${capitalizedBrandPrefix}_detils`)) as string;
        } else {
          brandKey = Object.keys(item).find(key => key.includes(`${brandPrefix}_details`) || key.includes(`${capitalizedBrandPrefix}_detils`)) as string;
        }


        const productKey = Object.keys(item).find(key => key.includes(`${brandPrefix}_PAINTS`)) as string;
        const materialCodeKey = Object.keys(item).find(key => key.includes(`${brandPrefix}_MaterialCode`)) as string;

        console.log(brandKey, "brandKey");
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
            materialCode: item[materialCodeKey] as string,
            distributorcode: localStorage.getItem("distributorcode") || ""
          };
        }

        return undefined; // Return undefined if fields are missing
      })
      .filter((item): item is TargetData => item !== undefined); // Filter out undefined items
  };

  // addtocart() {
  //   // Calculate the total price
  //   this.totalPrice = this.calculateTotalPrice();

  //   this.filteredData = this.filterNonEmpty(this.data);
  //   console.log(this.filteredData, "filter");

  //   const cartItem = [
  //     this.filteredData
  //   ]
  //   this.productDetails = this.convertData(cartItem, this.paint_index);
  //   console.log(this.productDetails[0], "productDetails");

  //   this.logic.cartItems = [...this.logic.cartItems, cartItem]

  //   this.logic.cart = {
  //     "customerId": localStorage.getItem("apCusId"),
  //     "products": [
  //       this.logic.cartItems
  //     ]
  //   }
  //   console.log(this.logic.cart, "cart");

  //   this.logic.cartLength = this.logic.cart.products.length;
  //   console.log(this.logic.cartLength);


  //   console.log(this.logic.cart, "cart details");

  //   this.logic.cus('success', '', 'Added to the cart!');

  //   // Optionally navigate to the cart page
  //   // this.router.navigate(['/cart']);
  // }

  addtocart() {
    let cartProducts: any[] = [];
    this.packDetails.forEach((product: any) => {

      if (
        product.quantity > 0
      ) {
        console.log(product, "product");
        const quantity = parseFloat(product.quantity) || 0;
        const price = parseFloat(product.price) || 0;
        const totalDiscount = parseFloat(product.totaldisamount) || 0;
        let productprice = quantity * price;

        // Apply discount if `totaldisamount` is valid
        if (totalDiscount > 0) {
          productprice -= totalDiscount;
        }

        const productAdded = {
          customerId: localStorage.getItem("apCusId"),
          pack: product.pack,
          price: productprice.toString(),
          qty: (product.quantity).toString(), // Default to 0 if quantity is not set
          cdate: "", // Populate this with the current date if needed
          productname: product.productname as string,
          materialCode: product.materialCode as string, // Fixed case-sensitive issue
          distributorcode: localStorage.getItem("distributorcode") || "",
          companyname: product.paint_name,
          schemetype: product.cschemetype,
          discountamount:product.cdisvalue,
          ecomcode:this.selectedEcomcode
        };
        console.log(productAdded, "product added");

        cartProducts = [...cartProducts, productAdded];
        console.log(cartProducts, "cart products");
        this.logic.cartProducts = cartProducts;
      }
    });
    console.log(cartProducts);
    this.logic.cus("success", "", "Added to the cart!");
    // Assign to cartItems and show a success message
    // if (cartProducts.length > 0) {

    //   console.log(this.logic.cartItems, "cart item");

    // } else {
    //   this.logic.cus("info", "", "No valid items to add to the cart!");
    // }
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
    console.log("cart creation");

    // this.logic.cartProducts = [...this.logic.cartProducts, this.productDetails[0]];
    // console.log(this.logic.cartProducts, "product details");
    this.logic.cartProducts.map((product: any) => {
      this.api.cartCreate(product).subscribe({
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
    })


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
