import '@fontsource/montserrat';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { MainComponent } from './main/main.component';
import { Budget } from './models/budget';
import { typeBudget } from './types/types';

@Component({
  selector: 'app-root',
  imports: [MainComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'frontend';
  
  http = inject(HttpClient);
  data = {
    username: "Peter",
    email: "peter@mail.com"
  }

  budget = {
    name: 'Income',
    userId: '39478gkjshdf9',
    amount: 1000,
    used: 350,
    recreate: false,
  }

  id: string = '39478gkjshdf9';

  constructor() {
    Budget.http = this.http;
  }

  async ngOnInit(): Promise<void> {
    this.http.get('/api').subscribe((res) => {
      console.log(res)
    })

    this.http.post('/api', this.data).subscribe((res) => {
      console.log(res)
    })

    // console.log(await Budget.create(this.budget))
    console.log(await Budget.get(this.id))
  }
}
