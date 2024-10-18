import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from '../../parts/header/header.component';
import { ToolsMenuComponent } from '../../parts/tools-menu/tools-menu.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { RouterModule } from '@angular/router';
import { LogicsService } from '../../shared/logics.service';
@Component({
  selector: 'cart',
  standalone: true,
  imports: [HeaderComponent,RouterModule,ToolsMenuComponent,NzButtonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  logic = inject(LogicsService)
  cartData:any =[]
  selectedPaints:any = []
  selectedTotal:any=0
  cartLength:any=0
  ngOnInit(): void {
   console.log(this.logic.cart ,'cart');
   this.cartData = this.logic.cart
   this.cartLength = this.cartData.length
   this.getTotalPrice()
  }
  getTotalPrice() {
    let total = 0;
    this.cartData.forEach((product:any) => {
      total += product.selectDetails.price;
      const clonedProduct = JSON.parse(JSON.stringify({
        selectDetails: product.selectDetails,
        selectedPack: product.selectedPack,
        count: 1
      }));
      this.selectedPaints.push(clonedProduct);
    });
    console.log(this.selectedPaints,'selected paints');
    
    this.total = total
    this.getSeletedTotal()
  }
  getSeletedTotal(){
    let total = 0;
    this.selectedPaints.forEach((product:any) => {
      total += product.selectDetails.price;
      // this.selectedPaints.push({selectDetails:product.selectDetails,selectedPack:product.selectedPack,count:1})
    });
    console.log(this.selectedPaints,'selected paints',this.cartData,'cart data');
    
    this.selectedTotal = Math.round(total) 
    
  }
  sum(arIndex:any,count:any,val:any){
    if(val == -1){
      
      this.selectedPaints[arIndex].count = count - 1
      const price = this.cartData[arIndex].selectDetails.price
     
      
      this.selectedPaints[arIndex].selectDetails.price = price * (count-1)
      console.log('minus',this.selectedPaints[arIndex].selectDetails.price,price , count-1);
      
      this.getSeletedTotal()
    }else if(val ==1){
      this.selectedPaints[arIndex].count = count + 1
      const price =this.cartData[arIndex].selectDetails.price
      this.selectedPaints[arIndex].selectDetails.price = price * (count + 1)
      console.log('plus',this.selectedPaints[arIndex].selectDetails.price,price * (count + 1));

      this.getSeletedTotal()
    }
    this.getSeletedTotal()
  }

  total :any = 0
  mainTItle = [
    'Specialty Coating',
    'Wood Coating',
    'Wall Paints',
    'Enamels',
    'Floor Coating',
    'Protective Coatings',
    'Spray paints',
  ];
  subTitle =['Interiors Wall Paints','Exterior Wall Paints']
}
