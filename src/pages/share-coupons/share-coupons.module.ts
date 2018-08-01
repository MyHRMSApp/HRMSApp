import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShareCouponsPage } from './share-coupons';

@NgModule({
  declarations: [
    ShareCouponsPage,
  ],
  imports: [
    IonicPageModule.forChild(ShareCouponsPage),
  ],
})
export class ShareCouponsPageModule {}
