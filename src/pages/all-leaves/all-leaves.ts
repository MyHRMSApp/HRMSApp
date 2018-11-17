import { Component, ChangeDetectorRef } from '@angular/core';
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
import { CommonStringsProvider } from '../../providers/common-strings/common-strings';

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
  userInformation: any;
  employeeLevel: any;
  KTEXT: any;
  public leaveData4SingleDate:any;

  constructor(public menu: MenuController, public events: Events, private camera: Camera, 
    private http: Http, private toast: ToastController, private network: Network, 
    public loadingCtrl: LoadingController, public platform: Platform, 
    public alertCtrl: AlertController, public statusBar: StatusBar, public navCtrl: NavController, 
    public navParams: NavParams, public storage:StorageProvider, public modalCtrl: ModalController,
    public utilService: UtilsProvider, public service: ServiceProvider, public mainService: MyApp,
    public ref: ChangeDetectorRef, public commonString: CommonStringsProvider) {

      this.userInformation = JSON.parse(localStorage.getItem(this.commonString.commonStrings.AllLeavesPage.USERINFO_TEXT));
      this.employeeLevel = this.userInformation.EP_EGROUP;
      console.log(this.employeeLevel);

    this.menu.swipeEnable(false);
    this.title = this.navParams.get(this.commonString.commonStrings.AllLeavesPage.TITLENAME_TEXT);
    // this.leaveFromDate = " ";
    // this.leaveToDate = " ";
    this.resonForLeave = "";
    this.leaveType = this.navParams.get(this.commonString.commonStrings.AllLeavesPage.LEAVETYPE_TEXT);
    this.userInfo = JSON.parse(localStorage.getItem(this.commonString.commonStrings.AllLeavesPage.USERINFO_TEXT));
    if(this.navParams.get(this.commonString.commonStrings.AllLeavesPage.LEAVEDATE_TEXT)) this.leaveData4SingleDate =  this.navParams.get(this.commonString.commonStrings.AllLeavesPage.LEAVEDATE_TEXT);
    
  }

  ionViewDidLoad() {
    this.hamburger = (this.commonString.commonStrings.AllLeavesPage.HAMBURGERICON_IMG);
    this.homeIcon = (this.commonString.commonStrings.AllLeavesPage.HOMEICON_IMG);
    
    if(this.leaveData4SingleDate.LDATE !== undefined && this.leaveData4SingleDate.cssClass !== undefined){
      this.leaveFromDate = moment(this.leaveData4SingleDate.LDATE).format(this.commonString.commonStrings.AllLeavesPage.DD_MM_YYYY);
    this.leaveToDate = moment(this.leaveData4SingleDate.LDATE).format(this.commonString.commonStrings.AllLeavesPage.DD_MM_YYYY);
    switch (this.leaveData4SingleDate.cssClass) {
      case this.commonString.commonStrings.AllLeavesPage.ATT1_Approved_ATT2_UA_TEXT:
        this.leaveFromTimeStr = this.commonString.commonStrings.AllLeavesPage.SECONDHALF_TEXT;
        this.leaveToTimeStr = this.commonString.commonStrings.AllLeavesPage.SECONDHALF_TEXT;
        this.leaveFromTime = this.commonString.commonStrings.AllLeavesPage.SH_TEXT;
        this.leaveToTime = this.commonString.commonStrings.AllLeavesPage.SH_TEXT;
        break;
      case this.commonString.commonStrings.AllLeavesPage.ATT1_Pending_ATT2_UA_TEXT:
        this.leaveFromTimeStr = this.commonString.commonStrings.AllLeavesPage.SECONDHALF_TEXT;
        this.leaveToTimeStr = this.commonString.commonStrings.AllLeavesPage.SECONDHALF_TEXT;
        this.leaveFromTime = this.commonString.commonStrings.AllLeavesPage.SH_TEXT;
        this.leaveToTime = this.commonString.commonStrings.AllLeavesPage.SH_TEXT;
        break;
      case this.commonString.commonStrings.AllLeavesPage.ATT1_Holliday_ATT2_UA_TEXT:
        this.leaveFromTimeStr = this.commonString.commonStrings.AllLeavesPage.SECONDHALF_TEXT;
        this.leaveToTimeStr = this.commonString.commonStrings.AllLeavesPage.SECONDHALF_TEXT;
        this.leaveFromTime = this.commonString.commonStrings.AllLeavesPage.SH_TEXT;
        this.leaveToTime = this.commonString.commonStrings.AllLeavesPage.SH_TEXT;
        break;
      case this.commonString.commonStrings.AllLeavesPage.ATT1_NormalPunch_ATT2_UA_TEXT:
        this.leaveFromTimeStr = this.commonString.commonStrings.AllLeavesPage.SECONDHALF_TEXT;
        this.leaveToTimeStr = this.commonString.commonStrings.AllLeavesPage.SECONDHALF_TEXT;
        this.leaveFromTime = this.commonString.commonStrings.AllLeavesPage.SH_TEXT;
        this.leaveToTime = this.commonString.commonStrings.AllLeavesPage.SH_TEXT;
        break;
      case this.commonString.commonStrings.AllLeavesPageATT1_NomalPunch_ATT2_UA_TEXT:
      this.leaveFromTimeStr = this.commonString.commonStrings.AllLeavesPage.SECONDHALF_TEXT;
      this.leaveToTimeStr = this.commonString.commonStrings.AllLeavesPage.SECONDHALF_TEXT;
      this.leaveFromTime = this.commonString.commonStrings.AllLeavesPage.SH_TEXT;
      this.leaveToTime = this.commonString.commonStrings.AllLeavesPage.SH_TEXT;
        break;
      case this.commonString.commonStrings.AllLeavesPageATT1_UA_ATT2_Holliday_TEXT:
        this.leaveFromTimeStr = this.commonString.commonStrings.AllLeavesPage.FIRSTHALF_TEXT;
        this.leaveToTimeStr = this.commonString.commonStrings.AllLeavesPage.FIRSTHALF_TEXT;
        this.leaveFromTime = this.commonString.commonStrings.AllLeavesPage.FH_TEXT;
        this.leaveToTime = this.commonString.commonStrings.AllLeavesPage.FH_TEXT;
        break;
      case this.commonString.commonStrings.AllLeavesPage.ATT1_UA_ATT2_NormalPunch_TEXT:
      this.leaveFromTimeStr = this.commonString.commonStrings.AllLeavesPage.FIRSTHALF_TEXT;
      this.leaveToTimeStr = this.commonString.commonStrings.AllLeavesPage.FIRSTHALF_TEXT;
      this.leaveFromTime = this.commonString.commonStrings.AllLeavesPage.FH_TEXT;
      this.leaveToTime = this.commonString.commonStrings.AllLeavesPage.FH_TEXT;
        break;
      case this.commonString.commonStrings.AllLeavesPage.ATT1_UA_ATT2_Approved_TEXT:
      this.leaveFromTimeStr = this.commonString.commonStrings.AllLeavesPage.FIRSTHALF_TEXT;
      this.leaveToTimeStr = this.commonString.commonStrings.AllLeavesPage.FIRSTHALF_TEXT;
      this.leaveFromTime = this.commonString.commonStrings.AllLeavesPage.FH_TEXT;
      this.leaveToTime = this.commonString.commonStrings.AllLeavesPage.FH_TEXT;
        break;
      case this.commonString.commonStrings.AllLeavesPage.ATT1_UA_ATT2_Pending_TEXT:
      this.leaveFromTimeStr = this.commonString.commonStrings.AllLeavesPage.FIRSTHALF_TEXT;
      this.leaveToTimeStr = this.commonString.commonStrings.AllLeavesPage.FIRSTHALF_TEXT;
      this.leaveFromTime = this.commonString.commonStrings.AllLeavesPage.FH_TEXT;
      this.leaveToTime = this.commonString.commonStrings.AllLeavesPage.FH_TEXT;
        break;
      default :
        this.leaveFromTimeStr = this.commonString.commonStrings.AllLeavesPage.FULLDAY_TEXT;
        this.leaveToTimeStr = this.commonString.commonStrings.AllLeavesPage.FULLDAY_TEXT;
        this.leaveFromTime = this.commonString.commonStrings.AllLeavesPage.FD_TEXT;
        this.leaveToTime = this.commonString.commonStrings.AllLeavesPage.FD_TEXT;
        break;
    }
      this.fromDateFlag = true;
      this.toDateFlag = true;
    }else{
      this.fromDateFlag = false;
      this.toDateFlag = false;
    }
    
  }

  openMenu() {
    this.menu.toggle();
  }
  back(){
    this.navCtrl.pop();
  }
  home() {
    this.navCtrl.setRoot(this.commonString.commonStrings.AllLeavesPage.HOMEPAGE_TEXT);
  }

  ionViewCanEnter(){
    this.allLeaveData = this.navParams.get(this.commonString.commonStrings.AllLeavesPage.USERLEAVE_TEXT);
    this.KTEXT = this.allLeaveData.KTEXT;
  }

  fromDateCalendar(){
      let myCalendar = this.modalCtrl.create(this.commonString.commonStrings.AllLeavesPage.CUSTOMCALENDAEMODELPAGE_TEXT, { "Cal": "from", selectedDate: this.leaveFromDate, quarterWiseSelectionFlag: (this.userInfo.EP_EGROUP == "E" && this.leaveType == "0001")?"true":"false" });
      myCalendar.present();
      myCalendar.onDidDismiss((data) => {
        console.log(data);
        if(data !== undefined && data.leaveFromDate !== undefined && data.leaveFromTime !== undefined){
          this.leaveFromDate = moment(data.leaveFromDate, this.commonString.commonStrings.AllLeavesPage.YYYY_MM_DD).format(this.commonString.commonStrings.AllLeavesPage.DD_MM_YYYY);
          this.leaveToDate = moment(data.leaveFromDate, this.commonString.commonStrings.AllLeavesPage.YYYY_MM_DD).format(this.commonString.commonStrings.AllLeavesPage.DD_MM_YYYY);
          this.leaveFromTime = data.leaveFromTime;
          this.leaveToTime = data.leaveFromTime;
          this.fromDateFlag = true;
          this.toDateFlag = true;
          switch (this.leaveFromTime) {
            case this.commonString.commonStrings.AllLeavesPage.FD_TEXT:
              this.leaveFromTimeStr = this.commonString.commonStrings.AllLeavesPage.FULLDAY_TEXT;
              this.leaveToTimeStr = this.commonString.commonStrings.AllLeavesPage.FULLDAY_TEXT;
              break;
            case this.commonString.commonStrings.AllLeavesPage.FH_TEXT:
              this.leaveFromTimeStr = this.commonString.commonStrings.AllLeavesPage.FIRSTHALF_TEXT;
              this.leaveToTimeStr = this.commonString.commonStrings.AllLeavesPage.FIRSTHALF_TEXT;
            break;
            case this.commonString.commonStrings.AllLeavesPage.SH_TEXT:
              this.leaveFromTimeStr = this.commonString.commonStrings.AllLeavesPage.SECONDHALF_TEXT;
              this.leaveToTimeStr = this.commonString.commonStrings.AllLeavesPage.SECONDHALF_TEXT;
            break;
            case this.commonString.commonStrings.AllLeavesPage.FQ_TEXT:
              this.leaveFromTimeStr = this.commonString.commonStrings.AllLeavesPage.FIRSTQUARTER_TEXT;
              this.leaveToTimeStr = this.commonString.commonStrings.AllLeavesPage.FIRSTQUARTER_TEXT;
              break;
            case this.commonString.commonStrings.AllLeavesPage.LQ_TEXT:
              this.leaveFromTimeStr = this.commonString.commonStrings.AllLeavesPage.SECQUARTER_TEXT;
              this.leaveToTimeStr = this.commonString.commonStrings.AllLeavesPage.SECQUARTER_TEXT;
              break;
          }
        }else if(this.leaveFromDate !== undefined){
          this.fromDateFlag = true;
        }else{
          this.fromDateFlag = false;
        }
        
      });
  }

  toDateCalendar(){
    if(this.leaveFromDate !== undefined && this.leaveFromTime !== undefined ){
      let myCalendar = this.modalCtrl.create(this.commonString.commonStrings.AllLeavesPage.CUSTOMCALENDAEMODELPAGE_TEXT, { "Cal": "to", selectedDate: this.leaveToDate, "leaveFromDate": this.leaveFromDate, "leaveFromTime": this.leaveFromTime, quarterWiseSelectionFlag: (this.userInfo.EP_EGROUP == "E" && this.leaveType == "0001")?"true":"false" });
      myCalendar.present();
      myCalendar.onDidDismiss((data) => {
        console.log(data);
        if(data !== undefined && data.leaveToDate !== undefined && data.leaveToTime !== undefined){
          this.leaveToDate = moment(data.leaveToDate).format(this.commonString.commonStrings.AllLeavesPage.DD_MM_YYYY);
          this.leaveToTime = data.leaveToTime;
          this.toDateFlag = true;
          switch (this.leaveToTime) {
            case this.commonString.commonStrings.AllLeavesPage.FD_TEXT:
              this.leaveToTimeStr = this.commonString.commonStrings.AllLeavesPage.FULLDAY_TEXT;
              break;
            case this.commonString.commonStrings.AllLeavesPage.FH_TEXT:
              this.leaveToTimeStr = this.commonString.commonStrings.AllLeavesPage.FIRSTHALF_TEXT;
            break;
            case this.commonString.commonStrings.AllLeavesPage.SH_TEXT:
              this.leaveToTimeStr = this.commonString.commonStrings.AllLeavesPage.SECONDHALF_TEXT;
            break;
            case this.commonString.commonStrings.AllLeavesPage.FQ_TEXT:
              this.leaveToTimeStr = this.commonString.commonStrings.AllLeavesPage.FIRSTQUARTER_TEXT;
              break;
            case this.commonString.commonStrings.AllLeavesPage.LQ_TEXT:
              this.leaveToTimeStr = this.commonString.commonStrings.AllLeavesPage.SECQUARTER_TEXT;
              break;
          }
        }else if(this.leaveToDate !== undefined){
          this.toDateFlag = true;
        }else{
          this.toDateFlag = false;
        }
      });
    }else{
      this.utilService.showCustomPopup4Error(this.title, this.commonString.commonStrings.AllLeavesPage.FROMDATEVALIDATE_TEXT, this.commonString.commonStrings.AllLeavesPage.FAILURE_TITLE_TEXT);
    }
    
  }

  calLeaveApplyValidation(){
    // if(this.mainService.internetConnectionCheck){
      if(this.leaveFromTime === undefined || this.leaveFromDate === undefined){
        this.utilService.showCustomPopup4Error(this.title, this.commonString.commonStrings.AllLeavesPage.FROMDATEANDPERIODVALIDATE_TEXT, this.commonString.commonStrings.AllLeavesPage.FAILURE_TITLE_TEXT);
      }else if(this.leaveToTime === undefined ||  this.leaveToDate === undefined){
        this.utilService.showCustomPopup4Error(this.title, this.commonString.commonStrings.AllLeavesPage.TODATEANDPERIODVALIDATE_TEXT, this.commonString.commonStrings.AllLeavesPage.FAILURE_TITLE_TEXT);
      }else if(this.resonForLeave === undefined || this.resonForLeave == ""){
        this.utilService.showCustomPopup4Error(this.commonString.commonStrings.AllLeavesPage.APPLYLEAVE_TEXT, this.commonString.commonStrings.AllLeavesPage.REASONVALIDATE_TEXT, this.commonString.commonStrings.AllLeavesPage.FAILURE_TITLE_TEXT);
      }else{
        this.utilService.showLoader(this.commonString.commonStrings.AllLeavesPage.PLEASEWAIT_TEXT);
        var leavetypeData = this.leaveType;
    if(this.leaveFromTime == this.commonString.commonStrings.AllLeavesPage.FQ_TEXT || this.leaveFromTime == this.commonString.commonStrings.AllLeavesPage.LQ_TEXT_TEXT || this.leaveToTime == this.commonString.commonStrings.AllLeavesPage.FQ_TEXT || this.leaveToTime == this.commonString.commonStrings.AllLeavesPage.LQ_TEXT){
      leavetypeData = "0011";
    }
    console.log(this.leaveFromDate+""+this.leaveToDate);
    var payloadData = {
      "IP_LTYP": leavetypeData,
      "IP_FDATE": moment(this.leaveFromDate, this.commonString.commonStrings.AllLeavesPage.DD_MM_YYYY).format(this.commonString.commonStrings.AllLeavesPage.YYYYMMDD),
      "IP_TDATE": moment(this.leaveToDate, this.commonString.commonStrings.AllLeavesPage.DD_MM_YYYY).format(this.commonString.commonStrings.AllLeavesPage.YYYYMMDD),
      "IP_FHALF": (this.leaveFromTime == this.commonString.commonStrings.AllLeavesPage.LQ_TEXT)? this.commonString.commonStrings.AllLeavesPage.SQ_TEXT: this.leaveFromTime,
      "IP_THALF": (this.leaveToTime == this.commonString.commonStrings.AllLeavesPage.LQ_TEXT)? this.commonString.commonStrings.AllLeavesPage.SQ_TEXT: this.leaveToTime
    };
      this.service.invokeAdapterCall(this.commonString.commonStrings.AllLeavesPage.COMMONADAPTERSERVICES_TEXT, this.commonString.commonStrings.AllLeavesPage.VALIDATELEAVEBALANCE_TEXT, 'post', {payload : true, length:5, payloadData: payloadData}).then((resultData:any)=>{
        if(resultData){
          if(resultData.status_code == 0){
            this.utilService.dismissLoader();
            console.log(JSON.stringify(resultData.data));
            if(resultData.data.ET_VBAL.FLAG == "S"){
              var tempLeaveFromTime, tempLeaveToTime = "";
              switch (this.leaveFromTime) {
                case this.commonString.commonStrings.AllLeavesPage.FD_TEXT:
                  tempLeaveFromTime = this.commonString.commonStrings.AllLeavesPage.FULLDAY_TEXT;
                  break;
                case this.commonString.commonStrings.AllLeavesPage.FH_TEXT:
                  tempLeaveFromTime = this.commonString.commonStrings.AllLeavesPage.FIRSTHALF_TEXT;
                  break;
                case this.commonString.commonStrings.AllLeavesPage.SH_TEXT:
                  tempLeaveFromTime = this.commonString.commonStrings.AllLeavesPage.SECONDHALF_TEXT;
                  break;
                case this.commonString.commonStrings.AllLeavesPage.FQ_TEXT:
                  tempLeaveFromTime = this.commonString.commonStrings.AllLeavesPage.FIRSTQUARTER_TEXT;
                  break;
                case this.commonString.commonStrings.AllLeavesPage.LQ_TEXT:
                  tempLeaveFromTime = this.commonString.commonStrings.AllLeavesPage.SECQUARTER_TEXT;
                  break;
              }
              switch (this.leaveToTime) {
                case this.commonString.commonStrings.AllLeavesPage.FD_TEXT:
                  tempLeaveToTime = this.commonString.commonStrings.AllLeavesPage.FULLDAY_TEXT;
                  break;
                case this.commonString.commonStrings.AllLeavesPage.FH_TEXT:
                  tempLeaveToTime = this.commonString.commonStrings.AllLeavesPage.FIRSTHALF_TEXT;
                  break;
                case this.commonString.commonStrings.AllLeavesPage.SH_TEXT:
                  tempLeaveToTime = this.commonString.commonStrings.AllLeavesPage.SECONDHALF_TEXT;
                  break;
                case this.commonString.commonStrings.AllLeavesPage.FQ_TEXT:
                  tempLeaveToTime = this.commonString.commonStrings.AllLeavesPage.FIRSTQUARTER_TEXT;
                  break;
                case this.commonString.commonStrings.AllLeavesPage.LQ_TEXT:
                  tempLeaveToTime = this.commonString.commonStrings.AllLeavesPage.SECQUARTER_TEXT;
                  break;
              }
              this.showCustomPopup4List(resultData.data.ET_VBAL.NO_DAY, this.leaveFromDate, this.leaveToDate, tempLeaveFromTime, tempLeaveToTime);
            }else if(resultData.data.ET_VBAL.FLAG == "E"){
              this.utilService.showCustomPopup4Error(this.title, resultData.data.ET_VBAL.REASON, this.commonString.commonStrings.AllLeavesPage.FAILURE_TITLE_TEXT);
            }
          }else{
            this.utilService.dismissLoader();
            this.utilService.showCustomPopup4Error(this.title, resultData.message, this.commonString.commonStrings.AllLeavesPage.FAILURE_TITLE_TEXT);
          }
    
        };
      }, (error)=> {
        console.log(error);
        this.utilService.dismissLoader();
        this.utilService.showCustomPopup4Error(this.title, "102: Oops! Something went wrong, Please try again", this.commonString.commonStrings.AllLeavesPage.FAILURE_TITLE_TEXT);
      });
      }
    
    // }else{
    //   this.utilService.showCustomPopup("FAILURE_TITLE_TEXT", "You are in offline, Please check you internet..");
    // }
    
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
       console.log("Apply clicked");
       var leavetypeData = this.leaveType;
    if(this.leaveFromTime == this.commonString.commonStrings.AllLeavesPage.FQ_TEXT || this.leaveFromTime == this.commonString.commonStrings.AllLeavesPage.LQ_TEXT || this.leaveToTime == this.commonString.commonStrings.AllLeavesPage.FQ_TEXT || this.leaveToTime == this.commonString.commonStrings.AllLeavesPage.LQ_TEXT){
      leavetypeData = "0011";
    }
       var payloadData = {
                          "IP_LTYP": leavetypeData,
                          "IP_FDATE": moment(leaveFromDate, this.commonString.commonStrings.AllLeavesPage.DD_MM_YYYY).format(this.commonString.commonStrings.AllLeavesPage.YYYYMMDD),
                          "IP_TDATE": moment(leaveToDate, this.commonString.commonStrings.AllLeavesPage.DD_MM_YYYY).format(this.commonString.commonStrings.AllLeavesPage.YYYYMMDD),
                          "IP_FHALF": (this.leaveFromTime == this.commonString.commonStrings.AllLeavesPage.LQ_TEXT)? this.commonString.commonStrings.AllLeavesPage.SQ_TEXT: this.leaveFromTime,
                          "IP_THALF": (this.leaveToTime == this.commonString.commonStrings.AllLeavesPage.LQ_TEXT)? this.commonString.commonStrings.AllLeavesPage.SQ_TEXT: this.leaveToTime,
                          "IP_DAY": noDays,
                          "R_LEAVE": this.resonForLeave,
                          "IP_REQ_TYPE": this.commonString.commonStrings.AllLeavesPage.NEW,
                          "IP_WF_STATUS": this.commonString.commonStrings.AllLeavesPage.SUBMITTED_TEXT
                        }
      // if(this.mainService.internetConnectionCheck){
        this.utilService.showLoader("Please wait...");
        this.service.invokeAdapterCall(this.commonString.commonStrings.AllLeavesPage.COMMONADAPTERSERVICES_TEXT, this.commonString.commonStrings.AllLeavesPage.EMPLOYEEAPPLYLEAVE_TEXT, 'post', {payload : true, length:9, payloadData: payloadData}).then((resultData:any)=>{
          if(resultData){
              console.log(JSON.stringify(resultData.data));
              if(resultData.status_code == 0){
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
                     this.navCtrl.setRoot(this.commonString.commonStrings.AllLeavesPage.HOMEPAGE_TEXT);
                   }
                 });
                 alert.present();
               }else if(resultData.data.EP_REASON.TYPE == "E"){
                 this.utilService.showCustomPopup4Error(this.title, resultData.data.EP_REASON.MESSAGE, this.commonString.commonStrings.AllLeavesPage.FAILURE_TITLE_TEXT);
               }
             }else{
               this.utilService.dismissLoader();
               this.utilService.showCustomPopup4Error(this.title, resultData.message, this.commonString.commonStrings.AllLeavesPage.FAILURE_TITLE_TEXT);
             }
          }
        }, (error)=>{
          console.log(error);
          this.utilService.dismissLoader();
          this.utilService.showCustomPopup4Error(this.title, "102: Oops! Something went wrong, Please try again", this.commonString.commonStrings.AllLeavesPage.FAILURE_TITLE_TEXT)
        });
      // }else{
      //   this.utilService.showCustomPopup("FAILURE_TITLE_TEXT", "You are in offline, Please check you internet..");
      // }
      }
    });

    alert.present();
  }

}
