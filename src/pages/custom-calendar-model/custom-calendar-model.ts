import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, MenuController } from 'ionic-angular';
import { CalendarComponentOptions } from 'ion2-calendar';
import moment from 'moment';
import { UtilsProvider } from '../../providers/utils/utils';
import { CommonStringsProvider } from '../../providers/common-strings/common-strings';

@IonicPage()
@Component({
  selector: 'page-custom-calendar-model',
  templateUrl: 'custom-calendar-model.html',
})
export class CustomCalendarModelPage {

  public optionsRange: any;
  public dateRange: any;
  public calenderVIew: boolean = false;
  public calStartDate: any;
  public calEndDate: any;
  public leaveFromDate: any;
  public leaveToDate: any;
  public leaveFromTime: any;
  public leaveToTime: any;
  public calendarFor: any;
  public quarterFlag: boolean = false;
  public fulldayFlag: boolean = false;
  public firstHalfFlag: boolean = false;
  public secHalfFlag: boolean = false;
  public currentDate: any;
  public currentYear: any;
  public selectedDateFromCal: any;
  public quarterWiseSelectionFlag: any = true;
  public dayWiseSelectionFlag: any = true;
  public fromPage: any;
  public selecedDate: any;
  public allLeaveApplyFlag: boolean = false;
  public checkFromDate: any;
  public checkFromMonth: any;
  public checkToMonth: any;
  public checkToDate: any;

  constructor(public menu: MenuController, public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
    public utilService: UtilsProvider, public alert: AlertController, public ref: ChangeDetectorRef,
    public commonString: CommonStringsProvider) {

    this.menu.swipeEnable(false);
    this.calendarFor = this.navParams.get('Cal');
    if (this.navParams.get('selectedDate') !== undefined) {
      var selectedDate = this.navParams.get('selectedDate');
      this.selecedDate = selectedDate;
      this.dateRange = this.createDateFunction(moment(selectedDate, "DD-MM-YYYY").format("YYYY, MM, DD"));
      this.leaveFromDate = moment(selectedDate, "DD-MM-YYYY").format("YYYY-MM-DD");
      this.leaveToDate = moment(selectedDate, "DD-MM-YYYY").format("YYYY-MM-DD");
    } else {
      this.dateRange = this.createDateFunction(moment().format("YYYY, MM, DD"));
      this.leaveFromDate = moment().format("YYYY-MM-DD");
      this.leaveToDate = moment().format("YYYY-MM-DD");
    }
    if (this.calendarFor == "from") {
      this.leaveFromDate = moment(selectedDate, "DD-MM-YYYY").format("YYYY-MM-DD");
    }
    if (this.calendarFor == "to") {
      var fromDate = this.navParams.get('leaveFromDate');
      var toDate = this.navParams.get('selectedDate');
      this.leaveFromDate = moment(fromDate, "DD-MM-YYYY").format("YYYY-MM-DD");
      this.leaveToDate = moment(toDate, "DD-MM-YYYY").format("YYYY-MM-DD");
      this.leaveFromTime = this.navParams.get('leaveFromTime');
      this.defaultPeriodSet();
    }
    if (this.navParams.get('quarterWiseSelectionFlag') == "false") {
      this.quarterWiseSelectionFlag = false;
    }
    if (this.navParams.get('dayWiseSelectionFlag') == "false") {
      this.dayWiseSelectionFlag = false;
    }
    if (this.navParams.get('fromPage') == "ODApply") {
      this.fromPage = "ODApply";
    }
    this.currentDate = moment().format("ddd,Do MMM");
    this.currentYear = moment().format("YYYY");
  }

