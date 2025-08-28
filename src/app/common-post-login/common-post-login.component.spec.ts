import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonPostLoginComponent } from './common-post-login.component';

describe('CommonPostLoginComponent', () => {
  let component: CommonPostLoginComponent;
  let fixture: ComponentFixture<CommonPostLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommonPostLoginComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonPostLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
