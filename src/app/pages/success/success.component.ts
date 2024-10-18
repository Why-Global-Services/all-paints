import { Component } from '@angular/core';
import { HeaderComponent } from '../../parts/header/header.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-success',
  standalone: true,
  imports: [HeaderComponent,RouterModule],
  templateUrl: './success.component.html',
  styleUrl: './success.component.scss'
})
export class SuccessComponent {

}
