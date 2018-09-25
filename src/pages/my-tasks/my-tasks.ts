import { Component, ChangeDetectorRef } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Nav, Platform, MenuController, AlertController, LoadingController, ToastController, ModalController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { Network } from '@ionic-native/network';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Http, Headers, RequestOptions } from '@angular/http';
import { MyApp } from '../../app/app.component';
import { ServiceProvider } from '../../providers/service/service';
import { UtilsProvider } from '../../providers/utils/utils';
import {AlertPageFortextareaPage } from '../alert-page-fortextarea/alert-page-fortextarea';

@IonicPage()
@Component({
  selector: 'page-my-tasks',
  templateUrl: 'my-tasks.html',
})
export class MyTasksPage {
  hamburger: string;
  homeIcon: string;
  isDisabled = false;
  tasks = [{ title: "Vivek", selected: false, type: "CL"},
           { title: "Karthi", selected: false, type: "OD"},
           { title: "Amit", selected: false, type: "FTP"}];
  selectedAll: any;
  acceptButton: string;
  rejectButton: string;
  public approvedFlag: boolean = false;
  public showApprove: boolean = false;
  public selectedLeaves: any = [];
  public commonLeaveType:Array<any>;
  public ODLeaveType:Array<any>;
  public selectedAllFlag:boolean = false;
  public approvedRequestJSONObject:any = {'IT_INPUT': {'item': ''}};
  public rejectedRequestJSONObject:any = {'IT_INPUT': {'item': ''}};
  userInformation: any;
  employeeLevel: any;

  constructor(public menu: MenuController, public events: Events, private camera: Camera, 
    private http: Http, private toast: ToastController, private network: Network, 
    public loadingCtrl: LoadingController, public platform: Platform, 
    public alertCtrl: AlertController, public statusBar: StatusBar, public navCtrl: NavController, 
    public navParams: NavParams, public ref: ChangeDetectorRef, public mainService: MyApp, 
    public service: ServiceProvider, public utilService: UtilsProvider, public modalCtrl: ModalController ) {

    this.userInformation = JSON.parse(localStorage.getItem("userInfo"));
    this.employeeLevel = this.userInformation.EP_EGROUP;
    console.log(this.employeeLevel);
    
    this.menu.swipeEnable(false);
    this.commonLeaveType = [];
    this.ODLeaveType = [];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyTasksPage');
    this.hamburger = ("./assets/homePageIcons/hamburger.svg");
    this.homeIcon = ("./assets/homePageIcons/Home.svg");
    this.acceptButton = ("./assets/couponsImages/my-Task-Approve.svg");
    this.rejectButton = ("./assets/couponsImages/my-Task-Cancel.svg");
  }


  selectAll() {
    this.selectedAllFlag = !this.selectedAllFlag;
    this.approvedFlag = this.selectedAllFlag;
    for(var i=0; i<this.commonLeaveType.length; i++){
      this.commonLeaveType[i].selected = this.selectedAllFlag;
      console.log("this.commonLeaveType[i].selected--->>>"+JSON.stringify(this.commonLeaveType[i]));
    }
    setTimeout(() => {
      this.ref.detectChanges();
    }, 100);
  }

  unSelectAll() {
    this.selectedAllFlag = false;
    this.approvedFlag = this.selectedAllFlag;
    for(var i=0; i<this.commonLeaveType.length; i++){
      this.commonLeaveType[i].selected = this.selectedAllFlag;
      console.log("this.commonLeaveType[i].selected--->>>"+JSON.stringify(this.commonLeaveType[i]));
    }
    setTimeout(() => {
      this.ref.detectChanges();
    }, 100);
  }

  selectMe(indexValue) {
    var count = 0;
    this.commonLeaveType[indexValue].selected = !this.commonLeaveType[indexValue].selected;
    for(var i=0; i<this.commonLeaveType.length; i++){
      if(this.commonLeaveType[i].selected){
        count++;
      }
    }
    (count > 0)?this.approvedFlag = true:this.approvedFlag = false;
    setTimeout(() => {
      this.ref.detectChanges();
    }, 100);
  }

