import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountingComponent } from './accounting/accounting.component';
import { ApprovalsComponent } from './approvals/approvals.component';
import { BetsComponent } from './bets/bets.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DownlinesComponent } from './downlines/downlines.component';
import { UsersComponent } from './users/users.component';
import { ViewHistoryComponent } from './view-history/view-history.component';
import { WalletLogComponent } from './wallet-log/wallet-log.component';
import { WalletstationComponent } from './walletstation/walletstation.component';
import { QueryComsComponent } from './query-coms/query-coms.component';
import { SummaryDetailsComponent } from './summary-details/summary-details.component';
import { ListEventsComponent } from './list-events/list-events.component';
import { FightDetailsComponent } from './fight-details/fight-details.component';
import { DrawSummaryComponent } from './draw-summary/draw-summary.component';
import { CashinComponent } from './cashin/cashin.component';
import { CashoutComponent } from './cashout/cashout.component';
import { SettingsComponent } from './settings/settings.component';
import { LottoEventsComponent } from './lotto-events/lotto-events.component';
import { LottoEventsDetailsComponent } from './lotto-events-details/lotto-events-details.component';
const routes: Routes = [
    {
        path: 'lotto-events',
        component: LottoEventsComponent,
    },
    {
        path: 'lotto-events-details/:eventID',
        component: LottoEventsDetailsComponent,
    },
    {
        path: 'settings',
        component: SettingsComponent,
    },
    {
        path: 'cashin',
        component: CashinComponent,
    },
    {
        path: 'cashout',
        component: CashoutComponent,
    },
    {
        path: 'draw-summary',
        component: DrawSummaryComponent,
    },
    {
        path: 'fight-details/:fightNumberId',
        component: FightDetailsComponent,
    },
    {
        path: 'list-events',
        component: ListEventsComponent,
    },
    {
        path: 'summary-details',
        component: SummaryDetailsComponent,
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
        path: 'downlines',
        component: DownlinesComponent,
    },
    {
        path: 'walletstation',
        component: WalletstationComponent,
    },

    {
        path: 'wallet-log',
        component: WalletLogComponent,
    },
    {
        path: 'users',
        component: UsersComponent,
    },
    {
        path: 'bets',
        component: BetsComponent,
    },
    {
        path: 'accounting',
        component: AccountingComponent,
    },
    {
        path: 'query-coms',
        component: QueryComsComponent,
    },
    {
        path: 'event-details/:eventId',
        component: ViewHistoryComponent,
    },


];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AdminRoutingModule { }
