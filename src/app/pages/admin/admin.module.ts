import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ApprovalsComponent } from './approvals/approvals.component';
import { DownlinesComponent } from './downlines/downlines.component';
import { WalletstationComponent } from './walletstation/walletstation.component';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { WalletLogComponent } from './wallet-log/wallet-log.component';
import { UsersComponent } from './users/users.component';
import { BetsComponent } from './bets/bets.component';
import { AccountingComponent } from './accounting/accounting.component';
import { ViewHistoryComponent } from './view-history/view-history.component';
import { QueryComsComponent } from './query-coms/query-coms.component';
import { RouterModule } from '@angular/router';
import { SummaryDetailsComponent } from './summary-details/summary-details.component';
import { ListEventsComponent } from './list-events/list-events.component';
import { FightDetailsComponent } from './fight-details/fight-details.component';
import { DrawSummaryComponent } from './draw-summary/draw-summary.component';
import { CashinComponent } from './cashin/cashin.component';
import { CashoutComponent } from './cashout/cashout.component';

@NgModule({
  declarations: [
    AdminComponent,
    DashboardComponent,
    ApprovalsComponent,
    DownlinesComponent,
    WalletstationComponent,
    WalletLogComponent,
    UsersComponent,
    BetsComponent,
    AccountingComponent,
    ViewHistoryComponent,
    QueryComsComponent,
    SummaryDetailsComponent,
    ListEventsComponent,
    FightDetailsComponent,
    DrawSummaryComponent,
    CashinComponent,
    CashoutComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    AdminRoutingModule,
    RouterModule
  ],
  providers: [DatePipe],
})
export class AdminModule { }
