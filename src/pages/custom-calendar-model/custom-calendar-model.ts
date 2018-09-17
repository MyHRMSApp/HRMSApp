import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, MenuController } from 'ionic-angular';
import { CalendarComponentOptions } from 'ion2-calendar';
import moment from 'moment';
import { UtilsProvider } from '../../providers/utils/utils';

@IonicPage()
@Component({
  selector: 'page-custom-calendar-model',
  templateUrl: 'custom-calendar-model.html',
})
export class CustomCalendarModelPage {

  public optionsRange:any;
  public dateRange:any;
  public calenderVIew:boolean = false;
  public calStartDate:any;
  public calEndDate:any;
  public leaveFromDate:any;
  public leaveToDate:any;
  public leaveFromTime:any;
  public leaveToTime:any;
  public calendarFor:any;
  public quarterFlag:boolean = false;
  public fulldayFlag:boolean = false;
  public firstHalfFlag:boolean = false;
  public secHalfFlag:boolean = false;
  public currentDate:any;
  public currentYear:any;
  public selectedDateFromCal:any;
  public quarterWiseSelectionFlag:any = true;
  public dayWiseSelectionFlag:any = true;
  public fromPage:any;
  constructor(public menu: MenuController, public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
              public utilService: UtilsProvider, public alert:AlertController, public ref: ChangeDetectorRef) {
    
    this.menu.swipeEnable(false);
    this.calendarFor = this.navParams.get('Cal');
    if(this.calendarFor == "to"){
      this.leaveFromDate = this.navParams.get('leaveFromDate');
      this.leaveFromTime = this.navParams.get('leaveFromTime');

      this.quarterFlag = true;
      this.fulldayFlag = true;
      this.firstHalfFlag = true;
      this.secHalfFlag = true;

      // if(this.leaveFromTime == "FQ" || this.leaveFromTime == "LQ"){
      //     this.quarterFlag = false;
      //     this.fulldayFlag = true;
      //     this.firstHalfFlag = true;
      //     this.secHalfFlag = true;
      // }else if(this.leaveFromTime == "FD"){
      //   this.quarterFlag = true;
      //   this.fulldayFlag = false;
      //   this.firstHalfFlag = false;
      //   this.secHalfFlag = true;
      // }else if(this.leaveFromTime == "FH"){
      //   this.quarterFlag = true;
      //   this.fulldayFlag = true;
      //   this.firstHalfFlag = false;
      //   this.secHalfFlag = true;
      // }else if(this.leaveFromTime == "SH"){
      //   this.quarterFlag = true;
      //   this.fulldayFlag = false;
      //   this.firstHalfFlag = false;
      //   this.secHalfFlag = false;
      // }
    }
    if(this.navParams.get('quarterWiseSelectionFlag') == "false"){
      this.quarterWiseSelectionFlag = false;
    }
    if(this.navParams.get('dayWiseSelectionFlag') == "false"){
      this.dayWiseSelectionFlag = false;
    }
    if(this.navParams.get('fromPage') == "ODApply"){
      this.fromPage = "ODApply";
    }
    this.currentDate = moment().format("ddd,Do MMM");
    this.currentYear = moment().format("YYYY");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CustomCalendarModelPage');
  }

