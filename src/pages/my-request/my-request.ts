import { Component, ChangeDetectorRef } from '@angular/core';
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
  selector: 'page-my-request',
  templateUrl: 'my-request.html',
})
export class MyRequestPage {
  hamburger: string;
  homeIcon: string;
  cancelButtonLeave: boolean = false;
  cancelButtonFTP: boolean = false;
  cancelButtonOD: boolean = false;
  public leaveRequestDataList:any;
  public odRequestDataList:any;
  public ftpRequestDataList:any;

  constructor(public menu: MenuController, public events: Events, private camera: Camera, 
    private http: Http, private toast: ToastController, private network: Network, 
    public loadingCtrl: LoadingController, public platform: Platform, 
    public alertCtrl: AlertController, public statusBar: StatusBar, public navCtrl: NavController, 
    public navParams: NavParams, private ref: ChangeDetectorRef, public mainService: MyApp, 
    public service: ServiceProvider, public utilService: UtilsProvider) { 
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyRequestPage');
    this.hamburger = ("./assets/homePageIcons/hamburger.svg");
    this.homeIcon = ("./assets/homePageIcons/Home.svg");
  }
 
    /*Acordion function for Leave*/ 
    shownLeave = null;
    toggleLeave(group) {
      if (this.isGroupLeave(group)) {
          this.shownLeave = null;
      } else {
          this.shownLeave = group;
      }
      this.ref.detectChanges();
    };
    isGroupLeave(group) {
      return this.shownLeave === group;
    };

    /*Acordion function for OD*/  
    shownOD = null;
    toggleOD(group) {
      if (this.isGroupOD(group)) {
          this.shownOD = null;
      } else {
          this.shownOD = group;
      }
      this.ref.detectChanges();
    };
    isGroupOD(group) {
      return this.shownOD === group;
    };
 
    /*Acordion function for FTP*/ 
    shownFTP = null;
    toggleFTP(group) {
      if (this.isGroupFTP(group)) {
          this.shownFTP = null;
      } else {
          this.shownFTP = group;
      }
      this.ref.detectChanges();
    };
    isGroupFTP(group) {
      return this.shownFTP === group;
    };

    cancelLeave(eventID){
      this.cancelButtonLeave=!this.cancelButtonLeave;
      if(!this.cancelButtonLeave){
        var cancelBtn = document.getElementById(eventID);
        cancelBtn.className = "cancel displayNone";
      }else{
        var cancelBtn = document.getElementById(eventID);
        cancelBtn.className = "cancel";
      }
      this.ref.detectChanges();
    }
    cancelOD(){
      this.cancelButtonOD=true;
      this.ref.detectChanges();
    }
    cancelFTP(){
      this.cancelButtonFTP=true;
      this.ref.detectChanges();
    }

    confirmCancelLeave(event){
      this.cancelButtonLeave=!this.cancelButtonLeave;
      this.ref.detectChanges();
    }
    confirmCancelOD(){
      this.cancelButtonOD=false;
      this.ref.detectChanges();
    }
    confirmCancelFTP(){
      this.cancelButtonFTP=false;
      this.ref.detectChanges();
    }

  openMenu() {
    this.menu.toggle();
  }

  back(){
    this.navCtrl.pop();
  }

  ionViewCanEnter() {
    console.log("this.mainService.myRequestData--->>>"+this.mainService.myRequestData);
    this.leaveRequestDataList = this.mainService.myRequestData.ET_LEAVE.item;
  }

  getStatusRequest(status){
    var res = status.split("@");
    var responceData = "";
    if(res[1] == "P"){
      responceData = "Pending";
    }else if(res[1] == "A"){
      responceData = "Approved";
    }else if(res[1] == "R"){
      responceData = "Rejected";
    }
    return responceData;
  }

  getStatusRequestMsg(status){
    var res = status.split("@");
    return res[0];
  }

  getPeriod(period){
    var periodRes = "";
    switch (period) {
      case "FD":
        periodRes = "full Day";
        break;
      case "FQ":
        periodRes = "1st Qtr";
        break;
      case "SQ":
        periodRes = "2nd Qtr";
        break;
      case "FH":
        periodRes = "1st half";
        break;
      case "SH":
        periodRes = "2nd half";
        break;
    }

    return periodRes;
  }

}
