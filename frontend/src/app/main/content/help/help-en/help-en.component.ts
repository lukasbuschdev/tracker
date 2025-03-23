import { Component } from '@angular/core';
import { ScrollService } from '../../../../services/scroll.service';

@Component({
  selector: 'app-help-en',
  imports: [],
  templateUrl: './help-en.component.html',
  styleUrl: './help-en.component.scss'
})
export class HelpEnComponent {
  constructor(public scroll: ScrollService) { }
}
