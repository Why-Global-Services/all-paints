import{D as i,H as s,xb as a}from"./chunk-HVBQXB2O.js";var p={api:"https://allpaintsdevapi.sheenlac.com/"};var m=(()=>{let r=class r{constructor(){this.api=p.api,this.http=s(a)}loginStaff(t){return this.http.post(this.api+"security/createToken",t)}profile(t){return this.http.post(this.api+"api/Stock/GetAllpaintprofileprocess",t)}getAllPacks(t){return this.http.post(this.api+"api/stock/GetAllPaintsProducts",t)}createCustomer(t){return this.http.post(this.api+"api/FranchiOrder/Savecustomercreation",t)}getAllProducts(t){return this.http.post(this.api+"api/stock/GetAllPaintsProducts",t)}getAllSchemes(t){return this.http.post(this.api+"api/FranchiOrder/AllPaintsOrderData",t)}reSendOtp(t){return this.http.post(this.api+"api/FranchiOrder/misexotelotp",t)}verfiyOtp(t){return this.http.post(this.api+"api/FranchiOrder/OTPverify",t)}cartCreate(t){return this.http.post(this.api+"api/FranchiOrder/Cartorder",t)}createCart(t){return this.http.post(this.api+"api/FranchiOrder/Cartcreation",t)}getCart(t){return this.http.post(this.api+"api/FranchiOrder/Getcartdetails",t)}updateCart(t){return this.http.post(this.api+"api/FranchiOrder/CartUpdate",t)}DeleteCartItem(t){return this.http.post(this.api+"api/FranchiOrder/RemoveCartOrder",t)}payment(t){return this.http.post(this.api+"api/FranchiStock/CustomerPayment",t)}getCustomerDetails(t){return this.http.post(this.api+"api/FranchiOrder/AllPaintsOrderData",t)}setSessionId(t){sessionStorage.setItem("sessionId",t)}getSessionId(){return sessionStorage.getItem("sessionId")}clearSessionId(){sessionStorage.removeItem("sessionId")}};r.\u0275fac=function(o){return new(o||r)},r.\u0275prov=i({token:r,factory:r.\u0275fac,providedIn:"root"});let e=r;return e})();export{m as a};
