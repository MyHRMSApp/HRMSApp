import { Component, ChangeDetectorRef } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Nav, Platform, MenuController, AlertController, LoadingController, ToastController, ModalController } from 'ionic-angular';
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
  selector: 'page-apply-ftp',
  templateUrl: 'apply-ftp.html',
})
export class ApplyFtpPage {
  attendanceIcon: string;
  hamburger: string;
  homeIcon: string;
  public inPunch:any;
  public outPunch:any;
  public midInPunch:any;
  public midOutPunch:any;
  public inPunchFlag:any = "";
  public outPunchFlag:any = "";
  public midInPunchFlag:any = "";
  public midOutPunchFlag:any = "";
  public selectedDate:any;
  public ftpObject:any;
  public requestTypeSelection:any;
  userInformation: any;
  employeeLevel: any;
  select: boolean = true;
  forgot: boolean = false;


  public jsonData:any = {
    Hours: [
      { description: "00" },
      { description: "01" },
      { description: "02" },
      { description: "03" },
      { description: "04" },
      { description: "05" },
      { description: "06" },
      { description: "07" },
      { description: "08" },
      { description: "09" },
      { description: "10" },
      { description: "11" },
      { description: "12" },
      { description: "13" },
      { description: "14" },
      { description: "15" },
      { description: "16" },
      { description: "17" },
      { description: "18" },
      { description: "19" },
      { description: "20" },
      { description: "21" },
      { description: "22" },
      { description: "23" }
    ],
    Minutes: [
      { description: "00" },
      { description: "05" },
      { description: "10" },
      { description: "15" },
      { description: "20" },
      { description: "25" },
      { description: "30" },
      { description: "35" },
      { description: "40" },
      { description: "45" },
      { description: "50" },
      { description: "55" }
    ]
  };

  constructor(public menu: MenuController, public events: Events, private camera: Camera, 
    private http: Http, private toast: ToastController, private network: Network, 
    public loadingCtrl: LoadingController, public platform: Platform, 
    public alertCtrl: AlertController, public statusBar: StatusBar, public navCtrl: NavController, 
    public navParams: NavParams, public storage:StorageProvider, public modalCtrl: ModalController,
    public service: ServiceProvider, public utilService: UtilsProvider, public mainService: MyApp,
    public selector: WheelSelector, private ref: ChangeDetectorRef, public commonString: CommonStringsProvider) {

      this.userInformation = JSON.parse(localStorage.getItem(this.commonString.commonStrings.ApplyFtpPage.USERINFO_TEXT));
      this.employeeLevel = this.userInformation.EP_EGROUP;
      console.log(this.employeeLevel);
    
    this.menu.swipeEnable(false);  
    if(this.navParams.get(this.commonString.commonStrings.ApplyFtpPage.FTPDATA_TEXT)) this.ftpObject =  this.navParams.get(this.commonString.commonStrings.ApplyFtpPage.FTPDATA_TEXT);
    this.selectedDate = moment(this.ftpObject.LDATE, this.commonString.commonStrings.AllLeavesPage.YYYY_MM_DD).format(this.commonString.commonStrings.AllLeavesPage.DD_MM_YYYY);
    this.inPunch = this.ftpObject.PUN_P10;
    this.outPunch = this.ftpObject.PUN_P20;
    this.midInPunch = this.ftpObject.PUN_P25;
    this.midOutPunch = this.ftpObject.PUN_P15;
  }

  /**
   *  Method for Menu Toggle
   */
  openMenu() {
    this.menu.toggle();
  }
  back(){
    this.navCtrl.pop();
  }
  /**
   * Method for pushing 
   */
  home() {
    this.navCtrl.setRoot("HomePage");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ApplyFtpPage');
    this.attendanceIcon = (this.commonString.commonStrings.AllLeavesPage.attendanceIcon);
    this.hamburger = (this.commonString.commonStrings.AllLeavesPage.hamburgerIcon);
    this.homeIcon = (this.commonString.commonStrings.AllLeavesPage.homeIcon);
  }

