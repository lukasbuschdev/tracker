import { Component } from '@angular/core';
import { HeaderComponent } from "./header/header.component";
import { NavComponent } from "./nav/nav.component";
import { ContentComponent } from "./content/content.component";

@Component({
  selector: 'app-main',
  imports: [HeaderComponent, NavComponent, ContentComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {

}
