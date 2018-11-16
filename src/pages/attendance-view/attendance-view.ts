import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams, BlockerOptions } from 'ionic-angular';
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
import { CommonStringsProvider } from '../../providers/common-strings/common-strings';
declare var angular: any;

@IonicPage()
@Component({
  selector: 'page-attendance-view',
  templateUrl: 'attendance-view.html',
})
export class AttendanceViewPage {
  public calenderVIew: boolean = false;

  public optionsRange: any;
  public dateRange: any;
  public showingDate: any;
  public showingMonth: any;
  public totalHoursWorked: any;
  public punchIN: any;
  public punchOUT: any;
  public midIN: any;
  public midOUT: any;
  public firstHalfStatus: any;
  public secHalfStatus: any;
  public currentDate: any = "30";
  public currentMonth: any = "JUL";
  public currentCssClass: any;
  public requests_ATT_1: any;
  public requests_ATT_2: any;
  public calStartDate: any;
  public calEndDate: any;
  public homeIcon: string;
  public hamburger: string;
  public attendanceSingleDayData: any;
  employeeLevel: string;
  userInformation: any;
  public allLeaveApplyFlag: boolean = false;

  constructor(public menu: MenuController, public events: Events, private camera: Camera,
    private http: Http, private toast: ToastController, private network: Network,
    public loadingCtrl: LoadingController, public platform: Platform,
    public alertCtrl: AlertController, public statusBar: StatusBar, public navCtrl: NavController,
    public navParams: NavParams, public storage: StorageProvider, public mainService: MyApp,
    public utilService: UtilsProvider, public service: ServiceProvider,
    public commonString: CommonStringsProvider) {

    this.userInformation = JSON.parse(localStorage.getItem("userInfo"));
    this.employeeLevel = this.userInformation.EP_EGROUP;
    console.log(this.employeeLevel);

    this.menu.swipeEnable(false);
  }

  openMenu() {
    this.menu.toggle();
  }

  home() {
    this.navCtrl.setRoot(this.commonString.commonStrings.AttendanceViewPage.HOMEPAGE_NAV);
  }

  ionViewDidLoad() {
    this.hamburger = (this.commonString.commonStrings.AttendanceViewPage.HAMBURGERICON_IMG);
    this.homeIcon = (this.commonString.commonStrings.AttendanceViewPage.HOMEICON_IMG);
  }

  onChange($event) {
    var elements: any = document.getElementById("attendancePage").querySelectorAll(".switch-btn");
    var currentMonth = moment(elements[0].innerText, "MMM YYYY").format("MMYYYY").toString();
    var selectedMonth = moment($event._d).format("MMYYYY").toString();

    if (currentMonth == selectedMonth) {
      console.log(moment($event._d).format("YYYY-MM-DD"));
      var currentDayData = this.mainService.attanancePageData.find(x => x.LDATE == moment($event._d).format("YYYY-MM-DD"));
      this.mainService.selectedDateDataFromAttendance = currentDayData;
      if (currentDayData) {
        this.currentDate = moment(currentDayData.LDATE).format("DD").toString();
        this.currentMonth = moment(currentDayData.LDATE).format("MMM").toString();
        this.punchIN = currentDayData.PUN_P10;
        this.punchOUT = currentDayData.PUN_P20;
        this.midIN = currentDayData.PUN_P25;
        this.midOUT = currentDayData.PUN_P15;
        this.currentCssClass = "Cur_" + currentDayData.cssClass;
        this.totalHoursWorked = currentDayData.ATT;
        this.requests_ATT_1 = (currentDayData.RS_ATT1) ? currentDayData.RS_ATT1 : null;
        this.requests_ATT_2 = (currentDayData.RS_ATT2) ? currentDayData.RS_ATT2 : null;
        console.log(currentDayData);
        this.attendanceSingleDayData = currentDayData;
      } else {
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
        this.mainService.selectedDateDataFromAttendance.LDATE = moment($event._d).format("DD-MM-YYYY");
        this.mainService.selectedDateDataFromAttendance.cssClass = "custom";
      }

      var value = moment($event._d).format("MMYYYY").toString();
      var selectedDateOnly: any = moment($event._d).format("DD");
      var CurrentDateOnly: any = moment().format("DD");
      var monthDifferCheck = moment().diff(moment(value, "MMYYYY"), 'months', true);
      if (monthDifferCheck >= 0 && monthDifferCheck < 1) {
        this.allLeaveApplyFlag = true;
      } else if (monthDifferCheck < 0 && monthDifferCheck > -1) {
        this.allLeaveApplyFlag = true;
      } else if (monthDifferCheck < -1 && monthDifferCheck > -2) {
        this.allLeaveApplyFlag = true;
      } else if (monthDifferCheck >= 1 && monthDifferCheck < 2) {
        if (CurrentDateOnly >= 15 && selectedDateOnly >= 15) {
          this.allLeaveApplyFlag = true;
        } else if (CurrentDateOnly <= 14) {
          this.allLeaveApplyFlag = true;
        } else {
          this.allLeaveApplyFlag = false;
        }
      } else if (monthDifferCheck >= 2 && monthDifferCheck < 3) {
        if (CurrentDateOnly <= 14 && selectedDateOnly >= 15) {
          this.allLeaveApplyFlag = true;
        } else {
          this.allLeaveApplyFlag = false;
        }
      }
    }


  }

