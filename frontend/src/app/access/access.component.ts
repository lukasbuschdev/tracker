import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslatePipe } from '../pipe/translate.pipe';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-access',
  imports: [RouterModule, TranslatePipe],
  templateUrl: './access.component.html',
  styleUrl: './access.component.scss'
})
export class AccessComponent {
  constructor(public router: Router, public language: LanguageService) { }
}
