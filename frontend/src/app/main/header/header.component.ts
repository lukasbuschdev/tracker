import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DataService } from '../../services/data.service';
import { ThemeService } from '../../services/theme.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(private data: DataService) { }

  router = inject(Router);
  theme = inject(ThemeService);

  logOut(): void {
    this.router.navigateByUrl('/login');
    this.data.logout();
  }
}
