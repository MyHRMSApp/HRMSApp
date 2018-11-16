import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Nav, Platform, MenuController, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { Network } from '@ionic-native/network';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Http, Headers, RequestOptions } from '@angular/http';
import { CommonStringsProvider } from '../../providers/common-strings/common-strings';

@IonicPage()
@Component({
  selector: 'page-hr-helpline',
  templateUrl: 'hr-helpline.html',
})
export class HrHelplinePage {
  hamburger: string;
  homeIcon: string;

  constructor(public menu: MenuController, public events: Events, private camera: Camera, 
    private http: Http, private toast: ToastController, private network: Network, 
    public loadingCtrl: LoadingController, public platform: Platform, 
    public alertCtrl: AlertController, public statusBar: StatusBar, public navCtrl: NavController, 
    public navParams: NavParams, public commonString: CommonStringsProvider) {
    
    this.menu.swipeEnable(false);
  }

  ionViewDidLoad() {
    this.hamburger = (this.commonString.commonStrings.HRHelplinePage.HAMBURGERICON_IMG);
    this.homeIcon = (this.commonString.commonStrings.HRHelplinePage.HOMEICON_IMG);
  }
  openMenu() {
    this.menu.toggle();
  }
  back(){
    this.navCtrl.pop();
  }
  home() {
    this.navCtrl.setRoot(this.commonString.commonStrings.HRHelplinePage.HOMEPAGE_NAV);
  }

}
