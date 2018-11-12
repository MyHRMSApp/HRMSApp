import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, MenuController } from 'ionic-angular';
import { UtilsProvider } from '../../providers/utils/utils';


@IonicPage()
@Component({
  selector: 'page-alert-page-fortextarea',
  templateUrl: 'alert-page-fortextarea.html',
})
export class AlertPageFortextareaPage {
  public deleteReason:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
              public utilService: UtilsProvider, public menu: MenuController) {

  this.menu.swipeEnable(false);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AlertPage FortextareaPage');
  }

  dismiss() {
    if(this.deleteReason !== undefined || this.deleteReason == ""){
      this.viewCtrl.dismiss({deleteReason: this.deleteReason});
    }else{
      this.utilService.showCustomPopup4Error("My Request", "Please enter the reason", "FAILURE");
    } 
  }
  cancel(){
    this.viewCtrl.dismiss();
  }

}
