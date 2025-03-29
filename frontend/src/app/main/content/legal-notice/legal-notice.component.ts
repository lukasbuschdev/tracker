import { Component, inject } from '@angular/core';
import { TranslatePipe } from '../../../pipe/translate.pipe';
import { ThemeService } from '../../../services/theme.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-legal-notice',
  imports: [TranslatePipe, CommonModule],
  templateUrl: './legal-notice.component.html',
  styleUrl: './legal-notice.component.scss'
})
export class LegalNoticeComponent {
  theme = inject(ThemeService);
}
