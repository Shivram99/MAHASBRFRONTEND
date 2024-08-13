import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CirclularComponent } from './circlular.component';

describe('CirclularComponent', () => {
  let component: CirclularComponent;
  let fixture: ComponentFixture<CirclularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CirclularComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CirclularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
