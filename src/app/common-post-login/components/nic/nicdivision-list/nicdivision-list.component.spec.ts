import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NICDivisionListComponent } from './nicdivision-list.component';

describe('NICDivisionListComponent', () => {
  let component: NICDivisionListComponent;
  let fixture: ComponentFixture<NICDivisionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NICDivisionListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NICDivisionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
