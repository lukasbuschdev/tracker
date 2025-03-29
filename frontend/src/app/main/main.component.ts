import { Component, inject } from '@angular/core';
import { HeaderComponent } from "./header/header.component";
import { NavComponent } from "./nav/nav.component";
import { ContentComponent } from "./content/content.component";
import { DialogComponent } from "./dialog/dialog.component";
import { ConfirmationDialogComponent } from "./confirmation-dialog/confirmation-dialog.component";
import { CommonModule } from '@angular/common';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-main',
  imports: [HeaderComponent, NavComponent, ContentComponent, DialogComponent, ConfirmationDialogComponent, CommonModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  theme = inject(ThemeService);
}
