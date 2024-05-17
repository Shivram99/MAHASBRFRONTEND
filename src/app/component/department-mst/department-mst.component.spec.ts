import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentMstComponent } from './department-mst.component';

describe('DepartmentMstComponent', () => {
  let component: DepartmentMstComponent;
  let fixture: ComponentFixture<DepartmentMstComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DepartmentMstComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DepartmentMstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
