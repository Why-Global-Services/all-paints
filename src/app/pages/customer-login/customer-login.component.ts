import { Component, ElementRef, inject, ViewChild, AfterViewInit } from '@angular/core';
import { HeaderComponent } from '../../parts/header/header.component';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
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
  imports: [HeaderComponent, ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './customer-login.component.html',
  styleUrl: './customer-login.component.scss',
})
export class CustomerLoginComponent {
  @ViewChild('popbtn') popbtn!: ElementRef<HTMLButtonElement>;
  @ViewChild('customerModal') customerModal!: ElementRef<HTMLButtonElement>;

  fb = inject(FormBuilder);
  service = inject(ApiService);
  logic = inject(LogicsService);
  router = inject(Router);
  customerDetails: any[] = [];
  cusForm = this.fb.group({
    customer_Gst_no: [''],
    firstname: ['', Validators.required],
    lastName: [''],
    customer_Mobile: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
    customer_Mobile2: [''],
    customer_Email: ['', [Validators.required, Validators.email]],
    gender: ['MALE'],
    dateOfBirth: [''],
    customer_pin: ['600119'],
    customercode: [''],
    customername: [''],
    customerstatus: [''],
    distributor_Code: ['91037014'],
    customer_Distributor: [''],
    id_proff: [''],
    customer_State: ['Tamilnadu'],
    customer_city: ['chennai'],
    attach1: [''],
    attach2: [''],
    attach3: [''],
    cremarks1: [''],
    cremarks2: [''],
    cremarks3: [''],
    cremarks4: [''],
    cremarks5: [''],
    lcreateddate: ['']
  });
  number: any;
  customerRequest = this.fb.group({
    "filtervalue1": "0091037014",
    "filtervalue2": "IT-ADMIN",
    "filtervalue3": "Customer1",
    "filtervalue4": "bill_to",
    "filtervalue5": "",
    "filtervalue6": "",
    "filtervalue7": "",
    "filtervalue8": ""
  })

  formSubmit() {
    console.log('working');
    this.number = this.cusForm.get('customer_Mobile')?.value;
    if (this.cusForm.valid) {
      console.log('working2');
      let name = this.cusForm.get('firstname')?.value
      let number = this.cusForm.get('customer_Mobile')?.value
      let email = this.cusForm.get('customer_Email')?.value
      localStorage.setItem('apName', name || 'not found')
      localStorage.setItem('apNumber', number || "no number")
      localStorage.setItem('apEmail', email || 'no email')
      const formData = this.cusForm.value;
      this.service.createCustomer(formData).subscribe((res: any) => {
        console.log(res[0][0], "login data");
        localStorage.setItem('apCusId', res[0][0].CUSTOMER.CUSTOMER)
        if (res != 'Mobile Number Already Registered') {
          if (this.cusForm.get('customer_Mobile')?.value) {
            this.otpForm.patchValue({
              filtervalue1: this.number,
            });
          }

          this.popbtn.nativeElement.click();
          this.startCountdown();
        }
        else {
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
  getCustomerDetails() {
    this.service.getCustomerDetails(this.customerRequest.value).subscribe(
      (res: any) => {
        console.log('API Response:', res);

        // Check if the response is a JSON string and parse it if necessary
        if (typeof res === 'string') {
          try {
            // Parse the string if it's JSON formatted
            this.customerDetails = JSON.parse(res);
          } catch (e) {
            console.error('Failed to parse response:', e);
            this.customerDetails = [];
          }
        } else if (Array.isArray(res)) {
          // If it's already an array, assign it directly
          this.customerDetails = res;
        } else {
          // If the response is neither a string nor an array, assume empty
          this.customerDetails = [];
        }

        console.log(this.customerDetails, 'Parsed customer details');
        this.customerModal.nativeElement.click();
      },
      (err) => {
        console.log('Error in this API', err);
      }
    );
  }

  storeCustomerCode(customercode: any, name: string) {
    localStorage.setItem("apCusId", customercode)
    localStorage.setItem("apName", name)
    window.history.back()
  }

  closeCustomerModal() {
    this.customerModal.nativeElement.click(); // Adjust based on your modal close mechanism
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
  offer: any = {
    name: 'walmast',
    type: 'asian_paints',
    offerPrice: 510,
    price: 700,
    perctange: 20
  }
  combo: any = {
    products: [
      {
        name: 'walmast',
        type: 'asian_paints',
        price: 700,
      },
      {
        name: 'walmast',
        type: 'asian_paints',
        price: 700,
      },
    ],
    combo: {
      offerPrice: 510,
      price: 700,
      perctange: 20
    }
  }
}
