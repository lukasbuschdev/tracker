import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-header',
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(private data: DataService) { }

  router = inject(Router);

  logOut(): void {
    this.router.navigateByUrl('/login');
    this.data.logout();
  }
}
