import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
    IsBetOperator1GuardService,
    IsBetOperator2GuardService,
} from 'src/app/services/auth-guard.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MasterRevertComponent } from './master-revert/master-revert.component';
import { ArenaListComponent } from './arena-list/arena-list.component';

import { Ez2revertlistComponent } from './ez2revertlist/ez2revertlist.component';
import { Ez2revertconsoleComponent } from './ez2revertconsole/ez2revertconsole.component';
import { SuertresrevertlistComponent } from './suertresrevertlist/suertresrevertlist.component';
import { SuertresrevertconsoleComponent } from './suertresrevertconsole/suertresrevertconsole.component';

import { Pick3Component } from './pick3/pick3.component';
import { Pick3ConsoleComponent } from './pick3-console/pick3-console.component';
import { Pick3revertlistComponent } from './pick3revertlist/pick3revertlist.component';
import { Pick3revertconsoleComponent } from './pick3revertconsole/pick3revertconsole.component';


import { List2dComponent } from './list2d/list2d.component';
import { List3dComponent } from './list3d/list3d.component';
import { Dashboard2dComponent } from './dashboard2d/dashboard2d.component';
import { Dashboard3dComponent } from './dashboard3d/dashboard3d.component';





const routes: Routes = [
    {
        path: 'dashboard-3d',
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
        path: 'pick3/console',
        component: Pick3ConsoleComponent
        ,
    },


    {
        path: 'pick3-masterrevert-list',
        component: Pick3revertlistComponent
        ,
    },


    {
        path: 'pick3-revert/console/:id',
        component: Pick3revertconsoleComponent

    },



    {
        path: 'ez2revert-list',
        component: Ez2revertlistComponent
        ,
    },

    {
        path: 'ez2revert/console/:id',
        component: Ez2revertconsoleComponent

    },
    {
        path: '3d-lotto-revert-list',
        component: SuertresrevertlistComponent

    },
    {
        path: '3dlottorevert/console/:id',
        component: SuertresrevertconsoleComponent

    },



];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class BetOperatorRoutingModule { }
