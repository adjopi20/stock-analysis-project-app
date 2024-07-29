import { NgIf } from '@angular/common';
import { Component, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-histogram-filter',
  standalone: true,
  imports: [NgIf],
  templateUrl: './histogram-filter.component.html',
  styleUrl: './histogram-filter.component.scss'
})
export class HistogramFilterComponent {
  @Input() data?: any[] = [];
  @Input() template?: TemplateRef<HTMLElement>

}


export class DynamicTemplate{
  value: any
}
