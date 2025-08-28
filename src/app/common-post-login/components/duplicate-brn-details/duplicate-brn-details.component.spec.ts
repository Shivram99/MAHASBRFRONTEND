import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DuplicateBrnDetailsComponent } from './duplicate-brn-details.component';

describe('DuplicateBrnDetailsComponent', () => {
  let component: DuplicateBrnDetailsComponent;
  let fixture: ComponentFixture<DuplicateBrnDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DuplicateBrnDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DuplicateBrnDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
