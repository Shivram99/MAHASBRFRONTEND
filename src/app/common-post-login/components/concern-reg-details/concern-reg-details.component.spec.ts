import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConcernRegDetailsComponent } from './concern-reg-details.component';

describe('ConcernRegDetailsComponent', () => {
  let component: ConcernRegDetailsComponent;
  let fixture: ComponentFixture<ConcernRegDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConcernRegDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConcernRegDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
