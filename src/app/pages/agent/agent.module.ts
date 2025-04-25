import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { AgentRoutingModule } from './agent-routing.module';
import { AgentComponent } from './agent.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ApprovalsComponent } from './approvals/approvals.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { PlayersComponent } from './players/players.component';
import { DownlinesComponent } from './downlines/downlines.component';
import { WalletLogComponent } from './wallet-log/wallet-log.component';
import { WalletstationComponent } from './walletstation/walletstation.component';
import { FormsModule } from '@angular/forms';
import { CashoutHistoryComponent } from './cashout-history/cashout-history.component';
import { CommissionComponent } from './commission/commission.component';
import { CommissionLogsComponent } from './commission-logs/commission-logs.component';
import { ChangePassComponent } from './change-pass/change-pass.component';
import { ViewCtwLogsComponent } from './view-ctw-logs/view-ctw-logs.component';
import { SummaryComponent } from './summary/summary.component';
import { PlayerBetHistoryComponent } from './player-bet-history/player-bet-history.component';
import { AgentQueryComsComponent } from './agent-query-coms/agent-query-coms.component';
import { EventSummaryComponent } from './event-summary/event-summary.component';

@NgModule({
  declarations: [
    AgentComponent,
    DashboardComponent,
    ApprovalsComponent,
    PlayersComponent,
    DownlinesComponent,
    WalletLogComponent,
    WalletstationComponent,
    CashoutHistoryComponent,
    CommissionComponent,
    CommissionLogsComponent,
    ChangePassComponent,
    ViewCtwLogsComponent,
    SummaryComponent,
    PlayerBetHistoryComponent,
    AgentQueryComsComponent,

  ],
  imports: [
    CommonModule,
    AgentRoutingModule,
    NgSelectModule,
    FormsModule,
    NgSelectModule,
    EventSummaryComponent
  ],
  providers: [DatePipe],
})
export class AgentModule { }
