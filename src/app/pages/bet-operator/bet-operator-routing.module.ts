import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
    IsBetOperator1GuardService,
    IsBetOperator2GuardService,
} from 'src/app/services/auth-guard.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MasterRevertComponent } from './master-revert/master-revert.component';
import { ArenaListComponent } from './arena-list/arena-list.component';



import { Pick3Component } from './pick3/pick3.component';
import { Pick3ConsoleComponent } from './pick3-console/pick3-console.component';

import { List2dComponent } from './list2d/list2d.component';
import { List3dComponent } from './list3d/list3d.component';
import { Dashboard2dComponent } from './dashboard2d/dashboard2d.component';
import { Dashboard3dComponent } from './dashboard3d/dashboard3d.component';


import { ListMessagesComponent } from './list-messages/list-messages.component';

import { List3dMasterrevertComponent } from './list3d-masterrevert/list3d-masterrevert.component';
import { List2dMasterrevertComponent } from './list2d-masterrevert/list2d-masterrevert.component';
import { Listpick3MasterrevertComponent } from './listpick3-masterrevert/listpick3-masterrevert.component';





const routes: Routes = [
    {
        path: 'master-revert-pick3',
        component: Listpick3MasterrevertComponent,
        canActivate: [IsBetOperator1GuardService],
    },

    {
        path: 'master-revert-2d',
        component: List2dMasterrevertComponent,
        canActivate: [IsBetOperator1GuardService],
    },

    {
        path: 'master-revert-3d',
        component: List3dMasterrevertComponent,
        canActivate: [IsBetOperator1GuardService],
    },

    {
        path: 'list-messages',
        component: ListMessagesComponent,
        canActivate: [IsBetOperator1GuardService],
    },
    {
        path: 'dashboard-3d/:eventId',
        component: Dashboard3dComponent,
        canActivate: [IsBetOperator1GuardService],
    },
    {
        path: 'dashboard-2d/:eventId',
        component: Dashboard2dComponent,
        canActivate: [IsBetOperator1GuardService],
    },
    {
        path: 'list-3d',
        component: List3dComponent,
        canActivate: [IsBetOperator1GuardService],
    },

    {
        path: 'list-2d',
        component: List2dComponent,
        canActivate: [IsBetOperator1GuardService],
    },
    {
        path: 'master-revert',
        component: MasterRevertComponent,
        canActivate: [IsBetOperator1GuardService],
    },


    {
        path: 'arena',
        component: ArenaListComponent,
    },
    {
        path: 'arena/:id',
        component: DashboardComponent,
    },






    {
        path: 'pick3',
        component: Pick3Component
        ,
    },
    {
        path: 'pick3/console/:eventId',
        component: Pick3ConsoleComponent
        ,
    },




];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class BetOperatorRoutingModule { }
