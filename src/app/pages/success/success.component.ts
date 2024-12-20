import { Component } from '@angular/core';
import { HeaderComponent } from '../../parts/header/header.component';
import { Router, RouterModule } from '@angular/router';
import { LogicsService } from '../../shared/logics.service';
import {  inject, OnInit } from '@angular/core';
@Component({
  selector: 'app-success',
  standalone: true,
  imports: [HeaderComponent,RouterModule],
  templateUrl: './success.component.html',
  styleUrl: './success.component.scss'
})
export class SuccessComponent {
  router = inject(Router);
  logic = inject(LogicsService);


  clearCartandRoute (){
    this.logic.lengthOfcart=0
    this.router.navigateByUrl('/home#image')

  }


}
