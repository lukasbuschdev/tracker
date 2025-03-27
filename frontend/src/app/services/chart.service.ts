import { Injectable } from '@angular/core';
import { ChartConfiguration, ChartData, ChartOptions } from 'chart.js';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  constructor(private data: DataService) { }


  // FIRST SIMPLE PIE CHART

  public firstPieChartType = 'pie' as const;

  public get firstPieChartData(): ChartData<'pie', number[], string | string[]> {
    if(!this.data.selectedBudget) {
      return {
        labels: [],
        datasets: [{
          data: []
        }]
      };
    }

    return {
      labels: ['Budget amount available', 'Budget amount used'],
      datasets: [{
        data: [
          (this.data.selectedBudget?.amount - this.data.selectedBudget?.used),  
          this.data.selectedBudget?.used, 
        ],
        backgroundColor: ['#0eb50e', '#d70f0f'],
        hoverBackgroundColor: ['#0eb50ebf', '#d70f0fbf']
      }],
    };
  }

  public firstPieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    animation: {
      duration: 0
    },
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          boxWidth: 15,
          boxHeight: 15,
          padding: 10
        }
      },
      datalabels: {
        formatter: (value, ctx) => {
          return value;
        },
        color: '#fff',
        font: {
          weight: 'bold',
          size: 14,
        },
      },
    }
  };


  // SECOND PIE CHART

  public secondPieChartType = 'pie' as const;

  public get secondPieChartData(): ChartData<'pie', number[], string | string[]> {
    const { name, amount } = this.data.getAllCategoriesData();

    return {
      labels: name,
      datasets: [{
        data: amount,
        backgroundColor: [
          '#2f071e', 
          '#4a0d26', 
          '#611232', 
          '#76203c', 
          '#843147', 
          '#923c52', 
          '#a1375d', 
          '#af4170', 
          '#bb4a82', 
          '#c95696'  
        ],
      }],
    };
  }

  public secondPieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    animation: {
      duration: 0
    },
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          boxWidth: 15,
          boxHeight: 15,
          padding: 10
        },
      },
      datalabels: {
        formatter: (value, ctx) => {
          return value;
        },
        color: '#fff',
        font: {
          weight: 'bold',
          size: 14,
        },
      },
    },
  };
}
