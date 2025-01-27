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

  }
  form = this.fb.group(
    {
      "filtervalue3": "POST_PAYMENT",
      "filtervalue4": "0094000001",
      "filtervalue5": "Sphinax Infra",
      "filtervalue6": "0094000001",
      "filtervalue7": "All_paints_HO",
      "filtervalue8": "cash",
      "filtervalue9": JSON.stringify(this.logic.cartTotal),
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
        this.logic.cus('success', '', 'Order Created Successfully!');
        this.router.navigate(['/paid']);
        this.logic.cartItems = [];
        this.logic.cartTotal = 0;
        this.logic.leastProductArray=[]
        this.api.clearSessionId();
        const randomSessionId = 'session-' + Math.random().toString(36).substr(2, 9);
        this.api.setSessionId(randomSessionId);
        localStorage.removeItem("apCusId")
        localStorage.removeItem("apEmail")
        localStorage.removeItem("apName")
        localStorage.removeItem("apNumber")
      },
      error: (err: HttpErrorResponse) => {

        // Check if the status is available in the error
        if (err.status === 200) {
          this.logic.cus('success', '', 'Order Created Successfully!');
          this.router.navigate(['/paid']);
          this.logic.cartItems = [];
          this.logic.cartTotal = 0;
          this.api.clearSessionId();
          const randomSessionId = 'session-' + Math.random().toString(36).substr(2, 9);
          this.api.setSessionId(randomSessionId);
          localStorage.removeItem("apCusId")
          localStorage.removeItem("apEmail")
          localStorage.removeItem("apName")
          localStorage.removeItem("apNumber")
        } else {
          // Handle other error statuses
          console.error(`Error Status: ${err.status} - ${err.message}`);
        }
      }
    }

    )
  }

  handleBack(){
    this.router.navigate(['/checkOut']);
  }
}
