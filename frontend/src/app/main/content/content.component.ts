import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DataService } from '../../services/data.service';
import { LoadingService } from '../../services/loading.service';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-content',
  imports: [RouterModule, CommonModule],
  templateUrl: './content.component.html',
  styleUrl: './content.component.scss'
})
export class ContentComponent implements OnInit {
  constructor(private data: DataService, public loading: LoadingService) { }

  theme = inject(ThemeService);

  ngOnInit(): void {
    if(!this.data.currentUserId) return;
    this.data.init();

    this.loading.loadingAnimation(1000);
  }
}
