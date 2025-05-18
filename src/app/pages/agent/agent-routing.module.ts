import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChangePassComponent } from './change-pass/change-pass.component';
import { ApprovalsComponent } from './approvals/approvals.component';
import { CashoutHistoryComponent } from './cashout-history/cashout-history.component';
import { CommissionLogsComponent } from './commission-logs/commission-logs.component';
import { CommissionComponent } from './commission/commission.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DownlinesComponent } from './downlines/downlines.component';
import { PlayerBetHistoryComponent } from './player-bet-history/player-bet-history.component';
import { PlayersComponent } from './players/players.component';
import { SummaryComponent } from './summary/summary.component';
import { ViewCtwLogsComponent } from './view-ctw-logs/view-ctw-logs.component';
import { WalletLogComponent } from './wallet-log/wallet-log.component';
import { WalletstationComponent } from './walletstation/walletstation.component';
import { AgentQueryComsComponent } from './agent-query-coms/agent-query-coms.component';
import { EventSummaryComponent } from './event-summary/event-summary.component';
import { CommissionLogsLottoComponent } from './commission-logs-lotto/commission-logs-lotto.component';
const routes: Routes = [
    {
        path: 'commission-log-lotto',
        component: CommissionLogsLottoComponent,
    },
    {
        path: 'event-summary',
        component: EventSummaryComponent,
    },

    {
        path: 'dashboard',
        component: DashboardComponent,
    },

    {
        path: 'approvals',
        component: ApprovalsComponent,
    },
    {
        path: 'players',
        component: PlayersComponent,
    },
    {
        path: 'downlines',
        component: DownlinesComponent,
    },
    {
        path: 'wallet-station',
        component: WalletstationComponent,
    },
    {
        path: 'wallet-log',
        component: WalletLogComponent,
    },

    {
        path: 'cashout-history',
        component: CashoutHistoryComponent,
    },
    {
        path: 'commission',
        component: CommissionComponent,
    },
    {
        path: 'commission-log',
        component: CommissionLogsComponent,
    },
    {
        path: 'change-password',
        component: ChangePassComponent,
    },
    {
        path: 'view-ctw-logs/:agentId',
        component: ViewCtwLogsComponent,
    },
    {
        path: 'player-bet-history/:playerId',
        component: PlayerBetHistoryComponent,
    },
    {
        path: 'summary',
        component: SummaryComponent,
    },
    {
        path: 'agent-query-coms',
        component: AgentQueryComsComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AgentRoutingModule { }
