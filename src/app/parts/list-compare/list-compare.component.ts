import { Component, inject, Input, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ApiService } from '../../shared/api.service';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'list-compare',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './list-compare.component.html',
  styleUrl: './list-compare.component.scss'
})
export class ListCompareComponent implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  @Input() data: Observable<any[]> = new BehaviorSubject<any[]>([]).asObservable();
  private dataSubscription!: Subscription;
  dataValue!: string; 
  arData:any=[]
  api = inject(ApiService)
  
  final:any=[
  ]
  ngOnInit(): void {
    if (this.data) { 
      this.subscribeToData();
    }
    // this.getAll()
  }
  ngOnChanges(changes: SimpleChanges): void {
  
    console.log(this.data);
    
    if (changes['data'] && this.data) {
      this.subscribeToData();
    }
   

  }
  subscribeToData(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();  
    }
    this.dataSubscription = this.data.subscribe((value: any) => {
      console.log('Data received:', value);  
      this.final = value;  // Update the final data with the latest
    });
  }
  getAll(){
    this.api.getAllProducts('').subscribe((res:any)=>{
      // console.log(res);
      this.data=JSON.parse(res)
      this.filterData()
    })
  }
  filterData(){
    console.log(typeof this.data);
    
    this.arData.forEach((item:any)=>{
      let index = this.final.findIndex((value:any)=>{
        return item.CATEGORY == value.CATEGORY && item['SUB CATEGORY'] == value.SUB_CATEGORY
      })
      // console.log(index);
      
      if(index > -1){
       this.final[index].items.push(item)
      }else{
        this.final.push({CATEGORY:item.CATEGORY,SUB_CATEGORY:item['SUB CATEGORY'],items:[item]})
      }
    })
    console.log(this.final,'sdfsdf',this.final[0]);
  // this.final[0].items.f
  }
}
