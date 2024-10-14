import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistrictBRNDetailsComponent } from './district-brndetails.component';

describe('DistrictBRNDetailsComponent', () => {
  let component: DistrictBRNDetailsComponent;
  let fixture: ComponentFixture<DistrictBRNDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DistrictBRNDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DistrictBRNDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
