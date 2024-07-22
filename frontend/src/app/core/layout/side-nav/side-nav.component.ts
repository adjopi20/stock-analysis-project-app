import { NgFor } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

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
  @Output() industryEvent = new EventEmitter<string>();
  @Output() sectorEvent = new EventEmitter<string>();
  currentIndustry? : string;
  currentSector? : string;

  changeIndustry(event: Event){
    const value = (event?.target as HTMLSelectElement).value;
    const industry = value.toString()
    if (industry=== this.currentIndustry){
      this.currentIndustry='';
      this.industryEvent.emit('');
    }else{
      this.currentIndustry=industry;
      this.industryEvent.emit(industry);
    }
  }

  changeSector(event: Event){ //ini event ke html nya ke dom, eventemitter itu event ke parent
    const value = (event?.target as HTMLSelectElement).value;
    const sector = value.toString();
    if(sector===this.currentSector){
      this.currentSector='';
      this.sectorEvent.emit('');
      this.currentIndustry='';
      this.industryEvent.emit('');
    }else{
      this.currentSector=sector
      this.sectorEvent.emit(sector)
      this.currentIndustry='';
      this.industryEvent.emit('');
    }
  }

}
