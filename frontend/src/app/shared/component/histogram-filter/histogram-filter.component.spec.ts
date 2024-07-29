import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistogramFilterComponent } from './histogram-filter.component';

describe('HistogramFilterComponent', () => {
  let component: HistogramFilterComponent;
  let fixture: ComponentFixture<HistogramFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistogramFilterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HistogramFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
