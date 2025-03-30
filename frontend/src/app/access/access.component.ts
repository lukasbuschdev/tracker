import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslatePipe } from '../pipe/translate.pipe';
import { LanguageService } from '../services/language.service';
import { ThemeService } from '../services/theme.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-access',
  imports: [RouterModule, TranslatePipe, CommonModule],
  templateUrl: './access.component.html',
  styleUrl: './access.component.scss'
})
export class AccessComponent {
  constructor(public router: Router, public language: LanguageService, public theme: ThemeService) { }

  ngOnInit(): void {
    this.theme.loadTheme();
  }
}
