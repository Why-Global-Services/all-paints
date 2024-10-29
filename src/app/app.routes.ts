import { Routes } from '@angular/router';

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
        loadComponent:()=>import('./parts/image-compare/image-compare.component').then((m)=>m.ImageCompareComponent)
      },
      {
        path:'list',
        loadComponent:()=>import('./parts/list-compare/list-compare.component').then((m)=>m.ListCompareComponent)
      },
      {
        path:'detail',
        loadComponent:()=>import('./parts/product-view/product-view.component').then((m)=>m.ProductViewComponent)
      }
    ],
    loadComponent:()=> import('./pages/home/home.component').then((m)=>m.HomeComponent)
   
  },
  {
    path:'cart',
    loadComponent:()=> import('./pages/cart/cart.component').then((m)=>m.CartComponent)
  },
  {
    path:'checkOut',
    loadComponent:()=>import('./pages/check-out/check-out.component').then((m)=>m.CheckOutComponent)
  },
  {
    path:'payment',
    loadComponent:()=>import('./payment/payment.component').then((m)=>m.PaymentComponent)
  },
  {
    path:"paid",
    loadComponent:()=>import('./pages/success/success.component').then((m)=>m.SuccessComponent)
  },
  {
    path:"**",
    loadComponent: () =>
      import('./pages/staff-login/staff-login.component').then(
        (m) => m.StaffLoginComponent
      ),
  }
];
