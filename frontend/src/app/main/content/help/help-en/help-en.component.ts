import { Component } from '@angular/core';
import { ScrollService } from '../../../../services/scroll.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-help-en',
  imports: [RouterModule],
  templateUrl: './help-en.component.html',
  styleUrl: './help-en.component.scss'
})
export class HelpEnComponent {
  constructor(public scroll: ScrollService) { }
}
