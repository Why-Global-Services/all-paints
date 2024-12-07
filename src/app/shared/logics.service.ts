import { HttpClient, HttpClientModule } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class LogicsService {
  toaster = inject(ToastrService)
  http = inject(HttpClient)
  productDetails = new BehaviorSubject<any[]>([])
  cart: any = []
  cartItems: any = []
  cartProducts: any[] = []
  cartTotal: any
  cartLength: any
  distributorcode:any
  paymentDetails:any
  colorUrl: any = 'assets/categorized_sheenlac_colors.json'
  leastProductArray:any[]=[]

  constructor() { }
  getcolor(): Observable<any> {
    return this.http.get(this.colorUrl)
  }
  error(head: string, body: string) {
    this.toaster.error(head, body, {
      positionClass: 'toast-bottom-right',
    })
  }
  cus(type: string, head: string, body: string) {
    const options = {
      positionClass: 'toast-bottom-right',
      timeOut: 3000,
      closeButton: true,
      progressBar: true
    };

    switch (type.toLowerCase()) {
      case 'success':
        this.toaster.success(body, head, options);
        break;
      case 'error':
        this.toaster.error(body, head, options);
        break;
      case 'info':
        this.toaster.info(body, head, options);
        break;
      case 'warning':
        this.toaster.warning(body, head, options);
        break;
      default:
        console.warn('Unknown toaster type:', type);
        break;
    }
  }
  dummyData = [
    {
      "category": "EXT EMULSION",
      "suB_CATEGORY": "ECONOMY",
      "Division": "35",
      "products": [
        {
          "asiaN_PAINTS": "ACE",
          "asian_details": [
            {
              "product_id": 1,
              "description": "ACE Emulsion Paint is a premium quality paint offering superior coverage and durability.",
              "price": 130.99,
              "available_sizes": ["1L", "4L", "10L"]
            }
          ],
          "bergeR_PAINTS": "WALMASTA",
          "bergeR_details": [
            {
              "product_id": 2,
              "description": "WALMASTA is known for its rich texture and vibrant colors.",
              "price": 132.49,
              "available_sizes": ["1L", "4L"]
            }
          ],
          "jN_PAINTS": "FERT",
          "jN_details": [
            {
              "product_id": 3,
              "description": "FERT Emulsion is a cost-effective solution for high-quality finishes.",
              "price": 125.75,
              "available_sizes": ["1L", "5L"]
            }
          ]
        },
        {
          "asiaN_PAINTS": "NATIONAL PAINTS",
          "asian_details": [
            {
              "product_id": 4,
              "description": "NATIONAL PAINTS offer a wide range of eco-friendly emulsion paints.",
              "price": 136.50,
              "available_sizes": ["1L", "4L", "10L"]
            }
          ],
          "bergeR_PAINTS": "BRIGHTMATE",
          "bergeR_details": [
            {
              "product_id": 5,
              "description": "BRIGHTMATE provides excellent durability and a smooth finish.",
              "price": 138.99,
              "available_sizes": ["1L", "5L"]
            }
          ],
          "jN_PAINTS": "COLORFLEX",
          "jN_details": [
            {
              "product_id": 6,
              "description": "COLORFLEX is designed for superior coverage and a rich look.",
              "price": 124.30,
              "available_sizes": ["2L", "5L"]
            }
          ]
        },
        {
          "asiaN_PAINTS": "DULUX",
          "asian_details": [
            {
              "product_id": 7,
              "description": "DULUX EXT is a top-of-the-line emulsion perfect for exterior surfaces.",
              "price": 142.50,
              "available_sizes": ["1L", "4L", "10L", "20L"]
            }
          ],
          "bergeR_PAINTS": "FINECOAT",
          "bergeR_details": [
            {
              "product_id": 8,
              "description": "FINECOAT is recognized for its excellent weather resistance.",
              "price": 141.99,
              "available_sizes": ["1L", "4L"]
            }
          ],
          "jN_PAINTS": "WATERGUARD",
          "jN_details": [
            {
              "product_id": 9,
              "description": "WATERGUARD is perfect for areas prone to moisture and dampness.",
              "price": 139.00,
              "available_sizes": ["1L", "5L"]
            }
          ]
        },
        {
          "asiaN_PAINTS": "ASIAN PAINTS",
          "asian_details": [
            {
              "product_id": 10,
              "description": "ASIAN PAINTS provides unmatched quality and is a household favorite.",
              "price": 150.00,
              "available_sizes": ["1L", "4L", "10L"]
            }
          ],
          "bergeR_PAINTS": "EMULSION PRO",
          "bergeR_details": [
            {
              "product_id": 11,
              "description": "EMULSION PRO offers a smooth finish with high washability.",
              "price": 149.50,
              "available_sizes": ["1L", "5L", "10L"]
            }
          ],
          "jN_PAINTS": "ECOPAINT",
          "jN_details": [
            {
              "product_id": 12,
              "description": "ECOPAINT is an environmentally friendly option for home painting.",
              "price": 145.00,
              "available_sizes": ["1L", "4L"]
            }
          ]
        },
        {
          "asiaN_PAINTS": "AQUA SHIELD",
          "asian_details": [
            {
              "product_id": 13,
              "description": "AQUA SHIELD is a waterproof emulsion perfect for exterior walls.",
              "price": 148.50,
              "available_sizes": ["1L", "4L", "20L"]
            }
          ],
          "bergeR_PAINTS": "SUPERIOR",
          "bergeR_details": [
            {
              "product_id": 14,
              "description": "SUPERIOR offers a long-lasting finish with a rich gloss.",
              "price": 149.99,
              "available_sizes": ["1L", "10L"]
            }
          ],
          "jN_PAINTS": "ECO PAINT",
          "jN_details": [
            {
              "product_id": 15,
              "description": "ECO PAINT is environmentally friendly and safe for all.",
              "price": 144.30,
              "available_sizes": ["2L", "5L"]
            }
          ]
        }
      ]
    },
    {
      "category": "INTERIOR PAINT",
      "suB_CATEGORY": "PREMIUM",
      "products": [
        {
          "asiaN_PAINTS": "DULUX",
          "asian_details": [
            {
              "product_id": 1,
              "description": "DULUX Premium is designed for superior finishes and durability.",
              "price": 160.50,
              "available_sizes": ["1L", "4L", "10L", "20L"]
            }
          ],
          "bergeR_PAINTS": "SUPERIOR",
          "bergeR_details": [
            {
              "product_id": 2,
              "description": "SUPERIOR offers a long-lasting finish with a rich gloss.",
              "price": 161.99,
              "available_sizes": ["1L", "10L"]
            }
          ],
          "jN_PAINTS": "LUXE",
          "jN_details": [
            {
              "product_id": 3,
              "description": "LUXE provides a smooth and velvety finish ideal for interiors.",
              "price": 155.00,
              "available_sizes": ["1L", "5L"]
            }
          ]
        },
        {
          "asiaN_PAINTS": "VELVET TOUCH",
          "asian_details": [
            {
              "product_id": 4,
              "description": "VELVET TOUCH provides a luxurious finish with soft undertones.",
              "price": 165.00,
              "available_sizes": ["1L", "4L", "10L"]
            }
          ],
          "bergeR_PAINTS": "SHINE COAT",
          "bergeR_details": [
            {
              "product_id": 5,
              "description": "SHINE COAT delivers a glossy finish for premium interiors.",
              "price": 169.50,
              "available_sizes": ["1L", "5L"]
            }
          ],
          "jN_PAINTS": "SOFT GLOW",
          "jN_details": [
            {
              "product_id": 6,
              "description": "SOFT GLOW creates a gentle and reflective surface for elegant rooms.",
              "price": 158.75,
              "available_sizes": ["1L", "5L"]
            }
          ]
        },
        {
          "asiaN_PAINTS": "LUXURY EMULSION",
          "asian_details": [
            {
              "product_id": 7,
              "description": "LUXURY EMULSION offers superior coverage and rich colors.",
              "price": 170.50,
              "available_sizes": ["1L", "4L", "10L"]
            }
          ],
          "bergeR_PAINTS": "PREMIER SATIN",
          "bergeR_details": [
            {
              "product_id": 8,
              "description": "PREMIER SATIN offers a velvety sheen perfect for modern interiors.",
              "price": 172.99,
              "available_sizes": ["1L", "10L"]
            }
          ],
          "jN_PAINTS": "DIAMOND FINISH",
          "jN_details": [
            {
              "product_id": 9,
              "description": "DIAMOND FINISH provides a tough and durable surface that lasts.",
              "price": 165.00,
              "available_sizes": ["1L", "5L"]
            }
          ]
        }
      ]
    },
    {
      "category": "PRIMER",
      "suB_CATEGORY": "BASIC",
      "products": [
        {
          "asiaN_PAINTS": "PRIMER COAT",
          "asian_details": [
            {
              "product_id": 1,
              "description": "PRIMER COAT is the first step for any painting project, ensuring a solid base.",
              "price": 120.99,
              "available_sizes": ["1L", "4L", "20L"]
            }
          ],
          "bergeR_PAINTS": "PREPARE PRIME",
          "bergeR_details": [
            {
              "product_id": 2,
              "description": "PREPARE PRIME ensures a smooth surface for top coats.",
              "price": 125.75,
              "available_sizes": ["1L", "5L"]
            }
          ],
          "jN_PAINTS": "FOUNDATION PRIMER",
          "jN_details": [
            {
              "product_id": 3,
              "description": "FOUNDATION PRIMER strengthens the adherence of top layers.",
              "price": 124.30,
              "available_sizes": ["2L", "5L"]
            }
          ]
        },
        {
          "asiaN_PAINTS": "BASE PREP",
          "asian_details": [
            {
              "product_id": 4,
              "description": "BASE PREP ensures the ideal foundation for smooth finishes.",
              "price": 130.50,
              "available_sizes": ["1L", "4L", "10L"]
            }
          ],
          "bergeR_PAINTS": "UNDERCOAT",
          "bergeR_details": [
            {
              "product_id": 5,
              "description": "UNDERCOAT provides excellent coverage and base protection.",
              "price": 135.00,
              "available_sizes": ["1L", "5L"]
            }
          ],
          "jN_PAINTS": "PREMIUM BASE",
          "jN_details": [
            {
              "product_id": 6,
              "description": "PREMIUM BASE offers a superior base layer for any emulsion paint.",
              "price": 134.99,
              "available_sizes": ["1L", "4L"]
            }
          ]
        }
      ]
    }
  ];
  dummyCategories = [
    {
      "Division": "30",
      "Name": "Wood coatings"
    },
    {
      "Division": "35",
      "Name": "Wall paints"
    },
    {
      "Division": "50",
      "Name": "Spray"
    },
    {
      "Division": "10",
      "Name": "Ancillaries"
    },
    {
      "Division": "61",
      "Name": "Floor"
    },
  ]
}
