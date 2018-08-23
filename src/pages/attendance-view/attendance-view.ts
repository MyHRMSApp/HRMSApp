import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Nav, Platform, MenuController, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { Network } from '@ionic-native/network';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Http, Headers, RequestOptions } from '@angular/http';
import { StorageProvider } from '../../providers/storage/storage';
import { CalendarComponentOptions } from 'ion2-calendar';
import { MyApp } from '../../app/app.component';
import moment from 'moment';
import { UtilsProvider } from '../../providers/utils/utils';
import { ServiceProvider } from '../../providers/service/service';

@IonicPage()
@Component({
  selector: 'page-attendance-view',
  templateUrl: 'attendance-view.html',
})
export class AttendanceViewPage {
  public calenderVIew:boolean = false;
 
  public optionsRange:any;
  public dateRange:any;
  public showingDate:any;
  public showingMonth:any;
  public totalHoursWorked:any;
  public punchIN:any;
  public punchOUT:any;
  public midIN:any;
  public midOUT:any;
  public firstHalfStatus:any;
  public secHalfStatus:any;
  public currentDate:any = "30";
  public currentMonth:any = "JUL";
  public currentCssClass:any;
  public requests_ATT_1:any;
  public requests_ATT_2:any;
  public calStartDate:any;
  public calEndDate:any;
  public homeIcon: string;
  public hamburger: string;
  public attendanceSingleDayData:any;
  

  // dateRange: string[] = ['2018-07-021', '2018-01-02', '2018-01-05'];

  constructor(public menu: MenuController, public events: Events, private camera: Camera, 
    private http: Http, private toast: ToastController, private network: Network, 
    public loadingCtrl: LoadingController, public platform: Platform, 
    public alertCtrl: AlertController, public statusBar: StatusBar, public navCtrl: NavController, 
    public navParams: NavParams, public storage:StorageProvider, public mainService: MyApp, 
    public utilService: UtilsProvider, public service: ServiceProvider) {
  }
  
  /**
  *Method for Menu Toggle
  */
 openMenu() {
    this.menu.toggle();
  }

  /**
  *Method for pushing 
  */
  home() {
    this.navCtrl.setRoot("HomePage");
  }

  ionViewDidLoad() {
    this.hamburger = ("./assets/homePageIcons/hamburger.svg");
    this.homeIcon = ("./assets/homePageIcons/Home.svg");
    console.log('ionViewDidLoad AttendanceViewPage');
  }

  onChange($event) {
    console.log(moment($event._d).format("YYYY-MM-DD"));
    var currentDayData = this.mainService.attanancePageData.find(x=>x.LDATE == moment($event._d).format("YYYY-MM-DD"));
    if(currentDayData){
      this.currentDate = moment(currentDayData.LDATE).format("DD").toString();
      this.currentMonth = moment(currentDayData.LDATE).format("MMM").toString();
      this.punchIN = currentDayData.PUN_P10;
      this.punchOUT = currentDayData.PUN_P20;
      this.midIN = currentDayData.PUN_P25;
      this.midOUT = currentDayData.PUN_P15;
      this.currentCssClass = "Cur_"+currentDayData.cssClass;
      this.totalHoursWorked = currentDayData.ATT;
      this.requests_ATT_1 = (currentDayData.RS_ATT1)?currentDayData.RS_ATT1:null;
      this.requests_ATT_2 = (currentDayData.RS_ATT2)?currentDayData.RS_ATT2:null;
      console.log(currentDayData);
      this.attendanceSingleDayData = currentDayData;
    }else{
      this.currentDate = moment().format("DD").toString();
      this.currentMonth = moment().format("MMM").toString();
      this.punchIN = "00:00:00";
      this.punchOUT = "00:00:00";
      this.midIN = "00:00:00";
      this.midOUT = "00:00:00";
      this.currentCssClass = "Cur_ATT1_NomalPunch_ATT2_NormalPunch";
      this.totalHoursWorked = "0";
      this.requests_ATT_1 = null;
      this.requests_ATT_2 = null;
    }
    
  }

