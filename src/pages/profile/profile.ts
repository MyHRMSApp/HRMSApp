import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Nav, Platform, MenuController, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { Network } from '@ionic-native/network';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Http, Headers, RequestOptions } from '@angular/http';
import { MyApp } from '../../app/app.component';
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
  public profileDetails:any = {
    "ENAME": undefined,
    "EMP_HR": undefined,
    "BTRTL_TXT": undefined,
    "PERSK": undefined,
    "ORGEH_TXT": undefined,
    "PERSG_TXT": undefined,
    "EP_MANAGER": undefined,
    "EMPCODE": undefined
};

  constructor(public menu: MenuController, public events: Events, private camera: Camera, 
    private http: Http, private toast: ToastController, private network: Network, 
    public loadingCtrl: LoadingController, public platform: Platform, 
    public alertCtrl: AlertController, public statusBar: StatusBar, public navCtrl: NavController, 
    public navParams: NavParams, public mainService: MyApp, public service: ServiceProvider,
    public utilService: UtilsProvider) {
    
    this.menu.swipeEnable(false);
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

  ionViewCanEnter(){
    // if(this.mainService.internetConnectionCheck){
      this.utilService.showLoader("Please wait...");
      this.service.invokeAdapterCall('commonAdapterServices', 'GetMyProfileDetails', 'get', {payload : false}).then((resultData:any)=>{
        if(resultData){
          if(resultData.status_code == 0){
            console.log(resultData.data.ET_DATA);
            this.profileDetails = resultData.data.ET_DATA;
            setTimeout(() => {
              this.utilService.dismissLoader();
            }, 1000);
          }else{
            this.utilService.dismissLoader();
            this.utilService.showCustomPopup4Error("Profile", resultData.message, "FAILURE");
          }
        };
      }, (error)=>{
        console.log("Data readed from jsonstore error",error);
        this.utilService.dismissLoader();
        this.utilService.showCustomPopup4Error("Profile", error.statusText, "FAILURE");
      });
    // }else{
    //   this.utilService.showCustomPopup("FAILURE", "You are in offline, Please check you internet..");
    // }
  }

  getProfileValue(profileValue){
    if(profileValue !== undefined){
      return profileValue;
    } 
    return "";
  }
  
}
