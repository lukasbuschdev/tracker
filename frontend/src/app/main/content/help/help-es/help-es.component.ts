import { Component } from '@angular/core';
import { ScrollService } from '../../../../services/scroll.service';

@Component({
  selector: 'app-help-es',
  imports: [],
  templateUrl: './help-es.component.html',
  styleUrl: './help-es.component.scss'
})
export class HelpEsComponent {
  constructor(public scroll: ScrollService) { }
}
