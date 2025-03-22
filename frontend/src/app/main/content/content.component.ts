import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-content',
  imports: [RouterModule],
  templateUrl: './content.component.html',
  styleUrl: './content.component.scss'
})
export class ContentComponent implements OnInit {

  constructor(private data: DataService) { }

  ngOnInit(): void {
    if(!this.data.currentUserId) return;
    this.data.init();  
  }
}