  punchInTimeSelection(){
    // let inTimePicker = this.modalCtrl.create("CustomTimePickerPage", {title: "PUNCH IN"});
    // inTimePicker.present();
    // inTimePicker.onDidDismiss((data) => {
    //   console.log(data);
    //   this.inPunch = data.time+":00";
    //   this.inPunchFlag = "X";
    // });

    this.selector.show({
      title: this.commonString.commonStrings.ApplyFtpPage.PUNCHIN,
      items: [this.jsonData.Hours, this.jsonData.Minutes],
    }).then(
      result => {
        console.log(result[0].description+':'+result[1].description);
        this.inPunch = result[0].description+':'+result[1].description+":00";
        if(this.inPunch != this.commonString.commonStrings.ApplyFtpPage.ZERO_H_M_S)this.inPunchFlag = "X";
        this.ref.detectChanges();
      },
      err => console.log('Error: ', err)
      );

  }

  punchOutTimeSelection(){
    // let outTimePicker = this.modalCtrl.create("CustomTimePickerPage", {title: "PUNCH OUT"});
    // outTimePicker.present();
    // outTimePicker.onDidDismiss((data) => {
    //   console.log(data);
    //   this.outPunch = data.time+":00";
    //   this.outPunchFlag = "X";
    // });

    this.selector.show({
      title: this.commonString.commonStrings.ApplyFtpPage.PUNCHOUT,
      items: [this.jsonData.Hours, this.jsonData.Minutes],
    }).then(
      result => {
        console.log(result[0].description+':'+result[1].description);
        this.outPunch = result[0].description+':'+result[1].description+":00";
        if(this.outPunch != this.commonString.commonStrings.ApplyFtpPage.ZERO_H_M_S)this.outPunchFlag = "X";
        this.ref.detectChanges();
      },
      err => console.log('Error: ', err)
      );
  }

  midInTimeSelection(){
    // let outTimePicker = this.modalCtrl.create("CustomTimePickerPage", {title: "MID IN"});
    // outTimePicker.present();
    // outTimePicker.onDidDismiss((data) => {
    //   console.log(data);
    //   this.midInPunch = data.time+":00";
    //   this.midInPunchFlag = "X";
    // });

    this.selector.show({
      title: this.commonString.commonStrings.ApplyFtpPage.MIDIN,
      items: [this.jsonData.Hours, this.jsonData.Minutes],
    }).then(
      result => {
        console.log(result[0].description+':'+result[1].description);
        this.midInPunch = result[0].description+':'+result[1].description+":00";
        if(this.midInPunch != this.commonString.commonStrings.ApplyFtpPage.ZERO_H_M_S)this.midInPunchFlag = "X";
        this.ref.detectChanges();
      },
      err => console.log('Error: ', err)
      );
  }

  midOutTimeSelection(){
    // let outTimePicker = this.modalCtrl.create("CustomTimePickerPage", {title: "MID OUT"});
    // outTimePicker.present();
    // outTimePicker.onDidDismiss((data) => {
    //   console.log(data);
    //   this.midOutPunch = data.time+":00";
    //   this.midOutPunchFlag = "X";
    // });

    this.selector.show({
      title: this.commonString.commonStrings.ApplyFtpPage.MIDOUT,
      items: [this.jsonData.Hours, this.jsonData.Minutes],
    }).then(
      result => {
        console.log(result[0].description+':'+result[1].description);
        this.midOutPunch = result[0].description+':'+result[1].description+":00";
        if(this.midOutPunch != this.commonString.commonStrings.ApplyFtpPage.ZERO_H_M_S)this.midOutPunchFlag = "X";
        this.ref.detectChanges();
      },
      err => console.log('Error: ', err)
      );
  }

  requestType(){
    this.select = false;
    this.requestTypeSelection = this.commonString.commonStrings.ApplyFtpPage.FORGOTTORECORDMYATTENDANCE_ERROR_MSG;
    this.ref.detectChanges();
  }

  onCancel(data){
    console.log("cancel", data);
    this.select = true;
    this.ref.detectChanges();
  }

