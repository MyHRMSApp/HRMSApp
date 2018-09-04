import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { UtilsProvider } from '../../providers/utils/utils';

/**
 * Generated class for the AlertPageFortextareaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-alert-page-fortextarea',
  templateUrl: 'alert-page-fortextarea.html',
})
export class AlertPageFortextareaPage {
  public deleteReason:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
              public utilService: UtilsProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AlertPageFortextareaPage');
  }

  dismiss() {
    if(this.deleteReason !== undefined || this.deleteReason == ""){
      this.viewCtrl.dismiss({deleteReason: this.deleteReason});
    }else{
      this.utilService.showCustomPopup4Error("My Request", "Please enter Reason..", "FAILURE");
    }
    
  }

}
