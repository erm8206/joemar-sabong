import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dashboard3dComponent } from './dashboard3d.component';

describe('Dashboard3dComponent', () => {
  let component: Dashboard3dComponent;
  let fixture: ComponentFixture<Dashboard3dComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Dashboard3dComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Dashboard3dComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
