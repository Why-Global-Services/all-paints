import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from '../../parts/header/header.component';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import {
  ActivatedRoute,
  Router,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { ImageCompareComponent } from '../../parts/image-compare/image-compare.component';
import { ListCompareComponent } from '../../parts/list-compare/list-compare.component';
import { ApiService } from '../../shared/api.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Comment } from '@angular/compiler';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProductViewComponent } from '../../parts/product-view/product-view.component';
import { CartComponent } from '../cart/cart.component';
import { LogicsService } from '../../shared/logics.service';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeaderComponent,
    CartComponent,
    ProductViewComponent,
    RouterOutlet,
    CommonModule,
    NzDropDownModule,
    ImageCompareComponent,
    ListCompareComponent,
    RouterModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  api = inject(ApiService);
  fb = inject(FormBuilder);
  show: string = 'image';
  showDisplay: any = 'Display By Image';
  logic = inject(LogicsService);
  // dummyData: any = this.logic.dummyData;
  dummyCategories: any = this.logic.dummyCategories;
  arData: any = [];
  cats: any = [];
  newCats: any = [];
  selectedCat: any;
  selectedCatSub: any;
  selectedSubIndex: number = 0
  final: any = [];
  originalData: any = [];
  // sortDisplay: Observable<string>=of('Low to High')
  filterForm = this.fb.group({
    filtervalue1: [''],
    filtervalue2: [''],
    filtervalue3: [''],
    filtervalue4: [''],
    filtervalue5: [''],
    filtervalue6: [''],
    filtervalue7: [''],
  });
  mainTItle = [
    'Specialty Coating',
    'Wood Coating',
    'Wall Paints',
    'Enamels',
    'Floor Coating',
    'Protective Coatings',
    'Spray paints',
  ];
  subTitle = ['Interiors Wall Paints', 'Exterior Wall Paints'];
  private productsSubject = new BehaviorSubject<any[]>([]);
  data$ = this.productsSubject.asObservable();

  // filterDummy() {
  //   this.dummyData.forEach((v: any) => {


  //     let index = this.cats.findIndex((item: any) => {

  //       return item.cat == v.category;
  //     });

  //     if (index >= 0) {
  //       this.cats[index].subcat.push(v.suB_CATEGORY);
  //     } else {
  //       this.cats.push({ cat: v.category, subcat: [v.suB_CATEGORY] });
  //     }
  //   });
  //   console.log(this.cats, 'cats');
  //   this.selectedCat = this.cats[0].cat;
  //   this.selectedSubIndex = 0;
  //   this.selectedCatSub = this.cats[0].subcat[0];
  //   this.selectSub(this.selectedCatSub);
  //   this.sortValue === 'High to Low';
  //   this.sortProducts();
  // }
  ngOnInit(): void {
    // this.filterDummy();
    this.newCats = this.dummyCategories;
    console.log(this.newCats, "static cats");
    this.activatedRoute.fragment.subscribe((fragment: string | null) => {
      console.log(this.show, "show");
      if (fragment) {
        this.show = fragment;
      }


    });
    // if(this.show == 'cart'){
    console.log(this.logic.cart, 'cart', this.show);

    // }
    console.log(this.show);
    this.getAll();
    if (this.show == 'image' || this.show == 'list') {

      this.activatedRoute.queryParams.subscribe((res: any) => {
        console.log(res, 'res');
        if (res.cat) {
          this.selectedCat = res.cat;

          console.log(this.selectedCat, "selectedCat");
          this.selectedSubIndex = this.final.findIndex((r: any) => {
            console.log(r.Division, "sub index");

            return r.Division == this.selectedCat;
          });
          console.log(this.selectedSubIndex, "sub Index");
        }
        if (res.subCat) {
          this.selectedCatSub = res.subCat;
          this.final.forEach((item: any) => {
            if (
              item.CATEGORY == this.selectedCat &&
              this.selectedCatSub == item.SUB_CATEGORY
            ) {

              this.data$ = of(item.items);
              this.originalData = item.items;


              console.log(this.originalData);
            }
          });
        }
      });
    }


  }
  searchNow(value: any) {
    let searchTerm = value.trim().toLowerCase();
    // console.log(searchTerm,this.originalData);

    if (!searchTerm) {
      // If no search term, revert to original data
      this.final = this.originalData;
    } else {
      // Filter the original data based on the search term
      this.final = this.originalData.filter((item: any) => {
        return (
          item.asiaN_PAINTS?.toLowerCase().includes(searchTerm) ||
          item.bergeR_PAINTS?.toLowerCase().includes(searchTerm) ||
          item.jN_PAINTS?.toLowerCase().includes(searchTerm)
        );
      });
    }
    this.data$ = of(this.final);
    console.log(this.final, 'search');
  }

  selectCat(v: any) {
    if (this.show == 'detail') {
      window.history.back();
    }
    console.log(v, "select cat");

    this.router.navigateByUrl(`/home?cat=${v.Division}#${this.show}`);
    this.selectedCatSub = '';
    this.selectedCat = v;
    console.log(this.selectedCat, "selected cat select category");
    this.selectedSubIndex = 0;
    // this.selectedSubIndex = this.newCats.findIndex((r: any) => {
    //   console.log(r, "data for 35");
    //   console.log(v, "new v data");

    //   return r.Division == v.Division;
    // });
    // console.log(this.selectedSubIndex, "new sub index");
    this.final.forEach((item: any) => {
      console.log(item, "item")
      console.log(item.Division, this.selectedCat.Division, "test");
      // if (
      //   item.Division == this.selectedCat &&
      //   this.selectedCatSub == item.SUB_CATEGORY
      // )
      if (
        item.Division == this.selectedCat.Division
      ) {
        console.log(item.items, "products");

        this.data$ = of(item.items);
        this.originalData = item.items;
      }
    });
    console.log(this.originalData, 'send data');
  }
  selectSub(v: any) {
    this.selectedCatSub = v;
    console.log(this.selectedCatSub, 'sub');
    this.router.navigateByUrl(
      `/home?cat=${this.selectedCat}&subCat=${v}#${this.show}`
    );
    this.final.forEach((item: any) => {
      console.log(item.CATEGORY, this.selectedCat,
        this.selectedCatSub, item.SUB_CATEGORY);
      if (
        item.CATEGORY == this.selectedCat &&
        this.selectedCatSub == item.SUB_CATEGORY
      ) {


        this.data$ = of(item.products);
        this.originalData = item.products;



      }
    });
    console.log(this.originalData, 'send data');
  }

  getAll() {
    this.api.getAllProducts(this.filterForm.value).subscribe((res: any) => {
      console.log(res, 'data from api');
      this.arData = res;
      this.selectedCat = res[0].CATEGORY

      // this.data$ = of(res);

      // this.final = res;
      // console.log(this.arData);

      this.filterData();
    });
  }

  filterData() {
    console.log(this.arData, "arData");

    this.arData.forEach((item: any) => {
      let index = this.final.findIndex((value: any) => {
        return (
          item.CATEGORY == value.CATEGORY &&
          item.SUB_CATEGORY == value.SUB_CATEGORY
        );
      });
      // console.log(index);

      if (index > -1) {
        this.final[index].items.push(item.products[0]);
      } else {
        this.final.push({
          CATEGORY: item.CATEGORY,
          SUB_CATEGORY: item.SUB_CATEGORY,
          Division: item.Division,
          items: [item.products[0]],
        });
      }
    });
    this.selectSub(this.final[0].Division)
    console.log(this.final, 'filter data');
  }

  close(tag: HTMLElement, value: any) {
    // console.log('working');
    this.showDisplay = value;
    tag.click();
  }
  sortDisplay!: Observable<string>;
  sortValue: any = 'High to Low';
  closeSort(tag: HTMLElement, val: any) {
    this.sortValue = val;
    tag.click();
    this.sortProducts();
  }
  sortProducts(): void {
    if (this.sortValue === 'Low to High') {
      this.final.sort((a: any, b: any) => {
        const priceA = a.asian_details[0]?.price ?? Infinity; // Use Infinity if not found
        const priceB = b.asian_details[0]?.price ?? Infinity; // Use Infinity if not found
        return priceA - priceB; // Ascending order
      });
    } else if (this.sortValue === 'High to Low') {
      this.final.sort((a: any, b: any) => {
        const priceA = a.asian_details[0]?.price ?? -Infinity; // Use -Infinity if not found
        const priceB = b.asian_details[0]?.price ?? -Infinity; // Use -Infinity if not found
        return priceB - priceA; // Descending order
      });
    }

    console.log('Sorted data:', this.final, this.sortValue);
  }

  sortBackend(tag: HTMLElement, v: any) {
    this.filterForm.patchValue({
      filtervalue6: v,
    });
    this.getAll();
    tag.click();
  }
}
