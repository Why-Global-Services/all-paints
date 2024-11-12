import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from '../../parts/header/header.component';
import { ToolsMenuComponent } from '../../parts/tools-menu/tools-menu.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { Router, RouterModule } from '@angular/router';
import { LogicsService } from '../../shared/logics.service';
import { ApiService } from '../../shared/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  BERGER_PAINTS?: string;
  ASIAN_PAINTS?: string;
  JN_details?: CartItemDetail[];
  BERGER_details?: CartItemDetail[];
  ASIAN_details?: CartItemDetail[];
}

export interface CartData {
  customerId: string;
  products: Product[][][];
}


@Component({
  selector: 'cart',
  standalone: true,
  imports: [HeaderComponent, RouterModule, ToolsMenuComponent, NzButtonModule, CommonModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  logic = inject(LogicsService);
  api = inject(ApiService);

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
  router = inject(Router)

  ngOnInit(): void {
    this.cartData = this.logic.cart;
    console.log(this.logic.cart, "cart data");
    let totalProductCount = 0;
    this.logic.cart.products.forEach((firstLevel: any[]) =>
      firstLevel.forEach(secondLevel =>
        totalProductCount += secondLevel.length

      )
    );
    this.cartLength = totalProductCount;
    console.log('Total number of products:', totalProductCount);
    console.log(this.cartLength, "cart length");

    this.calculateTotalPrice(); // Calculate initial total price
  }

  getPaintBrandKey(product: Product): string | null {
    if (product.JN_PAINTS) {
      return 'JN_PAINTS';
    } else if (product.BERGER_PAINTS) {
      return 'BERGER_PAINTS';
    } else if (product.ASIAN_PAINTS) {
      return 'ASIAN_PAINTS';
    }
    return null; // Return null if none found
  }
  onBrandChange() {
    this.selectedProducts = this.getProductsByBrand(this.selectedBrand);
  }
  // Filter products based on the selected brand
  getProductsByBrand(brand: string): any[] {

    console.log(brand, "brand");
    this.products = [];
    // Loop through the product set
    this.logic.cart.products.forEach((productSet: any[]) => {
      console.log(productSet, "productset");

      // Loop through each product in the set
      productSet.forEach((product) => {
        console.log(product, "product");
        product.forEach((p: any) => {
          console.log(p, "product loop");

          // Check the selected brand and add the respective product details
          if (brand === 'Asian' && p.ASIAN_PAINTS) {
            console.log(p.ASIAN_PAINTS, "asian");

            this.products.push({
              brand: p.ASIAN_PAINTS,
              materialCode: p.Asian_MaterialCode,
              details: p.Asian_detils
            });
          } else if (brand === 'Berger' && p.BERGER_PAINTS) {
            console.log(product.BERGER_PAINTS, "berger");

            this.products.push({
              brand: p.BERGER_PAINTS,
              materialCode: p.Berger_MaterialCode,
              details: p.BERGER_details
            });
          } else if (brand === 'JN' && p.JN_PAINTS) {
            console.log("Jenson & Nicholson brand found");

            // Assuming the JN brand has some specific properties (if not, you can modify the condition accordingly)
            this.products.push({
              brand: p.JN_PAINTS, // Example name for JN brand
              materialCode: product.JN_MaterialCode,
              details: p.JN_details // Add the appropriate details if any
            });
          } else if (brand === 'Sheenlac') {
            // Since you don't have Sheenlac in the data yet, you can either add it here or leave it for future data updates
            console.log("Sheenlac brand is not available in this product set");
          }
        })

      });
    });

    console.log(this.products, "selected product");

    return this.products;
  }


  getQuantitiesAndPrices(data: CartData): Detail[] {
    const result: Detail[] = [];

    if (!Array.isArray(data.products)) {
      console.error("data.products is not an array", data.products);
      return result;
    }

    data.products.forEach((productCategory) => {
      if (Array.isArray(productCategory)) {
        productCategory.forEach((brandCategory) => {
          if (Array.isArray(brandCategory)) {
            brandCategory.forEach((product) => {
              const details = product.JN_details || product.BERGER_details || product.ASIAN_details || []; // Adjust based on your structure

              details.forEach((detail) => {
                const price = parseFloat(detail.price);
                const quantity = detail.quantity;

                if (detail && !isNaN(price) && typeof quantity === 'number') {
                  result.push({
                    price: price,
                    quantity: quantity,
                  });
                } else {
                  console.warn("Invalid detail structure", detail);
                }
              });
            });
          } else {
            console.warn("Expected brandCategory to be an array", brandCategory);
          }
        });
      } else {
        console.warn("Expected productCategory to be an array", productCategory);
      }
    });
    console.log(result, "result");

    return result;
  }



  calculateTotalPrice(): void {
    const quantitiesAndPrices = this.getQuantitiesAndPrices(this.cartData);
    this.total = quantitiesAndPrices.reduce(
      (sum, detail) => sum + detail.price * detail.quantity,
      0
    );
    this.logic.cartTotal = this.total;
    console.log("Total price:", this.total);
  }

  getSelectedTotal(): void {
    // Calculate total price for selected paints
    this.selectedTotal = this.selectedPaints.reduce((sum: number, category: Product[][]) => {
      return sum + category.reduce((catSum: number, brand: Product[]) => {
        return catSum + brand.reduce((prodSum: number, product: Product) => {
          return prodSum + (product.selectDetails?.price || 0) * (product.count || 0); // Safe access
        }, 0);
      }, 0);
    }, 0);
  }

  sum(categoryIndex: number, brandIndex: number, productIndex: number, operation: number): void {
    const selectedProduct = this.selectedPaints[categoryIndex]?.[brandIndex]?.[productIndex]; // Safe access

    if (selectedProduct) {
      if (operation === -1 && selectedProduct.count > 0) {
        selectedProduct.count -= 1; // Prevent negative count
      } else if (operation === 1) {
        selectedProduct.count += 1; // Increment count
      }
      this.getSelectedTotal(); // Update selected total after change
    } else {
      console.warn("Selected product not found:", categoryIndex, brandIndex, productIndex);
    }
  }
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
}
