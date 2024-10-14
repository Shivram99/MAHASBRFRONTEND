import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesDistrictBrnDetailsComponent } from './des-district-brn-details.component';

describe('DesDistrictBrnDetailsComponent', () => {
  let component: DesDistrictBrnDetailsComponent;
  let fixture: ComponentFixture<DesDistrictBrnDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DesDistrictBrnDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DesDistrictBrnDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
