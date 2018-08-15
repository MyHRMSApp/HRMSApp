import { Component, ChangeDetectorRef } from '@angular/core';
import { Events, IonicPage, NavController, NavParams, ActionSheetController  } from 'ionic-angular';
import { Nav, Platform, MenuController, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { Network } from '@ionic-native/network';
import { Http, Headers, RequestOptions } from '@angular/http';
import { SocialSharing } from '@ionic-native/social-sharing';
import { MyApp } from '../../app/app.component'

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
  title: any;
  counts: any;
  specificCoupons: any;
  couponCounts: any;
  selectedCoupons: any = [];
  newArray: any = [];
  shareData: {};
  str: string;

  constructor(public menu: MenuController, public events: Events, public actionSheetCtrl: ActionSheetController,
    private toast: ToastController, private network: Network, public loadingCtrl: LoadingController, public platform: Platform,
    private http: Http, public alertCtrl: AlertController, public statusBar: StatusBar, public navCtrl: NavController, 
    public navParams: NavParams, public mainService: MyApp, public socialSharing:SocialSharing, private ref:ChangeDetectorRef) {

    this.title = this.navParams.get("titleName");
    this.specificCoupons = this.navParams.get("coupons");
    this.couponCounts = this.navParams.get("length");
    console.log(this.specificCoupons);
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
  back() {
    this.navCtrl.pop();
  }
  home() {
    this.navCtrl.setRoot("HomePage");
  }
  shareCoupon() {
      this.shareWhatsapp=true;
      this.ref.detectChanges();
  }
  gmail() {
    var msg  = this.str;
    this.socialSharing.shareVia("com.google.android.gm", msg, null, null);
  }
  whatsapp() {
    var msg  = this.str;
    this.socialSharing.shareViaWhatsApp(msg, null, null);
  }
  sms() {
    var msg  = this.str;
    this.socialSharing.shareViaSMS(msg, null);
  }
  cancel() {
    this.shareWhatsapp=false;
    this.ref.detectChanges();
  }

  shareMe(data) {
    console.log(data);
    this.ref.detectChanges();
    data = {
      Employee_Number : "EP00432123",
      Coupon_Number : data.DCOUPN,
    }
    this.selectedCoupons.push(data);
    console.log(this.selectedCoupons);
    this.str = '';
    for(let i =0; i < this.selectedCoupons.length; i++) {
      this.str +=  "Coupon Number :" + this.selectedCoupons[i].Coupon_Number + "\n";
      console.log(this.str);
    }

}
  

}