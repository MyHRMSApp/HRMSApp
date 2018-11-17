import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Nav, Platform, MenuController, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { Network } from '@ionic-native/network';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Http, Headers, RequestOptions } from '@angular/http';
import { StorageProvider } from '../../providers/storage/storage';
import { MyApp } from '../../app/app.component';
import { ServiceProvider } from '../../providers/service/service';
import { UtilsProvider } from '../../providers/utils/utils';
import { CommonStringsProvider } from '../../providers/common-strings/common-strings';

@IonicPage()
@Component({
  selector: 'page-encashment-leave',
  templateUrl: 'encashment-leave.html',
})
export class EncashmentLeavePage {
  title: any;
  hamburger: string;
  homeIcon: string;
  public encashmentData: Array < any > ;
  public applyBtnFlag: boolean = false;
  public applyEncashDays: any;
  public encashmentEP_NDAY: any;

  constructor(public menu: MenuController, public events: Events, private camera: Camera,
    private http: Http, private toast: ToastController, private network: Network,
    public loadingCtrl: LoadingController, public platform: Platform,
    public alertCtrl: AlertController, public statusBar: StatusBar, public navCtrl: NavController,
    public navParams: NavParams, public storage: StorageProvider, public mainService: MyApp,
    public service: ServiceProvider, public utilService: UtilsProvider, public commonString: CommonStringsProvider) {

    this.menu.swipeEnable(false);
    this.title = this.navParams.get("titleName");
    this.encashmentData = [];
  }

  ionViewDidLoad() {
    this.hamburger = (this.commonString.commonStrings.EncashmentLeavePage.HAMBURGERICON_IMG);
    this.homeIcon = (this.commonString.commonStrings.EncashmentLeavePage.HOMEICON_IMG);
  }

  ionViewCanEnter() {
    // this.encashmentData = this.mainService.leaveEncashData;
    if (this.mainService.leaveEncashData.ET_HSTRY !== "") {
      if (this.mainService.leaveEncashData.ET_HSTRY.item.length === undefined) {
        this.encashmentData.push(this.mainService.leaveEncashData.ET_HSTRY.item);
      } else {
        for (var i = 0; i < this.mainService.leaveEncashData.ET_HSTRY.item.length; i++) {
          this.encashmentData.push(this.mainService.leaveEncashData.ET_HSTRY.item[i]);
        }
      }
    }
    this.applyBtnFlag = (this.mainService.leaveEncashData.EP_ELGBL == "") ? true : false;
    this.encashmentEP_NDAY = this.mainService.leaveEncashData.EP_NDAY;
  }

  openMenu() {
    this.menu.toggle();
  }
  back() {
    this.navCtrl.pop();
  }
  home() {
    this.navCtrl.setRoot(this.commonString.commonStrings.EncashmentLeavePage.HOMEPAGE_NAV);
  }

  applyEncashmentRequest() {

    var enterDays = parseFloat(this.applyEncashDays);
    var eligibleDays = parseFloat(this.encashmentEP_NDAY);
    // if(this.mainService.internetConnectionCheck){
    if (this.applyEncashDays === undefined || this.applyEncashDays == "") {
      this.utilService.showCustomPopup4Error(this.commonString.commonStrings.EncashmentLeavePage.FAILURE_TITLE, this.commonString.commonStrings.EncashmentLeavePage.FAILURE_MSG_ONE, this.commonString.commonStrings.EncashmentLeavePage.FAILURE_TITLE_TEXT);
    }
    if (enterDays > eligibleDays) {
      this.utilService.showCustomPopup4Error(this.commonString.commonStrings.EncashmentLeavePage.FAILURE_TITLE, this.commonString.commonStrings.EncashmentLeavePage.FAILURE_MSG_TWO, this.commonString.commonStrings.EncashmentLeavePage.FAILURE_TITLE_TEXT);
    } else {
      this.utilService.showLoader(this.commonString.commonStrings.EncashmentLeavePage.PLEASE_WAIT);
      var payloadData = {
        "IP_NO_DAYS": this.applyEncashDays,
      }
      console.log(payloadData);
      this.service.invokeAdapterCall('commonAdapterServices', 'applyEncashmentRequest', 'post', {
        payload: true,
        length: 1,
        payloadData: payloadData
      }).then((resultData: any) => {
        if (resultData) {
          if (resultData.status_code == 0) {
            if (resultData.data.EP_RETURN.TYPE == "E") {
              this.utilService.dismissLoader();
              this.utilService.showCustomPopup4Error(this.commonString.commonStrings.EncashmentLeavePage.FAILURE_TITLE, resultData.data.EP_RETURN.MESSAGE, this.commonString.commonStrings.EncashmentLeavePage.FAILURE_TITLE_TEXT);
            } else if (resultData.data.EP_RETURN.TYPE == "S") {
              const alert = this.alertCtrl.create({
                title: "",
                message: "<p class='header'>Apply Encashment</p> <p>" + resultData.data.EP_RETURN.MESSAGE + "</p>",
                cssClass: "SUCCESS",
                enableBackdropDismiss: false,
              });
              alert.addButton({
                text: 'OK',
                handler: data => {
                  this.navCtrl.setRoot(this.commonString.commonStrings.EncashmentLeavePage.HOMEPAGE_NAV);
                }
              });
              this.utilService.dismissLoader();
              alert.present();

            }
          } else {
            this.utilService.dismissLoader();
            this.utilService.showCustomPopup4Error(this.commonString.commonStrings.EncashmentLeavePage.FAILURE_TITLE, resultData.message, this.commonString.commonStrings.EncashmentLeavePage.FAILURE_TITLE_TEXT);
          }

        };
      }, (error) => {
        this.utilService.dismissLoader();
        this.utilService.showCustomPopup4Error(this.commonString.commonStrings.EncashmentLeavePage.FAILURE_TITLE, "102: Oops! Something went wrong, Please try again", this.commonString.commonStrings.EncashmentLeavePage.FAILURE_TITLE_TEXT);
      });
    }
  }

}
