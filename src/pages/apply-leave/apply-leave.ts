import { Component, SystemJsNgModuleLoader } from '@angular/core';
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

@IonicPage()
@Component({
  selector: 'page-apply-leave',
  templateUrl: 'apply-leave.html',
})
export class ApplyLeavePage {
  homeIcon: string;
  hamburger: string;
  public userPLLeave:any;
  public userSLLeave:any;
  public userGLLeave:any;
  public userCLLeave:any;
  public userLeaveEncashment:any;
  privelage: any;
  general: any;
  sick: any;
  casual: any;

  constructor(public menu: MenuController, public events: Events, private camera: Camera, 
    private http: Http, private toast: ToastController, private network: Network, 
    public loadingCtrl: LoadingController, public platform: Platform, 
    public alertCtrl: AlertController, public statusBar: StatusBar, public navCtrl: NavController, 
    public navParams: NavParams, public storage:StorageProvider, public utilService: UtilsProvider,
    public mainServices: MyApp, public service: ServiceProvider) {
     
    this.menu.swipeEnable(false);
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
  privilegeLeave() {
    this.navCtrl.push("AllLeavesPage", {"titleName":"PRIVILEGE LEAVE", userLeave: this.userPLLeave, leaveType: "0003"});
  }
  sickLeave() {
    this.navCtrl.push("AllLeavesPage", {"titleName":"SICK LEAVE", userLeave: this.userSLLeave, leaveType: "0002"});
  }
  generalLeave() {
    this.navCtrl.push("AllLeavesPage", {"titleName":"GENERAL LEAVE", userLeave: this.userGLLeave, leaveType: "0034"});
  }
  casualLeave() {
    this.navCtrl.push("AllLeavesPage", {"titleName":"CASUAL LEAVE", userLeave: this.userCLLeave, leaveType: "0001"});
  }
  leaveEncashment() {
  
      try {
        if(this.mainServices.internetConnectionCheck){
          this.utilService.showLoader("Please wait...");
        this.service.invokeAdapterCall('commonAdapterServices', 'getLeaveEncashBalance', 'get', {payload : false}).then((resultData:any)=>{
          if(resultData){
            if(resultData.status_code == 200){
              this.mainServices.leaveEncashData = resultData.data;
              console.log(JSON.stringify(this.mainServices.userLeaveBalanceListData));
              this.utilService.dismissLoader();
              this.navCtrl.push("EncashmentLeavePage", {"titleName":"LEAVE ENCASHMENT", userLeave: this.userLeaveEncashment, leaveType: "ENC"});
            }else{
              this.utilService.dismissLoader();
              this.utilService.showCustomPopup("FAILURE",resultData.message);
            }

          };
        }, (error)=>{
          console.log("Data readed from jsonstore error",error);
          this.utilService.dismissLoader();
          this.utilService.showCustomPopup("FAILURE",error.statusText);
        });
        }else{
          this.utilService.showCustomPopup("FAILURE", "You are in offline, please check you internet");
        }        
      } catch (error) {
        console.log("catch-->>",error);
      }
  }

  ionViewDidLoad() {
    this.hamburger = ("./assets/homePageIcons/hamburger.svg");
    this.homeIcon = ("./assets/homePageIcons/Home.svg");
    console.log('ionViewDidLoad ApplyLeavePage');
    this.utilService.dismissLoader();
  }

  ionViewCanEnter(){
    if(this.mainServices.userLeaveBalanceListData.ET_EMPBAL.item.length > 0){
      for(var i = 0; i < this.mainServices.userLeaveBalanceListData.ET_EMPBAL.item.length; i++){
        switch (this.mainServices.userLeaveBalanceListData.ET_EMPBAL.item[i].KTEXT) {
          case "CL":
            this.userCLLeave = this.mainServices.userLeaveBalanceListData.ET_EMPBAL.item[i];
            this.casual = this.mainServices.userLeaveBalanceListData.ET_EMPBAL.item[i].KTEXT;
            console.log(this.casual);
            break;
          case "SL":
            this.userSLLeave = this.mainServices.userLeaveBalanceListData.ET_EMPBAL.item[i];
            this.sick = this.mainServices.userLeaveBalanceListData.ET_EMPBAL.item[i].KTEXT;
            console.log(this.sick);
            break;
          case "GL":
            this.userGLLeave = this.mainServices.userLeaveBalanceListData.ET_EMPBAL.item[i];
            this.general = this.mainServices.userLeaveBalanceListData.ET_EMPBAL.item[i].KTEXT;
            console.log(this.general);
            break;
          case "PL":
            this.userPLLeave = this.mainServices.userLeaveBalanceListData.ET_EMPBAL.item[i];
            this.privelage = this.mainServices.userLeaveBalanceListData.ET_EMPBAL.item[i].KTEXT;
            console.log(this.privelage);
            break;
        }
      }
    }
    this.utilService.dismissLoader();
    console.log(this.userCLLeave+"-"+this.userSLLeave+"-"+this.userGLLeave+"-"+this.userPLLeave);
  }

  

}
