import { Component, OnInit } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartService } from '../../../services/chart.service';
import { DataService } from '../../../services/data.service';
import { UtilsService } from '../../../services/utils.service';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { TranslatePipe } from '../../../pipe/translate.pipe';

@Component({
  selector: 'app-dashboard',
  imports: [BaseChartDirective, TranslatePipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  isDropdownOpened: boolean = false;
  isActiveCategory: boolean = false;
  activeCategoryId: string = '';
  availableInSelectedBudget: number = 0;

  constructor(public chart: ChartService, public data: DataService, public utils: UtilsService) { }

  ngOnInit(): void {
    Chart.register(...registerables, ChartDataLabels);
  }
  
  toggleBudgets(event: MouseEvent): void {
    event.stopPropagation();
    this.isDropdownOpened = !this.isDropdownOpened;
  }

  closeBudgtes(): void {
    this.isDropdownOpened = false;
  }

  calculateAvailableBudget(): number {
    if(!this.data.selectedBudget) return 0;
    const categoriesAmounts = this.data.categoriesArray.map(category => category.amount);

    return this.availableInSelectedBudget = this.data.selectedBudget.amount - categoriesAmounts.reduce((acc, curr) => acc + curr, 0);
  }
}
