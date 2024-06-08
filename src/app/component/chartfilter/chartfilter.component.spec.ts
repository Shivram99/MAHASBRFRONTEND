import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartfilterComponent } from './chartfilter.component';

describe('ChartfilterComponent', () => {
  let component: ChartfilterComponent;
  let fixture: ComponentFixture<ChartfilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChartfilterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChartfilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
