import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-nav',
  imports: [RouterModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent {
  activeNav: string = 'dashboard';

  constructor(private data: DataService) {}

  async setActive(nav: string): Promise<void> {
    this.activeNav = nav;
    this.data.selectBudget(this.data.selectedBudget!)

    if(this.activeNav === 'expenses') return await this.data.getExpenses();
    if(this.activeNav === 'categories') return await this.data.getCategories();
    
  }
}
