import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BRNregistoryDetailsComponent } from './brnregistory-details.component';

describe('BRNregistoryDetailsComponent', () => {
  let component: BRNregistoryDetailsComponent;
  let fixture: ComponentFixture<BRNregistoryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BRNregistoryDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BRNregistoryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
