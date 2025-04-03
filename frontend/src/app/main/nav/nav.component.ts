import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DataService } from '../../services/data.service';
import { TranslatePipe } from '../../pipe/translate.pipe';
import { ScrollService } from '../../services/scroll.service';
import { ThemeService } from '../../services/theme.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav',
  imports: [RouterModule, TranslatePipe, CommonModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent {
  activeNav: string = 'dashboard';

  constructor(private data: DataService, private scroll: ScrollService) {}

  theme = inject(ThemeService);

  async setActive(nav: string): Promise<void> {
    this.activeNav = nav;
    this.data.selectBudget(this.data.selectedBudget!)

    this.scroll.scrollToTop();

    if(this.activeNav === 'expenses') return this.data.getExpenses();
    if(this.activeNav === 'categories') return this.data.getCategories();
  }
}
