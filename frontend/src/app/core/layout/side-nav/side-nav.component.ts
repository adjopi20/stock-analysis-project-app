import { NgFor } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [NgFor, FormsModule],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss'
})
export class SideNavComponent {
  @Input() industry: any[] = [];
  @Input() sector: any[] = [];
  @Output() industryEvent = new EventEmitter<string>();
  @Output() sectorEvent = new EventEmitter<string>();
  @Output() minMarketCapEvent = new EventEmitter<number | undefined>();
  @Output() maxMarketCapEvent = new EventEmitter<number | undefined>();
  @Output() minPriceEvent = new EventEmitter<number | undefined>();
  @Output() maxPriceEvent = new EventEmitter<number | undefined>();
  @Output() minDividendRateEvent = new EventEmitter<number | undefined>();
  @Output() maxDividendRateEvent = new EventEmitter<number | undefined>();
  @Output() sortByEvent = new EventEmitter<string | undefined>();
  @Output() orderEvent = new EventEmitter<string | undefined>();

  currentIndustry? : string;
  currentSector? : string;
  @Input() currentMinMarketCap? : number | undefined;
  @Input() currentMaxMarketCap? : number | undefined;
  @Input() currentMinPrice? : number | undefined;
  @Input() currentMaxPrice? : number | undefined;
  @Input() currentMinDividendRate? : number | undefined;
  @Input() currentMaxDividendRate? : number | undefined;
  @Input() sortBy? : string | undefined;
  @Input() order? : string | undefined;


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

  setNumberFilter(
    minMC:number|undefined, maxMC:number|undefined,
    minP:number|undefined, maxP:number|undefined,
    minDR:number|undefined, maxDR:number|undefined
  ){
    this.currentMinMarketCap=minMC;
    this.currentMaxMarketCap=maxMC;
    this.minMarketCapEvent.emit(minMC);
    this.maxMarketCapEvent.emit(maxMC);

    this.currentMinPrice=minP;
    this.currentMaxPrice=maxP;
    this.minPriceEvent.emit(minP);
    this.maxPriceEvent.emit(maxP);

    this.currentMinDividendRate=minDR;
    this.currentMaxDividendRate=maxDR;
    this.minDividendRateEvent.emit(minDR);
    this.maxDividendRateEvent.emit(maxDR);

  }

  changeSortBy(event?: Event){
    const value = (event?.target as HTMLSelectElement).value;
    const [sortBy,order] = value.split(',');
    this.sortBy=sortBy;
    this.sortByEvent.emit(sortBy);
    this.order=order;
    this.orderEvent.emit(order)
  }

  


}
