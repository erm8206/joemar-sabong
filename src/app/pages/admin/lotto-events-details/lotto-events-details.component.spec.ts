import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LottoEventsDetailsComponent } from './lotto-events-details.component';

describe('LottoEventsDetailsComponent', () => {
  let component: LottoEventsDetailsComponent;
  let fixture: ComponentFixture<LottoEventsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LottoEventsDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LottoEventsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
