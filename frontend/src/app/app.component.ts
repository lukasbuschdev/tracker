import '@fontsource/montserrat';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { MainComponent } from './main/main.component';

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

  ngOnInit(): void {
    this.http.get('/api').subscribe((res) => {
      console.log(res)
    })

    this.http.post('/api', this.data).subscribe((res) => {
      console.log(res)
    })
  }
}
