import { NgFor } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [NgFor],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss'
})
export class SideNavComponent {
  @Input() industry: any[] = [];
  @Input() sector: any[] = [];

}