  ionViewCanEnter() {

    console.log('ionViewCanEnter HomePage');

    var date = new Date(), y = date.getFullYear(), m = date.getMonth();

    var firstDay = new Date(y, m - 2, 1);
    var lastDay = new Date(y, m + 3, 0);

    this.calStartDate = moment(firstDay).format("YYYY, MM, DD").toString();
    this.calEndDate = moment(lastDay).format("YYYY, MM, DD").toString();

    var tempoptionsRange : CalendarComponentOptions = {
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
    console.log(moment($event._d).format("YYYY-MM-DD"));
    console.log("date different count: "+moment(this.leaveFromDate).diff($event._d, 'days'));
    this.currentDate = moment($event._d).format("ddd,Do MMM");
    this.currentYear = moment($event._d).format("YYYY");
    this.selectedDateFromCal = moment($event._d).format("YYYY-MM-DD");

    if(this.calendarFor == "from"){
      this.leaveFromDate = moment($event._d).format("YYYY-MM-DD");
    }
    else if(this.calendarFor == "to"){
      if(moment($event._d).format("YYYY-MM-DD") == moment(this.leaveFromDate).format("YYYY-MM-DD")){
        if(this.leaveFromTime == "FD"){
          this.quarterFlag = true;
          this.fulldayFlag = false;
          this.firstHalfFlag = true;
          this.secHalfFlag = true;
          this.ref.detectChanges();
        }else if(this.leaveFromTime == "FH"){
          this.quarterFlag = true;
          this.fulldayFlag = true;
          this.firstHalfFlag = false;
          this.secHalfFlag = true;
          this.ref.detectChanges();
        }else if(this.leaveFromTime == "SH"){
          this.quarterFlag = true;
          this.fulldayFlag = true;
          this.firstHalfFlag = true;
          this.secHalfFlag = false;
          this.ref.detectChanges();
        }else if(this.leaveFromTime == "FQ" || this.leaveFromTime == "LQ"){
          this.quarterFlag = false;
          this.fulldayFlag = true;
          this.firstHalfFlag = true;
          this.secHalfFlag = true;
          this.ref.detectChanges();
        }
      }else if(moment(this.leaveFromDate).diff($event._d, 'days') < 0){
        if(this.leaveFromTime == "FD"){
          this.quarterFlag = true;
          this.fulldayFlag = false;
          this.firstHalfFlag = false;
          this.secHalfFlag = true;
          this.ref.detectChanges();
        }else if(this.leaveFromTime == "FH"){
          this.quarterFlag = true;
          this.fulldayFlag = true;
          this.firstHalfFlag = true;
          this.secHalfFlag = true;
          this.ref.detectChanges();
          this.utilService.showCustomPopup4Error("Apply Leave", "Invalid Date Selection..", "FAILURE");
        }else if(this.leaveFromTime == "SH"){
          this.quarterFlag = true;
          this.fulldayFlag = false;
          this.firstHalfFlag = false;
          this.secHalfFlag = true;
          this.ref.detectChanges();
        }else if(this.leaveFromTime == "FQ"){
          this.quarterFlag = true;
          this.fulldayFlag = true;
          this.firstHalfFlag = true;
          this.secHalfFlag = true;
          this.ref.detectChanges();
          this.utilService.showCustomPopup4Error("Apply Leave", "Invalid Date Selection..", "FAILURE");
        }else if(this.leaveFromTime == "LQ"){
          if(moment(this.leaveFromDate).diff($event._d, 'days') == 0 || moment(this.leaveFromDate).diff($event._d, 'days') == -1){
            this.quarterFlag = false;
            this.fulldayFlag = true;
            this.firstHalfFlag = true;
            this.secHalfFlag = true;
            this.ref.detectChanges();
          }else{
            this.quarterFlag = true;
            this.fulldayFlag = true;
            this.firstHalfFlag = true;
            this.secHalfFlag = true;
            this.ref.detectChanges();
            this.utilService.showCustomPopup4Error("Apply Leave", "Invalid Date Selection..", "FAILURE");
          }
          
        }
        
      }else if(moment(this.leaveFromDate).diff($event._d, 'days') > 0){
        this.utilService.showCustomPopup4Error("Apply Leave", "Invalid Date Selection..", "FAILURE");
      }
      this.leaveToDate = moment($event._d).format("YYYY-MM-DD");
    }
  }

  setTimingFunction(timeStr){
    console.log("Time Selected : "+ timeStr);
    if(this.calendarFor == "from"){
      this.leaveFromTime = timeStr;
    }else if(this.calendarFor == "to"){
      this.leaveToTime = timeStr;
    }
    if(timeStr == "FD" || timeStr == "FH" || timeStr == "SH" ){
        this.quarterFlag = true;
        this.ref.detectChanges();
    }else if(timeStr == "FQ" || timeStr == "LQ"){
      this.fulldayFlag = true;
      this.firstHalfFlag = true;
      this.secHalfFlag = true;
    }
    
  }

  getQuarterFunction(){
    console.log("getQuarterFunction-->>"+moment(this.leaveFromDate).diff(this.selectedDateFromCal, 'days'));
    if(this.leaveFromTime !== undefined && this.leaveFromTime == "FQ"){
      if(this.calendarFor == "to"){
        if(moment(this.leaveFromDate).diff(this.selectedDateFromCal, 'days') == 0){
          this.showCustomPopupWithCheckBox(true, false, true, true);
        }else if(moment(this.leaveFromDate).diff(this.selectedDateFromCal, 'days') < 0){
          this.utilService.showCustomPopup4Error("Apply Leave", "Invalid Date Selection..", "FAILURE");
        }
      }else{
        this.showCustomPopupWithCheckBox((this.leaveFromTime == "FQ")? true:false , (this.leaveFromTime == "LQ")? true:false, false, false);
      }
    }else if(this.leaveFromTime !== undefined && this.leaveFromTime == "LQ"){
      if(this.calendarFor == "to"){
        if(moment(this.leaveFromDate).diff(this.selectedDateFromCal, 'days') == 0){
          this.showCustomPopupWithCheckBox(false, true, true, true);
        }else if(moment(this.leaveFromDate).diff(this.selectedDateFromCal, 'days') == -1){
          this.showCustomPopupWithCheckBox(true, false, true, true);
        }else if(moment(this.leaveFromDate).diff(this.selectedDateFromCal, 'days') < -1){
          this.utilService.showCustomPopup4Error("Apply Leave", "Invalid Date Selection..", "FAILURE");
        }
      }else{
        this.showCustomPopupWithCheckBox((this.leaveFromTime == "FQ")? true:false , (this.leaveFromTime == "LQ")? true:false, false, false);
      }
    }else{
      this.showCustomPopupWithCheckBox(false, false, false, false);
    }
  }

  dismiss(val) {
    if(val == 'k'){
      if(this.calendarFor == "to"){
        if(this.leaveToDate === undefined){
          this.utilService.showCustomPopup4Error("Apply Leave", "Please select Date..", "FAILURE");
        }else if(this.leaveToTime === undefined){
          this.utilService.showCustomPopup4Error("Apply Leave", "please select the period..", "FAILURE");
        }else{
          let data = { leaveFromDate: this.leaveFromDate,
            leaveToDate: this.leaveToDate,  
            leaveFromTime: this.leaveFromTime, 
            leaveToTime: this.leaveToTime
           };
          this.viewCtrl.dismiss(data);
        }
      }

      if(this.calendarFor == "from"){
        if(this.leaveFromDate === undefined){
          this.utilService.showCustomPopup4Error("Apply Leave", "Please select Date..", "FAILURE");
        }else if(this.leaveFromTime === undefined && this.fromPage != "ODApply"){
          this.utilService.showCustomPopup4Error("Apply Leave", "please select the period..", "FAILURE");
        }else{
          let data = { leaveFromDate: this.leaveFromDate,
            leaveToDate: this.leaveToDate,  
            leaveFromTime: this.leaveFromTime, 
            leaveToTime: this.leaveToTime
           };
          this.viewCtrl.dismiss(data);
        }
      }
     
    }else{
      this.viewCtrl.dismiss();
    }
    
  }

  setLeaveTimeValue(leaveTime){
    if(this.calendarFor == "from"){
      this.leaveFromTime = leaveTime;
    }else if(this.calendarFor == "to"){
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
  showCustomPopupWithCheckBox(Q1Check, Q2Check, Q1disable, Q2disable){
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
        if(data == "FQ" || data == "LQ"){
          this.fulldayFlag = true;
          this.firstHalfFlag = true;
          this.secHalfFlag = true;
          this.ref.detectChanges();
        }
        if(this.calendarFor == "from"){
          this.leaveFromTime = data;
        }else if(this.calendarFor == "to"){
          this.leaveToTime = data;
        }
      }
    });

    alert.present();
  }

