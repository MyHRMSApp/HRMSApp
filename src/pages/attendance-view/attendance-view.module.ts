import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AttendanceViewPage } from './attendance-view';

import { CalendarModule } from "ion2-calendar";

@NgModule({
  declarations: [
    AttendanceViewPage,
  ],
  imports: [
    IonicPageModule.forChild(AttendanceViewPage),
    CalendarModule
  ],
})
export class AttendanceViewPageModule {}
