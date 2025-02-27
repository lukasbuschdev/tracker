import '@fontsource/montserrat';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { MainComponent } from './main/main.component';
import { Budget } from './models/budget';
import { typeBudget } from './types/types';
import { User } from './models/user';
import { Expense } from './models/expense';
import { Category } from './models/category';

@Component({
  selector: 'app-root',
  imports: [MainComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'frontend';
  
  http = inject(HttpClient);

  budget = {
    name: 'Income',
    userId: '39478gkjshdf9',
    amount: 1000,
    used: 350,
    recreate: false,
  }

  budgetId = '835c6365-acc7-4822-88ae-9cc3aae8c373';

  user = {
    name: 'Tarik',
    email: 'pisser@mail.com',
    password: 'Dupisser123'
  }

  userData = {
    name: 'Lukas',
  }

  category = {
    name: 'Food',
    amount: 250,
    recreate: false,
    budgetId: this.budgetId
  }

  expense = {
    name: 'Leberkas Semmel',
    category: 'Food',
    amount: 5.70,
    recreate: false,
    budgetId: this.budgetId
  }

  id: string = 'c9122b3f-9c14-4693-ab50-359278e857cf'; //ID Lukas
  // id: string = '564eddf1-873b-44a6-91c0-1cc81defb1a2'; //ID Olaf



  constructor() {
    Budget.http = this.http;
    User.http = this.http;
    Expense.http = this.http;
    Category.http = this.http;
  }

  async ngOnInit(): Promise<void> {

  }
}
