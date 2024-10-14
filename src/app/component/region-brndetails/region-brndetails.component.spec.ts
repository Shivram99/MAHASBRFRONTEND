import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionBRNDetailsComponent } from './region-brndetails.component';

describe('RegionBRNDetailsComponent', () => {
  let component: RegionBRNDetailsComponent;
  let fixture: ComponentFixture<RegionBRNDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegionBRNDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegionBRNDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
