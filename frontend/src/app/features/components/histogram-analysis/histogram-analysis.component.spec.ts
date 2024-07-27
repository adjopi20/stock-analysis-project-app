import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistogramAnalysisComponent } from './histogram-analysis.component';

describe('HistogramAnalysisComponent', () => {
  let component: HistogramAnalysisComponent;
  let fixture: ComponentFixture<HistogramAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistogramAnalysisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HistogramAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
