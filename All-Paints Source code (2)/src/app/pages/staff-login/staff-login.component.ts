import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from '../../parts/header/header.component';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../shared/api.service';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotifierService, NotifierModule } from 'angular-notifier';
import { Cookie } from 'ng2-cookies';
import { ToastrService } from 'ngx-toastr';
import { LogicsService } from '../../shared/logics.service';
@Component({
  selector: 'app-staff-login',
  standalone: true,
  imports: [HeaderComponent, RouterModule, ReactiveFormsModule, NotifierModule],
  providers: [NotifierService],
  templateUrl: './staff-login.component.html',
  styleUrl: './staff-login.component.scss'
})
export class StaffLoginComponent implements OnInit {
  ngOnInit(): void {
    //  this.api.getAllProducts().subscribe((res:any)=>{
    //   console.log(res);

    //  })
  }
  api = inject(ApiService)
  fb = inject(FormBuilder)
  toaster = inject(ToastrService)
  logic = inject(LogicsService)
  router = inject(Router)
  showPas: boolean = false
  token!: string
  profileData: any = []
  staffForm = this.fb.group({
    UserName: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  })

  profileForm = this.fb.group({
    "FilterValue2": "400001",
    "FilterValue3": "LoginCompany",
    "FilterValue4": "",
    "FilterValue5": "",
    "FilterValue6": "",
    "FilterValue7": ""
  })

  submit() {
    if (this.staffForm.valid) {
      this.api.loginStaff(this.staffForm.value).subscribe((res: any) => {
        this.token = res
        Cookie.set("apToken", this.token)
        this.getCustomerDetails()
        this.router.navigateByUrl('/home#image')
      }, (err) => {
        if (err.status) {
          this.logic.error('', 'Invalid User')
          // this.toaster.error('',"Invalid user")
        }

        // console.log(err.error.message);
      })
    } else {
      this.logic.error('', 'Please fill the form!')
    }

  }
  getCustomerDetails() {
    let userData =
    {
      "FilterValue1": "400001",
      "FilterValue2": "",
      "FilterValue3": "LoginCompany",
      "FilterValue4": "",
      "FilterValue5": "",
      "FilterValue6": "",
      "FilterValue7": ""
    }
    this.api.profile(userData).subscribe({
      next: (responseSessionData: any) => {
        const parsedData = JSON.parse(responseSessionData);

        if (Array.isArray(parsedData) && parsedData.length > 0) {
          const companyCode = parsedData[0].CompanyCode;
          console.log(companyCode);

          localStorage.setItem("distributorcode", companyCode);
        } else {
          console.warn("Invalid data format or empty response.");
        }
      },
      error: (error) => {
        console.error("Error fetching profile data:", error);
      }
    });

  }
}


