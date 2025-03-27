import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DataService } from '../../services/data.service';
import { TranslatePipe } from '../../pipe/translate.pipe';
import { ScrollService } from '../../services/scroll.service';

@Component({
  selector: 'app-nav',
  imports: [RouterModule, TranslatePipe],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent {
  activeNav: string = 'dashboard';

  constructor(private data: DataService, private scroll: ScrollService) {}

  async setActive(nav: string): Promise<void> {
    this.activeNav = nav;
    this.data.selectBudget(this.data.selectedBudget!)

    this.scroll.scrollToTop();

    if(this.activeNav === 'expenses') return await this.data.getExpenses();
    if(this.activeNav === 'categories') return await this.data.getCategories();
  }
}
