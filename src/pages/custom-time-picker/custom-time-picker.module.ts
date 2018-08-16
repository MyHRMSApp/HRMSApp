import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomTimePickerPage } from './custom-time-picker';

@NgModule({
  declarations: [
    CustomTimePickerPage,
  ],
  imports: [
    IonicPageModule.forChild(CustomTimePickerPage),
  ],
})
export class CustomTimePickerPageModule {}