  monthChange() {
    var elements: any = document.getElementById("attendancePage").querySelectorAll(".switch-btn");
    var backArrow: any = document.getElementById("attendancePage").querySelector("#backArrow");
    var frontArrow: any = document.getElementById("attendancePage").querySelector("#frontArrow");
    frontArrow.className = "forward disable-btn";
    backArrow.className = "back disable-btn";
    setTimeout(() => {
      var value = moment(elements[0].innerText, "MMM YYYY").format("MMYYYY").toString();
      var monthDifferCheck = moment().diff(moment(value, "MMYYYY"), 'months', true);
      if (monthDifferCheck >= 0 && monthDifferCheck < 1) {
        backArrow.className = "back";
        frontArrow.className = "forward";
        this.loadCalendarForCurrentPriviousMonths();
      } else if (monthDifferCheck < 0 && monthDifferCheck > -1) {
        backArrow.className = "back";
        frontArrow.className = "forward";
        this.loadCalendarForNextMonth();
      } else if (monthDifferCheck < -1 && monthDifferCheck > -2) {
        backArrow.className = "back";
        frontArrow.className = "forward disable-btn";
        this.loadCalendarForNextAfterMonth();
      } else if (monthDifferCheck >= 1 && monthDifferCheck < 2) {
        backArrow.className = "back";
        frontArrow.className = "forward";
        this.loadCalendarForPriviousMonths();
      } else if (monthDifferCheck >= 2 && monthDifferCheck < 3) {
        backArrow.className = "back disable-btn";
        frontArrow.className = "forward";
        this.loadCalendarForPriviousBeforeMonth();
      }
    }, 1000);

  }


