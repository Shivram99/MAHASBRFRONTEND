import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonPostLoginBrnRegistryDetailsComponent } from './brn-registry-details.component'; 

describe('BrnRegistryDetailsComponent', () => {
  let component: CommonPostLoginBrnRegistryDetailsComponent;
  let fixture: ComponentFixture<CommonPostLoginBrnRegistryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommonPostLoginBrnRegistryDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonPostLoginBrnRegistryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
