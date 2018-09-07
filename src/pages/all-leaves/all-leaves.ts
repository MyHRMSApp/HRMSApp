import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Nav, Platform, MenuController, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { Network } from '@ionic-native/network';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Http, Headers, RequestOptions } from '@angular/http';
import { StorageProvider } from '../../providers/storage/storage';
import { CalendarModal, CalendarModalOptions, DayConfig, CalendarResult } from "ion2-calendar";
import { ModalController } from 'ionic-angular';
import { UtilsProvider } from '../../providers/utils/utils';
import { ServiceProvider } from '../../providers/service/service';
import moment from 'moment';
import { MyApp } from '../../app/app.component';

@IonicPage()
@Component({
  selector: 'page-all-leaves',
  templateUrl: 'all-leaves.html',
})
export class AllLeavesPage {
  public hamburger: string;
  public homeIcon: string;
  public allLeaveData:any;
  public leaveFromDate:any;
  public leaveToDate:any;
  public leaveFromTime:any;
  public leaveToTime:any;
  public leaveFromTimeStr:any;
  public leaveToTimeStr:any;
  public leaveType:any;
  public title: any;
  public resonForLeave: any;
  public userInfo:any;
  public fromDateFlag:boolean = false;
  public toDateFlag:boolean = false;

  constructor(public menu: MenuController, public events: Events, private camera: Camera, 
    private http: Http, private toast: ToastController, private network: Network, 
    public loadingCtrl: LoadingController, public platform: Platform, 
    public alertCtrl: AlertController, public statusBar: StatusBar, public navCtrl: NavController, 
    public navParams: NavParams, public storage:StorageProvider, public modalCtrl: ModalController,
    public utilService: UtilsProvider, public service: ServiceProvider, public mainService: MyApp) {

    this.title = this.navParams.get("titleName");
    this.leaveFromDate = " ";
    this.leaveToDate = " ";
    this.resonForLeave = "";
    this.leaveType = this.navParams.get("leaveType");
    this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
  }

