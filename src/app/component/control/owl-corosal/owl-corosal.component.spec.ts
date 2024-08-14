import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwlCorosalComponent } from './owl-corosal.component';

describe('OwlCorosalComponent', () => {
  let component: OwlCorosalComponent;
  let fixture: ComponentFixture<OwlCorosalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OwlCorosalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwlCorosalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
