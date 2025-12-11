import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NICCategoryListComponent } from './niccategory-list.component';

describe('NICCategoryListComponent', () => {
  let component: NICCategoryListComponent;
  let fixture: ComponentFixture<NICCategoryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NICCategoryListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NICCategoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
