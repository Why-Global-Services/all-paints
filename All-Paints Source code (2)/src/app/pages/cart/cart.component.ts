import { Component, inject, NgModule, OnInit } from '@angular/core';
import { HeaderComponent } from '../../parts/header/header.component';
import { ToolsMenuComponent } from '../../parts/tools-menu/tools-menu.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { Router, RouterModule } from '@angular/router';
import { LogicsService } from '../../shared/logics.service';
import { ApiService } from '../../shared/api.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { TooltipModule } from 'ng2-tooltip-directive';

interface SelectDetails {
  price: number; // Price of the selected product
}

interface Detail {
  price: number; // Price of the product
  quantity: number; // Quantity of the product
}

// This assumes selectedPaints is a 3D array
type SelectedPaints = Product[][][];
export interface CartItemDetail {
  pack: string;
  price: string;
  quantity: number;
}

export interface Product {
  selectDetails: any;
  count: number;
  JN_PAINTS?: string;
  Asian_MaterialCode?: string;
  Berger_MaterialCode?: string;
  JN_MaterialCode?: string;
  BERGER_PAINTS?: string;
  ASIAN_PAINTS?: string;
  Sheenlac_PAINTS?: string;
  JN_details?: CartItemDetail[];
  BERGER_details?: CartItemDetail[];
  Sheenlac_details?: CartItemDetail[];
  Asian_detils?: CartItemDetail[];
}

export interface CartData {
  customerId: string;
  products: Product[][][];
}


