import { Component, ChangeDetectorRef } from '@angular/core';
import { Events, IonicPage, NavController, NavParams, ModalController  } from 'ionic-angular';
import { Nav, Platform, MenuController, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { Network } from '@ionic-native/network';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Http, Headers, RequestOptions } from '@angular/http';
import { MyApp } from '../../app/app.component';
import { ServiceProvider } from '../../providers/service/service';
import { UtilsProvider } from '../../providers/utils/utils';
import {AlertPageFortextareaPage } from '../alert-page-fortextarea/alert-page-fortextarea';

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
  public leaveRequestDataList:Array<any>;
  public odRequestDataList:Array<any>;
  public ftpRequestDataList:Array<any>;

  constructor(public menu: MenuController, public events: Events, private camera: Camera, 
    private http: Http, private toast: ToastController, private network: Network, 
    public loadingCtrl: LoadingController, public platform: Platform, 
    public alertCtrl: AlertController, public statusBar: StatusBar, public navCtrl: NavController, 
    public navParams: NavParams, private ref: ChangeDetectorRef, public mainService: MyApp, 
    public service: ServiceProvider, public utilService: UtilsProvider, public modalCtrl: ModalController) { 
      this.leaveRequestDataList = [];
      this.odRequestDataList = [];
      this.ftpRequestDataList = [];
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

    confirmCancelLeave(status, requestItem, leaveType){
      var leaveTypevalue = "";
      switch (leaveType) {
        case 'CL':
          leaveTypevalue = "0001";
          break;
        case 'SL':
          leaveTypevalue = "0002";
          break;
        case 'PL':
          leaveTypevalue = "0003";
          break;
        case 'GL':
          leaveTypevalue = "0034";
          break;
        case 'OD':
          leaveTypevalue = "";
          break;
        case 'FTP':
          leaveTypevalue = "";
          break;
      }

      if(status == 'P'){
        var payloadData = {
          "IP_RNO": requestItem.REQID,
          "IP_LTYPE": leaveTypevalue,
          "IP_FLAG": 'C',
          "IP_CMNT": ""
        }
        this.applyCancelDeleteRequest(payloadData);
      }else if(status == 'A'){
        let deletionTextareaAlert = this.modalCtrl.create("AlertPageFortextareaPage");
        deletionTextareaAlert.present();
        deletionTextareaAlert.onDidDismiss((data) => {
          console.log(data);
          var payloadData = {
            "IP_RNO": requestItem.REQID,
            "IP_LTYPE": leaveTypevalue,
            "IP_FLAG": 'D',
            "IP_CMNT": data.deleteReason
          }
          this.applyCancelDeleteRequest(payloadData);
        });
      }
      
    }

    applyCancelDeleteRequest(payloadData){
      this.utilService.showLoader("Please wait..");

      console.log(payloadData);
    
    this.service.invokeAdapterCall('commonAdapterServices', 'applyCancelandDeleteRequest', 'post', {payload : true, length:4, payloadData: payloadData}).then((resultData:any)=>{
      if(resultData){
        if(resultData.status_code == 200){
          if(resultData.data.FLAG == "E"){
            this.utilService.dismissLoader();
            this.utilService.showCustomPopup4Error("My Request", resultData.data.REASON, "FAILURE");
          }else if(resultData.data.FLAG == "S"){
            const alert = this.alertCtrl.create({
              title: "",
              message: "<p class='header'>My Request</p> <p>"+resultData.data.REASON+"</p>",
              cssClass: "SUCCESS",
              enableBackdropDismiss: false,
            });
            alert.addButton({
              text: 'OK',
              handler: data => {
                this.navCtrl.setRoot("HomePage");
              }
            });
            this.utilService.dismissLoader();
            alert.present();
            
          }
        }else{
          this.utilService.dismissLoader();
          this.utilService.showCustomPopup4Error("My Request", resultData.message, "FAILURE");
        }
  
      };
    }, (error)=>{
      console.log("Data readed from jsonstore error",error);
      this.utilService.dismissLoader();
      this.utilService.showCustomPopup4Error("My Request", error.statusText, "FAILURE");
    });
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
    
    if(this.mainService.myRequestData.ET_LEAVE !== ""){
      if(this.mainService.myRequestData.ET_LEAVE.item.length === undefined){
        this.leaveRequestDataList.push(this.mainService.myRequestData.ET_LEAVE.item);
      }else{
        for(var i=0; i<this.mainService.myRequestData.ET_LEAVE.item.length; i++){
          this.leaveRequestDataList.push(this.mainService.myRequestData.ET_LEAVE.item[i]);
        }
      }
    }

    if(this.mainService.myRequestData.ET_OD !== ""){
      if(this.mainService.myRequestData.ET_OD.item.length === undefined){
        this.odRequestDataList.push(this.mainService.myRequestData.ET_OD.item);
      }else{
        for(var i=0; i<this.mainService.myRequestData.ET_OD.item.length; i++){
          this.odRequestDataList.push(this.mainService.myRequestData.ET_OD.item[i]);
        }
      }
    }

    if(this.mainService.myRequestData.ET_FTP !== ""){
      if(this.mainService.myRequestData.ET_FTP.item.length === undefined){
        this.ftpRequestDataList.push(this.mainService.myRequestData.ET_FTP.item);
      }else{
        for(var i=0; i<this.mainService.myRequestData.ET_FTP.item.length; i++){
          this.ftpRequestDataList.push(this.mainService.myRequestData.ET_FTP.item[i]);
        }
      }
    }
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

  getTimeDetails(timeData){
    console.log("getTimeDetails------->>"+timeData);
    if (timeData.toString().includes("@")){
      var result = timeData.toString().split("@");
      return result[0];
    }else{
      return timeData;
    }

    
  }

  getTimeDetailsChange(timeData){
    console.log("getTimeDetailsChange------->>"+timeData);
    if (timeData.toString().includes("@")){
      var result = timeData.toString().split("@");
      if(result[1] == "Y"){
        return 'Y';
      }
    }else{
      return 'N';
    }
  }

  getTimeValue(timeData){
    timeData = timeData.toString().replace(/:/g, "");
    return timeData;
  }

}
