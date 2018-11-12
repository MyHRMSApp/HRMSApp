import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, MenuController } from 'ionic-angular';
import { UtilsProvider } from '../../providers/utils/utils';
import { CommonStringsProvider } from '../../providers/common-strings/common-strings';

@IonicPage()
@Component({
  selector: 'page-alert-page-fortextarea',
  templateUrl: 'alert-page-fortextarea.html',
})
export class AlertPageFortextareaPage {
  public deleteReason:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
              public utilService: UtilsProvider, public menu: MenuController, public commonString: CommonStringsProvider) {

  this.menu.swipeEnable(false);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AlertPage FortextareaPage');
  }

  dismiss() {
    if(this.deleteReason !== undefined || this.deleteReason == ""){
      this.viewCtrl.dismiss({deleteReason: this.deleteReason});
    }else{
      this.utilService.showCustomPopup4Error(this.commonString.commonStrings.AlertPageFortextareaPage.MyRequest, this.commonString.commonStrings.AlertPageFortextareaPage.reasonValidate, this.commonString.commonStrings.AlertPageFortextareaPage.FAILURE);
    } 
  }
  cancel(){
    this.viewCtrl.dismiss();
  }

}
