import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dashboard2dComponent } from './dashboard2d.component';

describe('Dashboard2dComponent', () => {
  let component: Dashboard2dComponent;
  let fixture: ComponentFixture<Dashboard2dComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Dashboard2dComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Dashboard2dComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
