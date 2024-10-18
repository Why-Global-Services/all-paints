import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { HeaderComponent } from '../../parts/header/header.component';
import { Router, RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ApiService } from '../../shared/api.service';
import { LogicsService } from '../../shared/logics.service';
import { interval, takeWhile } from 'rxjs';

@Component({
  selector: 'app-customer-login',
  standalone: true,
  imports: [HeaderComponent, ReactiveFormsModule, RouterModule],
  templateUrl: './customer-login.component.html',
  styleUrl: './customer-login.component.scss',
})
export class CustomerLoginComponent {
  @ViewChild('popbtn') popbtn!: ElementRef<HTMLButtonElement>;
  fb = inject(FormBuilder);
  service = inject(ApiService);
  logic = inject(LogicsService);
  router = inject(Router);
  cusForm = this.fb.group({
    customer_Gst_no: [''],
    customer_Type: [''],
    customer_Name: ['', Validators.required],
    customer_Mobile: ['', Validators.required],
    customer_Mobile2: [''],
    customer_Land_1: [''],
    customer_Email: ['', [Validators.required, Validators.email]],
    customer_State: [''],
    customer_city: [''],
    customer_Contact_1: [''],
    customer_Contact_Mob1: [''],
    customer_Contact2: [''],
    customer_Contact_Mob2: [''],
    customer_Address: [''],
    customer_pin: [''],
    customer_Sales_Manager: [''],
    customer_Distributor: [''],
    distributor_Code: [''],
    customer_Channel: [''],
    attach1: [''],
    customercode: [''],
  });
  number: any;
  formSubmit() {
    console.log('working');
    this.number = this.cusForm.get('customer_Mobile')?.value;
    if (this.cusForm.valid) {
      console.log('working2');
      let name =this.cusForm.get('customer_Name')?.value
      let number = this.cusForm.get('customer_Mobile')?.value
      let email = this.cusForm.get('customer_Email')?.value
      localStorage.setItem('apName',name || 'not found')
      localStorage.setItem('apNumber',number || "no number")
      localStorage.setItem('apEmail',email|| 'no email')
      const formData = this.cusForm.value;
      this.service.createCustomer(formData).subscribe((res: any) => {
        console.log(res);
        if (res != 'Mobile Number Already Registered') {
          if (this.cusForm.get('customer_Mobile')?.value) {
            this.otpForm.patchValue({
              filtervalue1: this.number,
            });
          }

          this.popbtn.nativeElement.click();
          this.startCountdown();
        }
        else{
         this.router.navigateByUrl('/home#image')
        }
      
      });
    }
  }
  otpForm = this.fb.group({
    filtervalue1: ['', Validators.required],
    filtervalue2: [
      '',
      [Validators.required, Validators.minLength(4), Validators.maxLength(4)],
    ],
  });
  resendOtp() {
    this.service.reSendOtp(this.otpForm.value).subscribe((res: any) => {
      console.log(res);
      this.startCountdown();
    });
  }
  verfiyOtp() {
    this.number = this.cusForm.get('customer_Mobile')?.value;
    if (this.cusForm.get('customer_Mobile')?.value) {
      this.otpForm.patchValue({
        filtervalue1: this.number,
      });
    }
    if (this.otpForm.valid)
      this.service.verfiyOtp(this.otpForm.value).subscribe((res: any) => {
        console.log(res);
        if (res == 'OTP Verified') {
          this.popbtn.nativeElement.click();
          this.logic.cus('success', '', 'OTP verfied!');
          window.history.back()
          // this.router.navigateByUrl('/home');
        } else {
          this.logic.cus('error', '', 'Invalid OTP!');
        }
      });
  }
  formReset() {
    console.log('working');
    this.popbtn.nativeElement.click();
    this.logic.cus('success', '', 'Form reset!');
    this.cusForm.reset();
  }
  countdownTime: number = 60; // Set the countdown starting point (60 seconds)

  startCountdown() {
    const countdown$ = interval(1000).pipe(
      takeWhile(() => this.countdownTime > 0)
    );

    countdown$.subscribe(() => {
      this.countdownTime--;
    });
  }

  // Method to convert seconds into MM:SS format
  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${this.pad(minutes)}:${this.pad(remainingSeconds)}`;
  }

  // Helper function to add leading zero if necessary
  pad(value: number): string {
    return value < 10 ? '0' + value : value.toString();
  }
  offer:any = {
    name:'walmast',
    type:'asian_paints',
    offerPrice:510,
    price:700,
    perctange:20
  }
  combo:any={
    products:[
      {
        name:'walmast',
        type:'asian_paints',
        price:700,
      },
      {
        name:'walmast',
        type:'asian_paints',
        price:700,
      },
    ],
    combo:{
      offerPrice:510,
      price:700,
      perctange:20
    }
  }
}