  monthChange(){
    var elements:any = document.getElementsByClassName("switch-btn");
    var backArrow = document.getElementById("backArrow");
    var frontArrow = document.getElementById("frontArrow");
    frontArrow.className = "forward disable-btn";
    backArrow.className = "back disable-btn";
    setTimeout(() => {
      var value = moment(elements[0].innerText, "MMM YYYY").format("MMYYYY").toString();
      var monthDifferCheck = moment().diff(moment(value, "MMYYYY"), 'months', true);
      if(monthDifferCheck >= 0 && monthDifferCheck < 1){
        console.log("monthDifferCheck-->> "+"Current Month");
        backArrow.className = "back";
        frontArrow.className = "forward";
      }else if(monthDifferCheck < 0 && monthDifferCheck > -1){
        console.log("monthDifferCheck-->> "+"Next Month");
        backArrow.className = "back";
        frontArrow.className = "forward";
      }else if(monthDifferCheck < -1 && monthDifferCheck > -2){
        console.log("monthDifferCheck-->> "+"Next after Month");
        backArrow.className = "back";
        frontArrow.className = "forward disable-btn";
      }else if(monthDifferCheck >= 1 && monthDifferCheck < 2){
        console.log("monthDifferCheck-->> "+"Privious Month");
        backArrow.className = "back";
        frontArrow.className = "forward";
      }else if(monthDifferCheck >= 2 && monthDifferCheck < 3){
        console.log("monthDifferCheck-->> "+"Privious before Month");
        backArrow.className = "back disable-btn";
        frontArrow.className = "forward";
      }
    }, 1000);
    
  }

}
