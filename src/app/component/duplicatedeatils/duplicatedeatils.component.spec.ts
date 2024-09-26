import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DuplicatedeatilsComponent } from './duplicatedeatils.component';

describe('DuplicatedeatilsComponent', () => {
  let component: DuplicatedeatilsComponent;
  let fixture: ComponentFixture<DuplicatedeatilsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DuplicatedeatilsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DuplicatedeatilsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
