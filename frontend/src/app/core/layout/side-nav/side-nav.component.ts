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

  changeIndustry(industry: string){
    if (industry=== this.currentIndustry){
      this.currentIndustry='';
      this.industryEvent.emit('');
    }else{
      this.currentIndustry=industry;
      this.industryEvent.emit(industry);
    }
  }

  changeSector(sector:string){
    if(sector===this.currentSector){
      this.currentSector='';
      this.sectorEvent.emit('');
    }else{
      this.currentSector=sector
      this.sectorEvent.emit(sector)
    }
  }

}