  loadCalendarView() {
    this.calStartDate = moment().add('months', 2).date(0).format("YYYY, MM, DD");
    this.calEndDate = moment().add('months', -2).date(1).format("YYYY, MM, DD");
    var jsonArr = [];
    var tempCurrentDate4attendanceSingleDayData = "";
    if (this.attendanceSingleDayData !== undefined) {
      tempCurrentDate4attendanceSingleDayData = this.attendanceSingleDayData.LDATE;
      this.mainService.selectedDateDataFromAttendance = this.attendanceSingleDayData;
    } else {
      tempCurrentDate4attendanceSingleDayData = moment().format("YYYY-MM-DD").toString();
    }
    for (var i = 0; i < this.mainService.attanancePageData.length; i++) {
      if (this.mainService.attanancePageData[i].LDATE.toString() == tempCurrentDate4attendanceSingleDayData) {
        this.currentDate = moment(tempCurrentDate4attendanceSingleDayData, "YYYY-MM-DD").format("DD").toString();
        this.currentMonth = moment(tempCurrentDate4attendanceSingleDayData, "YYYY-MM-DD").format("MMM").toString();
        this.punchIN = this.mainService.attanancePageData[i].PUN_P10;
        this.punchOUT = this.mainService.attanancePageData[i].PUN_P20;
        this.midIN = this.mainService.attanancePageData[i].PUN_P25;
        this.midOUT = this.mainService.attanancePageData[i].PUN_P15;
        this.currentCssClass = "Cur_" + this.mainService.attanancePageData[i].cssClass;
        this.totalHoursWorked = this.mainService.attanancePageData[i].ATT;
        this.requests_ATT_1 = (this.mainService.attanancePageData[i].RS_ATT1) ? this.mainService.attanancePageData[i].RS_ATT1 : null;
        this.requests_ATT_2 = (this.mainService.attanancePageData[i].RS_ATT2) ? this.mainService.attanancePageData[i].RS_ATT2 : null;
      }
      jsonArr.push({
        date: this.mainService.attanancePageData[i].LDATE,
        cssClass: (moment().format("YYYY-MM-DD").toString() == this.mainService.attanancePageData[i].LDATE.toString()) ? this.mainService.attanancePageData[i].cssClass + " todayClass" : (this.mainService.attanancePageData[i].cssClass != "") ? this.mainService.attanancePageData[i].cssClass : "ATT1_NomalPunch_ATT2_NormalPunch",
        subTitle: (moment().format("YYYY-MM-DD").toString() == this.mainService.attanancePageData[i].LDATE.toString()) ? "Today" : ""
      });
    }

    console.log(jsonArr);
    var tempoptionsRange: CalendarComponentOptions = {
      color: 'danger',
      daysConfig: jsonArr,
      showMonthPicker: false,
      weekStart: 1
    };

    setTimeout(() => {
      this.optionsRange = tempoptionsRange;
      this.mainService.selectedDateDataFromAttendance = undefined;
      this.utilService.dismissLoader();
      this.calenderVIew = true;
    }, 100);
  }