  defaultPeriodSet() {
    var fromTempDate = moment(this.leaveFromDate, "YYYY-MM-DD").format("YYYY-MM-DD");
    var toTempDate = moment(this.leaveToDate, "YYYY-MM-DD").format("YYYY-MM-DD");
    if (toTempDate == fromTempDate) {
      if (this.leaveFromTime == "FD") {
        this.quarterFlag = true;
        this.fulldayFlag = false;
        this.firstHalfFlag = true;
        this.secHalfFlag = true;
      } else if (this.leaveFromTime == "FH") {
        this.quarterFlag = true;
        this.fulldayFlag = true;
        this.firstHalfFlag = false;
        this.secHalfFlag = true;
      } else if (this.leaveFromTime == "SH") {
        this.quarterFlag = true;
        this.fulldayFlag = true;
        this.firstHalfFlag = true;
        this.secHalfFlag = false;
      } else if (this.leaveFromTime == "FQ" || this.leaveFromTime == "LQ") {
        this.quarterFlag = false;
        this.fulldayFlag = true;
        this.firstHalfFlag = true;
        this.secHalfFlag = true;
      }
    } else if (moment(fromTempDate).diff(toTempDate, 'days') < 0) {
      if (this.leaveFromTime == "FD") {
        this.quarterFlag = true;
        this.fulldayFlag = false;
        this.firstHalfFlag = false;
        this.secHalfFlag = true;
      } else if (this.leaveFromTime == "FH") {
        this.quarterFlag = true;
        this.fulldayFlag = true;
        this.firstHalfFlag = true;
        this.secHalfFlag = true;
      } else if (this.leaveFromTime == "SH") {
        this.quarterFlag = true;
        this.fulldayFlag = false;
        this.firstHalfFlag = false;
        this.secHalfFlag = true;
      } else if (this.leaveFromTime == "FQ") {
        this.quarterFlag = true;
        this.fulldayFlag = true;
        this.firstHalfFlag = true;
        this.secHalfFlag = true;
      } else if (this.leaveFromTime == "LQ") {
        if (moment(this.leaveFromDate).diff(this.leaveToDate, 'days') == 0 || moment(this.leaveFromDate).diff(this.leaveToDate, 'days') == -1) {
          this.quarterFlag = false;
          this.fulldayFlag = true;
          this.firstHalfFlag = true;
          this.secHalfFlag = true;
        } else {
          this.quarterFlag = true;
          this.fulldayFlag = true;
          this.firstHalfFlag = true;
          this.secHalfFlag = true;
        }
      }
    }
  }

  ionViewDidLoad() {}

  ionViewCanEnter() {

    var date = new Date(),
      y = date.getFullYear(),
      m = date.getMonth();

    var firstDay = new Date(y, m - 2, 1);
    var lastDay = new Date(y, m + 3, 0);

    this.calStartDate = moment(firstDay).format("YYYY, MM, DD").toString();
    this.calEndDate = moment(lastDay).format("YYYY, MM, DD").toString();

    var tempoptionsRange: CalendarComponentOptions = {
      showMonthPicker: false,
      from: this.calStartDate,
      to: this.calEndDate,
    };

    setTimeout(() => {
      this.optionsRange = tempoptionsRange;
      this.calenderVIew = true;
    }, 100);

  }

