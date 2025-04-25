import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawSummaryComponent } from './draw-summary.component';

describe('DrawSummaryComponent', () => {
  let component: DrawSummaryComponent;
  let fixture: ComponentFixture<DrawSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DrawSummaryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DrawSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
