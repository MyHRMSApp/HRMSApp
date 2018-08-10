import { Component, SystemJsNgModuleLoader } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Nav, Platform, MenuController, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { Network } from '@ionic-native/network';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Http, Headers, RequestOptions } from '@angular/http';
import { StorageProvider } from '../../providers/storage/storage';
import { UtilsProvider } from '../../providers/utils/utils';
import { MyApp } from '../../app/app.component';

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

  constructor(public menu: MenuController, public events: Events, private camera: Camera, 
    private http: Http, private toast: ToastController, private network: Network, 
    public loadingCtrl: LoadingController, public platform: Platform, 
    public alertCtrl: AlertController, public statusBar: StatusBar, public navCtrl: NavController, 
    public navParams: NavParams, public storage:StorageProvider, public utilService: UtilsProvider, public mainServices: MyApp) {
      
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
    this.navCtrl.push("AllLeavesPage", {"titleName":"PRIVILEGE LEAVE", userLeave: this.userPLLeave});
  }
  sickLeave() {
    this.navCtrl.push("AllLeavesPage", {"titleName":"SICK LEAVE", userLeave: this.userSLLeave});
  }
  generalLeave() {
    this.navCtrl.push("AllLeavesPage", {"titleName":"GENERAL LEAVE", userLeave: this.userGLLeave});
  }
  casualLeave() {
    this.navCtrl.push("AllLeavesPage", {"titleName":"CASUAL LEAVE", userLeave: this.userCLLeave});
  }
  leaveEncashment() {
    this.navCtrl.push("EncashmentLeavePage", {"titleName":"LEAVE ENCASHMENT", userLeave: this.userLeaveEncashment});
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
            break;
          case "SL":
            this.userSLLeave = this.mainServices.userLeaveBalanceListData.ET_EMPBAL.item[i];
            break;
          case "GL":
            this.userGLLeave = this.mainServices.userLeaveBalanceListData.ET_EMPBAL.item[i];
            break;
          case "PL":
            this.userPLLeave = this.mainServices.userLeaveBalanceListData.ET_EMPBAL.item[i];
            break;
        }
      }
    }
    this.utilService.dismissLoader();
    console.log(this.userCLLeave+"-"+this.userSLLeave+"-"+this.userGLLeave+"-"+this.userPLLeave);
  }

  

}