  onChange($event) {
    this.currentDate = moment($event._d).format("ddd,Do MMM");
    this.currentYear = moment($event._d).format("YYYY");
    this.selectedDateFromCal = moment($event._d).format("YYYY-MM-DD");

    if (this.calendarFor == "from") {
      this.leaveFromDate = moment($event._d).format("YYYY-MM-DD");
    } else if (this.calendarFor == "to") {
      var fromTempDate = moment(this.leaveFromDate, "DD-MM-YYYY").format("YYYY-MM-DD");
      var toTempDate = moment($event._d).format("YYYY-MM-DD");
      if (moment($event._d).format("YYYY-MM-DD") == this.leaveFromDate) {
        if (this.leaveFromTime == "FD") {
          this.quarterFlag = true;
          this.fulldayFlag = false;
          this.firstHalfFlag = true;
          this.secHalfFlag = true;
          this.ref.detectChanges();
          this.leaveToDate = moment($event._d).format("YYYY-MM-DD");
        } else if (this.leaveFromTime == "FH") {
          this.quarterFlag = true;
          this.fulldayFlag = true;
          this.firstHalfFlag = false;
          this.secHalfFlag = true;
          this.ref.detectChanges();
          this.leaveToDate = moment($event._d).format("YYYY-MM-DD");
        } else if (this.leaveFromTime == "SH") {
          this.quarterFlag = true;
          this.fulldayFlag = true;
          this.firstHalfFlag = true;
          this.secHalfFlag = false;
          this.ref.detectChanges();
          this.leaveToDate = moment($event._d).format("YYYY-MM-DD");
        } else if (this.leaveFromTime == "FQ" || this.leaveFromTime == "LQ") {
          this.quarterFlag = false;
          this.fulldayFlag = true;
          this.firstHalfFlag = true;
          this.secHalfFlag = true;
          this.ref.detectChanges();
          this.leaveToDate = moment($event._d).format("YYYY-MM-DD");
        }
      } else if (moment(this.leaveFromDate).diff($event._d, 'days') < 0) {
        if (this.leaveFromTime == "FD") {
          this.quarterFlag = true;
          this.fulldayFlag = false;
          this.firstHalfFlag = false;
          this.secHalfFlag = true;
          this.ref.detectChanges();
          this.leaveToDate = moment($event._d).format("YYYY-MM-DD");
        } else if (this.leaveFromTime == "FH") {
          this.quarterFlag = true;
          this.fulldayFlag = true;
          this.firstHalfFlag = true;
          this.secHalfFlag = true;
          this.ref.detectChanges();
          this.utilService.showCustomPopup4Error(this.commonString.commonStrings.CustomCalendarPage.FAILURE_TITLE, this.commonString.commonStrings.CustomCalendarPage.FAILURE_MSG_ONE, this.commonString.commonStrings.CustomCalendarPage.FAILURE_TITLE_TEXT);
          this.ref.detectChanges();
          this.dateRange = this.createDateFunction(moment(this.selecedDate, "DD-MM-YYYY").format("YYYY, MM, DD"));
          this.leaveToDate = moment(this.selecedDate, "DD-MM-YYYY").format("YYYY-MM-DD");
          this.defaultPeriodSet();
        } else if (this.leaveFromTime == "SH") {
          this.quarterFlag = true;
          this.fulldayFlag = false;
          this.firstHalfFlag = false;
          this.secHalfFlag = true;
          this.ref.detectChanges();
          this.leaveToDate = moment($event._d).format("YYYY-MM-DD");
        } else if (this.leaveFromTime == "FQ") {
          this.quarterFlag = true;
          this.fulldayFlag = true;
          this.firstHalfFlag = true;
          this.secHalfFlag = true;
          this.ref.detectChanges();
          this.utilService.showCustomPopup4Error(this.commonString.commonStrings.CustomCalendarPage.FAILURE_TITLE, this.commonString.commonStrings.CustomCalendarPage.FAILURE_MSG_ONE, this.commonString.commonStrings.CustomCalendarPage.FAILURE_TITLE_TEXT);
          this.ref.detectChanges();
          this.dateRange = this.createDateFunction(moment(this.selecedDate, "DD-MM-YYYY").format("YYYY, MM, DD"));
          this.leaveToDate = moment(this.selecedDate, "DD-MM-YYYY").format("YYYY-MM-DD");
          this.defaultPeriodSet();
        } else if (this.leaveFromTime == "LQ") {
          if (moment(this.leaveFromDate).diff($event._d, 'days') == 0 || moment(this.leaveFromDate).diff($event._d, 'days') == -1) {
            this.quarterFlag = false;
            this.fulldayFlag = true;
            this.firstHalfFlag = true;
            this.secHalfFlag = true;
            this.ref.detectChanges();
            this.leaveToDate = moment($event._d).format("YYYY-MM-DD");
          } else {
            this.quarterFlag = true;
            this.fulldayFlag = true;
            this.firstHalfFlag = true;
            this.secHalfFlag = true;
            this.ref.detectChanges();
            this.utilService.showCustomPopup4Error(this.commonString.commonStrings.CustomCalendarPage.FAILURE_TITLE, this.commonString.commonStrings.CustomCalendarPage.FAILURE_MSG_ONE, this.commonString.commonStrings.CustomCalendarPage.FAILURE_TITLE_TEXT);
            this.ref.detectChanges();
            this.dateRange = this.createDateFunction(moment(this.selecedDate, "DD-MM-YYYY").format("YYYY, MM, DD"));
            this.leaveToDate = moment(this.selecedDate, "DD-MM-YYYY").format("YYYY-MM-DD");
            this.defaultPeriodSet();
          }

        }

      } else if (moment(this.leaveFromDate).diff($event._d, 'days') > 0) {
        this.utilService.showCustomPopup4Error(this.commonString.commonStrings.CustomCalendarPage.FAILURE_TITLE, this.commonString.commonStrings.CustomCalendarPage.FAILURE_MSG_ONE, this.commonString.commonStrings.CustomCalendarPage.FAILURE_TITLE_TEXT);
        this.ref.detectChanges();
        this.dateRange = this.createDateFunction(moment(this.selecedDate, "DD-MM-YYYY").format("YYYY, MM, DD"));
        this.leaveToDate = moment(this.selecedDate, "DD-MM-YYYY").format("YYYY-MM-DD");
        this.defaultPeriodSet();
      }
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

  setTimingFunction(timeStr) {

    if (this.calendarFor == "from") {
      if (timeStr == "FD" && !this.fulldayFlag) {
        this.leaveFromTime = timeStr;
        this.quarterFlag = true;
        this.ref.detectChanges();
      } else if (timeStr == "FH" && !this.firstHalfFlag) {
        this.leaveFromTime = timeStr;
        this.quarterFlag = true;
        this.ref.detectChanges();
      } else if (timeStr == "SH" && !this.secHalfFlag) {
        this.leaveFromTime = timeStr;
        this.quarterFlag = true;
        this.ref.detectChanges();
      } else if ((timeStr == "FQ" && !this.quarterFlag) || (timeStr == "FQ" && !this.quarterFlag)) {
        this.fulldayFlag = true;
        this.firstHalfFlag = true;
        this.secHalfFlag = true;
      }
    } else if (this.calendarFor == "to") {
      if (timeStr == "FD" && !this.fulldayFlag) {
        this.leaveToTime = timeStr;
        this.quarterFlag = true;
        this.ref.detectChanges();
      } else if (timeStr == "FH" && !this.firstHalfFlag) {
        this.leaveToTime = timeStr;
        this.quarterFlag = true;
        this.ref.detectChanges();
      } else if (timeStr == "SH" && !this.secHalfFlag) {
        this.leaveToTime = timeStr;
        this.quarterFlag = true;
        this.ref.detectChanges();
      } else if ((timeStr == "FQ" && !this.quarterFlag) || (timeStr == "FQ" && !this.quarterFlag)) {
        this.fulldayFlag = true;
        this.firstHalfFlag = true;
        this.secHalfFlag = true;
      }
    }

    this.ref.detectChanges();

  }

  getQuarterFunction() {
    if (this.leaveFromTime !== undefined && this.leaveFromTime == "FQ") {
      if (this.calendarFor == "to") {
        if (moment(this.leaveFromDate).diff(this.leaveToDate, 'days') == 0) {
          this.showCustomPopupWithCheckBox(true, false, true, true);
        } else if (moment(this.leaveFromDate).diff(this.leaveToDate, 'days') < 0) {
          this.utilService.showCustomPopup4Error(this.commonString.commonStrings.CustomCalendarPage.FAILURE_TITLE, this.commonString.commonStrings.CustomCalendarPage.FAILURE_MSG_ONE, this.commonString.commonStrings.CustomCalendarPage.FAILURE_TITLE_TEXT);
          this.ref.detectChanges();
          this.dateRange = this.createDateFunction(moment(this.selecedDate, "DD-MM-YYYY").format("YYYY, MM, DD"));
          this.leaveToDate = moment(this.selecedDate, "DD-MM-YYYY").format("YYYY-MM-DD");
          this.defaultPeriodSet();
        }
      } else {
        this.showCustomPopupWithCheckBox((this.leaveFromTime == "FQ") ? true : false, (this.leaveFromTime == "LQ") ? true : false, false, false);
      }
    } else if (this.leaveFromTime !== undefined && this.leaveFromTime == "LQ") {
      if (this.calendarFor == "to") {
        if (moment(this.leaveFromDate).diff(this.leaveToDate, 'days') == 0) {
          this.showCustomPopupWithCheckBox(false, true, true, true);
        } else if (moment(this.leaveFromDate).diff(this.leaveToDate, 'days') == -1) {
          this.showCustomPopupWithCheckBox(true, false, true, true);
        } else if (moment(this.leaveFromDate).diff(this.leaveToDate, 'days') < -1) {
          this.utilService.showCustomPopup4Error(this.commonString.commonStrings.CustomCalendarPage.FAILURE_TITLE, this.commonString.commonStrings.CustomCalendarPage.FAILURE_MSG_ONE, this.commonString.commonStrings.CustomCalendarPage.FAILURE_TITLE_TEXT);
          this.ref.detectChanges();
          this.dateRange = this.createDateFunction(moment(this.selecedDate, "DD-MM-YYYY").format("YYYY, MM, DD"));
          this.leaveToDate = moment(this.selecedDate, "DD-MM-YYYY").format("YYYY-MM-DD");
          this.defaultPeriodSet();
        }
      } else {
        this.showCustomPopupWithCheckBox((this.leaveFromTime == "FQ") ? true : false, (this.leaveFromTime == "LQ") ? true : false, false, false);
      }
    } else {
      this.showCustomPopupWithCheckBox(false, false, false, false);
    }
  }

  dismiss(val) {

    if (this.calendarFor == "from") {
      (this.leaveFromDate !== undefined && this.leaveFromDate !== "") ? this.allLeaveApplyFlag = true: this.allLeaveApplyFlag = false;
    }

    if (this.calendarFor == "to") {
      (this.leaveToDate !== undefined && this.leaveToDate !== "") ? this.allLeaveApplyFlag = true: this.allLeaveApplyFlag = false;
    }


    if (this.allLeaveApplyFlag) {
      if (val == 'k') {
        if (this.calendarFor == "to") {
          if (this.leaveToTime === undefined) {
            this.utilService.showCustomPopup4Error(this.commonString.commonStrings.CustomCalendarPage.FAILURE_TITLE, this.commonString.commonStrings.CustomCalendarPage.FAILURE_MSG_TWO, this.commonString.commonStrings.CustomCalendarPage.FAILURE_TITLE_TEXT);
          } else {
            let data = {
              leaveFromDate: this.leaveFromDate,
              leaveToDate: (this.leaveToDate !== undefined) ? this.leaveToDate : this.dateRange,
              leaveFromTime: this.leaveFromTime,
              leaveToTime: this.leaveToTime
            };
            this.viewCtrl.dismiss(data);
          }
        }

        if (this.calendarFor == "from") {
          if (this.leaveFromTime === undefined && this.fromPage != "ODApply") {
            this.utilService.showCustomPopup4Error(this.commonString.commonStrings.CustomCalendarPage.FAILURE_TITLE, this.commonString.commonStrings.CustomCalendarPage.FAILURE_MSG_TWO, this.commonString.commonStrings.CustomCalendarPage.FAILURE_TITLE_TEXT);
          } else {
            let data = {
              leaveFromDate: (this.leaveFromDate !== undefined) ? this.leaveFromDate : this.dateRange,
              leaveToDate: this.leaveToDate,
              leaveFromTime: this.leaveFromTime,
              leaveToTime: this.leaveToTime
            };
            this.viewCtrl.dismiss(data);
          }
        }

      } else {
        this.viewCtrl.dismiss();
      }
    } else {
      this.utilService.showCustomPopup4Error(this.commonString.commonStrings.CustomCalendarPage.FAILURE_TITLE, this.commonString.commonStrings.CustomCalendarPage.FAILURE_MSG_ONE, this.commonString.commonStrings.CustomCalendarPage.FAILURE_TITLE_TEXT);
      this.ref.detectChanges();
      this.dateRange = this.createDateFunction(moment(this.selecedDate, "DD-MM-YYYY").format("YYYY, MM, DD"));
      this.leaveToDate = moment(this.selecedDate, "DD-MM-YYYY").format("YYYY-MM-DD");
      this.defaultPeriodSet();
    }


  }

  setLeaveTimeValue(leaveTime) {
    if (this.calendarFor == "from") {
      this.leaveFromTime = leaveTime;
    } else if (this.calendarFor == "to") {
      this.leaveToTime = leaveTime;
    }
  }

  /**
   * Method for showing popups with CheckBoxs
   * @param Q1Check
   * @param Q2Check
   * @param Q1disable
   * @param Q2disable
   */
  showCustomPopupWithCheckBox(Q1Check, Q2Check, Q1disable, Q2disable) {
    const alert = this.alert.create();
    alert.setTitle('QUARTERLY LEAVE');
    alert.setCssClass('SHOWALERT');
    alert.addInput({
      type: 'radio',
      label: 'First Quarter',
      value: 'FQ',
      checked: Q1Check,
      disabled: Q1disable
    });

    alert.addInput({
      type: 'radio',
      label: 'Last Quarter',
      value: 'LQ',
      checked: Q2Check,
      disabled: Q2disable
    });

    alert.addButton('CANCEL');
    alert.addButton({
      text: 'CONFIRM',
      handler: data => {
        if (data == "FQ" || data == "LQ") {
          this.fulldayFlag = true;
          this.firstHalfFlag = true;
          this.secHalfFlag = true;
          this.ref.detectChanges();
        }
        if (this.calendarFor == "from") {
          this.leaveFromTime = data;
        } else if (this.calendarFor == "to") {
          this.leaveToTime = data;
        }
      }
    });

    alert.present();
  }

  monthChange() {
    var elements: any = document.getElementById("customCalendarPage").querySelectorAll(".switch-btn");
    var backArrow: any = document.getElementById("customCalendarPage").querySelector("#backArrow");
    var frontArrow: any = document.getElementById("customCalendarPage").querySelector("#frontArrow");
    frontArrow.className = "forward disable-btn";
    backArrow.className = "back disable-btn";
    setTimeout(() => {
      var value = moment(elements[0].innerText, "MMM YYYY").format("MMYYYY").toString();
      var monthDifferCheck = moment().diff(moment(value, "MMYYYY"), 'months', true);
      if (monthDifferCheck >= 0 && monthDifferCheck < 1) {
        backArrow.className = "back";
        frontArrow.className = "forward";
      } else if (monthDifferCheck < 0 && monthDifferCheck > -1) {
        backArrow.className = "back";
        frontArrow.className = "forward";
      } else if (monthDifferCheck < -1 && monthDifferCheck > -2) {
        backArrow.className = "back";
        frontArrow.className = "forward disable-btn";
      } else if (monthDifferCheck >= 1 && monthDifferCheck < 2) {
        backArrow.className = "back";
        frontArrow.className = "forward";
      } else if (monthDifferCheck >= 2 && monthDifferCheck < 3) {
        backArrow.className = "back disable-btn";
        frontArrow.className = "forward";
      }
    }, 1000);

  }

  createDateFunction(DateFormat) {
    var str_array: any = DateFormat.split(',');
    var date = parseInt(str_array[2]);
    var month = parseInt(str_array[1]);
    var year = parseInt(str_array[0]);

    return new Date(year, month - 1, date);
  }

}
