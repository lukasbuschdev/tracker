import { Injectable } from '@angular/core';
import { typeBudget, typeCategory, typeExpense } from '../types/types';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  budgets = [
    {
      id: '0',
      name: "Income",
      amount: 3270.00,
      used: 760.00,
      userId: 'jerf8743',
      recreate: false
    },
    {
      id: '1',
      name: "Savings",
      amount: 13270.00,
      used: 1760.00,
      userId: 'jerf8743',
      recreate: false
    }
  ];

  expenses: typeExpense[] = [
    {
      id: '0',
      name: 'Bus ticket',
      category: 'Transportation',
      amount: 5.20,
      created: 1740425857730,
      recreate: false
    },
    {
      id: '1',
      name: 'Lunch',
      category: 'Food',
      amount: 12.70,
      created: 1740425857730,
      recreate: false
    },
    {
      id: '2',
      name: 'Rent',
      category: 'Rent',
      amount: 720,
      created: 1740425857730,
      recreate: false
    },
    {
      id: '3',
      name: 'Snack',
      category: 'Food',
      amount: 3.20,
      created: 1740425857730,
      recreate: false
    },
    {
      id: '4',
      name: 'Train ticket',
      category: 'Transportation',
      amount: 6.80,
      created: 1740425857730,
      recreate: false
    }
  ];

  categories: typeCategory[] = [
    {
      id: '0',
      name: "Transportation",
      amount: 270.00,
      used: 71.40,
      recreate: false
    },
    {
      id: '1',
      name: "Food",
      amount: 320.00,
      used: 172.50,
      recreate: false
    },
    {
      id: '2',
      name: "Rent",
      amount: 720.00,
      used: 720.00,
      recreate: false
    }
  ];

  selectableBudgets: string[] = ['Income', 'Savings', 'Whatever'];
  selectedBudget: string = 'Income';
  currentAvailable: number = 2550;


}
