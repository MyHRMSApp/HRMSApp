import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Nav, Platform, MenuController, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { Network } from '@ionic-native/network';
import { Http, Headers, RequestOptions } from '@angular/http';
import { StorageProvider } from '../../providers/storage/storage';
import { ServiceProvider } from '../../providers/service/service';
import { UtilsProvider } from '../../providers/utils/utils';
import { CommonStringsProvider } from '../../providers/common-strings/common-strings';
import { MyApp } from '../../app/app.component';

/**
 * CouponsPage Functionalities
 * @author Vivek
 */

@IonicPage()
@Component({
  selector: 'page-coupons',
  templateUrl: 'coupons.html',
})
export class CouponsPage {

  hamburger: string;
  homeIcon: string;
  watches: string;
  jewelleries: string;
  saree: string;
  eyeWears: string;
  counts: any;
  watchCounts: any;
  jewelleryCounts: any;
  eyeWearCounts: any;
  taneiraCounts: any;
  watchCoupons: any;
  jewelleryCoupons: any;
  eyeWearCoupons: any;
  taneiraCoupons: any;
  strings: any;

  constructor(public menu: MenuController, public events: Events,
    private http: Http, private toast: ToastController, private network: Network,
    public loadingCtrl: LoadingController, public platform: Platform, public mainService: MyApp,
    public alertCtrl: AlertController, public statusBar: StatusBar, public navCtrl: NavController,
    public navParams: NavParams, public storage: StorageProvider, public service: ServiceProvider,
    public utilService: UtilsProvider, public commonStrings: CommonStringsProvider) {

    this.menu.swipeEnable(false);
    this.counts = this.mainService.couponPageData;
    this.strings = this.commonStrings.commonStrings.couponsPage;
  }


  ionViewCanEnter() {

    this.eyeWearCounts = 0;
    this.jewelleryCounts = 0;
    this.taneiraCounts = 0;
    this.watchCounts = 0;

    this.eyeWearCounts = this.navParams.get("eyeWearLength");
    this.jewelleryCounts = this.navParams.get("jewelleryLength");
    this.taneiraCounts = this.navParams.get("taneiraLength");
    this.watchCounts = this.navParams.get("watchLength");

  }

  ionViewDidLoad() {
    this.utilService.dismissLoader();
    this.hamburger = (this.commonStrings.commonStrings.CouponsPage.HAMBURGERICON_IMG);
    this.homeIcon = (this.commonStrings.commonStrings.CouponsPage.HOMEICON_IMG);
    this.watches = (this.commonStrings.commonStrings.CouponsPage.WATCHES_IMG);
    this.jewelleries = (this.commonStrings.commonStrings.CouponsPage.JEWELLERIES_IMG);
    this.saree = (this.commonStrings.commonStrings.CouponsPage.SAREE_IMG);
    this.eyeWears = (this.commonStrings.commonStrings.CouponsPage.EYEWEARS_IMG);

  }

  /**
  Method for Menu Toggle
  */
  openMenu() {
    this.menu.toggle();
  }

  back() {
    this.navCtrl.pop();
  }

  home() {
    this.navCtrl.setRoot(this.commonStrings.commonStrings.CouponsPage.HOMEPAGE_NAV);
  }

  watch() {
    if (this.watchCounts == 0) {
      this.utilService.showCustomPopup(this.commonStrings.commonStrings.CouponsPage.FAILURE_TITLE_TEXT, this.commonStrings.commonStrings.CouponsPage.NO_COUPONS);
    } else {
      this.watchCoupons = this.counts.data.ET_WATCH.item;
      this.navCtrl.push(this.commonStrings.commonStrings.CouponsPage.SHARECOUPONSPAGE_NAV, {
        "titleName": "WATCHES",
        "coupons": this.watchCoupons,
        "length": this.watchCounts
      });
    }
  }

  jewellery() {
    if (this.jewelleryCounts == 0) {
      this.utilService.showCustomPopup(this.commonStrings.commonStrings.CouponsPage.FAILURE_TITLE_TEXT, this.commonStrings.commonStrings.CouponsPage.NO_COUPONS);
    } else {
      this.jewelleryCoupons = this.counts.data.ET_JEWELLERY.item;
      this.navCtrl.push(this.commonStrings.commonStrings.CouponsPage.SHARECOUPONSPAGE_NAV, {
        "titleName": "JEWELLERY",
        "coupons": this.jewelleryCoupons,
        "length": this.jewelleryCounts
      });
    }
  }

  eyewear() {
    if (this.eyeWearCounts == 0) {
      this.utilService.showCustomPopup(this.commonStrings.commonStrings.CouponsPage.FAILURE_TITLE_TEXT, this.commonStrings.commonStrings.CouponsPage.NO_COUPONS);
    } else {
      this.eyeWearCoupons = this.counts.data.ET_EYEWEAR.item;
      this.navCtrl.push(this.commonStrings.commonStrings.CouponsPage.SHARECOUPONSPAGE_NAV, {
        "titleName": "EYE WEAR",
        "coupons": this.eyeWearCoupons,
        "length": this.eyeWearCounts
      });
    }
  }

  taneira() {
    if (this.taneiraCounts == 0) {
      this.utilService.showCustomPopup(this.commonStrings.commonStrings.CouponsPage.FAILURE_TITLE_TEXT, this.commonStrings.commonStrings.CouponsPage.NO_COUPONS);
    } else {
      this.taneiraCoupons = this.counts.data.ET_TANEIRA.item;
      this.navCtrl.push(this.commonStrings.commonStrings.CouponsPage.SHARECOUPONSPAGE_NAV, {
        "titleName": "TANEIRA",
        "coupons": this.taneiraCoupons,
        "length": this.taneiraCounts
      });
    }
  }

}
