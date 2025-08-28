import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BRNregistoryDetailsComponent } from './brn-registry-details.component'; 

describe('BrnRegistryDetailsComponent', () => {
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