  applyLeave() {
    if (this.allLeaveApplyFlag) {
      try {
        // if(this.mainService.internetConnectionCheck){
        this.utilService.showLoader(this.commonString.commonStrings.AttendanceViewPage.PLEASE_WAIT);
        this.service.invokeAdapterCall('commonAdapterServices', 'getLeaveBalance', 'get', {
          payload: false
        }).then((resultData: any) => {
          if (resultData) {
            if (resultData.status_code == 0) {
              this.mainService.userLeaveBalanceListData = resultData.data;
              console.log(JSON.stringify(this.mainService.userLeaveBalanceListData));
              this.utilService.dismissLoader();
              this.navCtrl.push(this.commonString.commonStrings.AttendanceViewPage.APPLYLEAVE_NAV, {
                "LeaveData": this.attendanceSingleDayData
              });
            } else {
              this.utilService.dismissLoader();
              this.utilService.showCustomPopup4Error(this.commonString.commonStrings.AttendanceViewPage.FAILURE_TITLE_LEAVE, resultData.message, this.commonString.commonStrings.AttendanceViewPage.FAILURE_TITLE_TEXT);
            }

          };
        }, (error) => {
          console.log(error);
          this.utilService.dismissLoader();
          this.utilService.showCustomPopup4Error(this.commonString.commonStrings.AttendanceViewPage.FAILURE_TITLE_LEAVE, this.commonString.commonStrings.AttendanceViewPage.FAILURE_MSG_TWO, this.commonString.commonStrings.AttendanceViewPage.FAILURE_TITLE_TEXT);
        });
        // }else{
        //   this.utilService.showCustomPopup("FAILURE", "You are in offline, Please check you internet..");
        // }
      } catch (error) {
        console.log( error);
      }
    } else {
      this.utilService.showCustomPopup4Error(this.commonString.commonStrings.AttendanceViewPage.FAILURE_TITLE_LEAVE, this.commonString.commonStrings.AttendanceViewPage.FAILURE_MSG_ONE, this.commonString.commonStrings.AttendanceViewPage.FAILURE_TITLE_TEXT);
    }

  }
  applyOD() {
    if (this.allLeaveApplyFlag) {
      this.navCtrl.push(this.commonString.commonStrings.AttendanceViewPage.APPLYOD_NAV, {
        "ODData": this.attendanceSingleDayData
      });
    } else {
      this.utilService.showCustomPopup4Error(this.commonString.commonStrings.AttendanceViewPage.FAILURE_TITLE_OD, this.commonString.commonStrings.AttendanceViewPage.FAILURE_MSG_ONE, this.commonString.commonStrings.AttendanceViewPage.FAILURE_TITLE_TEXT);
    }
  }
  applyFTP() {
    if (this.allLeaveApplyFlag) {
      if (this.attendanceSingleDayData !== undefined) {
        var value = moment(this.dateRange, "YYYY-MM-DD").format("YYYY-MM-DD").toString();
        var monthDifferCheck = moment().diff(moment(value, "YYYY-MM-DD"), 'months', true);
        if (monthDifferCheck < 0) {
          this.utilService.showCustomPopup4Error(this.commonString.commonStrings.AttendanceViewPage.FAILURE_TITLE_FTP, this.commonString.commonStrings.AttendanceViewPage.FAILURE_MSG_TWO, this.commonString.commonStrings.AttendanceViewPage.FAILURE_TITLE_TEXT);
        } else {
          this.navCtrl.push(this.commonString.commonStrings.AttendanceViewPage.APPLYFTP_NAV, {
            "ftpData": this.attendanceSingleDayData
          });
        }
      } else {
        this.utilService.showCustomPopup4Error(this.commonString.commonStrings.AttendanceViewPage.FAILURE_TITLE_FTP, this.commonString.commonStrings.AttendanceViewPage.FAILURE_MSG_THREE, this.commonString.commonStrings.AttendanceViewPage.FAILURE_TITLE_TEXT);
      }
    } else {
      this.utilService.showCustomPopup4Error(this.commonString.commonStrings.AttendanceViewPage.FAILURE_TITLE_FTP, this.commonString.commonStrings.AttendanceViewPage.FAILURE_MSG_ONE, this.commonString.commonStrings.AttendanceViewPage.FAILURE_TITLE_TEXT);
    }



  }

  loadCalendarForNextMonth() {

    // if(this.mainService.internetConnectionCheck){
    this.utilService.showLoader(this.commonString.commonStrings.AttendanceViewPage.PLEASE_WAIT);
    // this.calenderVIew = false;
    if (this.mainService.attendanceNA1_DataFlag) {
      var payloadData = {
        "IP_SMONTH": 1,
        "IP_EMONTH": 1
      }
      this.service.invokeAdapterCall('commonAdapterServices', 'getEmployeeAttendanceData', 'post', {
        payload: true,
        length: 2,
        payloadData: payloadData
      }).then((resultData: any) => {
        if (resultData) {
          if (resultData.status_code == 0) {
            this.mainService.attanancePageData = resultData.data;
            this.mainService.attendanceNA1_Data = resultData.data;
            this.mainService.attendanceNA1_DataFlag = false;
            this.dateRange = moment(moment().format("YYYY-MM-DD")).add(1, 'M');
            console.log(JSON.stringify(this.mainService.attanancePageData));
            this.loadCalendarView();
          } else {
            // this.calenderVIew = true;
            this.mainService.attendanceNA1_DataFlag = true;
            this.utilService.dismissLoader();
            this.utilService.showPopup("Attendance", resultData.message);
          }

        };
      }, (error) => {
        console.log(error);
        this.utilService.dismissLoader();
        this.utilService.showCustomPopup(this.commonString.commonStrings.AttendanceViewPage.FAILURE_TITLE_TEXT, this.commonString.commonStrings.AttendanceViewPage.FAILURE_MSG_TWO);
      });
      // }else{
      //   this.utilService.showCustomPopup("FAILURE", "You are in offline, Please check you internet..");
      // }
    } else {
      this.mainService.attanancePageData = this.mainService.attendanceNA1_Data;
      this.dateRange = moment(moment().format("YYYY-MM-DD")).add(1, 'M')
      console.log(JSON.stringify(this.mainService.attanancePageData));
      this.loadCalendarView();
    }
  }

