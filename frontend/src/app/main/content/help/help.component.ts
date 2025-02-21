import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-help',
  imports: [RouterModule],
  templateUrl: './help.component.html',
  styleUrl: './help.component.scss'
})
export class HelpComponent {
  
  scrollToSection(id: string): void {
    const section = document.getElementById(id);
    if(!section) return;
    section.scrollIntoView();
  }
}
