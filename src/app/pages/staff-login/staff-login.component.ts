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
  imports: [HeaderComponent,RouterModule,ReactiveFormsModule,NotifierModule],
  providers:[NotifierService],
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
  showPas :boolean = false
  token!:string 
  staffForm = this.fb.group({
    UserName:new FormControl('',Validators.required),
    password:new FormControl('',Validators.required)
  })

  submit(){
    if(this.staffForm.valid){
      this.api.loginStaff(this.staffForm.value).subscribe((res:any)=>{
        console.log(res);
        this.token = res
        Cookie.set("apToken",this.token)
        this.router.navigateByUrl('/home#image')
      },(err) => {
        console.log(err.status);
        if(err.status){
          this.logic.error('','Invalid User')
          // this.toaster.error('',"Invalid user")
        }
       
        // console.log(err.error.message);
      })
    }else{
      this.logic.error('','Please fill the form!')
    }
   
  }
}