  ionViewDidLoad() {
    this.hamburger = ("./assets/homePageIcons/hamburger.svg");
    this.homeIcon = ("./assets/homePageIcons/Home.svg");
    console.log('ionViewDidLoad AllLeavesPage');
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

  ionViewCanEnter(){
    this.allLeaveData = this.navParams.get("userLeave");
  }

  fromDateCalendar(){
      let myCalendar = this.modalCtrl.create("CustomCalendarModelPage", { "Cal": "from", quarterWiseSelectionFlag: (this.userInfo.EP_EGROUP = "E" && this.leaveType == "0001")?"true":"false" });
      myCalendar.present();
      myCalendar.onDidDismiss((data) => {
        console.log(data);
        if(data !== undefined && data.leaveFromDate !== undefined && data.leaveFromTime !== undefined){
          this.leaveFromDate = data.leaveFromDate;
          this.leaveFromTime = data.leaveFromTime;
          this.fromDateFlag = true;
          switch (this.leaveFromTime) {
            case "FD":
              this.leaveFromTimeStr = "full day";
              break;
            case "FH":
              this.leaveFromTimeStr = "1st half";
            break;
            case "SH":
              this.leaveFromTimeStr = "2nd half";
            break;
            case "FQ":
              this.leaveFromTimeStr = "1st Quarter";
              break;
            case "LQ":
              this.leaveFromTimeStr = "2nd Quarter";
              break;
          }
        }else{
          this.fromDateFlag = false;
        }
        
      });
  }

  toDateCalendar(){
    if(this.leaveFromDate !== undefined && this.leaveFromTime !== undefined ){
      let myCalendar = this.modalCtrl.create("CustomCalendarModelPage", { "Cal": "to", "leaveFromDate": this.leaveFromDate, "leaveFromTime": this.leaveFromTime, quarterWiseSelectionFlag: (this.userInfo.EP_EGROUP = "E" && this.leaveType == "0001")?"true":"false" });
      myCalendar.present();
      myCalendar.onDidDismiss((data) => {
        console.log(data);
        if(data !== undefined && data.leaveToDate !== undefined && data.leaveToTime !== undefined){
          this.leaveToDate = data.leaveToDate;
          this.leaveToTime = data.leaveToTime;
          this.toDateFlag = true;
          switch (this.leaveToTime) {
            case "FD":
              this.leaveToTimeStr = "full day";
              break;
            case "FH":
              this.leaveToTimeStr = "1st half";
            break;
            case "SH":
              this.leaveToTimeStr = "2nd half";
            break;
            case "FQ":
              this.leaveToTimeStr = "1st Quarter";
              break;
            case "LQ":
              this.leaveToTimeStr = "2nd Quarter";
              break;
          }
        }else{this.toDateFlag = false;}
      });
    }else{
      this.utilService.showCustomPopup4Error(this.title, "Please select From Date..", "FAILURE");
    }
    
  }

  calLeaveApplyValidation(){
    this.utilService.showLoader("Please wait..");
    var leavetypeData = this.leaveType;
    if(this.leaveFromTime == "FQ" || this.leaveFromTime == "LQ" || this.leaveToTime == "FQ" || this.leaveToTime == "LQ"){
      leavetypeData = "0011";
    }
    var payloadData = {
      "IP_LTYP": leavetypeData,
      "IP_FDATE": moment(this.leaveFromDate).format("YYYYMMDD"),
      "IP_TDATE": moment(this.leaveToDate).format("YYYYMMDD"),
      "IP_FHALF": this.leaveFromTime,
      "IP_THALF": this.leaveToTime
    };
    this.service.invokeAdapterCall('commonAdapterServices', 'validateLeaveBalance', 'post', {payload : true, length:5, payloadData: payloadData}).then((resultData:any)=>{
      if(resultData){
        if(resultData.status_code == 200){
          this.utilService.dismissLoader();
          console.log(JSON.stringify(resultData.data));
          if(resultData.data.ET_VBAL.FLAG == "S"){
            var tempLeaveFromTime, tempLeaveToTime = "";
            switch (this.leaveFromTime) {
              case "FD":
                tempLeaveFromTime = "full day";
                break;
              case "FH":
                tempLeaveFromTime = "first half";
                break;
              case "SH":
                tempLeaveFromTime = "secont half";
                break;
              case "FQ":
                tempLeaveFromTime = "first quarter";
                break;
              case "LQ":
                tempLeaveFromTime = "last quarter";
                break;
            }
            switch (this.leaveToTime) {
              case "FD":
                tempLeaveToTime = "full day";
                break;
              case "FH":
                tempLeaveToTime = "first half";
                break;
              case "SH":
                tempLeaveToTime = "secont half";
                break;
              case "FQ":
                tempLeaveToTime = "first quarter";
                break;
              case "LQ":
                tempLeaveToTime = "last quarter";
                break;
            }
            this.showCustomPopup4List(resultData.data.ET_VBAL.NO_DAY, this.leaveFromDate, this.leaveToDate, tempLeaveFromTime, tempLeaveToTime);
          }else if(resultData.data.ET_VBAL.FLAG == "E"){
            this.utilService.showCustomPopup4Error(this.title, resultData.data.ET_VBAL.REASON, "FAILURE");
          }
        }else{
          this.utilService.dismissLoader();
          this.utilService.showCustomPopup4Error(this.title, resultData.message, "FAILURE");
        }
  
      };
    }, (error)=> {
      console.log("Data readed from jsonstore error", error);
      this.utilService.dismissLoader();
      this.utilService.showCustomPopup4Error(this.title, error, "FAILURE");
    });
  }

  showCustomPopup4List(noDays, leaveFromDate, leaveToDate, LeaveFromTime, LeaveToTime){

    let message = "<div class='list-group'><div class='listData'><div class='contentLeft'>FROM</div> <div class='contentRight'><b>"+leaveFromDate+" -</b> "+LeaveFromTime+"</div></div>"+
                  "<div class='listData'><div class='contentLeft'>TO</div> <div class='contentRight'><b>"+leaveToDate+" -</b> "+LeaveToTime+"</div></div>"+
                  "<div class='listData'><div class='contentLeft'>NO OF DAYS</div> <div class='contentRight'><b>"+noDays+" days</b></div></div></div>";
    const alert = this.alertCtrl.create({
      title: this.title,
      message: message,
      cssClass: "SHOWALERT",
      enableBackdropDismiss: false
    });

    alert.addButton('CANCEL');
    alert.addButton({
      text: 'APPLY',
      handler: data => {
       console.log("Apply clicked..!!");
       this.utilService.showLoader("Please wait..");
       var payloadData = {
                          "IP_LTYP": this.leaveType,
                          "IP_FDATE": moment(leaveFromDate).format("YYYYMMDD"),
                          "IP_TDATE": moment(leaveToDate).format("YYYYMMDD"),
                          "IP_FHALF": this.leaveFromTime,
                          "IP_THALF": this.leaveToTime,
                          "IP_DAY": noDays,
                          "R_LEAVE": this.resonForLeave,
                          "IP_REQ_TYPE": "NEW",
                          "IP_WF_STATUS": "Submitted"
                        }
       this.service.invokeAdapterCall('commonAdapterServices', 'employeeApplyLeave', 'post', {payload : true, length:9, payloadData: payloadData}).then((resultData:any)=>{
         if(resultData){
             console.log(JSON.stringify(resultData.data));
             if(resultData.status_code == 200){
              this.utilService.dismissLoader();
              console.log(JSON.stringify(resultData.data));
              if(resultData.data.EP_REASON.TYPE == "S"){
                const alert = this.alertCtrl.create({
                  title: "",
                  message: "<p class='header'>"+this.title+" !</p> <p>"+resultData.data.EP_REASON.MESSAGE+"</p>",
                  cssClass: "SUCCESS",
                  enableBackdropDismiss: false,
                });
                alert.addButton({
                  text: 'OK',
                  handler: data => {
                    this.mainService.attendanceN_NP1_DataFlag = true;
                    this.mainService.attendanceNP2_DataFlag = true;
                    this.mainService.attendanceNA1_DataFlag = true;
                    this.mainService.attendanceNA2_DataFlag = true;
                    this.mainService.attendanceCallFlag = true;
                    this.navCtrl.setRoot("HomePage");
                  }
                });
                alert.present();
              }else if(resultData.data.EP_REASON.TYPE == "E"){
                this.utilService.showCustomPopup4Error(this.title, resultData.data.EP_REASON.MESSAGE, "FAILURE");
              }
            }else{
              this.utilService.dismissLoader();
              this.utilService.showCustomPopup4Error(this.title, resultData.message, "FAILURE");
            }
         }
       }, (error)=>{
         console.log("Data readed from jsonstore error",error);
         this.utilService.dismissLoader();
         this.utilService.showCustomPopup4Error(this.title, error, "FAILURE")
       });
      }
    });

    alert.present();
  }

}
