import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {MainPage} from './main.page';
import {DashboardPage} from "@modules/main/pages/dashboard/dashboard.page";

const routes: Routes = [
  {
    path: '',
    component: MainPage,
    children: [
      {
        path: '',
        title: 'dashboard',
        component: DashboardPage
      },
      {
        path: '',
        redirectTo: '',
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
