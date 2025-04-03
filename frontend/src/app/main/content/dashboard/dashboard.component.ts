import { Component, inject, OnInit } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartService } from '../../../services/chart.service';
import { DataService } from '../../../services/data.service';
import { UtilsService } from '../../../services/utils.service';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { TranslatePipe } from '../../../pipe/translate.pipe';
import { ThemeService } from '../../../services/theme.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [BaseChartDirective, TranslatePipe, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  isDropdownOpened: boolean = false;
  isActiveCategory: boolean = false;
  activeCategoryId: string = '';
  availableInSelectedBudget: number = 0;

  constructor(public chart: ChartService, public data: DataService, public utils: UtilsService) { }

  theme = inject(ThemeService);

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
}
