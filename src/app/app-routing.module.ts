import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './pages/admin/admin.component';
import { AgentComponent } from './pages/agent/agent.component';
import { AuthComponent } from './pages/auth/auth.component';
import { BetOperatorComponent } from './pages/bet-operator/bet-operator.component';
import { PlayerComponent } from './pages/player/player.component';
import { LoaderComponent } from './pages/loader/loader.component';
import {
  AdminGuardService,
  AgentGuardService,
  BetOperatorGuardService,
  LoaderGuardService,
  PlayerGuardService,
} from './services/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/play/login',
    pathMatch: 'full',
  },
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: 'admin',
        canActivate: [AdminGuardService],
        loadChildren: () =>
          import('src/app/pages/admin/admin.module').then((m) => m.AdminModule),
      },
    ],
  },
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: 'play',
        loadChildren: () =>
          import('src/app/pages/auth/auth.module').then((m) => m.AuthModule),
      },
    ],
  },
  {
    path: '',
    component: AgentComponent,
    canActivate: [AgentGuardService],
    children: [
      {
        path: 'agent',
        loadChildren: () =>
          import('src/app/pages/agent/agent.module').then((m) => m.AgentModule),
      },
    ],
  },
  {
    path: '',
    component: LoaderComponent,
    canActivate: [LoaderGuardService],
    children: [
      {
        path: 'loader',
        loadChildren: () =>
          import('src/app/pages/loader/loader.module').then((m) => m.LoaderModule),
      },
    ],
  },
  {
    path: '',
    component: PlayerComponent,
    canActivate: [PlayerGuardService],
    children: [
      {
        path: 'player',
        loadChildren: () =>
          import('src/app/pages/player/player.module').then(
            (m) => m.PlayerModule
          ),
      },
    ],
  },
  {
    path: '',
    component: BetOperatorComponent,
    canActivate: [BetOperatorGuardService],
    children: [
      {
        path: 'operator',
        loadChildren: () =>
          import('src/app/pages/bet-operator/bet-operator.module').then(
            (m) => m.BetOperatorModule
          ),
      },
    ],
  },
  { path: '**', redirectTo: '/play/login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
