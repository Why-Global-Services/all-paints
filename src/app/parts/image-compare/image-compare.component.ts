import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, OnChanges, SimpleChanges, OnDestroy, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { BehaviorSubject, Observable, Subscription, from } from 'rxjs';
import { LogicsService } from '../../shared/logics.service';

@Component({
  selector: 'image-compare',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './image-compare.component.html',
  styleUrls: ['./image-compare.component.scss']
})
export class ImageCompareComponent implements OnInit, OnChanges, OnDestroy {

  @Input() sort2!: Observable<string>;  // Input for sorting criteria (Low to High or High to Low)
  @Input() data: Observable<any[]> = new BehaviorSubject<any[]>([]).asObservable();  // Input for product data

  private productsSubject = new BehaviorSubject<any[]>([]);  // To manage product data
  private sortSubscription!: Subscription;
  private dataSubscription!: Subscription;

  logic = inject(LogicsService);
  router = inject(Router);
  
  arData: any;
  final: any[] = [];  // Final data to be used in the template
  ngOnInit(): void {
    if (this.data) { 
      this.subscribeToData();  
    }

    if (this.sort2) {
      this.subscribeToSort(); 
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      this.subscribeToData();  
    }

    if (changes['sort2'] && this.sort2) {
      console.log('Sorting data');
      this.subscribeToSort(); 
    }
  }

  subscribeToData(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();  
    }
    this.dataSubscription = this.data.subscribe((value: any) => {
      //console.log('Data received:', value);  
      this.final = value;  // Update the final data with the latest
    });
  }

  subscribeToSort(): void {
    if (this.sortSubscription) {
      this.sortSubscription.unsubscribe();  // Unsubscribe from any previous subscriptions
    }
    
    if (this.sort2 && typeof this.sort2.subscribe === 'function') {
      this.sortSubscription = this.sort2.subscribe((sortValue: string) => {
        console.log('Sort value received:', sortValue);
        this.sortProducts(sortValue);  // Sort the products based on the sort value
      });
    } else {
      console.warn('sort2 is not an Observable or is undefined.');
    }
  }

  sortProducts(sortValue: string): void {
    if (sortValue === 'Low to High') {
      this.final[0].items.sort((a: any, b: any) => a['DPL / BT'] - b['DPL / BT']);
    } else if (sortValue === 'High to Low') {
      this.final[0].items.sort((a: any, b: any) => b['DPL / BT'] - a['DPL / BT']);
    }
    console.log('Sorted data:', this.final);
  }



  check(first: any, second: any): boolean {
    return first === second;
  }

  ngOnDestroy(): void {
    if (this.sortSubscription) {
      this.sortSubscription.unsubscribe();
    }
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();  // Ensure all subscriptions are unsubscribed
    }
  }

  sendDetail(v: any): void {
    this.logic.productDetails.next(v);
    this.router.navigateByUrl(`/home#detail`);
  }

  onImageError(event: Event, v: any){
    const target = event.target as HTMLImageElement;

    v=="JN"?target.src = '../../../assets/images/jenson 1.png': target.src = '../../../assets/images/jenson 1.png'
    
  }
}