  callApplyFTPFunction(){

    if(this.inPunch !== undefined && this.outPunch !== undefined){
      var beginningTimeInPunch = moment(this.inPunch, this.commonString.commonStrings.ApplyFtpPage.HH_mm);
      var endTimeOutPunch = moment(this.outPunch, this.commonString.commonStrings.ApplyFtpPage.HH_mm);
      console.log("beginningTime.isBefore==>>"+beginningTimeInPunch.isBefore(endTimeOutPunch)); // true
    }

    if(this.employeeLevel == "E" && this.midInPunch !== undefined && this.midOutPunch !== undefined){
      var beginningTimemidInPunch = moment(this.midInPunch, this.commonString.commonStrings.ApplyFtpPage.HH_mm);
      var endTimemidOutPunch = moment(this.midOutPunch, this.commonString.commonStrings.ApplyFtpPage.HH_mm);
      console.log("beginningTime.isBefore==>>"+beginningTimemidInPunch.isBefore(endTimemidOutPunch)); // true
    }

    if(this.inPunch === undefined || this.inPunch == this.commonString.commonStrings.ApplyFtpPage.ZERO_H_M_S){
      this.utilService.showCustomPopup4Error(this.commonString.commonStrings.ApplyFtpPage.APPLYFTP_TEXT, this.commonString.commonStrings.ApplyFtpPage.INPUNCHVALIDATE_TEXT, this.commonString.commonStrings.AllLeavesPage.FAILURE);
    }else if(this.outPunch === undefined || this.outPunch == this.commonString.commonStrings.ApplyFtpPage.ZERO_H_M_S){
      this.utilService.showCustomPopup4Error(this.commonString.commonStrings.ApplyFtpPage.APPLYFTP_TEXT, this.commonString.commonStrings.ApplyFtpPage.OUTPUNCHVALIDATE_TEXT, this.commonString.commonStrings.AllLeavesPage.FAILURE);
    }else if(!beginningTimeInPunch.isBefore(endTimeOutPunch)){
      this.utilService.showCustomPopup4Error(this.commonString.commonStrings.ApplyFtpPage.APPLYFTP_TEXT, this.commonString.commonStrings.ApplyFtpPage.INANDOUTVALIDATE_TEXT, this.commonString.commonStrings.AllLeavesPage.FAILURE);
    }else if(this.employeeLevel == "E" && this.midOutPunch !== undefined && this.midOutPunch !== this.commonString.commonStrings.ApplyFtpPage.ZERO_H_M_S && this.midInPunch == undefined){
      this.utilService.showCustomPopup4Error(this.commonString.commonStrings.ApplyFtpPage.APPLYFTP_TEXT, this.commonString.commonStrings.ApplyFtpPage.MIDINPUNCHVALIDATE_TEXT, this.commonString.commonStrings.AllLeavesPage.FAILURE);
    }else if(this.employeeLevel == "E" && this.midOutPunch !== undefined && this.midOutPunch !== this.commonString.commonStrings.ApplyFtpPage.ZERO_H_M_S && this.midInPunch == this.commonString.commonStrings.ApplyFtpPage.ZERO_H_M_S){
      this.utilService.showCustomPopup4Error(this.commonString.commonStrings.ApplyFtpPage.APPLYFTP_TEXT, this.commonString.commonStrings.ApplyFtpPage.MIDINPUNCHVALIDATE_TEXT, this.commonString.commonStrings.AllLeavesPage.FAILURE);
    }else if(this.employeeLevel == "E" && this.midInPunch !== undefined && this.midInPunch !== this.commonString.commonStrings.ApplyFtpPage.ZERO_H_M_S && this.midOutPunch === undefined){
      this.utilService.showCustomPopup4Error(this.commonString.commonStrings.ApplyFtpPage.APPLYFTP_TEXT, this.commonString.commonStrings.ApplyFtpPage.MIDOUTPUNCHVALIDATE_TEXT, this.commonString.commonStrings.AllLeavesPage.FAILURE);
    }else if(this.employeeLevel == "E" && this.midInPunch !== undefined && this.midInPunch !== this.commonString.commonStrings.ApplyFtpPage.ZERO_H_M_S && this.midOutPunch == this.commonString.commonStrings.ApplyFtpPage.ZERO_H_M_S){
      this.utilService.showCustomPopup4Error(this.commonString.commonStrings.ApplyFtpPage.APPLYFTP_TEXT, this.commonString.commonStrings.ApplyFtpPage.MIDOUTPUNCHVALIDATE_TEXT, this.commonString.commonStrings.AllLeavesPage.FAILURE);
    }else if(this.employeeLevel == "E" && this.midOutPunch !== undefined && this.midInPunch !== undefined && this.midOutPunch !== this.commonString.commonStrings.ApplyFtpPage.ZERO_H_M_S && this.midInPunch !== this.commonString.commonStrings.ApplyFtpPage.ZERO_H_M_S && !endTimemidOutPunch.isBefore(beginningTimemidInPunch)){
      this.utilService.showCustomPopup4Error(this.commonString.commonStrings.ApplyFtpPage.APPLYFTP_TEXT, this.commonString.commonStrings.ApplyFtpPage.MIDINANDOUTPUNCHVALIDATE_TEXT, this.commonString.commonStrings.AllLeavesPage.FAILURE);
    }else if(this.requestTypeSelection === undefined){
      this.utilService.showCustomPopup4Error(this.commonString.commonStrings.ApplyFtpPage.APPLYFTP_TEXT, this.commonString.commonStrings.ApplyFtpPage.REQUESTTYPEVALIDATE_TEXT, this.commonString.commonStrings.AllLeavesPage.FAILURE);
    }else{

      var payloadData = {
        "DATUM": moment(this.selectedDate, this.commonString.commonStrings.AllLeavesPage.DD_MM_YYYY).format(this.commonString.commonStrings.AllLeavesPage.YYYYMMDD),
        "SFT_IN": this.inPunch,
        "SFT_OUT": this.outPunch,
        "LUN_IN": this.midInPunch,
        "LUN_OUT": this.midOutPunch,
        "LUN_IN_FLAG": this.midInPunchFlag,
        "LUN_OUT_FLAG": this.midOutPunchFlag,
        "SFT_IN_FLAG": this.inPunchFlag,
        "SFT_OUT_FLAG": this.outPunchFlag,
        "R_TYPE": "1"
      }

      console.log(payloadData);
      // if(this.mainService.internetConnectionCheck){
        this.utilService.showLoader("Please wait...");
        this.service.invokeAdapterCall(this.commonString.commonStrings.AllLeavesPage.commonAdapterServices, this.commonString.commonStrings.ApplyFtpPage.APPLYFTPREQUEST_TEXT, 'post', {payload : true, length:10, payloadData: payloadData}).then((resultData:any)=>{
          if(resultData){
            if(resultData.status_code == 0){
              if(resultData.data.ET_DATA.item.TYPE == "E"){
                this.utilService.dismissLoader();
                this.utilService.showCustomPopup4Error(this.commonString.commonStrings.ApplyFtpPage.APPLYFTP_TEXT, resultData.data.ET_DATA.item.MESSAGE, this.commonString.commonStrings.AllLeavesPage.FAILURE);
              }else if(resultData.data.ET_DATA.item.TYPE == "S"){
                const alert = this.alertCtrl.create({
                  title: "",
                  message: "<p class='header'>Apply FTP</p> <p>"+resultData.data.ET_DATA.item.MESSAGE+"</p>",
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
                    this.navCtrl.setRoot(this.commonString.commonStrings.AllLeavesPage.HomePage);
                  }
                });
                this.utilService.dismissLoader();
                alert.present();
                
              }
            }else{
              this.utilService.dismissLoader();
              this.utilService.showCustomPopup4Error(this.commonString.commonStrings.ApplyFtpPage.APPLYFTP_TEXT, resultData.message, this.commonString.commonStrings.AllLeavesPage.FAILURE);
            }
      
          };
        }, (error)=>{
          console.log(error);
          this.utilService.dismissLoader();
          this.utilService.showCustomPopup4Error(this.commonString.commonStrings.ApplyFtpPage.APPLYFTP_TEXT, "102: Oops! Something went wrong, Please try again", this.commonString.commonStrings.AllLeavesPage.FAILURE);
        });
      // }else{
      //   this.utilService.showCustomPopup("FAILURE", "You are in offline, Please check you internet..");
      // }
    }
    
    
    // else if(this.employeeLevel == "E" && this.midInPunch === undefined || this.employeeLevel == "E" && this.midInPunch == "00:00:00"){
    //   this.utilService.showCustomPopup4Error("Apply FTP", "Please select proper Mid In Punch", "FAILURE");
    // }else if(this.employeeLevel == "E" &&  this.midOutPunch === undefined || this.employeeLevel == "E" && this.midOutPunch == "00:00:00"){
    //   this.utilService.showCustomPopup4Error("Apply FTP","Please select proper Mid Out Punch", "FAILURE");
    // }else if(this.employeeLevel == "E" &&  !endTimemidOutPunch.isBefore(beginningTimemidInPunch)){
    //   this.utilService.showCustomPopup4Error("Apply FTP","Please enter the valid MidIn & MidOut Time", "FAILURE");
    // }else if(this.requestTypeSelection === undefined){
    //   this.utilService.showCustomPopup4Error("Apply FTP","Please select Request Type", "FAILURE");
    // }
    
  }

  getRequestString(string){
    var res = string.slice(0, 5);
    return res;
  }
}
