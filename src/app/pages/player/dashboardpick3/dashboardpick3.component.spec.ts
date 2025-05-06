import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dashboardpick3Component } from './dashboardpick3.component';

describe('Dashboardpick3Component', () => {
  let component: Dashboardpick3Component;
  let fixture: ComponentFixture<Dashboardpick3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Dashboardpick3Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Dashboardpick3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
