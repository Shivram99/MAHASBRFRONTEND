import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestFormListComponent } from './request-form-list.component';

describe('RequestFormListComponent', () => {
  let component: RequestFormListComponent;
  let fixture: ComponentFixture<RequestFormListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RequestFormListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestFormListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
