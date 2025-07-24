import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { TryoutPageComponent } from './tryout-page.component';

const tryoutPageRoutes: Routes = [{ path: '', component: TryoutPageComponent }];

@NgModule({
  imports: [RouterModule.forChild(tryoutPageRoutes), SharedModule],
  declarations: [TryoutPageComponent],
})
export class TryoutPageModule { }
