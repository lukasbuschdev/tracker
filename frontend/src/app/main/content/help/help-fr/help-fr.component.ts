import { Component } from '@angular/core';
import { ScrollService } from '../../../../services/scroll.service';

@Component({
  selector: 'app-help-fr',
  imports: [],
  templateUrl: './help-fr.component.html',
  styleUrl: './help-fr.component.scss'
})
export class HelpFrComponent {
  constructor(public scroll: ScrollService) { }
}
