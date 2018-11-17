import { Component, ChangeDetectorRef } from '@angular/core';
import { Events, IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { Nav, Platform, MenuController, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { Network } from '@ionic-native/network';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Http, Headers, RequestOptions } from '@angular/http';
import { StorageProvider } from '../../providers/storage/storage';
import moment from 'moment';
import { ServiceProvider } from '../../providers/service/service';
import { UtilsProvider } from '../../providers/utils/utils';
import { MyApp } from '../../app/app.component';
import { WheelSelector } from '@ionic-native/wheel-selector';
import { CommonStringsProvider } from '../../providers/common-strings/common-strings';

@IonicPage()
@Component({
  selector: 'page-apply-od',
  templateUrl: 'apply-od.html',
})
export class ApplyOdPage {
  attendanceIcon: string;
  hamburger: string;
  homeIcon: string;

  public startDate:any;
  public endDate:any;
  public inTime:any;
  public outTime:any;
  public placeVisited:any;
  public OrgVisited:any;
  public reasonForOD:any;
  public ODObject:any;

  public jsonData:any;

  constructor(public menu: MenuController, public events: Events, private camera: Camera, 
    private http: Http, private toast: ToastController, private network: Network, 
    public loadingCtrl: LoadingController, public platform: Platform, 
    public alertCtrl: AlertController, public statusBar: StatusBar, public navCtrl: NavController, 
    public navParams: NavParams, public storage:StorageProvider, public modalCtrl: ModalController,
    public service: ServiceProvider, public utilService: UtilsProvider,  public mainService: MyApp,
    public selector: WheelSelector, private ref: ChangeDetectorRef, public commonString: CommonStringsProvider) {
    
      this.menu.swipeEnable(false);
      this.inTime = "00:00";
      this.outTime = "00:00";
      this.placeVisited = "";
      this.OrgVisited = "";
      this.reasonForOD = "";

      if(this.navParams.get("ODDATA_TEXT")) this.ODObject =  this.navParams.get("ODDATA_TEXT");

      if(this.ODObject.LDATE !== undefined){
        this.startDate = moment(this.ODObject.LDATE, "YYYY-MM-DD").format("DD-MM-YYYY").toString();
        this.endDate = moment(this.ODObject.LDATE, "YYYY-MM-DD").format("DD-MM-YYYY").toString();
      }else{
        this.startDate = moment().format("DD-MM-YYYY");
        this.endDate = moment().format("DD-MM-YYYY");
      }
  }
  
  /**
   *  Method for Menu Toggle
   */
  openMenu() {
    this.menu.toggle();
  }
  back() {
    this.navCtrl.pop();
  }
  /**
   * Method for pushing 
   */
  home() {
    this.navCtrl.setRoot("HomePage");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ApplyOdPage');
    this.attendanceIcon = ("./assets/homePageIcons/attendance.svg");
    this.hamburger = ("./assets/homePageIcons/hamburger.svg");
    this.homeIcon = ("./assets/homePageIcons/Home.svg");

  }

  ionViewCanEnter(){
    this.jsonData = this.commonString.commonStrings.ApplyOdPage.timeData;
  }

  inTimeSelection(){
    // let inTimePicker = this.modalCtrl.create("CustomTimePickerPage", {title: "START TIME"});
    // inTimePicker.present();
    // inTimePicker.onDidDismiss((data) => {
    //   console.log(data);
    //   this.inTime = data.time;
    // });

    this.selector.show({
      title: "START TIME",
      items: [this.jsonData.Hours, this.jsonData.Minutes],
    }).then(
      result => {
        console.log(result[0].description+':'+result[1].description);
        this.inTime = result[0].description+':'+result[1].description;
        this.ref.detectChanges();
      },
      err => console.log('Error: ', err)
      );
  }

  toTimeSelection(){
    // let outTimePicker = this.modalCtrl.create("CustomTimePickerPage", {title: "END TIME"});
    // outTimePicker.present();
    // outTimePicker.onDidDismiss((data) => {
    //   console.log(data);
    //   this.outTime = data.time;
    // });

    this.selector.show({
      title: "END TIME",
      items: [this.jsonData.Hours, this.jsonData.Minutes]
    }).then(
      result => {
        console.log(result[0].description+':'+result[1].description);
        this.outTime = result[0].description+':'+result[1].description;
        this.ref.detectChanges();
      },
      err => console.log('Error: ', err)
      );
  }

  fromDateSelection(){
    let fromDatePicker = this.modalCtrl.create("CUSTOMCALENDARMODELPAGE_TEXT", {dayWiseSelectionFlag: "false", selectedDate: this.startDate, quarterWiseSelectionFlag: "false", Cal: "from", fromPage:"ODApply"});
    fromDatePicker.present();
    fromDatePicker.onDidDismiss((data) => {
      console.log(data);
      this.startDate = moment(data.leaveFromDate).format("DD-MM-YYYY");
      this.endDate = moment(data.leaveFromDate).format("DD-MM-YYYY");
    });
  }

  toDateSelection(){
    let toDatePicker = this.modalCtrl.create("CUSTOMCALENDARMODELPAGE_TEXT", {dayWiseSelectionFlag: "false", selectedDate: this.endDate, quarterWiseSelectionFlag: "false", Cal: "from", fromPage:"ODApply"});
    toDatePicker.present();
    toDatePicker.onDidDismiss((data) => {
      console.log(data);
      this.endDate = moment(data.leaveFromDate).format("DD-MM-YYYY");
    });
  }

  callODApplyFunction(){
    if(this.startDate !== undefined && this.endDate !== undefined){
      var sDate = this.startDate.toString().replace(/-/g, "");
      var eDate = this.endDate.toString().replace(/-/g, "");
      var beginningDate = moment(sDate, 'DDMMYYYY');
      var endDate = moment(eDate, 'DDMMYYYY');
      var beginningTime = moment(sDate+this.inTime, 'DDMMYYYYHH:mm');
      var endTime = moment(eDate+this.outTime, 'DDMMYYYYHH:mm');
      console.log("beginningTime.isBefore==>>"+beginningTime.isBefore(endTime)); // true
    }
    
    if(this.startDate === undefined || this.startDate == ""){
      this.utilService.showCustomPopup4Error("Apply OD","Please enter valid Start Date", "FAILURE");
    }else if(this.endDate === undefined || this.endDate == ""){
      this.utilService.showCustomPopup4Error("Apply OD", "Please enter valid End Date", "FAILURE");
    }else if(this.startDate != this.endDate && !beginningDate.isBefore(endDate)){
      this.utilService.showCustomPopup4Error("Apply OD","Please enter the valid Start & End Date", "FAILURE");
    }else if(this.inTime === undefined || this.inTime == "00:00"){
      this.utilService.showCustomPopup4Error("Apply OD", "Please enter valid From Time", "FAILURE");
    }else if(this.outTime === undefined || this.outTime == "00:00"){
      this.utilService.showCustomPopup4Error("Apply OD","Please enter valid TO Time", "FAILURE");
    }else if(!beginningTime.isBefore(endTime)){
      this.utilService.showCustomPopup4Error("Apply OD","Please enter the valid From & To Time", "FAILURE");
    }else if(this.placeVisited === undefined || this.placeVisited == ""){
      this.utilService.showCustomPopup4Error("Apply OD", "Please enter the Place Visited field", "FAILURE");
    }else if(this.OrgVisited === undefined || this.OrgVisited == ""){
      this.utilService.showCustomPopup4Error("Apply OD", "Please enter the Organization Visited field", "FAILURE");
    }else if(this.reasonForOD === undefined || this.reasonForOD == ""){
      this.utilService.showCustomPopup4Error("Apply OD", "Please enter the Reason field", "FAILURE");
    }else{

      

      var payloadData = {
        "IP_SDATE": moment(this.startDate, "DD-MM-YYYY").format("YYYYMMDD"),
        "IP_EDATE": moment(this.endDate, "DD-MM-YYYY").format("YYYYMMDD"),
        "LV_STIME": this.inTime+":00",
        "LV_ETIME": this.outTime+":00",
        "LV_PLACE": this.placeVisited,
        "LV_ORG": this.OrgVisited,
        "LV_PER": "",
        "LV_COMMENTS": this.reasonForOD
      }

      console.log(payloadData);
      // if(this.mainService.internetConnectionCheck){
        this.utilService.showLoader("Please wait...");
        this.service.invokeAdapterCall('commonAdapterServices', 'applyOnDutyRequest', 'post', {payload : true, length:8, payloadData: payloadData}).then((resultData:any)=>{
          if(resultData){
            if(resultData.status_code == 0){
              if(resultData.data.LT_VALIDATION.FLAG == "E"){
                this.utilService.dismissLoader();
                this.utilService.showCustomPopup4Error("Apply OD", resultData.data.LT_VALIDATION.REASON, "FAILURE");
              }else if(resultData.data.IT_REQSUCESS.FLAG == "S"){
                const alert = this.alertCtrl.create({
                  title: "",
                  message: "<p class='header'>Apply OD</p> <p>"+resultData.data.IT_REQSUCESS.REASON+"</p>",
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
                this.utilService.dismissLoader();
                alert.present();
                
              }
            }else{
              this.utilService.dismissLoader();
              this.utilService.showCustomPopup4Error("Apply OD", resultData.message, "FAILURE");
            }
      
          };
        }, (error)=>{
          console.log("Data readed from jsonstore error",error);
          this.utilService.dismissLoader();
          this.utilService.showCustomPopup4Error("Apply OD", error.statusText, "FAILURE");
        });
      // }else{
      //   this.utilService.showCustomPopup("FAILURE", "You are in offline, Please check you internet..");
      // }
    

    }

    

  }

  // basic number selection, index is always returned in the result
 selectANumber() {
  this.selector.show({
    title: "How Many?",
    items: [
      this.jsonData.Hours, this.jsonData.Minutes
    ],
  }).then(
    result => {
      console.log(result[0].description + ' at index: ' + result[0].index);
    },
    err => console.log('Error: ', err)
    );
}

}
