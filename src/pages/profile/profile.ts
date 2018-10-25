import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Nav, Platform, MenuController, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { Network } from '@ionic-native/network';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Http, Headers, RequestOptions } from '@angular/http';
import { ServiceProvider } from '../../providers/service/service';
import { UtilsProvider } from '../../providers/utils/utils';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  hamburger: string;
  homeIcon: string;

public profileDetails:any;

  constructor(public menu: MenuController, public events: Events, private camera: Camera, 
    private http: Http, private toast: ToastController, private network: Network, 
    public loadingCtrl: LoadingController, public platform: Platform, 
    public alertCtrl: AlertController, public statusBar: StatusBar, public navCtrl: NavController, 
    public navParams: NavParams, public service: ServiceProvider,
    public utilService: UtilsProvider) {
    
    this.menu.swipeEnable(false);

    this.profileDetails = this.navParams.get('profile');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
    this.hamburger = ("./assets/homePageIcons/hamburger.svg");
    this.homeIcon = ("./assets/homePageIcons/Home.svg");
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

  // ionViewCanEnter(){
  //   // if(this.mainService.internetConnectionCheck){
  //     this.utilService.showLoaderProfile("Please wait...");
  //     // if(this.mainService.globalProfileData !== undefined){
  //     //   this.profileDetails = this.mainService.globalProfileData;
  //     //   this.utilService.dismissLoader();
  //     // }else{
  //       this.profileDetails = {
  //             "ENAME": "",
  //             "EMP_HR": "",
  //             "BTRTL_TXT": "",
  //             "PERSK": "",
  //             "ORGEH_TXT": "",
  //             "PERSG_TXT": "",
  //             "EP_MANAGER": "",
  //             "EMPCODE": "",
  //         };
  //       this.service.invokeAdapterCall('commonAdapterServices', 'GetMyProfileDetails', 'get', {payload : false}).then((resultData:any)=>{
  //         if(resultData){
  //           if(resultData.status_code == 0){
  //             console.log(resultData.data.ET_DATA);
  //             // this.profileDetails = resultData.data.ET_DATA;
  //             this.profileDetails = {
  //               "ENAME": resultData.data.ET_DATA.ENAME,
  //               "EMP_HR": resultData.data.ET_DATA.EMP_HR,
  //               "BTRTL_TXT": resultData.data.ET_DATA.BTRTL_TXT,
  //               "PERSK": resultData.data.ET_DATA.PERSK,
  //               "ORGEH_TXT": resultData.data.ET_DATA.ORGEH_TXT,
  //               "PERSG_TXT": resultData.data.ET_DATA.PERSG_TXT,
  //               "EP_MANAGER": resultData.data.ET_DATA.EP_MANAGER,
  //               "EMPCODE": resultData.data.ET_DATA.EMPCODE,
  //           };
  //             // setTimeout(() => {
  //               this.utilService.dismissLoader();
  //             // }, 2000);
  //           }else{
  //             this.utilService.dismissLoader();
  //             // this.utilService.showCustomPopup4Error("Profile", resultData.message, "FAILURE");
  //             this.showErrorAlertWindow(resultData.message);
  //           }
  //         };
  //       }, (error)=>{
  //         console.log("Error",error);
  //         this.utilService.dismissLoader();
  //         this.utilService.showCustomPopup4Error("Profile", "Oops! Something went wrong, Please try again", "FAILURE");
  //         this.showErrorAlertWindow("Oops! Something went wrong, Please try again");
  //       });
  //     // }

  // }

  getProfileValue(profileValue){
    if(profileValue !== undefined){
      return profileValue;
    } 
    return "";
  }
  
}
