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
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { Comment } from '@angular/compiler';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProductViewComponent } from '../../parts/product-view/product-view.component';
import { CartComponent } from '../cart/cart.component';
import { LogicsService } from '../../shared/logics.service';

interface ProductItem {
  CATEGORY: string;
  SUB_CATEGORY: string;
  Division: string;
  Discount: number;
  ECOMCODE: string;
  MaterialCode: string;
  items: Array<{ pack: string; price: number }>; // Adjust item structure as needed
}
interface ProductGroup {
  ECOMCODE: string;
  Division: string;
  products: ProductItem[];
}
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
  selectedCat: any = { "Division": 35 };
  selectedCategory: any =  35 ;
  selectedCatSub: any;
  selectedSubIndex: number = 0
  final: any = [];
  originalData: any = [];
  groupedData: any = {};
  username: any
  cartCount: any
  // sortDisplay: Observable<string>=of('Low to High')
  filterForm = this.fb.group({
    "filtervalue1": "Summary",
    "filtervalue2": "",
    "filtervalue3": "",
    "filtervalue4": "",
    "filtervalue5": "",
    "filtervalue6": "",
    "filtervalue7": ""

  });
  schemesForm = this.fb.group({
    "filtervalue1": "",
    "filtervalue2": "",
    "filtervalue3": "scheme_v11",
    "filtervalue4": "",
    "filtervalue5": "",
    "filtervalue6": "",
    "filtervalue7": "",
    "filtervalue8": ""
  })
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
      this.username = localStorage.getItem("apName");
      this.cartCount = this.logic.cartItems.length
    });
    // if(this.show == 'cart'){
    // console.log(this.logic.cart, 'cart', this.show);
    this.selectCat({ "Division": 35 })
    // }
    // console.log(this.show);
    // this.getAllBrandwise();
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
            // if (
            //   item.CATEGORY == this.selectedCat &&
            //   this.selectedCatSub == item.SUB_CATEGORY
            // ) {
            if (
              item.CATEGORY == this.selectedCat
            ) {

              this.data$ = of(item.items);
              this.originalData = item.items;


              //console.log(this.originalData);
            }
          });
        }
      });
    }


  }
  searchNow(value: any) {
    let searchTerm = value.trim().toLowerCase();
    console.log(searchTerm, "search");

    if (!searchTerm) {
      // If no search term, revert to original data
      // console.log(this.final, "final data");

      // this.final = this.originalData;
      // this.data$ = this.originalData;
      this.getAll();
    } else {
      // Filter the original data based on the search term
      this.final = this.originalData.filter((item: any) => {
        return (
          item.ASIAN_PAINTS?.toLowerCase().includes(searchTerm) ||
          item.BERGER_PAINTS?.toLowerCase().includes(searchTerm) ||
          item.JN_PAINTS?.toLowerCase().includes(searchTerm)
        );
      });
    }
    this.data$ = of(this.final);
    console.log(this.final, 'search');
  }

  // selectCat(v: any) {
  //   if (this.show == 'detail') {
  //     window.history.back();
  //   }
  //   //console.log(v, "select cat");

  //   this.router.navigateByUrl(`/home?cat=${v.Division}#${this.show}`);
  //   this.selectedCatSub = '';
  //   this.selectedCat = v;
  //   //console.log(this.selectedCat, "selected cat select category");
  //   this.selectedSubIndex = 0;
  //   // this.selectedSubIndex = this.newCats.findIndex((r: any) => {
  //   //   console.log(r, "data for 35");
  //   //   console.log(v, "new v data");

  //   //   return r.Division == v.Division;
  //   // });
  //   // console.log(this.selectedSubIndex, "new sub index");
  //   this.final.forEach((item: any) => {
  //     console.log(item, "item")
  //     //console.log(item.Division, this.selectedCat.Division, "test");
  //     // if (
  //     //   item.Division == this.selectedCat &&
  //     //   this.selectedCatSub == item.SUB_CATEGORY
  //     // )
  //     if (
  //       item.Division == this.selectedCat.Division
  //     ) {
  //       console.log(item.items, "products");

  //       this.data$ = of(item.items);
  //       this.originalData = item.items;
  //     }
  //   });
  //   console.log(this.originalData, 'send data');
  // }

  // selectSub(v: any) {
  //   this.selectedCatSub = v;
  //   console.log(this.selectedCatSub, 'sub');
  //   this.router.navigateByUrl(
  //     `/home?cat=${this.selectedCat}&subCat=${v}#${this.show}`
  //   );
  //   this.final.forEach((item: any) => {
  //     console.log(item.CATEGORY, this.selectedCat,
  //       this.selectedCatSub, item.SUB_CATEGORY);
  //     if (
  //       item.CATEGORY == this.selectedCat &&
  //       this.selectedCatSub == item.SUB_CATEGORY
  //     ) {


  //       this.data$ = of(item.products);
  //       this.originalData = item.products;



  //     }
  //   });
  //   console.log(this.originalData, 'send data');
  // }

  //On catgeory select

  // selectCat(v: any) {
  //   if (this.show === 'detail') {
  //     window.history.back();
  //   }

  //   this.router.navigateByUrl(`/home?cat=${v.Division}#${this.show}`);
  //   this.selectedCatSub = '';
  //   this.selectedCat = v;
  //   this.selectedSubIndex = 0;

  //   // Temporary array to collect all items for the selected Division
  //   const allDivisionItems: any[] = [];

  //   // Loop through the final grouped data and collect items matching the Division
  //   this.final.forEach((group: ProductGroup) => {
  //     group.products.forEach((item: ProductItem) => {
  //       if (item.Division === this.selectedCat.Division ) {
  //         allDivisionItems.push(...item.items); // Collect all items for this Division
  //       }
  //     });
  //   });

  //   // Set data$ and originalData to the collected items for the Division
  //   this.data$ = of(allDivisionItems);
  //   this.originalData = allDivisionItems;

  //   console.log(this.originalData, 'send data');
  // }

  // selectCat(v: any) {
  //   if (this.show === 'detail') {
  //     window.history.back();
  //   }

  //   this.router.navigateByUrl(`/home?cat=${v.Division}#${this.show}`);
  //   this.selectedCatSub = '';
  //   this.selectedCat = v;
  //   this.selectedSubIndex = 0;

  //   // Object to store common data for each unique ECOMCODE
  //   const commonDataByEcomcode: { [key: string]: any } = {};

  //   // Loop through the final grouped data and collect items matching the Division
  //   this.final.forEach((group: ProductGroup) => {
  //     group.products.forEach((item: ProductItem) => {
  //       if (item.Division === this.selectedCat.Division) {
  //         const ecomcode = item.ECOMCODE;

  //         // Initialize common data for the ECOMCODE if it doesn't exist
  //         if (!commonDataByEcomcode[ecomcode]) {
  //           commonDataByEcomcode[ecomcode] = {
  //             ASIAN_PAINTS: null,
  //             Asian_detils: [],
  //             BERGER_PAINTS: null,
  //             BERGER_details: [],
  //             JN_PAINTS: null,
  //             JN_details: []
  //           };
  //         }

  //         // Populate the common details by checking each brand in the item
  //         item.items.forEach((brandItem: any) => {
  //           if (brandItem.ASIAN_PAINTS) commonDataByEcomcode[ecomcode].ASIAN_PAINTS = brandItem.ASIAN_PAINTS;
  //           if (brandItem.Asian_detils.length) commonDataByEcomcode[ecomcode].Asian_detils = brandItem.Asian_detils;
  //           if (brandItem.BERGER_PAINTS) commonDataByEcomcode[ecomcode].BERGER_PAINTS = brandItem.BERGER_PAINTS;
  //           if (brandItem.BERGER_details.length) commonDataByEcomcode[ecomcode].BERGER_details = brandItem.BERGER_details;
  //           if (brandItem.JN_PAINTS) commonDataByEcomcode[ecomcode].JN_PAINTS = brandItem.JN_PAINTS;
  //           if (brandItem.JN_details.length) commonDataByEcomcode[ecomcode].JN_details = brandItem.JN_details;
  //         });
  //       }
  //     });
  //   });

  //   // Convert the common data object into an array of only common details
  //   const commonDataArray = Object.values(commonDataByEcomcode);

  //   // Set data$ and originalData to the array of common data
  //   this.data$ = of(commonDataArray);
  //   this.originalData = commonDataArray;

  //   console.log(this.originalData, 'send common data');
  // }

  selectCat(v: any) {
    if (this.show === 'detail') {
      window.history.back();
    }

    this.router.navigateByUrl(`/home?cat=${v.Division}#${this.show}`);
    this.selectedCatSub = '';
    this.selectedCat = v;
    this.selectedCategory=v.Division
    this.selectedSubIndex = 0;

    // Object to store common data for each unique ECOMCODE
    const commonDataByEcomcode: { [key: string]: any } = {};

    // Loop through the final grouped data and collect items matching the Division
    this.final.forEach((group: ProductGroup) => {
      group.products.forEach((item: ProductItem) => {
        console.log(this.final, "final");


        if (item.Division == this.selectedCat.Division) {
          console.log(this.selectedCat.Division, item.Division, "on load seleced division");

          const ecomcode = item.ECOMCODE;
          // console.log(ecomcode, item, "ecomcodee");

          // Initialize common data for the ECOMCODE if it doesn't exist
          if (!commonDataByEcomcode[ecomcode]) {
            commonDataByEcomcode[ecomcode] = {
              ecomcode: item.ECOMCODE,
              ASIAN_PAINTS: null,
              ASIAN_MaterialCode: "",
              Asian_detils: [],
              BERGER_PAINTS: null,
              BERGER_MaterialCode: "",
              BERGER_details: [],
              JN_PAINTS: null,
              JN_MaterialCode: "",
              JN_details: [],
              Sheenlac_PAINTS: null,
              Sheenlac_MaterialCode: "",
              Sheenlac_details: []
            };
          }

          // Populate the common details by checking each brand in the item
          item.items.forEach((brandItem: any) => {
            // Check and assign ASIAN_PAINTS and its MaterialCode
            if (brandItem.ASIAN_PAINTS) {
              commonDataByEcomcode[ecomcode].ASIAN_PAINTS = brandItem.ASIAN_PAINTS;
              commonDataByEcomcode[ecomcode].ASIAN_MaterialCode = item.MaterialCode;
            }
            if (brandItem.Asian_detils.length) {
              commonDataByEcomcode[ecomcode].Asian_detils = brandItem.Asian_detils;
            }

            // Check and assign BERGER_PAINTS and its MaterialCode
            if (brandItem.BERGER_PAINTS) {
              commonDataByEcomcode[ecomcode].BERGER_PAINTS = brandItem.BERGER_PAINTS;
              commonDataByEcomcode[ecomcode].BERGER_MaterialCode = item.MaterialCode;
            }
            if (brandItem.BERGER_details.length) {
              commonDataByEcomcode[ecomcode].BERGER_details = brandItem.BERGER_details;
            }

            // Check and assign JN_PAINTS and its MaterialCode
            if (brandItem.JN_PAINTS) {
              commonDataByEcomcode[ecomcode].JN_PAINTS = brandItem.JN_PAINTS;
              commonDataByEcomcode[ecomcode].JN_MaterialCode = item.MaterialCode;
            }
            if (brandItem.JN_details.length) {
              commonDataByEcomcode[ecomcode].JN_details = brandItem.JN_details;
            }
            if (brandItem.Sheenlac_PAINTS) {
              commonDataByEcomcode[ecomcode].Sheenlac_PAINTS = brandItem.Sheenlac_PAINTS;
              commonDataByEcomcode[ecomcode].Sheenlac_MaterialCode = item.MaterialCode;
            }
            if (brandItem.Sheenlac_details.length) {
              commonDataByEcomcode[ecomcode].Sheenlac_details = brandItem.Sheenlac_details;
            }
          });
        }
      });
    });

    // Convert the common data object into an array of only common details
    const commonDataArray = Object.values(commonDataByEcomcode);

    // Set data$ and originalData to the array of common data
    this.data$ = of(commonDataArray);
    this.originalData = commonDataArray;

    console.log(this.originalData, 'send common data');
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
  // filterData() {
  //   console.log(this.arData, "arData");

  //   this.arData.forEach((item: any) => {
  //     console.log(item, "log item");

  //     let index = this.final.findIndex((value: any) => {
  //       //console.log(item.Division, value.Division, "category");

  //       return (
  //         item.Division == value.Division && item.ECOMCODE == value.ECOMCODE
  //       );
  //       // return (
  //       //   item.CATEGORY == value.CATEGORY
  //       // );
  //       // return (
  //       //   item.CATEGORY == value.CATEGORY &&
  //       //   item.SUB_CATEGORY == value.SUB_CATEGORY
  //       // );
  //     });
  //     console.log(index, 'index');

  //     if (index > -1) {
  //       this.final[index].items.push(item.products[0]);
  //       console.log(this.final, 'filter data if');

  //     } else {
  //       this.final.push({
  //         CATEGORY: item.CATEGORY,
  //         SUB_CATEGORY: item.SUB_CATEGORY,
  //         Division: item.Division,
  //         Discount: item.DISCOUNT,
  //         ECOMCODE: item.ECOMCODE,
  //         MaterialCode: item.MaterialCode,
  //         items: [item.products[0]],
  //       });
  //       console.log(this.final, 'filter data else');

  //     }
  //   });
  //   //this.selectSub(this.final[0].Division)
  // }

  filterData() {
    console.log(this.arData, "arData");

    const groupedProducts = new Map<string, ProductGroup>();

    this.arData.forEach((item: any) => {
      const key = item.ECOMCODE + '-' + item.Division;  // Combine ECOMCODE and Division to form the key

      if (groupedProducts.has(key)) {
        // Append product to the existing ECOMCODE and Division group
        groupedProducts.get(key)?.products.push({
          CATEGORY: item.CATEGORY,
          SUB_CATEGORY: item.SUB_CATEGORY,
          Division: item.Division,
          Discount: item.DISCOUNT,
          ECOMCODE: item.ECOMCODE,
          MaterialCode: item.MaterialCode,
          items: item.products,
        });
      } else {
        // Create a new group for the combined ECOMCODE and Division if it doesn't exist
        groupedProducts.set(key, {
          ECOMCODE: item.ECOMCODE,
          Division: item.Division,
          products: [{
            CATEGORY: item.CATEGORY,
            SUB_CATEGORY: item.SUB_CATEGORY,
            Division: item.Division,
            Discount: item.DISCOUNT,
            ECOMCODE: item.ECOMCODE,
            MaterialCode: item.MaterialCode,
            items: item.products,
          }]
        });
      }
    });

    // Convert the map values to an array and then to an observable
    this.final = Array.from(groupedProducts.values());  // Convert the Map to an array
    this.data$ = from(this.final) as Observable<ProductGroup[]>; // Create an observable from the array of ProductGroup
    console.log(this.final, "final grouped output");
    this.selectCat({ "Division": this.selectedCategory });

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