  shownGroup = null;
  toggleGroup(group) {
    if (this.isGroupShown(group)) {
        this.shownGroup = null;
    } else {
        this.shownGroup = group;
    }
    this.ref.detectChanges();
  };
  isGroupShown(group) {
      return this.shownGroup === group;
  };

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
    if(this.mainService.myTaskData.ET_LEAVE !== ""){
      if(this.mainService.myTaskData.ET_LEAVE.item.length === undefined){
        this.mainService.myTaskData.ET_LEAVE.item.selected = false;
        this.mainService.myTaskData.ET_LEAVE.item.type = this.mainService.myTaskData.ET_LEAVE.item.LEAVE_TY;
        console.log("this.mainService.myTaskData.ET_LEAVE.item---->>"+ JSON.stringify(this.mainService.myTaskData.ET_LEAVE.item));
        this.commonLeaveType.push(this.mainService.myTaskData.ET_LEAVE.item);
      }else{
        for(var i=0; i<this.mainService.myTaskData.ET_LEAVE.item.length; i++){
          this.mainService.myTaskData.ET_LEAVE.item[i].selected = false;
          this.mainService.myTaskData.ET_LEAVE.item[i].type = this.mainService.myTaskData.ET_LEAVE.item[i].LEAVE_TY;
          console.log("this.mainService.myTaskData.ET_LEAVE.item[i]---->>"+ JSON.stringify(this.mainService.myTaskData.ET_LEAVE.item[i]));
          this.commonLeaveType.push(this.mainService.myTaskData.ET_LEAVE.item[i]);
        }
      }
    }

    if(this.mainService.myTaskData.ET_OD !== ""){
      if(this.mainService.myTaskData.ET_OD.item.length === undefined){
        this.mainService.myTaskData.ET_OD.item.selected = false;
        this.mainService.myTaskData.ET_OD.item.type = "OD";
        console.log("this.mainService.myTaskData.ET_OD.item---->>"+ JSON.stringify(this.mainService.myTaskData.ET_OD.item));
        this.commonLeaveType.push(this.mainService.myTaskData.ET_OD.item);
      }else{
        for(var i=0; i<this.mainService.myTaskData.ET_OD.item.length; i++){
          this.mainService.myTaskData.ET_OD.item[i].selected = false;
          this.mainService.myTaskData.ET_OD.item[i].type = "OD";
          console.log("this.mainService.myTaskData.ET_OD.item[i]---->>"+ JSON.stringify(this.mainService.myTaskData.ET_OD.item[i]));
          this.commonLeaveType.push(this.mainService.myTaskData.ET_OD.item[i]);
        }
      }
    }