  monthChange(){
    var elements:any = document.getElementsByClassName("switch-btn");
    setTimeout(() => {
      var value = moment(elements[0].innerText, "MMM YYYY").format("MMYYYY").toString();
      var monthDifferCheck = moment().diff(moment(value, "MMYYYY"), 'months', true);
      if(monthDifferCheck >= 0 && monthDifferCheck < 1){
        console.log("monthDifferCheck-->> "+"Current Month");
        this.loadCalendarForCurrentPriviousMonths();
      }else if(monthDifferCheck < 0 && monthDifferCheck > -1){
        console.log("monthDifferCheck-->> "+"Next Month");
        this.loadCalendarForNextMonth();
      }else if(monthDifferCheck < -1 && monthDifferCheck > -2){
        console.log("monthDifferCheck-->> "+"Next after Month");
        this.loadCalendarForNextAfterMonth();
      }else if(monthDifferCheck >= 1 && monthDifferCheck < 2){
        console.log("monthDifferCheck-->> "+"Privious Month");
        this.loadCalendarForPriviousMonths();
      }else if(monthDifferCheck >= 2 && monthDifferCheck < 3){
        console.log("monthDifferCheck-->> "+"Privious before Month");
        this.loadCalendarForPriviousBeforeMonth();
      }
    }, 1000);
    
  }


  loadCalendarView(){
    console.log('ionViewCanEnter HomePage');
    var date = new Date(), y = date.getFullYear(), m = date.getMonth();

    var firstDay = new Date(y, m - 2, 1);
    var lastDay = new Date(y, m + 3, 0);

    this.calStartDate = moment(firstDay).format("YYYY, MM, DD").toString();
    this.calEndDate = moment(lastDay).format("YYYY, MM, DD").toString();

    console.log(this.mainService.attanancePageData.length);
    var jsonArr = [];
    for (var i = 0; i < this.mainService.attanancePageData.length; i++) {
      console.log(moment().format("YYYY-MM-DD").toString()+"=="+this.mainService.attanancePageData[i].LDATE.toString());
      if(this.mainService.attanancePageData[i].LDATE.toString() == moment().format("YYYY-MM-DD").toString()){
        this.currentDate = moment().format("DD").toString();
        this.currentMonth = moment().format("MMM").toString();
        this.punchIN = this.mainService.attanancePageData[i].PUN_P10;
        this.punchOUT = this.mainService.attanancePageData[i].PUN_P20;
        this.midIN = this.mainService.attanancePageData[i].PUN_P25;
        this.midOUT = this.mainService.attanancePageData[i].PUN_P15;
        this.currentCssClass = "Cur_"+this.mainService.attanancePageData[i].cssClass;
        this.totalHoursWorked = this.mainService.attanancePageData[i].ATT;
        this.requests_ATT_1 = (this.mainService.attanancePageData[i].RS_ATT1)?this.mainService.attanancePageData[i].RS_ATT1:null;
        this.requests_ATT_2 = (this.mainService.attanancePageData[i].RS_ATT2)?this.mainService.attanancePageData[i].RS_ATT2:null;
      }
      jsonArr.push({
        date: this.mainService.attanancePageData[i].LDATE,
        cssClass: (moment().format("YYYY-MM-DD").toString() == this.mainService.attanancePageData[i].LDATE.toString())?this.mainService.attanancePageData[i].cssClass+" todayClass":this.mainService.attanancePageData[i].cssClass,
        subTitle: (moment().format("YYYY-MM-DD").toString() == this.mainService.attanancePageData[i].LDATE.toString())?"Today":""
      });
  }

  console.log(jsonArr);
    var tempoptionsRange : CalendarComponentOptions = {
      color : 'danger',
      from: this.calStartDate,
      to: this.calEndDate,
      daysConfig: jsonArr,
      showMonthPicker: false,
      weekStart: 1
    };

    setTimeout(() => {
      this.optionsRange = tempoptionsRange;
      this.calenderVIew = true;
      this.utilService.dismissLoader();
    }, 100);
  }
  

