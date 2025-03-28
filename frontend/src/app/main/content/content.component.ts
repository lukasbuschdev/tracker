import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DataService } from '../../services/data.service';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-content',
  imports: [RouterModule],
  templateUrl: './content.component.html',
  styleUrl: './content.component.scss'
})
export class ContentComponent implements OnInit {
  constructor(private data: DataService, public loading: LoadingService) { }

  ngOnInit(): void {
    if(!this.data.currentUserId) return;
    this.data.init();  

    this.loading.loadingAnimation(1000);
  }
}
