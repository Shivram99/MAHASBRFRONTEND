import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostLoginDashboardComponent } from './post-login-dashboard.component';

describe('PostLoginDashboardComponent', () => {
  let component: PostLoginDashboardComponent;
  let fixture: ComponentFixture<PostLoginDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PostLoginDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PostLoginDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
