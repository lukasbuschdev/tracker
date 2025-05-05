import { Component } from '@angular/core';
import { ScrollService } from '../../../../services/scroll.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-help-de',
  imports: [RouterModule],
  templateUrl: './help-de.component.html',
  styleUrl: './help-de.component.scss'
})
export class HelpDeComponent {
  constructor(public scroll: ScrollService) { }
}