    if(this.mainService.myTaskData.ET_FTP !== ""){
      if(this.mainService.myTaskData.ET_FTP.item.length === undefined){
        this.mainService.myTaskData.ET_FTP.item.selected = false;
        this.mainService.myTaskData.ET_FTP.item.type = "FTP";
        console.log("this.mainService.myTaskData.ET_FTP.item---->>"+ JSON.stringify(this.mainService.myTaskData.ET_FTP.item));
        this.commonLeaveType.push(this.mainService.myTaskData.ET_FTP.item);
      }else{
        for(var i=0; i<this.mainService.myTaskData.ET_FTP.item.length; i++){
          this.mainService.myTaskData.ET_FTP.item[i].selected = false;
          this.mainService.myTaskData.ET_FTP.item[i].type = "FTP";
          console.log("this.mainService.myTaskData.ET_FTP.item[i]---->>"+ JSON.stringify(this.mainService.myTaskData.ET_FTP.item[i]));
          this.commonLeaveType.push(this.mainService.myTaskData.ET_FTP.item[i]);
        }
      }
    }

  }

  getPeriod(period){
    var periodRes = "";
    switch (period) {
      case "FD":
        periodRes = "full Day";
        break;
      case "FQ":
        periodRes = "1st Qtr";
        break;
      case "SQ":
        periodRes = "2nd Qtr";
        break;
      case "FH":
        periodRes = "1st half";
        break;
      case "SH":
        periodRes = "2nd half";
        break;
    } 

    return periodRes;
  }

  getTimeValue(timeData){
    timeData = timeData.toString().replace(/:/g, "");
    return timeData;
  }

  applySingleApprovedRequest(indexValue){
    this.approvedRequestJSONObject.IT_INPUT.item = {
      "PERNR": this.commonLeaveType[indexValue].PERNR,
      "REQNO":  this.commonLeaveType[indexValue].REQID,
      "RTYP": this.getLeaveTypeValue(this.commonLeaveType[indexValue].type),
      "FLAG": "A"};
      this.approvedRequestJSONObject.IP_CMNT = "";
      console.log(JSON.stringify(this.approvedRequestJSONObject));
      this.approveRejectRequestCall(this.approvedRequestJSONObject);
  }

  applySingleRejectRequest(indexValue){
      let deletionTextareaAlert = this.modalCtrl.create("AlertPageFortextareaPage");
        deletionTextareaAlert.present();
        deletionTextareaAlert.onDidDismiss((data) => { 
          console.log(data);
          this.rejectedRequestJSONObject.IT_INPUT.item = {
            "PERNR": this.commonLeaveType[indexValue].PERNR,
            "REQNO":  this.commonLeaveType[indexValue].REQID,
            "RTYP": this.getLeaveTypeValue(this.commonLeaveType[indexValue].type),
            "FLAG": "R"};
            this.rejectedRequestJSONObject.IP_CMNT = data.deleteReason;
            console.log(JSON.stringify(this.rejectedRequestJSONObject));
            this.approveRejectRequestCall(this.rejectedRequestJSONObject);
        });

  }

  applyAllApprovedRequests(){
    var approvedLsitTemp = [];
    var approvedListObject = [];
    for(var i=0; i<this.commonLeaveType.length; i++){
      if(this.commonLeaveType[i].selected){
        approvedLsitTemp.push(this.commonLeaveType[i]);
      }
    }

    if(approvedLsitTemp.length == 1){
        this.approvedRequestJSONObject.IT_INPUT.item = {
          "PERNR": approvedLsitTemp[0].PERNR,
          "REQNO":  approvedLsitTemp[0].REQID,
          "RTYP": this.getLeaveTypeValue(approvedLsitTemp[0].type),
          "FLAG": "A"
      }
    }else{
      for(var i=0; i<approvedLsitTemp.length; i++){
        approvedListObject.push({
            "PERNR": approvedLsitTemp[i].PERNR,
            "REQNO":  approvedLsitTemp[i].REQID,
            "RTYP": this.getLeaveTypeValue(approvedLsitTemp[i].type),
            "FLAG": "A"
        });
      }
      this.approvedRequestJSONObject.IT_INPUT.item = approvedListObject;
      this.approvedRequestJSONObject.IP_CMNT = "";
    }
    console.log("approvedLsitTemp--->>"+JSON.stringify(this.approvedRequestJSONObject));
    this.approveRejectRequestCall(this.approvedRequestJSONObject);
  }

  approveRejectRequestCall(payloadData){
    console.log(payloadData);
    // if(this.mainService.internetConnectionCheck){
      this.utilService.showLoader("Please wait...");
      this.service.invokeAdapterCall('commonAdapterServices', 'applyRejectTaskRequest', 'post', {payload : true, length:1, payloadData: {approvedRejectList : payloadData}}).then((resultData:any)=>{
        if(resultData){
          if(resultData.status_code == 0){
            if(resultData.data.ET_DATA.FLAG == "E"){
              this.utilService.dismissLoader();
              this.unSelectAll();
              this.utilService.showCustomPopup4Error("My Task", resultData.data.ET_DATA.REASON, "FAILURE");
            }else if(resultData.data.ET_DATA.FLAG == "S"){
              const alert = this.alertCtrl.create({
                title: "",
                message: "<p class='header'>My Task</p> <p>"+resultData.data.ET_DATA.REASON+"</p>",
                cssClass: "SUCCESS",
                enableBackdropDismiss: false,
              });
              alert.addButton({
                text: 'OK',
                handler: data => {
                  this.navCtrl.setRoot("HomePage");
                }
              });
              this.utilService.dismissLoader();
              alert.present();
              
            }
          }else{
            this.utilService.dismissLoader();
            this.utilService.showCustomPopup4Error("My Task", resultData.message, "FAILURE");
          }
    
        };
      }, (error)=>{
        console.log("Data readed from jsonstore error",error);
        this.utilService.dismissLoader();
        this.utilService.showCustomPopup4Error("My Task", error.statusText, "FAILURE");
      });
    // }else{
    //   this.utilService.showCustomPopup("FAILURE", "You are in offline, Please check you internet..");
    // }
  }

  getLeaveTypeValue(leaveType){
    var leaveTypevalue = "";
      switch (leaveType) {
        case 'CL':
          leaveTypevalue = "01";
          break;
        case 'SL':
          leaveTypevalue = "01";
          break;
        case 'PL':
          leaveTypevalue = "01";
          break;
        case 'GL':
          leaveTypevalue = "01";
          break;
        case 'OD':
          leaveTypevalue = "02";
          break;
        case 'FTP':
          leaveTypevalue = "03";
          break;
      }
      return leaveTypevalue;
  }

}