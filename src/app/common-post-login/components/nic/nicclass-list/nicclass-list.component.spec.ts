import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NICClassListComponent } from './nicclass-list.component';

describe('NICClassListComponent', () => {
  let component: NICClassListComponent;
  let fixture: ComponentFixture<NICClassListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NICClassListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NICClassListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
