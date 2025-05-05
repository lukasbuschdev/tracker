import { Component } from '@angular/core';
import { ScrollService } from '../../../../services/scroll.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-help-es',
  imports: [RouterModule],
  templateUrl: './help-es.component.html',
  styleUrl: './help-es.component.scss'
})
export class HelpEsComponent {
  constructor(public scroll: ScrollService) { }
}
