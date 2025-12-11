import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NICGroupListComponent } from './nicgroup-list.component';

describe('NICGroupListComponent', () => {
  let component: NICGroupListComponent;
  let fixture: ComponentFixture<NICGroupListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NICGroupListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NICGroupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
