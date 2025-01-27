import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'tools-menu',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './tools-menu.component.html',
  styleUrl: './tools-menu.component.scss'
})
export class ToolsMenuComponent {
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
