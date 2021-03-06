import { Component, ChangeDetectorRef } from '@angular/core';
import { Events, IonicPage, NavController, NavParams, ActionSheetController  } from 'ionic-angular';
import { Nav, Platform, MenuController, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { Network } from '@ionic-native/network';
import { Http, Headers, RequestOptions } from '@angular/http';
import { SocialSharing } from '@ionic-native/social-sharing';
import { MyApp } from '../../app/app.component';
import { UtilsProvider } from '../../providers/utils/utils';
import { CommonStringsProvider } from '../../providers/common-strings/common-strings';

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
  specificCoupons: any = [];
  couponCounts: any;
  selectedCoupons: any = [];
  newArray: any = [];
  shareData: {};
  str: string;
  shareIcon: boolean = false;
  userInformation: any;
  employeeName: any;
  employeeCode: any;
  iosMail: string;
  showScrolling: boolean = true;
  checkWhatsapp: boolean = false;

  constructor(public menu: MenuController, public events: Events, public actionSheetCtrl: ActionSheetController,
    private toast: ToastController, private network: Network, public loadingCtrl: LoadingController, public platform: Platform,
    private http: Http, public alertCtrl: AlertController, public statusBar: StatusBar, public navCtrl: NavController,
    public navParams: NavParams, public mainService: MyApp, public socialSharing: SocialSharing, private ref: ChangeDetectorRef,
    public utilService: UtilsProvider, public commonString: CommonStringsProvider) {

    this.menu.swipeEnable(false);
    this.selectedCoupons = [];
    this.specificCoupons = [];
    this.title = this.navParams.get("titleName");
    this.specificCoupons = this.navParams.get("coupons");
    for (var i = 0; i < this.specificCoupons.length; i++) {
      this.specificCoupons[i].checked = false;
    }
    this.couponCounts = this.navParams.get("length");
    console.log(this.specificCoupons);

    this.userInformation = JSON.parse(localStorage.getItem("userInfo"));
    this.employeeName = this.userInformation.EP_ENAME;
    this.employeeCode = this.userInformation.EP_PERNR;
    console.log(this.employeeName, this.employeeCode);

  }

  ionViewDidLoad() {
    this.hamburger = (this.commonString.commonStrings.ShareCouponsPage.HAMBURGERICON_IMG);
    this.homeIcon = (this.commonString.commonStrings.ShareCouponsPage.HOMEICON_IMG);
    this.share = (this.commonString.commonStrings.ShareCouponsPage.SHAREICON_IMG);
    this.cardBg = (this.commonString.commonStrings.ShareCouponsPage.COUPONSBG_IMG);
    this.ref.detectChanges();
  }

  openMenu() {
    this.menu.toggle();
  }
  back() {
    this.navCtrl.pop();
  }
  home() {
    this.navCtrl.setRoot(this.commonString.commonStrings.ShareCouponsPage.HOMEPAGE_NAV);
  }
  shareCoupon() {
    this.shareWhatsapp = true;
    this.showScrolling = false;
    this.ref.detectChanges();
  }
  gmail() {
    var msg = this.str;
    var mailToLink = this.commonString.commonStrings.ShareCouponsPage.MAIL_SUBJECT + encodeURIComponent(msg);
    window.location.href = mailToLink;
  }
  whatsapp() {
    var msg = this.str;

    if (this.platform.is('android')) {
      this.socialSharing.shareViaWhatsApp(msg, null, null).then(() => {}).catch(() => {
        this.utilService.showCustomPopup(this.commonString.commonStrings.ShareCouponsPage.FAILURE_TITLE_TEXT, this.commonString.commonStrings.ShareCouponsPage.FAILURE_ANDROID);
      });
    } else if (this.platform.is('ios')) {
      this.socialSharing.shareViaWhatsApp(msg, null, null);
      document.addEventListener('pause', () => {
        this.checkWhatsapp = true;
      });

      setTimeout(() => {
        if (this.checkWhatsapp == false) {
          this.utilService.showCustomPopup(this.commonString.commonStrings.ShareCouponsPage.FAILURE_TITLE_TEXT, this.commonString.commonStrings.ShareCouponsPage.FAILURE_IOS);
        }
      }, 2000);

    }

  }
  sms() {
    var msg = this.str;
    this.socialSharing.shareViaSMS(msg, null).then(() => {
    }).catch(() => {
      this.utilService.showCustomPopup(this.commonString.commonStrings.ShareCouponsPage.FAILURE_TITLE_TEXT, this.commonString.commonStrings.ShareCouponsPage.FAILURE_MSG);
    });
  }
  cancel() {
    this.shareWhatsapp = false;
    this.showScrolling = true;
    this.ref.detectChanges();
  }
  shareMe(data) {
    console.log(data);
    if (data.checked == true) {
      this.shareIcon = true;
      this.ref.detectChanges();
      data = {
        Category: data.CCTGRY,
        Type: data.CTYP,
        Coupon_Number: data.DCOUPN,
      }
      this.selectedCoupons.push(data);
      console.log(this.selectedCoupons.length);
      this.str = '';
      this.str += "Hi," + "\n" + "Details for discount are as below:";
      for (let i = 0; i < this.selectedCoupons.length; i++) {
        this.str += "\n" + "\n" + "Category:" + this.selectedCoupons[i].Category + "\n" + "Type:" + this.selectedCoupons[i].Type + "\n" + "Code:" + this.selectedCoupons[i].Coupon_Number;
        console.log(this.str);
      }
      this.str += "\n" + "\n" + "Emp Code:" + this.employeeCode + "\n" + "\n" + "Regards," + "\n" + this.employeeName;
    } else {
      this.str = '';
      this.str += "Hi," + "\n" + "Details for discount are as below:";
      let uncheckedCoupon = data.DCOUPN;
      console.log("Checked == false", uncheckedCoupon);
      this.ref.detectChanges();
      for (let i = 0; i < this.selectedCoupons.length; i++) {
        if (this.selectedCoupons[i].Coupon_Number == uncheckedCoupon) {
          this.selectedCoupons.splice(i, 1);
          console.log(this.selectedCoupons);
          console.log(this.selectedCoupons.length);
          if (this.selectedCoupons.length == "0") {
            this.shareIcon = false;
            this.ref.detectChanges();
          }
        }
      }
      for (let i = 0; i < this.selectedCoupons.length; i++) {
        this.str += "\n" + "Coupon Number:" + this.selectedCoupons[i].Coupon_Number;
        console.log(this.str);
      }
      this.str += "\n" + "\n" + "Regards," + "\n" + this.employeeName;
    }

  }
}