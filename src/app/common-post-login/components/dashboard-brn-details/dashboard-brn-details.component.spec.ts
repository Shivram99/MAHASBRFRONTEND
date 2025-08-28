import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardBrnDetailsComponent } from './dashboard-brn-details.component';

describe('DashboardBrnDetailsComponent', () => {
  let component: DashboardBrnDetailsComponent;
  let fixture: ComponentFixture<DashboardBrnDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardBrnDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardBrnDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
