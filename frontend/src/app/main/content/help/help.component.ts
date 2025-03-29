import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '../../../pipe/translate.pipe';
import { HelpDeComponent } from "./help-de/help-de.component";
import { HelpEnComponent } from "./help-en/help-en.component";
import { HelpEsComponent } from "./help-es/help-es.component";
import { HelpFrComponent } from "./help-fr/help-fr.component";
import { LanguageService } from '../../../services/language.service';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-help',
  imports: [RouterModule, TranslatePipe, HelpDeComponent, HelpEnComponent, HelpEsComponent, HelpFrComponent, CommonModule],
  templateUrl: './help.component.html',
  styleUrl: './help.component.scss'
})
export class HelpComponent {
  constructor(public language: LanguageService) { }

  theme = inject(ThemeService);
}
