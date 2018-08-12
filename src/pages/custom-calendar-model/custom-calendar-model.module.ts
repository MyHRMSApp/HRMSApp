import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomCalendarModelPage } from './custom-calendar-model';
import { CalendarModule } from "ion2-calendar";

@NgModule({
  declarations: [
    CustomCalendarModelPage,
  ],
  imports: [
    IonicPageModule.forChild(CustomCalendarModelPage),
    CalendarModule
  ],
})
export class CustomCalendarModelPageModule {}
