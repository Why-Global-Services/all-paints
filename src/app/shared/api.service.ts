import { inject, Injectable } from '@angular/core';
import { base } from '../environment'
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  api = base.api
  http = inject(HttpClient)
  constructor() { }

  loginStaff(body: any) {
    return this.http.post(this.api + 'security/createToken', body)
  }
  profile(body: any) {
    return this.http.post(this.api + 'api/Stock/GetAllpaintprofileprocess', body)
  }
  createCustomer(body: any) {
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json'
    // });
    return this.http.post(this.api + 'api/FranchiOrder/Savecustomercreation', body)
  }
  getAllProducts(body: any) {
    return this.http.post(this.api + 'api/stock/GetAllPaintsProducts', body)
  }
  getAllSchemes(body: any) {
    return this.http.post(this.api + 'api/FranchiOrder/AllPaintsOrderData', body)
  }
  reSendOtp(body: any) {
    return this.http.post(this.api + 'api/FranchiOrder/misexotelotp', body)
  }
  verfiyOtp(body: any) {
    return this.http.post(this.api + 'api/FranchiOrder/OTPverify', body)
  }
  cartCreate(body: any) {
    return this.http.post(this.api + 'api/FranchiOrder/Cartorder', body)
  }
  createCart(body: any) {
    return this.http.post(this.api + 'api/FranchiOrder/Cartcreation', body)
  }
  getCart(body: any) {
    return this.http.get(this.api + '')
  }
  payment(body: any) {
    return this.http.post(this.api + 'api/FranchiStock/CustomerPayment', body)
  }
  getCustomerDetails(body: any) {
    return this.http.post(this.api + 'api/FranchiOrder/AllPaintsOrderData', body);
  }

}
