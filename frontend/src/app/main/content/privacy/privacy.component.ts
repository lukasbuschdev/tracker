import { Component } from '@angular/core';
import { TranslatePipe } from '../../../pipe/translate.pipe';
import { LanguageService } from '../../../services/language.service';
import { PrivacyEnComponent } from "./privacy-en/privacy-en.component";
import { PrivacyEsComponent } from "./privacy-es/privacy-es.component";
import { PrivacyDeComponent } from "./privacy-de/privacy-de.component";
import { PrivacyFrComponent } from "./privacy-fr/privacy-fr.component";

@Component({
  selector: 'app-privacy',
  imports: [TranslatePipe, PrivacyEnComponent, PrivacyEsComponent, PrivacyDeComponent, PrivacyFrComponent],
  templateUrl: './privacy.component.html',
  styleUrl: './privacy.component.scss'
})
export class PrivacyComponent {
  constructor(public language: LanguageService) { }
}
