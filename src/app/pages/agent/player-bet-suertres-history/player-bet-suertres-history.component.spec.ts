import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerBetSuertresHistoryComponent } from './player-bet-suertres-history.component';

describe('PlayerBetSuertresHistoryComponent', () => {
  let component: PlayerBetSuertresHistoryComponent;
  let fixture: ComponentFixture<PlayerBetSuertresHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlayerBetSuertresHistoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlayerBetSuertresHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