  loadCalendarForNextAfterMonth() {
    // if(this.mainService.internetConnectionCheck){
    this.utilService.showLoader(this.commonString.commonStrings.AttendanceViewPage.PLEASE_WAIT);
    // this.calenderVIew = false;
    if (this.mainService.attendanceNA2_DataFlag) {
      var payloadData = {
        "IP_SMONTH": 2,
        "IP_EMONTH": 2
      }
      this.service.invokeAdapterCall('commonAdapterServices', 'getEmployeeAttendanceData', 'post', {
        payload: true,
        length: 2,
        payloadData: payloadData
      }).then((resultData: any) => {
        if (resultData) {
          if (resultData.status_code == 0) {
            this.mainService.attanancePageData = resultData.data;
            this.mainService.attendanceNA2_Data = resultData.data;
            this.mainService.attendanceNA2_DataFlag = false;
            this.dateRange = moment(moment().format("YYYY-MM-DD")).add(2, 'M');
            console.log(JSON.stringify(this.mainService.attanancePageData));
            this.loadCalendarView();
          } else {
            // this.calenderVIew = true;
            this.mainService.attendanceNA2_DataFlag = true;
            this.utilService.dismissLoader();
            this.utilService.showPopup("Attendance", resultData.message);
          }

        };
      }, (error) => {
        console.log(error);
        this.utilService.dismissLoader();
        this.utilService.showCustomPopup(this.commonString.commonStrings.AttendanceViewPage.FAILURE_TITLE_TEXT, this.commonString.commonStrings.AttendanceViewPage.FAILURE_MSG_TWO);
      });
      // }else{
      //   this.utilService.showCustomPopup("FAILURE", "You are in offline, Please check you internet..");
      // }
    } else {
      this.mainService.attanancePageData = this.mainService.attendanceNA2_Data;
      this.dateRange = moment(moment().format("YYYY-MM-DD")).add(2, 'M');
      this.loadCalendarView();
    }
  }

  loadCalendarForCurrentPriviousMonths() {

    // if(this.mainService.internetConnectionCheck){
    this.utilService.showLoader(this.commonString.commonStrings.AttendanceViewPage.PLEASE_WAIT);
    // this.calenderVIew = false;
    if (this.mainService.attendanceN_NP1_DataFlag) {
      var payloadData = {
        "IP_SMONTH": -1,
        "IP_EMONTH": 0
      }
      this.service.invokeAdapterCall('commonAdapterServices', 'getEmployeeAttendanceData', 'post', {
        payload: true,
        length: 2,
        payloadData: payloadData
      }).then((resultData: any) => {
        if (resultData) {
          if (resultData.status_code == 0) {
            this.mainService.attanancePageData = resultData.data;
            this.mainService.attendanceN_NP1_Data = resultData.data;
            this.mainService.attendanceN_NP1_DataFlag = false;
            this.dateRange = moment().format("YYYY-MM-DD");
            console.log(JSON.stringify(this.mainService.attanancePageData));
            this.loadCalendarView();
          } else {
            // this.calenderVIew = true;
            this.mainService.attendanceN_NP1_DataFlag = true;
            this.utilService.dismissLoader();
            this.utilService.showPopup("Attendance", resultData.message);
          }

        };
      }, (error) => {
        console.log(error);
        this.utilService.dismissLoader();
        this.utilService.showCustomPopup(this.commonString.commonStrings.AttendanceViewPage.FAILURE_TITLE_TEXT, this.commonString.commonStrings.AttendanceViewPage.FAILURE_MSG_TWO);
      });
      // }else{
      //   this.utilService.showCustomPopup("FAILURE", "You are in offline, Please check you internet..");
      // }
    } else {
      console.log(JSON.stringify(this.mainService.attendanceN_NP1_Data));
      this.mainService.attanancePageData = this.mainService.attendanceN_NP1_Data;
      this.dateRange = moment().format("YYYY-MM-DD");
      console.log(JSON.stringify(this.mainService.attanancePageData));
      this.loadCalendarView();
    }

  }

