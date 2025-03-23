import { Component } from '@angular/core';
import { ScrollService } from '../../../../services/scroll.service';

@Component({
  selector: 'app-help-de',
  imports: [],
  templateUrl: './help-de.component.html',
  styleUrl: './help-de.component.scss'
})
export class HelpDeComponent {
  constructor(public scroll: ScrollService) { }
}
