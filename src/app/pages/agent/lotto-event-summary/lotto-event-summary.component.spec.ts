import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LottoEventSummaryComponent } from './lotto-event-summary.component';

describe('LottoEventSummaryComponent', () => {
  let component: LottoEventSummaryComponent;
  let fixture: ComponentFixture<LottoEventSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LottoEventSummaryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LottoEventSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