  applyLeave() {
    
    try {
      this.utilService.showLoader("Please wait..");
      this.service.invokeAdapterCall('commonAdapterServices', 'getLeaveBalance', 'get', {payload : false}).then((resultData:any)=>{
        if(resultData){
          if(resultData.status_code == 200){
            this.mainService.userLeaveBalanceListData = resultData.data;
            console.log(JSON.stringify(this.mainService.userLeaveBalanceListData));
            this.utilService.dismissLoader();
            this.navCtrl.push("ApplyLeavePage");
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
      
    } catch (error) {
      console.log("catch-->>",error);
    }
  }
  applyOD(){
    this.navCtrl.push("ApplyOdPage");
  }
  applyFTP(){
    this.navCtrl.push("ApplyFtpPage",{"ftpData": this.attendanceSingleDayData});
  }

  loadCalendarForNextMonth(){
    this.utilService.showLoader("Please Wait..");
    this.calenderVIew = false;
    if(this.mainService.attendanceNA1_DataFlag){
      var payloadData = {
        "IP_SMONTH": 1,
        "IP_EMONTH": 1
      }
      this.service.invokeAdapterCall('commonAdapterServices', 'getEmployeeAttendanceData', 'post', {payload : true, length:2, payloadData: payloadData}).then((resultData:any)=>{
        if(resultData){
          if(resultData.status_code == 200){
            this.mainService.attanancePageData = resultData.data;
            this.mainService.attendanceNA1_Data = resultData.data;
            this.mainService.attendanceNA1_DataFlag = false;
            this.dateRange = moment(moment().format("YYYY-MM-DD")).add(1, 'M')
            console.log(JSON.stringify(this.mainService.attanancePageData));
            this.loadCalendarView();
          }else{
            this.calenderVIew = true;
            this.mainService.attendanceNA1_DataFlag = true;
            this.utilService.dismissLoader();
            this.utilService.showPopup("Attendance", resultData.message);
          }
    
        };
      }, (error)=>{
        console.log("Data readed from jsonstore error",error);
        this.utilService.dismissLoader();
        this.utilService.showPopup("Attendance",error.statusText);
      });
    }else{
      this.mainService.attanancePageData = this.mainService.attendanceNA1_Data;
      this.dateRange = moment(moment().format("YYYY-MM-DD")).add(1, 'M')
      console.log(JSON.stringify(this.mainService.attanancePageData));
      this.loadCalendarView();
    }
  }

  loadCalendarForNextAfterMonth(){
    this.utilService.showLoader("Please Wait..");
    this.calenderVIew = false;
    if(this.mainService.attendanceNA2_DataFlag){
      var payloadData = {
        "IP_SMONTH": 2,
        "IP_EMONTH": 2
      }
      this.service.invokeAdapterCall('commonAdapterServices', 'getEmployeeAttendanceData', 'post', {payload : true, length:2, payloadData: payloadData}).then((resultData:any)=>{
        if(resultData){
          if(resultData.status_code == 200){
            this.mainService.attanancePageData = resultData.data;
            this.mainService.attendanceNA2_Data = resultData.data;
            this.mainService.attendanceNA2_DataFlag = false;
            this.dateRange = moment(moment().format("YYYY-MM-DD")).add(2, 'M');
            console.log(JSON.stringify(this.mainService.attanancePageData));
            this.loadCalendarView();
          }else{
            this.calenderVIew = true;
            this.mainService.attendanceNA2_DataFlag = true;
            this.utilService.dismissLoader();
            this.utilService.showPopup("Attendance", resultData.message);
          }
    
        };
      }, (error)=>{
        console.log("Data readed from jsonstore error",error);
        this.utilService.dismissLoader();
        this.utilService.showPopup("Attendance",error.statusText);
      });
    }else{
      this.mainService.attanancePageData = this.mainService.attendanceNA2_Data;
      this.dateRange = moment(moment().format("YYYY-MM-DD")).add(2, 'M');
      console.log(JSON.stringify(this.mainService.attanancePageData));
      this.loadCalendarView();
    }
  }

  loadCalendarForCurrentPriviousMonths(){
    
    this.utilService.showLoader("Please Wait..");
    this.calenderVIew = false;
    if(this.mainService.attendanceN_NP1_DataFlag){
      var payloadData = {
        "IP_SMONTH": -1,
        "IP_EMONTH": 0
      }
      this.service.invokeAdapterCall('commonAdapterServices', 'getEmployeeAttendanceData', 'post', {payload : true, length:2, payloadData: payloadData}).then((resultData:any)=>{
        if(resultData){
          if(resultData.status_code == 200){
            this.mainService.attanancePageData = resultData.data;
            this.mainService.attendanceN_NP1_Data = resultData.data;
            this.mainService.attendanceN_NP1_DataFlag = false;
            this.dateRange = moment().format("YYYY-MM-DD");
            console.log(JSON.stringify(this.mainService.attanancePageData));
            this.loadCalendarView();
          }else{
            this.calenderVIew = true;
            this.mainService.attendanceN_NP1_DataFlag = true;
            this.utilService.dismissLoader();
            this.utilService.showPopup("Attendance", resultData.message);
          }
    
        };
      }, (error)=>{
        console.log("Data readed from jsonstore error",error);
        this.utilService.dismissLoader();
        this.utilService.showPopup("Attendance",error.statusText);
      });
    }else{
      console.log(JSON.stringify(this.mainService.attendanceN_NP1_Data));
      this.mainService.attanancePageData = this.mainService.attendanceN_NP1_Data;
      this.dateRange = moment().format("YYYY-MM-DD");
      console.log(JSON.stringify(this.mainService.attanancePageData));
      this.loadCalendarView();
    }

  }

  loadCalendarForPriviousBeforeMonth(){
    this.utilService.showLoader("Please Wait..");
    this.calenderVIew = false;
    if(this.mainService.attendanceNP2_DataFlag){
      var payloadData = {
        "IP_SMONTH": -2,
        "IP_EMONTH": -2
      }
      this.service.invokeAdapterCall('commonAdapterServices', 'getEmployeeAttendanceData', 'post', {payload : true, length:2, payloadData: payloadData}).then((resultData:any)=>{
        if(resultData){
          if(resultData.status_code == 200){
            this.mainService.attanancePageData = resultData.data;
            this.mainService.attendanceNP2_Data = resultData.data;
            this.mainService.attendanceNP2_DataFlag = false;
            this.dateRange = moment(moment().format("YYYY-MM-DD")).add(-2, 'M');
            console.log(JSON.stringify(this.mainService.attanancePageData));
            this.loadCalendarView();
          }else{
            this.calenderVIew = true;
            this.mainService.attendanceNP2_DataFlag = true;
            this.utilService.dismissLoader();
            this.utilService.showPopup("Attendance", resultData.message);
          }
    
        };
      }, (error)=>{
        console.log("Data readed from jsonstore error",error);
        this.utilService.dismissLoader();
        this.utilService.showPopup("Attendance",error.statusText);
      });
    }else{
      this.mainService.attanancePageData = this.mainService.attendanceNP2_Data;
      this.dateRange = moment(moment().format("YYYY-MM-DD")).add(-2, 'M');
      console.log(JSON.stringify(this.mainService.attanancePageData));
      this.loadCalendarView();
    }
  }

  loadCalendarForPriviousMonths(){
      console.log(JSON.stringify(this.mainService.attendanceN_NP1_Data));
      this.mainService.attanancePageData = this.mainService.attendanceN_NP1_Data;
      this.dateRange = moment(moment().format("YYYY-MM-DD")).add(-1, 'M');
      console.log(JSON.stringify(this.mainService.attanancePageData));
      this.loadCalendarView();
  }

  ionViewCanEnter() {
    this.loadCalendarView();
  }
  
}
