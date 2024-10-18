import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from '../../parts/header/header.component';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../shared/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-check-out',
  standalone: true,
  imports: [HeaderComponent,FormsModule,CommonModule,RouterModule,ReactiveFormsModule],
  templateUrl: './check-out.component.html',
  styleUrl: './check-out.component.scss'
})
export class CheckOutComponent implements OnInit {
  fb = inject(FormBuilder)
  api = inject(ApiService)
  totalPay :any='0'
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
    this.form.patchValue({
      filtervalue7:name,
      filtervalue10:number,
      filtervalue14:email
    })
  }
  payment:any = 'cash'
  paymentChange(v:any){
    this.payment = v
  }
  submit(){
    this.api.payment(this.form.value).subscribe((res:any)=>{
      console.log(res);
      
    })
  }
  adval :any
  check(v:any){
    console.log(v.target.checked); 
    if(v.target.checked){
      this.form.patchValue({
        filtervalue5:this.adval
      })
    }else{
      this.form.patchValue({
        filtervalue5:''
      })
    }
  }
  change(v:any){
    this.adval = v

  }
}
