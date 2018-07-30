import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AllLeavesPage } from './all-leaves';

@NgModule({
  declarations: [
    AllLeavesPage,
  ],
  imports: [
    IonicPageModule.forChild(AllLeavesPage),
  ],
})
export class AllLeavesPageModule {}
