import { Component } from '@angular/core';
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

  constructor(public menu: MenuController, public events: Events, private camera: Camera, 
    private http: Http, private toast: ToastController, private network: Network, 
    public loadingCtrl: LoadingController, public platform: Platform, 
    public alertCtrl: AlertController, public statusBar: StatusBar, public navCtrl: NavController, 
    public navParams: NavParams, public storage:StorageProvider, public modalCtrl: ModalController,
    public service: ServiceProvider, public utilService: UtilsProvider,  public mainService: MyApp) {
    
      this.menu.swipeEnable(false);
      this.startDate = moment().format("DD-MM-YYYY");
      this.endDate = moment().format("DD-MM-YYYY");
      this.inTime = "00:00";
      this.outTime = "00:00";
      this.placeVisited = "";
      this.OrgVisited = "";
      this.reasonForOD = "";
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

  inTimeSelection(){
    let inTimePicker = this.modalCtrl.create("CustomTimePickerPage", {title: "START TIME"});
    inTimePicker.present();
    inTimePicker.onDidDismiss((data) => {
      console.log(data);
      this.inTime = data.time;
    });
  }

  toTimeSelection(){
    let outTimePicker = this.modalCtrl.create("CustomTimePickerPage", {title: "END TIME"});
    outTimePicker.present();
    outTimePicker.onDidDismiss((data) => {
      console.log(data);
      this.outTime = data.time;
    });
  }

  fromDateSelection(){
    let fromDatePicker = this.modalCtrl.create("CustomCalendarModelPage", {dayWiseSelectionFlag: "false", quarterWiseSelectionFlag: "false", Cal: "from", fromPage:"ODApply"});
    fromDatePicker.present();
    fromDatePicker.onDidDismiss((data) => {
      console.log(data);
      this.startDate = moment(data.leaveFromDate).format("DD-MM-YYYY");
    });
  }

  toDateSelection(){
    let toDatePicker = this.modalCtrl.create("CustomCalendarModelPage", {dayWiseSelectionFlag: "false", quarterWiseSelectionFlag: "false", Cal: "from", fromPage:"ODApply"});
    toDatePicker.present();
    toDatePicker.onDidDismiss((data) => {
      console.log(data);
      this.endDate = moment(data.leaveFromDate).format("DD-MM-YYYY");
    });
  }

  callODApplyFunction(){

    if(this.startDate === undefined || this.startDate == ""){
      this.utilService.showCustomPopup4Error("Apply OD","Please enter proper Start Date", "FAILURE");
    }else if(this.endDate === undefined || this.endDate == ""){
      this.utilService.showCustomPopup4Error("Apply OD", "Please enter proper End Date", "FAILURE");
    }else if(this.inTime === undefined || this.inTime == "00:00"){
      this.utilService.showCustomPopup4Error("Apply OD", "Please enter proper In Time", "FAILURE");
    }else if(this.outTime === undefined || this.outTime == "00:00"){
      this.utilService.showCustomPopup4Error("Apply OD","Please enter proper Out Time", "FAILURE");
    }else if(this.placeVisited === undefined || this.placeVisited == ""){
      this.utilService.showCustomPopup4Error("Apply OD", "Please enter the Place Visisted field", "FAILURE");
    }else if(this.OrgVisited === undefined || this.OrgVisited == ""){
      this.utilService.showCustomPopup4Error("Apply OD", "Please enter the Organization Visited field", "FAILURE");
    }else if(this.reasonForOD === undefined || this.reasonForOD == ""){
      this.utilService.showCustomPopup4Error("Apply OD", "Please enter the Reason field", "FAILURE");
    }else{

      this.utilService.showLoader("Please wait..");

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
    
    this.service.invokeAdapterCall('commonAdapterServices', 'applyOnDutyRequest', 'post', {payload : true, length:8, payloadData: payloadData}).then((resultData:any)=>{
      if(resultData){
        if(resultData.status_code == 200){
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

    }

    

  }

}
