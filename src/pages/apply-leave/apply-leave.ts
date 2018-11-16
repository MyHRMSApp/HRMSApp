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
import { CommonStringsProvider } from '../../providers/common-strings/common-strings';

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
  public leaveDate4SingleDate:any;

  constructor(public menu: MenuController, public events: Events, private camera: Camera, 
    private http: Http, private toast: ToastController, private network: Network, 
    public loadingCtrl: LoadingController, public platform: Platform, 
    public alertCtrl: AlertController, public statusBar: StatusBar, public navCtrl: NavController, 
    public navParams: NavParams, public storage:StorageProvider, public utilService: UtilsProvider,
    public mainServices: MyApp, public service: ServiceProvider, public commonString: CommonStringsProvider) {
     
    this.menu.swipeEnable(false);
    if(this.navParams.get(this.commonString.commonStrings.AllLeavesPage.LeaveData)) this.leaveDate4SingleDate =  this.navParams.get(this.commonString.commonStrings.AllLeavesPage.LeaveData);

    }

  openMenu() {
    this.menu.toggle();
  }
  back(){
    this.navCtrl.pop();
  }
  home() {
    this.navCtrl.setRoot(this.commonString.commonStrings.AllLeavesPage.HomePage);
  }
  privilegeLeave() {
    this.navCtrl.push(this.commonString.commonStrings.AllLeavesPage.AllLeavesPage, {"titleName": this.commonString.commonStrings.ApplyLeavePage.PRIVILEGELEAVE, userLeave: this.userPLLeave, leaveType: "0003", "LeaveData": this.leaveDate4SingleDate});
  }
  sickLeave() {
    this.navCtrl.push(this.commonString.commonStrings.AllLeavesPage.AllLeavesPage, {"titleName": this.commonString.commonStrings.ApplyLeavePage.SICKLEAVE, userLeave: this.userSLLeave, leaveType: "0002", "LeaveData": this.leaveDate4SingleDate});
  }
  generalLeave() {
    this.navCtrl.push(this.commonString.commonStrings.AllLeavesPage.AllLeavesPage, {"titleName": this.commonString.commonStrings.ApplyLeavePage.GENERALLEAVE, userLeave: this.userGLLeave, leaveType: "0034", "LeaveData": this.leaveDate4SingleDate});
  }
  casualLeave() {
    this.navCtrl.push(this.commonString.commonStrings.AllLeavesPage.AllLeavesPage, {"titleName": this.commonString.commonStrings.ApplyLeavePage.CASUALLEAVE, userLeave: this.userCLLeave, leaveType: "0001", "LeaveData": this.leaveDate4SingleDate});
  }
  leaveEncashment() {
  
      try {
        if(this.mainServices.internetConnectionCheck){
          this.utilService.showLoader(this.commonString.commonStrings.AllLeavesPage.pleaseWait);
        this.service.invokeAdapterCall(this.commonString.commonStrings.AllLeavesPage.commonAdapterServices, this.commonString.commonStrings.ApplyLeavePage.GETLEAVEENCASHBALANCE_TEXT, 'get', {payload : false}).then((resultData:any)=>{
          if(resultData){
            if(resultData.status_code == 0){
              this.mainServices.leaveEncashData = resultData.data;
              console.log(JSON.stringify(this.mainServices.userLeaveBalanceListData));
              this.utilService.dismissLoader();
              this.navCtrl.push(this.commonString.commonStrings.ApplyLeavePage.ENCASHMENTLEAVEPAGE_TEXT, {"titleName":this.commonString.commonStrings.ApplyLeavePage.LEAVEENCASHMENT, userLeave: this.userLeaveEncashment, leaveType: "ENC"});
            }else{
              this.utilService.dismissLoader();
              this.utilService.showCustomPopup(this.commonString.commonStrings.AllLeavesPage.FAILURE,resultData.message);
            }

          };
        }, (error)=>{
          console.log("Data readed from jsonstore error",error);
          this.utilService.dismissLoader();
          this.utilService.showCustomPopup(this.commonString.commonStrings.AllLeavesPage.FAILURE,error.statusText);
        });
        }else{
          this.utilService.showCustomPopup(this.commonString.commonStrings.AllLeavesPage.FAILURE, this.commonString.commonStrings.ApplyLeavePage.internetVlidate);
        }        
      } catch (error) {
        console.log("catch-->>",error);
      }
  }

  ionViewDidLoad() {
    this.hamburger = (this.commonString.commonStrings.AllLeavesPage.hamburgerIcon);
    this.homeIcon = (this.commonString.commonStrings.AllLeavesPage.homeIcon);
    console.log('ionViewDidLoad ApplyLeavePage');
    this.utilService.dismissLoader();
  }

  ionViewCanEnter(){

    if(this.mainServices.userLeaveBalanceListData.ET_EMPBAL !== ""){
      if(this.mainServices.userLeaveBalanceListData.ET_EMPBAL.item.length === undefined && this.mainServices.userLeaveBalanceListData.ET_EMPBAL.item.KTEXT !== undefined) {
        switch (this.mainServices.userLeaveBalanceListData.ET_EMPBAL.item.KTEXT) {
          case this.commonString.commonStrings.ApplyLeavePage.CL:
            this.userCLLeave = this.mainServices.userLeaveBalanceListData.ET_EMPBAL.item;
            this.casual = this.mainServices.userLeaveBalanceListData.ET_EMPBAL.item.KTEXT;
            console.log(this.casual);
            break;
          case this.commonString.commonStrings.ApplyLeavePage.SL:
            this.userSLLeave = this.mainServices.userLeaveBalanceListData.ET_EMPBAL.item;
            this.sick = this.mainServices.userLeaveBalanceListData.ET_EMPBAL.item.KTEXT;
            console.log(this.sick);
            break;
          case this.commonString.commonStrings.ApplyLeavePage.GL:
            this.userGLLeave = this.mainServices.userLeaveBalanceListData.ET_EMPBAL.item;
            this.general = this.mainServices.userLeaveBalanceListData.ET_EMPBAL.item.KTEXT;
            console.log(this.general);
            break;
          case this.commonString.commonStrings.ApplyLeavePage.PL:
            this.userPLLeave = this.mainServices.userLeaveBalanceListData.ET_EMPBAL.item;
            this.privelage = this.mainServices.userLeaveBalanceListData.ET_EMPBAL.item.KTEXT;
            console.log(this.privelage);
            break;
        }
      }else {
        for(var i = 0; i < this.mainServices.userLeaveBalanceListData.ET_EMPBAL.item.length; i++){
          switch (this.mainServices.userLeaveBalanceListData.ET_EMPBAL.item[i].KTEXT) {
            case this.commonString.commonStrings.ApplyLeavePage.CL:
              this.userCLLeave = this.mainServices.userLeaveBalanceListData.ET_EMPBAL.item[i];
              this.casual = this.mainServices.userLeaveBalanceListData.ET_EMPBAL.item[i].KTEXT;
              console.log(this.casual);
              break;
            case this.commonString.commonStrings.ApplyLeavePage.SL:
              this.userSLLeave = this.mainServices.userLeaveBalanceListData.ET_EMPBAL.item[i];
              this.sick = this.mainServices.userLeaveBalanceListData.ET_EMPBAL.item[i].KTEXT;
              console.log(this.sick);
              break;
            case this.commonString.commonStrings.ApplyLeavePage.GL:
              this.userGLLeave = this.mainServices.userLeaveBalanceListData.ET_EMPBAL.item[i];
              this.general = this.mainServices.userLeaveBalanceListData.ET_EMPBAL.item[i].KTEXT;
              console.log(this.general);
              break;
            case this.commonString.commonStrings.ApplyLeavePage.PL:
              this.userPLLeave = this.mainServices.userLeaveBalanceListData.ET_EMPBAL.item[i];
              this.privelage = this.mainServices.userLeaveBalanceListData.ET_EMPBAL.item[i].KTEXT;
              console.log(this.privelage);
              break;
          }
        }
      }

    // if(this.mainServices.userLeaveBalanceListData.ET_EMPBAL.item.length > 0){
    //   for(var i = 0; i < this.mainServices.userLeaveBalanceListData.ET_EMPBAL.item.length; i++){
    //     switch (this.mainServices.userLeaveBalanceListData.ET_EMPBAL.item[i].KTEXT) {
    //       case "CL":
    //         this.userCLLeave = this.mainServices.userLeaveBalanceListData.ET_EMPBAL.item[i];
    //         this.casual = this.mainServices.userLeaveBalanceListData.ET_EMPBAL.item[i].KTEXT;
    //         console.log(this.casual);
    //         break;
    //       case "SL":
    //         this.userSLLeave = this.mainServices.userLeaveBalanceListData.ET_EMPBAL.item[i];
    //         this.sick = this.mainServices.userLeaveBalanceListData.ET_EMPBAL.item[i].KTEXT;
    //         console.log(this.sick);
    //         break;
    //       case "GL":
    //         this.userGLLeave = this.mainServices.userLeaveBalanceListData.ET_EMPBAL.item[i];
    //         this.general = this.mainServices.userLeaveBalanceListData.ET_EMPBAL.item[i].KTEXT;
    //         console.log(this.general);
    //         break;
    //       case "PL":
    //         this.userPLLeave = this.mainServices.userLeaveBalanceListData.ET_EMPBAL.item[i];
    //         this.privelage = this.mainServices.userLeaveBalanceListData.ET_EMPBAL.item[i].KTEXT;
    //         console.log(this.privelage);
    //         break;
    //     }
    //   }
    // }
    this.utilService.dismissLoader();
    console.log(this.userCLLeave+"-"+this.userSLLeave+"-"+this.userGLLeave+"-"+this.userPLLeave);
  }

  

}
}
