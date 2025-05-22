import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerBetPick2HistoryComponent } from './player-bet-pick2-history.component';

describe('PlayerBetPick2HistoryComponent', () => {
  let component: PlayerBetPick2HistoryComponent;
  let fixture: ComponentFixture<PlayerBetPick2HistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlayerBetPick2HistoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlayerBetPick2HistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
