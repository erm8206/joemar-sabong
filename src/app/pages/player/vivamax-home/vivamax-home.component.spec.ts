import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VivamaxHomeComponent } from './vivamax-home.component';

describe('VivamaxHomeComponent', () => {
  let component: VivamaxHomeComponent;
  let fixture: ComponentFixture<VivamaxHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VivamaxHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VivamaxHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
