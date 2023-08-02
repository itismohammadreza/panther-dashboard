import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {MainPage} from './main.page';
import {DashboardPage} from "@modules/main/pages/dashboard/dashboard.page";
import {ManagerPage} from "@modules/main/pages/manager/manager.page";

const routes: Routes = [
  {
    path: '',
    component: MainPage,
    children: [
      {
        path: 'models/:index',
        title: 'manage',
        component: ManagerPage
      },
      {
        path: 'dashboard',
        title: 'dashboard',
        component: DashboardPage
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {
}
