import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ApiService } from '../shared/api.service';
import { LogicsService } from '../shared/logics.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss'
})
export class PaymentComponent {
  fb = inject(FormBuilder)
  api = inject(ApiService)
  logic = inject(LogicsService);
  router = inject(Router)
  cartTotal: any
  paymentDetails: any
  payment: any = 'cash'
  paymentChange(v: any) {
    this.payment = v
  }
  ngOnInit(): void {
    this.paymentDetails = this.logic.paymentDetails;
    console.log(this.paymentDetails, "payment");

  }
  form = this.fb.group(
    {
      "filtervalue3": "POST_PAYMENT",
      "filtervalue4": "0094000001",
      "filtervalue5": "Sphinax Infra",
      "filtervalue6": "0094000001",
      "filtervalue7": "All_paints_HO",
      "filtervalue8": "cash",
      "filtervalue9": "3333",
      "filtervalue10": "00500000",
      "filtervalue11": "",
      "filtervalue12": "0",
      "filtervalue13": "",
      "filtervalue14": "",
      "filtervalue15": "F2024-25"

    })
  submit() {
    this.api.payment(this.form.value).subscribe({
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
          this.logic.cus('success', '', 'Order Created Successfully!');
          this.router.navigate(['/paid']);
        } else {
          // Handle other error statuses
          console.error(`Error Status: ${err.status} - ${err.message}`);
        }
      }
    }

    )
  }
}
