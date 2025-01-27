import { Routes } from '@angular/router';
import { Cookie } from 'ng2-cookies';

let routHandler=(component:any)=>{

  if(!Cookie.get('apToken')){
window.location.href="/login"

return
  }
return component;
}

export const routes: Routes = [
  {
    path: '',
    
    loadComponent: () =>
      import('./pages/staff-login/staff-login.component').then(
        (m) => m.StaffLoginComponent
      ),
  },
  {
    path: 'customer-login',
    loadComponent: () =>
      import('./pages/customer-login/customer-login.component').then(
        (m) => m.CustomerLoginComponent
      ),
  },
  {
    path:'home',
    children:[
    
      {
        path:'image',
        loadComponent:()=>import('./parts/image-compare/image-compare.component').then((m)=>routHandler(m.ImageCompareComponent))
      },
      {
        path:'list',
        loadComponent:()=>import('./parts/list-compare/list-compare.component').then((m)=>routHandler(m.ListCompareComponent))
      },
      {
        path:'detail',
        loadComponent:()=>import('./parts/product-view/product-view.component').then((m)=>routHandler(m.ProductViewComponent))
      }
    ],
    loadComponent:()=> import('./pages/home/home.component').then((m)=>routHandler(m.HomeComponent))
   
  },
  {
    path:'cart',
    loadComponent:()=> import('./pages/cart/cart.component').then((m)=>routHandler(m.CartComponent))
  },
  {
    path:'checkOut',
    loadComponent:()=>import('./pages/check-out/check-out.component').then((m)=>routHandler(m.CheckOutComponent))
  },
  {
    path:'payment',
    loadComponent:()=>import('./payment/payment.component').then((m)=>routHandler(m.PaymentComponent))
  },
  {
    path:"paid",
    loadComponent:()=>import('./pages/success/success.component').then((m)=>routHandler(m.SuccessComponent))
  },
  {
    path:"**",
    loadComponent: () =>
      import('./pages/staff-login/staff-login.component').then(
        (m) => m.StaffLoginComponent
      ),
  }
];
