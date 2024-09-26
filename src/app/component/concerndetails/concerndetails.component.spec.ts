import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConcerndetailsComponent } from './concerndetails.component';

describe('ConcerndetailsComponent', () => {
  let component: ConcerndetailsComponent;
  let fixture: ComponentFixture<ConcerndetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConcerndetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConcerndetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
