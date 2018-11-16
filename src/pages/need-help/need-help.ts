import { Component, ChangeDetectorRef } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Nav, Platform, MenuController, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { Network } from '@ionic-native/network';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Http, Headers, RequestOptions } from '@angular/http';
import { CommonStringsProvider } from '../../providers/common-strings/common-strings';

@IonicPage()
@Component({
  selector: 'page-need-help',
  templateUrl: 'need-help.html',
})
export class NeedHelpPage {
  hamburger: string;
  homeIcon: string;

  constructor(public menu: MenuController, public events: Events, private camera: Camera, 
    private http: Http, private toast: ToastController, private network: Network, 
    public loadingCtrl: LoadingController, public platform: Platform, 
    public alertCtrl: AlertController, public statusBar: StatusBar, public navCtrl: NavController, 
    public navParams: NavParams, public ref: ChangeDetectorRef, public commonString: CommonStringsProvider) {

    this.menu.swipeEnable(false);
  }

  ionViewDidLoad() {
    this.hamburger = (this.commonString.commonStrings.NeedHelpPage.HAMBURGERICON_IMG);
    this.homeIcon = (this.commonString.commonStrings.NeedHelpPage.HOMEICON_IMG);
  }

/*Accordion function for SAP*/ 
  shownGroupSap = null;
  toggleSap(group) {
  this.shownGroupGmail = null;
  this.shownGroupOthers = null;
  if (this.isGroupSap(group)) {
      this.shownGroupSap = null;
  } else {
      this.shownGroupSap = group;
  }
  this.ref.detectChanges();
  };
  isGroupSap(group) {
    return this.shownGroupSap === group;
  };

/*Accordion function for GMAIL*/ 
  shownGroupGmail = null;
  toggleGmail(group) {
  this.shownGroupSap = null;
  this.shownGroupOthers = null;
  if (this.isGroupGmail(group)) {
      this.shownGroupGmail = null;
  } else {
      this.shownGroupGmail = group;
  }
  this.ref.detectChanges();
  };
  isGroupGmail(group) {
    return this.shownGroupGmail === group;
  };

/*Accordion function for Others*/ 
  shownGroupOthers = null;
  toggleOthers(group) {
  this.shownGroupGmail = null;
  this.shownGroupSap = null;
  if (this.isGroupOthers(group)) {
      this.shownGroupOthers = null;
  } else {
      this.shownGroupOthers = group;
  }
  this.ref.detectChanges();
  };
  isGroupOthers(group) {
    return this.shownGroupOthers === group;
  };

  // openMenu(){
  //   this.menu.toggle();
  // }
  
  back(){
    this.navCtrl.pop();
  }

}
