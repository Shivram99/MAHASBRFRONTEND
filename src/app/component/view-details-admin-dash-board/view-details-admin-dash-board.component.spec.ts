import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDetailsAdminDashBoardComponent } from './view-details-admin-dash-board.component';

describe('ViewDetailsAdminDashBoardComponent', () => {
  let component: ViewDetailsAdminDashBoardComponent;
  let fixture: ComponentFixture<ViewDetailsAdminDashBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewDetailsAdminDashBoardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewDetailsAdminDashBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