  loadCalendarForPriviousBeforeMonth() {
    // if(this.mainService.internetConnectionCheck){
    this.utilService.showLoader(this.commonString.commonStrings.AttendanceViewPage.PLEASE_WAIT);
    // this.calenderVIew = false;
    if (this.mainService.attendanceNP2_DataFlag) {
      var payloadData = {
        "IP_SMONTH": -2,
        "IP_EMONTH": -2
      }
      this.service.invokeAdapterCall('commonAdapterServices', 'getEmployeeAttendanceData', 'post', {
        payload: true,
        length: 2,
        payloadData: payloadData
      }).then((resultData: any) => {
        if (resultData) {
          if (resultData.status_code == 0) {
            this.mainService.attanancePageData = resultData.data;
            this.mainService.attendanceNP2_Data = resultData.data;
            this.mainService.attendanceNP2_DataFlag = false;
            this.dateRange = moment(moment().format("YYYY-MM-DD")).add(-2, 'M');
            console.log(JSON.stringify(this.mainService.attanancePageData));
            this.loadCalendarView();
          } else {
            // this.calenderVIew = true;
            this.mainService.attendanceNP2_DataFlag = true;
            this.utilService.dismissLoader();
            this.utilService.showPopup("Attendance", resultData.message);
          }

        };
      }, (error) => {
        console.log(error);
        this.utilService.dismissLoader();
        this.utilService.showCustomPopup(this.commonString.commonStrings.AttendanceViewPage.FAILURE_TITLE_TEXT, this.commonString.commonStrings.AttendanceViewPage.FAILURE_MSG_TWO);
      });
      // }else{
      //   this.utilService.showCustomPopup("FAILURE", "You are in offline, Please check you internet..");
      // }
    } else {
      this.mainService.attanancePageData = this.mainService.attendanceNP2_Data;
      this.dateRange = moment(moment().format("YYYY-MM-DD")).add(-2, 'M');
      console.log(JSON.stringify(this.mainService.attanancePageData));
      this.loadCalendarView();
    }
  }

  loadCalendarForPriviousMonths() {
    console.log(JSON.stringify(this.mainService.attendanceN_NP1_Data));
    this.mainService.attanancePageData = this.mainService.attendanceN_NP1_Data;
    this.dateRange = moment(moment().format("YYYY-MM-DD")).add(-1, 'M');
    console.log(JSON.stringify(this.mainService.attanancePageData));
    this.loadCalendarView();
  }

  ionViewCanEnter() {
    this.dateRange = (this.mainService.selectedDateDataFromAttendance !== undefined) ? moment(this.mainService.selectedDateDataFromAttendance.LDATE).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD");
    this.loadCalendarView();
  }

  getTimeValue(timeData) {
    var res = timeData.slice(0, 5);
    return res;
  }

  getRequestString(string) {
    console.log(string);
    if (string.toString() == "FTP" || string.toString() == "FTA") {
      return "FTP";
    }
    var res = string.toString().slice(0, 2);
    return res;
  }

}
