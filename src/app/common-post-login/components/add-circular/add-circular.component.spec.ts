import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCircularComponent } from './add-circular.component';

describe('AddCircularComponent', () => {
  let component: AddCircularComponent;
  let fixture: ComponentFixture<AddCircularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddCircularComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCircularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
