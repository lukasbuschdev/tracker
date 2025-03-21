import { Component } from '@angular/core';
import { HeaderComponent } from "./header/header.component";
import { NavComponent } from "./nav/nav.component";
import { ContentComponent } from "./content/content.component";
import { DialogComponent } from "./dialog/dialog.component";
import { ConfirmationDialogComponent } from "./confirmation-dialog/confirmation-dialog.component";

@Component({
  selector: 'app-main',
  imports: [HeaderComponent, NavComponent, ContentComponent, DialogComponent, ConfirmationDialogComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
}
