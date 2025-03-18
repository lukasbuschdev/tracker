import '@fontsource/montserrat';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Budget } from './models/budget';
import { User } from './models/user';
import { Expense } from './models/expense';
import { Category } from './models/category';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend';
  
  http = inject(HttpClient);

  constructor() {
    Budget.http = this.http;
    User.http = this.http;
    Expense.http = this.http;
    Category.http = this.http;
  }
}
