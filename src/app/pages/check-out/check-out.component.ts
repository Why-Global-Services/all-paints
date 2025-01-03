import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from '../../parts/header/header.component';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../shared/api.service';
import { CommonModule } from '@angular/common';
import { LogicsService } from '../../shared/logics.service';
import { HttpErrorResponse } from '@angular/common/http';
type SourceProduct = {
  JN_PAINTS?: string;
  ASIAN_PAINTS?: string;
  BERGER_PAINTS?: string;
  JN_details?: Array<{ pack: string; price: string; quantity: number }>;
  Asian_detils?: Array<{ pack: string; price: string; quantity: number }>;
  BERGER_details?: Array<{ pack: string; price: string; quantity: number }>;
};

type SourceData = {
  customerId: string;
  products: SourceProduct[][][];
};

type TargetProductDetails = {
  pack: string;
  totalprice: number;
  quantity: number;
};

type TargetProduct = {
  paintS_Name: string;
  asian_detils: TargetProductDetails[];
};

type TargetData = {
  customerId: string;
  customerName: string;
  mobileno: string;
  emailId: string;
  gst: string;
  address: string;
  billingAddress: string;
  totalPrice: string;
  products: TargetProduct[];
};

@Component({
  selector: 'app-check-out',
  standalone: true,
  imports: [HeaderComponent, FormsModule, CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './check-out.component.html',
  styleUrl: './check-out.component.scss'
})
export class CheckOutComponent implements OnInit {
  fb = inject(FormBuilder)
  api = inject(ApiService)
  logic = inject(LogicsService);
  router = inject(Router)
  totalPay: any = '0'
  customerData: any;
  formattedDetails: any
  form = this.fb.group({
    filtervalue1: [''],
    filtervalue2: [''],
    filtervalue3: ['POST_PAYMENT'],
    filtervalue4: [''],
    filtervalue5: [''],
    filtervalue6: [''],
    filtervalue7: [''],
    filtervalue8: ['cash'],
    filtervalue9: [this.totalPay],
    filtervalue10: [''],
    filtervalue11: [''],
    filtervalue12: ['0'],
    filtervalue13: [''],
    filtervalue14: [''],
    filtervalue15: [''],

  })
  ngOnInit(): void {
    let name = localStorage.getItem('apName')
    let number = localStorage.getItem('apNumber')
    let email = localStorage.getItem('apEmail')

    this.totalPay = this.logic.cartTotal;
 
    this.transformData(this.logic.cartItems)
    this.form.patchValue({
      filtervalue7: name,
      filtervalue10: number,
      filtervalue14: email
    })
  }
  payment: any = 'cash'
  paymentChange(v: any) {
    this.payment = v
  }

  // Function to get the material code with a non-empty value
  getMaterialCodeWithValue(data: any): string | undefined {
    // Access the deeply nested product structure
    const products = data.products;

    // Traverse to the target material codes in products
    for (const productGroup of products) {
      for (const productArray of productGroup) {
        for (const product of productArray) {
          if (product.ASIAN_MaterialCode) {
            return product.ASIAN_MaterialCode;
          }
          if (product.BERGER_MaterialCode) {
            return product.BERGER_MaterialCode;
          }
          if (product.JN_MaterialCode) {
            return product.JN_MaterialCode;
          }
          if (product.Sheenlac_MaterialCode) {
            return product.Sheenlac_MaterialCode;
          }
        }
      }
    }

    return undefined;
  }



  transformData(data: SourceData): TargetData {
  

    // const transformedProducts = data.products.flat(3).map(product => {
    // console.log(product, "product");
    // let paintS_Name = "";
    // let asian_detils: Array<{ pack: string; price: string; quantity: number }> = [];

    // if (product.JN_PAINTS && product.JN_details) {
    //   paintS_Name = product.JN_PAINTS;
    //   asian_detils = product.JN_details;
    // } else if (product.ASIAN_PAINTS && product.Asian_detils) {
    //   paintS_Name = product.ASIAN_PAINTS;
    //   asian_detils = product.Asian_detils;
    // } else if (product.BERGER_PAINTS && product.BERGER_details) {
    //   paintS_Name = product.BERGER_PAINTS;
    //   asian_detils = product.BERGER_details;
    // }

    // Map and calculate total price for each detail
    this.formattedDetails = this.logic.cartItems.map((item: any) => ({
      "paintS_Name": item.productname,
      asian_detils: [{
        pack: item.pack,
        totalprice: item.price,
        quantity: item.qty
      }]
    }));
    // });

    // console.log(
    //   {
    //     customerId: localStorage.getItem("apCusId") || "",
    //     customerName: localStorage.getItem('apName') || "",
    //     mobileno: localStorage.getItem('apNumber') || "",
    //     emailId: localStorage.getItem('apEmail') || "",
    //     gst: "",
    //     address: "Chennai",
    //     billingAddress: "Ambattur",
    //     totalPrice: JSON.stringify(this.logic.cartTotal),
    //     products: transformedProducts
    //   });
    //const materialCode = this.getMaterialCodeWithValue(data);
    this.customerData = {
      materialCode: this.logic.cartItems[0].MaterialCode,
      distributorcode: localStorage.getItem("distributorcode") || "",
      customerId: localStorage.getItem("apCusId") || "",
      customerName: localStorage.getItem('apName') || "",
      mobileno: localStorage.getItem('apNumber') || "",
      emailId: localStorage.getItem('apEmail') || "",
      gst: "",
      address: "Chennai",
      billingAddress: "Ambattur",
      totalPrice: this.totalPay.toString(),
      sessionid:this.api.getSessionId(),
      products: this.formattedDetails
    };

    return this.customerData
  }
  submit() {
    // this.api.payment(this.form.value).subscribe((res: any) => {
    //   console.log(res);

    // })

    this.logic.paymentDetails = this.form.value;
 

    this.api.createCart(this.customerData).subscribe({
      next: (res: any) => {
        // Assuming res is a success response
        this.logic.cus('success', '', 'Cart Updated!');
        this.router.navigate(['/payment']);
      },
      error: (err: HttpErrorResponse) => {

        // Check if the status is available in the error
        if (err.status === 200) {
          this.logic.cus('success', '', 'Order Created Successfully!');
          this.router.navigate(['/payment']);
        } else {
          // Handle other error statuses
          console.error(`Error Status: ${err.status} - ${err.message}`);
        }
      }
    })
  }
  adval: any
  check(v: any) {
    if (v.target.checked) {
      this.form.patchValue({
        filtervalue5: this.adval
      })
    } else {
      this.form.patchValue({
        filtervalue5: ''
      })
    }
  }
  change(v: any) {
    this.adval = v

  }

handleBack(){
  this.router.navigate(['/cart']);
}

}