@Component({
  selector: 'cart',
  standalone: true,
  imports: [HeaderComponent, RouterModule, ToolsMenuComponent, NzButtonModule, CommonModule, FormsModule,TooltipModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  logic = inject(LogicsService);
  api = inject(ApiService);
  fb = inject(FormBuilder);
  // cartData: any[] = []; // Ensure cartData is an array
  cartData: CartData = {
    customerId: '',
    products: [],
  }; // Change this line
  cartLength: any
  selectedPaints: SelectedPaints = []; // Selected paints array
  selectedTotal: number = 0; // Total price for selected paints
  total: number = 0; // Total price for the cart
  selectedBrand: string = ''; // Default selection
  products: any[] = [];
  selectedProducts: any[] = [];
  schemes: any[] = [];
  router = inject(Router)
  leastPricedProducts: any[] = [];
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
  getCart = this.fb.group({
    "customerId": localStorage.getItem("apCusId"),
    "sessionid": this.api.getSessionId()

  })
  data: any[] = [];
  cartlogicData: any[] = [];
  duplogicData: any[] = [];
  getCartDetails: any[] = [];
  productLeastArray: any[] = [];
  alldiscountValue: any = 0
  isSwitched: boolean[] = new Array(this.productLeastArray.length).fill(false);
  // category: "A210040012210"
  // company_name: "ASIAN_PAINTS"
  // materialCode: "A210040012210"
  // pack: "0.9 L"
  // price: "0.00"
  // productname: "AP ACE EXT EMULSION BASE AC12G"
  currentDateTime: string = "";
  ngOnInit(): void {
    this.getAllCartdata();

    this.productLeastArray = this.logic.leastProductArray
    //this.cartData = this.logic.cart;
    // // this.findLeastPricedProducts()
    // console.log(this.logic.cart, "cart data");
    let totalProductCount = 0;
    this.logic.cart.forEach((firstLevel: any[]) =>
      firstLevel.forEach(secondLevel =>
        totalProductCount += secondLevel.length

      )
    );

    // this.api.getAllSchemes(this.schemesForm.value).subscribe((res: any) => {
    //   const parsedData = JSON.parse(res);
    //   console.log(parsedData);

    //   if (Array.isArray(parsedData) && parsedData.length > 0) {
    //     this.schemes = parsedData;

    //     let result: any[] = [];
    //     let discountAmount: number = 0;
    //     parsedData.forEach((schems: any) => {
    //       this.logic.cartProducts.forEach((product: any) => {
    //         console.log(product.materialCode);
    //         console.log(schems.cproductgroup);

    //         // Ensure we match the product and scheme by both material code and scheme type
    //         if (schems.cproductgroup === product.materialCode && schems.cschemetype === "Seasoning") {
    //           // Append scheme values to product
    //           product.discounttype = schems.cdistype;
    //           product.cdisdesc = schems.cdisdesc;
    //           product.schno = schems.schno;
    //           product.nmaxqty = schems.nmaxqty;
    //           product.nminqty = schems.nminqty;
    //           product.cdisvalue = schems.cdisvalue;
    //           product.cschemetype = schems.cschemetype;
    //           if (product.qty >= schems.nminqty && product.qty <= schems.nmaxqty) {
    //             console.log("inside condition", schems.cdistype);
    //             if (schems.cdistype === "Rupees") {
    //               console.log(product.qty, schems.cdisvalue, "data");

    //               discountAmount = product.qty * schems.cdisvalue
    //               console.log(discountAmount, 'amt');


    //             } else if (schems.cdistype == "Percentage") {
    //               const discountvalue = (product.price * schems.cdisvalue) / 100;
    //               discountAmount = product.qty * discountvalue
    //               console.log(discountAmount, "else amt");

    //             }
    //           }
    //           product.totaldisamount = discountAmount
    //           // Check if the product has already been added to result to avoid duplicates
    //           const isDuplicate = result.some((item: any) => item.materialCode === product.materialCode);
    //           if (!isDuplicate) {
    //             result.push(product);  // Add the updated product to result
    //           }
    //         }
    //       });
    //     });
    //     this.cartlogicData = result
    //     console.log(result, "matched schemes");
    //     this.calculateTotalPrice();
    //   }
    // });



    this.cartLength = totalProductCount;
   

    // Calculate initial total price
  }

  getAllCartdata() {
 

    this.api.getCart(this.getCart.value).subscribe((res: any) => {
      const parsedData = JSON.parse(res);

      if(parsedData.length==0){
        this.alldiscountValue=0
        this.total = 0
        this.logic.cartTotal=0
        this.logic.cartItems=[]
        this.cartlogicData =[]
        this.duplogicData=[]
        this.logic.lengthOfcart=0
        return
      }
      this.total=0
      this.logic.lengthOfcart=parsedData.length
      this.cartlogicData = parsedData;
      this.logic.cartItems = parsedData;
      this.cartlogicData.forEach((item: any) => {
        this.total += (parseInt(item.orginalprice)*parseInt(item.qty))

        this.logic.cartTotal = this.total;
      

      })

      console.log(this.cartlogicData)
      this.alldiscountValue = this.cartlogicData.reduce((acc, current) => {

        return acc = acc + (current.discountamount * current.qty)

      }, 0)
      this.duplogicData = parsedData.map((item: any, index: any) => {
        return {
          ...item
        }
      })


    })
  }
  findLeastPricedProducts(): void {
    this.leastPricedProducts = this.logic.cart.products[0].map((productGroup: any[]) => {
      const prices = productGroup.map(product => {
        const priceDetails = [
          { brand: "ASIAN_PAINTS", value: product.ASIAN_PAINTS, materialcode: product.ASIAN_MaterialCode, details: product.Asian_detils },
          { brand: "BERGER_PAINTS", value: product.BERGER_PAINTS, materialcode: product.BERGER_MaterialCode, details: product.BERGER_details },
          { brand: "JN_PAINTS", value: product.JN_PAINTS, materialcode: product.JN_MaterialCode, details: product.JN_details },
          { brand: "Sheenlac_PAINTS", value: product.Sheenlac_PAINTS, materialcode: product.Sheenlac_MaterialCode, details: product.Sheenlac_details }
        ]
          .filter(item => item.details?.length > 0)
          .map(item => ({
            name: item.brand,
            brand: item.value,
            price: parseFloat(item.details[0].price), // Convert price to a number
            pack: item.details[0].pack
          }));



        // Return the least priced product for the current product
        return priceDetails.reduce((min, current) =>
          current.price < min.price ? current : min
        );
      });

      return prices[0]; // Since each sub-array contains only one product object
    });

  }

  getPaintBrandKey(product: any): string | null {
    const value = product.company_name && product.company_name.split("_")[0]
   
    if (value && value.toLowerCase() == 'jn') {
      return 'JN_PAINTS';
    } else if (value && value.toLowerCase() == 'berger') {
      return 'BERGER_PAINTS';
    } else if (value && value.toLowerCase() == 'asian') {
      return 'ASIAN_PAINTS';
    } else if (value && value.toLowerCase() == 'sheenlac') {
      return 'Sheenlac_PAINTS';
    }
    return null; // Return null if none found
  }
  // onBrandChange() {
  //   this.selectedProducts = this.getProductsByBrand(this.selectedBrand);
  // }
  // // Filter products based on the selected brand
  // getProductsByBrand(brand: string): any[] {

  //   console.log(brand, "brand");
  //   this.products = [];
  //   // Loop through the product set
  //   this.logic.cart.products.forEach((productSet: any[]) => {
  //     console.log(productSet, "productset");

  //     // Loop through each product in the set
  //     productSet.forEach((product) => {
  //       console.log(product[0].JN_MaterialCode, "product");
  //       product.forEach((p: any) => {
  //         console.log(p, "product loop");

  //         // Check the selected brand and add the respective product details
  //         if (brand === 'Asian' && p.ASIAN_PAINTS) {
  //           console.log(p.ASIAN_PAINTS, "asian");

  //           this.products.push({
  //             brand: p.ASIAN_PAINTS,
  //             materialCode: p.Asian_MaterialCode,
  //             details: p.Asian_detils
  //           });
  //         } else if (brand === 'Berger' && p.BERGER_PAINTS) {
  //           console.log(product.BERGER_PAINTS, "berger");

  //           this.products.push({
  //             brand: p.BERGER_PAINTS,
  //             materialCode: p.Berger_MaterialCode,
  //             details: p.BERGER_details
  //           });
  //         } else if (brand === 'JN' && p.JN_PAINTS) {
  //           console.log("Jenson & Nicholson brand found");

  //           // Assuming the JN brand has some specific properties (if not, you can modify the condition accordingly)
  //           this.products.push({
  //             brand: p.JN_PAINTS, // Example name for JN brand
  //             materialCode: product.JN_MaterialCode,
  //             details: p.JN_details // Add the appropriate details if any
  //           });
  //         } else if (brand === 'Sheenlac') {
  //           // Since you don't have Sheenlac in the data yet, you can either add it here or leave it for future data updates
  //           console.log("Sheenlac brand is not available in this product set");
  //         }
  //       })

  //     });
  //   });

  //   console.log(this.products, "selected product");

  //   return this.products;
  // }
  ChangeProduct(product: any) {

  }

  // getQuantitiesAndPrices(data: CartData): Detail[] {
  //   const result: Detail[] = [];

  //   if (!Array.isArray(data.products)) {
  //     console.error("data.products is not an array", data.products);
  //     return result;
  //   }

  //   data.products.forEach((productCategory) => {
  //     if (Array.isArray(productCategory)) {
  //       productCategory.forEach((brandCategory) => {
  //         if (Array.isArray(brandCategory)) {
  //           brandCategory.forEach((product) => {
  //             console.log(product.JN_MaterialCode, "product");

  //             const details = product.JN_details || product.BERGER_details || product.Asian_detils || []; // Adjust based on your structure

  //             details.forEach((detail) => {
  //               const price = parseFloat(detail.price);
  //               const quantity = detail.quantity;

  //               if (detail && !isNaN(price)) {
  //                 result.push({
  //                   price: price,
  //                   quantity: quantity,
  //                 });
  //               } else {
  //                 console.warn("Invalid detail structure", detail);
  //               }
  //             });
  //           });
  //         } else {
  //           console.warn("Expected brandCategory to be an array", brandCategory);
  //         }
  //       });
  //     } else {
  //       console.warn("Expected productCategory to be an array", productCategory);
  //     }
  //   });
  //   console.log(result, "result");

  //   return result;
  // }



  // calculateTotalPrice() {
  //   const quantitiesAndPrices = this.getQuantitiesAndPrices(this.cartData);
  //   this.total = quantitiesAndPrices.reduce(
  //     (sum, detail) => sum + detail.price * detail.quantity,
  //     0
  //   );

  //   const totalDiscountAmount = this.cartlogicData.reduce((discountSum, product: any) => {
  //     if (product.totaldisamount) {
  //       discountSum += product.totaldisamount;
  //     }
  //     return discountSum;
  //   }, 0);

  //   console.log("Total Discount Amount:", totalDiscountAmount);

  //   console.log(totalDiscountAmount, "todisamt");

  //   this.total -= totalDiscountAmount;
  //   this.logic.cartTotal = this.total;
  //   console.log("Total price:", this.total);
  // }

  // getSelectedTotal(): void {
  //   // Calculate total price for selected paints
  //   this.selectedTotal = this.selectedPaints.reduce((sum: number, category: Product[][]) => {
  //     return sum + category.reduce((catSum: number, brand: Product[]) => {
  //       return catSum + brand.reduce((prodSum: number, product: Product) => {
  //         return prodSum + (product.selectDetails?.price || 0) * (product.count || 0); // Safe access
  //       }, 0);
  //     }, 0);
  //   }, 0);
  // }

  // sum(categoryIndex: number, brandIndex: number, productIndex: number, operation: number): void {
  //   const selectedProduct = this.selectedPaints[categoryIndex]?.[brandIndex]?.[productIndex]; // Safe access

  //   if (selectedProduct) {
  //     if (operation === -1 && selectedProduct.count > 0) {
  //       selectedProduct.count -= 1; // Prevent negative count
  //     } else if (operation === 1) {
  //       selectedProduct.count += 1; // Increment count
  //     }
  //     this.getSelectedTotal(); // Update selected total after change
  //   } else {
  //     console.warn("Selected product not found:", categoryIndex, brandIndex, productIndex);
  //   }
  // }
  cartCreation() {
    // this.api.createCart(this.logic.cart).subscribe((res) => {
    //   if (res) {



    // },
    //   (err) => {
    //     console.log(err.status);
    //   })
    this.router.navigateByUrl('/checkOut')
  }

  mainTitle: string[] = [
    'Specialty Coating',
    'Wood Coating',
    'Wall Paints',
    'Enamels',
    'Floor Coating',
    'Protective Coatings',
    'Spray paints',
  ];

  subTitle: string[] = ['Interiors Wall Paints', 'Exterior Wall Paints'];

  handlePlusMinus(val: any, index: any) {

    if (val > 0) {
      this.cartlogicData[index].qty = this.cartlogicData[index].qty + val
    }
    else {

      if (this.cartlogicData[index].qty > 0) {
        this.cartlogicData[index].qty = this.cartlogicData[index].qty + val

      }
    }
    this.duplogicData[index].change = true
  }

  updateCartData(index: any) {
    if (index > -1) {
      try {
// console.log(index)
        let individualPrice = (this.cartlogicData[index].orginalprice
        ) * this.cartlogicData[index].qty
        // console.log(individualPrice,"price",this.cartlogicData[index].originalprice)
        let data = this.fb.group({
          id: this.cartlogicData[index].id.toString(),
          customerId: this.cartlogicData[index].customerId,
          pack: this.cartlogicData[index].pack,
          price: individualPrice.toString(),
          qty: this.cartlogicData[index].qty.toString(),
          materialCode: this.cartlogicData[index].MaterialCode,
          productname: this.cartlogicData[index].productname,
          distributorcode: this.cartlogicData[index].distributorcode,
          company_name: this.cartlogicData[index].company_name,
          schemetype: this.cartlogicData[index].schemetype || "",
          discountamount: this.cartlogicData[index]?.discountamount || 0,
          ecomcode: this.cartlogicData[index].ecomcode || '',
          cdate: "",
          sessionid: this.api.getSessionId()

        })

        this.api.updateCart(data.value).subscribe({
          next: (response) => {
            
            // window.location.reload();
          },
          error: (err: HttpErrorResponse) => {
            if (err.status == 200) {
              this.getAllCartdata()
            }
          },
        })
        // 

      } catch (err) {
        console.log(err)
      }

    }

  }


  deleteCartItem(index: any) {
    if (index > -1) {
      const data = this.fb.group({
        id: this.cartlogicData[index].id.toString(),
        customerId: this.cartlogicData[index].customerId,
      });


      this.api.DeleteCartItem(data.value).subscribe({
        next: (res: any) => {
        },
        error: (err: HttpErrorResponse) => {
          if (err.status == 200) {
            this.productLeastArray.splice(index, 1);
            this.alldiscountValue=0
            this.total = 0
            this.logic.cartTotal=0
            this.logic.cartItems=[]
            this.cartlogicData =[]
            this.duplogicData=[]
            this.getAllCartdata()
          }
        },
      });
    }
  }
  generateQuotation() {
    const doc = new jsPDF()

    doc.setFontSize(16);
    doc.text("ALL PAINTS QUOTATION", 10, 10);
    doc.text("Product Details", 10, 20);
    doc.text("User Id:" + this.logic.cartItems[0].customerId, 150, 10);

    const columns = [
      { header: 'Product Name', dataKey: 'productname' },
      { header: 'Pack', dataKey: 'pack' },
      { header: 'Price', dataKey: 'price' },
      { header: 'Qty', dataKey: 'qty' },
    ];
    const totalPrice = this.logic.cartItems.reduce((sum: any, item: any) => sum + item.price, 0);
    autoTable(doc, {
      head: [columns.map(col => col.header)],
      body: this.logic.cartItems.map((item: any) => columns.map(col => item[col.dataKey])),
      startY: 30,
    });
    let finalY = (doc as any).lastAutoTable.finalY;
    // let finalX = (doc as any).lastAutoTable.finalX;

    doc.text(`Total Price: ${totalPrice}`, 135, finalY + 10);
    doc.text("*This is a computer generated file*", 50, finalY + 50)
    const now = new Date();
    this.currentDateTime = now.toLocaleString();
    doc.save('Product_Details-' + this.currentDateTime + '.pdf');
  }

  // swapProduct(index: number) {
  //   this.logic.cartItems.forEach((product: any, ind: number) => {
  //     console.log(product, "Cart Item:");

  //     this.logic.leastProductArray.forEach((least: any, i: number) => {
  //       console.log(i, "Least Product Index:");

  //       if (index === i) {
  //         // Ensure least[i] exists and has the expected structure
  //         if (least) {
  //           least[index].id = product.id; // Update properties
  //           least[index].qty = product.qty.toString();
  //           least[index].distributorcode = product.distributorcode;
  //           least[index].MaterialCode = least.materialCode;
  //           least[index].customerId = product.customerId;

  //           console.log(this.logic.leastProductArray[index], "Updated Array:");

  //           // Update cart using FormGroup
  //           const updateCart = this.fb.group({
  //             ...this.logic.leastProductArray
  //           });

  //           // Call API to update the cart
  //           this.api.updateCart(updateCart.value).subscribe(
  //             (response: any) => {
  //               console.log("Cart updated successfully:", response);
  //             },
  //             (error: any) => {
  //               console.error("Error updating cart:", error);
  //             }
  //           );
  //         } else {
  //           console.warn("Invalid least product at index", i);
  //         }
  //       }
  //     });
  //   });
  // }
  swapProduct(index: number) {
    this.isSwitched[index] = true;
  

    // Ensure cartItems and leastProductArray exist
    if (!this.logic.cartItems || !this.logic.leastProductArray) {
      console.warn("cartItems or leastProductArray is not defined");
      return;
    }

    // Find the corresponding cart item (deep clone to avoid reference sharing)
    const product = { ...this.logic.cartItems[index] };
    if (!product) {
      console.warn(`No cart item found at index ${index}`);
      return;
    }

    // Find the least product at the given index (deep clone to avoid reference sharing)
    const least = this.logic.leastProductArray[index];
    if (!least) {
      console.warn(`No least product found at index ${index}`);
      return;
    }


    // Update the least product with the cart item details
    least[0].id = product.id.toString();
    least[0].qty = product.qty.toString();
    least[0].ecomcode = least[0].ecomcode; // Access least.materialCode
    least[0].originalprice = parseFloat(least[0].originalprice); // Access least.materialCode
    least[0].customerId = product.customerId;
    least[0].distributorcode = localStorage.getItem("distributorcode");
    least[0].cdate = "";
    least[0].sessionid = this.api.getSessionId()


    // Exclude unwanted properties like materialCode
    const { category, ...updatedLeast } = least[0];

    // Create a FormGroup for the updated product only
    const updatedData = this.fb.group({
      ...updatedLeast,
    });

    // Call API to update only the specific index
    this.api.updateCart(updatedData.value).subscribe({
      next: (response) => {
        this.getAllCartdata();
        // Avoid reloading the page unnecessarily. You can update the data in the UI directly.
      },
      error: (err: HttpErrorResponse) => {
        console.error("Error updating cart", err);
        if (err.status === 200) {
          this.alldiscountValue=0
            this.total = 0
            this.logic.cartTotal=0
            this.logic.cartItems=[]
            this.cartlogicData =[]
            this.duplogicData=[]
          this.getAllCartdata();  // Re-fetch data if necessary
        }
      },
    });
  }





}
