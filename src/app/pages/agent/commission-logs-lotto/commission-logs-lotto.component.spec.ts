import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommissionLogsLottoComponent } from './commission-logs-lotto.component';

describe('CommissionLogsLottoComponent', () => {
  let component: CommissionLogsLottoComponent;
  let fixture: ComponentFixture<CommissionLogsLottoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommissionLogsLottoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CommissionLogsLottoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
