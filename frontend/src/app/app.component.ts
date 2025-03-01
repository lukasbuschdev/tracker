import '@fontsource/montserrat';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { MainComponent } from './main/main.component';
import { Budget } from './models/budget';
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
    name: 'Transportation',
    userId: 'c9122b3f-9c14-4693-ab50-359278e857cf',
    amount: 250,
    used: 250,
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
    name: 'Rent',
    category: 'Rent',
    amount: 750,
    recreate: false,
    budgetId: this.budgetId
  }


  constructor() {
    Budget.http = this.http;
    User.http = this.http;
    Expense.http = this.http;
    Category.http = this.http;
  }

  async ngOnInit(): Promise<void> {
    // console.log(await Expense.create(this.expense))
  }
}
