import { inject, Injectable } from '@angular/core';
import{base}from '../environment'
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  api = base.api
  http = inject(HttpClient)
  constructor() { }
  
  loginStaff(body:any){
    return this.http.post(this.api +'security/createToken',body)
  }
  createCustomer(body:any){
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json'
    // });
    return this.http.post(this.api+'api/FranchiOrder/SaveCustomerCreation',body)
  }
  getAllProducts(body:any){
    return this.http.post(this.api+'api/Stock/GetAllPaintsProducts',body)
  }
  reSendOtp(body:any){
    return this.http.post(this.api+'api/FranchiOrder/misexotelotp',body)
  }
  verfiyOtp(body:any){
    return this.http.post(this.api+'api/FranchiOrder/OTPverify',body)
  }
  createCart(body:any){
    return this.http.post(this.api+'api/FranchiOrder/Cartcreation',body)
  }
  getCart(body:any){
    return this.http.get(this.api+'')
  }
  payment(body:any){
    return this.http.post(this.api+'api/FranchiStock/CustomerPayment',body)
  }
}
