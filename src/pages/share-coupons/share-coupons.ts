import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams, ActionSheetController  } from 'ionic-angular';
import { Nav, Platform, MenuController, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { Network } from '@ionic-native/network';
import { Http, Headers, RequestOptions } from '@angular/http';
import { SocialSharing } from '@ionic-native/social-sharing';

@IonicPage()
@Component({
  selector: 'page-share-coupons',
  templateUrl: 'share-coupons.html',
})
export class ShareCouponsPage {
  hamburger: string;
  homeIcon: string;
  share: string;
  actionSheet: any;
  shareWhatsapp: boolean = false;
  cardBg: string;

  constructor(public menu: MenuController, public events: Events, public actionSheetCtrl: ActionSheetController,
    private toast: ToastController, private network: Network, public loadingCtrl: LoadingController, public platform: Platform,
    private http: Http, public alertCtrl: AlertController, public statusBar: StatusBar, public navCtrl: NavController, 
    public navParams: NavParams, public socialSharing: SocialSharing) {
  }

  ionViewDidLoad() {
    this.hamburger = ("./assets/homePageIcons/hamburger.svg");
    this.homeIcon = ("./assets/homePageIcons/Home.svg");
    this.share = ("./assets/couponsImages/share.svg");
    this.cardBg = ("./assets/couponsImages/coupons-BG.svg");
    console.log('ionViewDidLoad ShareCouponsPage');
  }

  openMenu() {
    this.menu.toggle();
  }
  back(){
    this.navCtrl.pop();
  }
  home() {
    this.navCtrl.setRoot("HomePage");
  }
  shareCoupon() {
    this.shareWhatsapp=true;
  }
  gmail() {
    var msg  = "Gmail";
    this.socialSharing.shareVia("com.google.android.gm", msg, null, null);
  }
  whatsapp() {
    var msg  = "Whatsapp";
    this.socialSharing.shareViaWhatsApp(msg, null, null);
  }
  sms() {
    var msg  = "SMS"
    this.socialSharing.shareViaSMS(msg, null);
  }
  cancel() {
    this.shareWhatsapp=false;
  }
  

}