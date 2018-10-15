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
  public selecedDate:any;
  public allLeaveApplyFlag:boolean = false;
  public checkFromDate:any;
  public checkFromMonth:any;
  public checkToMonth:any;
  public checkToDate:any;

  constructor(public menu: MenuController, public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
              public utilService: UtilsProvider, public alert:AlertController, public ref: ChangeDetectorRef) {
    
    this.menu.swipeEnable(false);
    this.calendarFor = this.navParams.get('Cal');
    this.dateRange = (this.navParams.get('selectedDate') !== undefined)?new Date(moment(this.navParams.get('selectedDate').toString(), "DD-MM-YYYY").format("YYYY, MM, DD").toString()):new Date(moment().format("YYYY, MM, DD").toString());
    this.leaveFromDate = this.dateRange;
    this.leaveToDate = this.dateRange;
    if(this.calendarFor == "from"){

    }
    if(this.calendarFor == "to"){
      this.leaveFromDate = this.navParams.get('leaveFromDate');
      this.leaveFromTime = this.navParams.get('leaveFromTime');

      console.log(this.navParams.get('leaveFromDate') +"---"+ this.navParams.get('leaveFromTime'));

      // this.quarterFlag = true;
      // this.fulldayFlag = true;
      // this.firstHalfFlag = true;
      // this.secHalfFlag = true;

      if(this.leaveFromTime == "FQ" || this.leaveFromTime == "LQ"){
          this.quarterFlag = false;
          this.fulldayFlag = true;
          this.firstHalfFlag = true;
          this.secHalfFlag = true;
      }else if(this.leaveFromTime == "FD"){
        this.quarterFlag = true;
        this.fulldayFlag = false;
        this.firstHalfFlag = false;
        this.secHalfFlag = true;
      }else if(this.leaveFromTime == "FH"){
        this.quarterFlag = true;
        this.fulldayFlag = true;
        this.firstHalfFlag = false;
        this.secHalfFlag = true;
      }else if(this.leaveFromTime == "SH"){
        this.quarterFlag = true;
        this.fulldayFlag = false;
        this.firstHalfFlag = false;
        this.secHalfFlag = false;
      }
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
    console.log($event);
    console.log(moment($event._d).format("YYYY-MM-DD"));
    console.log("this.leaveFromDate-->>"+this.leaveFromDate+"--"+"$event._d-->>"+$event._d)
    console.log("date different count: "+ moment(this.leaveFromDate).diff($event._d, 'days'));
    this.currentDate = moment($event._d).format("ddd,Do MMM");
    this.currentYear = moment($event._d).format("YYYY");
    this.selectedDateFromCal = moment($event._d).format("YYYY-MM-DD");

    if(this.calendarFor == "from"){
      this.leaveFromDate = moment($event._d).format("YYYY-MM-DD");
    }
    else if(this.calendarFor == "to"){      
      var fromTempDate = moment(this.leaveFromDate, "DD-MM-YYYY").format("YYYY-MM-DD");
      var toTempDate = moment($event._d).format("YYYY-MM-DD");
      console.log(fromTempDate+"---"+toTempDate);
      console.log("---->>"+ moment(fromTempDate).diff(toTempDate, 'days'));
      if(toTempDate == fromTempDate){
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
      }else if(moment(fromTempDate).diff(toTempDate, 'days') < 0 ){
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
          this.utilService.showCustomPopup4Error("Apply Leave", "Invalid Date Selection", "FAILURE");
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
          this.utilService.showCustomPopup4Error("Apply Leave", "Invalid Date Selection", "FAILURE");
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
            this.utilService.showCustomPopup4Error("Apply Leave", "Invalid Date Selection", "FAILURE");
          }
          
        }
        
      }else if(moment(fromTempDate).diff(toTempDate, 'days') > 0 ){
      //   if(moment(this.leaveFromDate).diff($event._d, 'days') == 29 || moment(this.leaveFromDate).diff($event._d, 'days') == 58){
      //   //this.utilService.showCustomPopup4Error("Apply Leave", "Invalid Date Selection", "FAILURE");
      //   console.log("29(need to check)");
      // }
      // else
      // {
        this.utilService.showCustomPopup4Error("Apply Leave", "Invalid Date Selection", "FAILURE");
      // }
      }
      this.leaveToDate = moment($event._d).format("YYYY-MM-DD");
    }
  

    var value = moment($event._d).format("MMYYYY").toString();
    var selectedDateOnly:any = moment($event._d).format("DD");
    var CurrentDateOnly:any = moment().format("DD");
    var monthDifferCheck = moment().diff(moment(value, "MMYYYY"), 'months', true);
    if(monthDifferCheck >= 0 && monthDifferCheck < 1){
      console.log("monthDifferCheck-->> "+"Current Month");
      this.allLeaveApplyFlag = true;
    }else if(monthDifferCheck < 0 && monthDifferCheck > -1){
      console.log("monthDifferCheck-->> "+"Next Month");
      this.allLeaveApplyFlag = true;
    }else if(monthDifferCheck < -1 && monthDifferCheck > -2){
      console.log("monthDifferCheck-->> "+"Next after Month");
      this.allLeaveApplyFlag = true;
    }else if(monthDifferCheck >= 1 && monthDifferCheck < 2){
      console.log("monthDifferCheck-->> "+"Privious Month");
      if(CurrentDateOnly >= 15 && selectedDateOnly >= 15){
        this.allLeaveApplyFlag = true;
      }else if(CurrentDateOnly <= 14){
        this.allLeaveApplyFlag = true;
      }else{
        this.allLeaveApplyFlag = false;
      }
    }else if(monthDifferCheck >= 2 && monthDifferCheck < 3){
      console.log("monthDifferCheck-->> "+"Privious before Month");
      if(CurrentDateOnly <= 14 && selectedDateOnly >= 15){
        this.allLeaveApplyFlag = true;
      }else{
        this.allLeaveApplyFlag = false;
      }
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
          this.utilService.showCustomPopup4Error("Apply Leave", "Invalid Date Selection", "FAILURE");
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
          this.utilService.showCustomPopup4Error("Apply Leave", "Invalid Date Selection", "FAILURE");
        }
      }else{
        this.showCustomPopupWithCheckBox((this.leaveFromTime == "FQ")? true:false , (this.leaveFromTime == "LQ")? true:false, false, false);
      }
    }else{
      this.showCustomPopupWithCheckBox(false, false, false, false);
    }
  }

  dismiss(val) {
    if(this.calendarFor == "from"){
        (this.leaveFromDate !== undefined && this.leaveFromDate !== "")?this.allLeaveApplyFlag=true:this.allLeaveApplyFlag=false;
    }

    if(this.calendarFor == "to"){
      (this.leaveToDate !== undefined && this.leaveToDate !== "")?this.allLeaveApplyFlag=true:this.allLeaveApplyFlag=false;
  }

    
    if(this.allLeaveApplyFlag){
      if(val == 'k'){
        if(this.calendarFor == "to"){
          // if(this.leaveToDate === undefined){
          //   this.utilService.showCustomPopup4Error("Apply Leave", "Please select Date..", "FAILURE");
          // }else 
          
          if(this.leaveToTime === undefined){
            this.utilService.showCustomPopup4Error("Apply Leave", "please select the period", "FAILURE");
          }else{
            let data = { leaveFromDate: this.leaveFromDate,
              leaveToDate: (this.leaveToDate !== undefined)?this.leaveToDate:this.dateRange,  
              leaveFromTime: this.leaveFromTime, 
              leaveToTime: this.leaveToTime
             };
            this.viewCtrl.dismiss(data);
          }
        }
  
        if(this.calendarFor == "from"){
          // if(this.leaveFromDate === undefined){
          //   this.utilService.showCustomPopup4Error("Apply Leave", "Please select Date..", "FAILURE");
          // }else 
          
          if(this.leaveFromTime === undefined && this.fromPage != "ODApply"){
            this.utilService.showCustomPopup4Error("Apply Leave", "please select the period", "FAILURE");
          }else{
            let data = { leaveFromDate: (this.leaveFromDate !== undefined)?this.leaveFromDate:this.dateRange,  
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
    }else{
      this.utilService.showCustomPopup4Error("Apply Leave", "Invalid Date Selection", "FAILURE");
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
    var elements:any = document.getElementById("customCalendarPage").querySelectorAll(".switch-btn");
    var backArrow:any = document.getElementById("customCalendarPage").querySelector("#backArrow");
    var frontArrow:any = document.getElementById("customCalendarPage").querySelector("#frontArrow");
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
