import { Component } from '@angular/core';
import { ScrollService } from '../../../../services/scroll.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-help-fr',
  imports: [RouterModule],
  templateUrl: './help-fr.component.html',
  styleUrl: './help-fr.component.scss'
})
export class HelpFrComponent {
  constructor(public scroll: ScrollService) { }
}
