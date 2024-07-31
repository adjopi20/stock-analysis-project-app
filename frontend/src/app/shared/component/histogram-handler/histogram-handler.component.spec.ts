import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistogramHandlerComponent } from './histogram-handler.component';

describe('HistogramHandlerComponent', () => {
  let component: HistogramHandlerComponent;
  let fixture: ComponentFixture<HistogramHandlerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistogramHandlerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HistogramHandlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
