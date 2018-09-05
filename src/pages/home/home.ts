import { Component, ChangeDetectorRef } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Nav, Platform, MenuController, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { Network } from '@ionic-native/network';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Http, Headers, RequestOptions } from '@angular/http';
import { StorageProvider } from '../../providers/storage/storage';
import { MyApp } from '../../app/app.component';
import { ServiceProvider } from '../../providers/service/service';
import { UtilsProvider } from '../../providers/utils/utils';
import moment from 'moment';

/**
 * HomePage Functionalities
 * @author Vivek
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  public photos: any;
  public defaultAvatar: any;
  public cal:any;
  public cameraPhoto: any;
  public base64Image: any;
  public imageOne: any;
  public userInfo: any;
  public userName: any;
  public customMsg: any;
  jsondata: any;
  attendanceIcon: string;
  couponsIcon: any;
  leavesIcon: any;
  my_requestIcon: any;
  my_taskIcon: any;
  hamburger: string;
  public attendanceInterval:any;
  public showCustomMsg: boolean = false;
  public showTasks: boolean = false;
  showTemplate: string;
  public eyeWearCounts: any[];
  public jewelleryCounts: any[];
  public taneiraCounts: any[];
  public watchCounts: any[];
  eyeWearLength: number;
  jewelleryLength: number;
  taneiraLength: number;
  watchLength: number;

  

constructor(public menu: MenuController, public events: Events, private camera: Camera, 
    private http: Http, private toast: ToastController, private network: Network, 
    public loadingCtrl: LoadingController, public platform: Platform, 
    public alertCtrl: AlertController, public statusBar: StatusBar, public navCtrl: NavController, 
    public navParams: NavParams, public storage:StorageProvider, public mainService: MyApp, 
    public service: ServiceProvider, public utilService: UtilsProvider, public ref: ChangeDetectorRef) {

    this.eyeWearCounts = [];
    this.jewelleryCounts = [];
    this.taneiraCounts = [];
    this.watchCounts = [];
    
    this.photos = localStorage.getItem("userPicture");
    this.userName = "";
    this.customMsg = "false";
    this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
    this.userName = this.userInfo.EP_ENAME;
    console.log(this.userInfo);
    if (this.userInfo.EP_USERTYPE == "MSS"){
     this.showCustomMsg = true;
    }
    else {
      this.showCustomMsg = false;
    }
  }
  
openMenu() {
  /**
  Method for Menu Toggle
  */
  this.menu.toggle();
} 
  
attendance() {

 this.utilService.showLoader("Please wait..");
 console.log("this.mainService.attanancePageData-->"+ this.mainService.attanancePageData);
 
  if(this.mainService.attendanceCallFlag && this.mainService.attendanceN_NP1_DataFlag){
    this.attendanceDataFetch();
  }else{
    var counter = 0;
    this.attendanceInterval = setInterval(()=>{
      console.log("turn no. " + counter);
      if (this.mainService.attanancePageData !== undefined) {
        this.mainService.attanancePageData = this.mainService.attendanceN_NP1_Data;
          this.navCtrl.push("AttendanceViewPage");
          this.routerOnDeactivate();
      }else if(counter == 29){
        this.utilService.dismissLoader();
        this.utilService.showPopup("Attendance", "Internal Server Error, Please try again");
        this.routerOnDeactivate();
      }
      counter++;
    }, 1000);
  }
}

attendanceDataFetch(){
  console.log("attendanceDataFetch Menthod Called-->>");
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
        console.log(JSON.stringify(this.mainService.attanancePageData));
        this.navCtrl.push("AttendanceViewPage");
      }else{
        this.utilService.showPopup("Attendance", resultData.message);
      }

    };
  }, (error)=>{
    console.log("Data readed from jsonstore error",error);
    this.utilService.dismissLoader();
    this.utilService.showPopup("Attendance",error.statusText);
  });
}

routerOnDeactivate() {
  clearInterval(this.attendanceInterval);
}

  /**
  Method for pushing 
  */
coupons() {
  this.utilService.showLoader("Loading Coupons...");
  this.service.invokeAdapterCall('commonAdapterServices', 'getCouponsList', 'get', {payload : false}).then((resultData:any)=>{
    if(resultData) {
      if(resultData.status_code == 200){
        this.mainService.couponPageData = resultData;
        
        /**
         * ET_EYEWEAR
         */
        if(resultData.data.ET_EYEWEAR !== ""){
          if(resultData.data.ET_EYEWEAR.item.length === undefined) {
            this.eyeWearCounts.push(resultData.data.ET_EYEWEAR.item);
            this.eyeWearLength = this.eyeWearCounts.length;
          }else {
            for (let i=0; resultData.data.ET_EYEWEAR.item[i]; i++ ){
              this.eyeWearCounts.push(resultData.data.ET_EYEWEAR.item[i]);
            }
            this.eyeWearLength = this.eyeWearCounts.length;
          }
          }else{
            this.eyeWearLength = 0;
          }

         /**
         * ET_JEWELLERY
         */
        if(resultData.data.ET_JEWELLERY !== ""){
          if(resultData.data.ET_JEWELLERY.item.length === undefined) {
            this.jewelleryCounts.push(resultData.data.ET_JEWELLERY.item);
            this.jewelleryLength = this.jewelleryCounts.length;
            console.log(this.jewelleryLength);
          }else {
            for (let i=0; resultData.data.ET_JEWELLERY.item[i]; i++ ){
              this.jewelleryCounts.push(resultData.data.ET_JEWELLERY.item[i]);
            }
            this.jewelleryLength = this.jewelleryCounts.length;
          }
          }else{
            this.jewelleryLength = 0;
          }

        /**
         * ET_TANEIRA
         */
        if(resultData.data.ET_TANEIRA !== ""){
          if(resultData.data.ET_TANEIRA.item.length === undefined) {
            this.taneiraCounts.push(resultData.data.ET_TANEIRA.item);
            this.taneiraLength = this.taneiraCounts.length;
          }else {
            for (let i=0; resultData.data.ET_TANEIRA.item[i]; i++ ){
              this.taneiraCounts.push(resultData.data.ET_TANEIRA.item[i]);
            }
            this.taneiraLength = this.taneiraCounts.length;
          }
          }else{
            this.taneiraLength = 0;
          }

        /**
         * ET_WATCH
         */
        if(resultData.data.ET_WATCH !== ""){
          if(resultData.data.ET_WATCH.item.length === undefined) {
            this.watchCounts.push(resultData.data.ET_WATCH.item);
            this.watchLength = this.watchCounts.length;
          }else {
            for (let i=0; resultData.data.ET_WATCH.item[i]; i++ ){
              this.watchCounts.push(resultData.data.ET_WATCH.item[i]);
            }
            this.watchLength = this.watchCounts.length;
          }
          }else{
            this.watchLength = 0;
          }

        this.navCtrl.push("CouponsPage", {"eyeWearLength":this.eyeWearLength, "jewelleryLength": this.jewelleryLength, "taneiraLength":this.taneiraLength, "watchLength":this.watchLength,});

      } else {
        this.utilService.showPopup("Coupons", resultData.message);
      }
    };
  },
  (error)=>{
   console.log(error);
  });
}

ionViewCanEnter() {
  try {
    this.mainService.attendanceN_NP1_DataFlag = true;
    this.mainService.attendanceNP2_DataFlag = true;
    this.mainService.attendanceNA1_DataFlag = true;
    this.mainService.attendanceNA2_DataFlag = true;
    this.mainService.attendanceCallFlag = true;
    
    if(this.mainService.attendanceCallFlag && this.mainService.attendanceN_NP1_DataFlag){
      this.mainService.attendanceCallFlag = false;
      this.mainService.attendanceN_NP1_DataFlag = false;
      var payloadData = {
        "IP_SMONTH": -1,
        "IP_EMONTH": 0
      }
      this.service.invokeAdapterCall('commonAdapterServices', 'getEmployeeAttendanceData', 'post', {payload : true, length:2, payloadData: payloadData}).then((resultData:any)=>{
        if(resultData) {
          if(resultData.status_code == 200){
            this.mainService.attanancePageData = resultData.data;
            this.mainService.attendanceN_NP1_Data = resultData.data;
            this.mainService.attendanceN_NP1_DataFlag = false;
          } else {
            // this.utilService.showPopup("Attendance", resultData.message);
          }
    
        };
      }, (error)=>{
        console.log("Error",error);
      });
  }
    this.service.invokeAdapterCall('commonAdapterServices', 'getCustomUserMessage', 'get', {payload : false}).then((resultData:any)=>{
      if(resultData){
          if(resultData.customMessage != "false"){
            this.customMsg = resultData.customMessage;
            setTimeout(() => {
              this.showTasks = true;
              this.ref.detectChanges();
            }, 100);
          }else{
            this.customMsg = "false";
            setTimeout(() => {
              this.showTasks = false;
              this.ref.detectChanges();
            }, 100);
          } 
      }
    }, (error)=>{
      console.log("Error",error);
      this.utilService.showCustomPopup("FAILURE",error.statusText);
    });
    
  } catch (error) {
    console.log("catch-->>",error);
  }
}


ionViewDidLoad() {   
  console.log('ionViewDidLoad HomePage');
  this.attendanceIcon = ("./assets/homePageIcons/attendance.svg");
  this.couponsIcon = ("./assets/homePageIcons/coupon.svg");
  this.leavesIcon = ("./assets/homePageIcons/leave.svg");
  this.my_requestIcon = ("./assets/homePageIcons/my_request.svg");
  this.my_taskIcon = ("./assets/homePageIcons/my_task.svg");
  this.hamburger = ("./assets/homePageIcons/hamburger-01.svg");
}

/**
* Method which gives two options to open camera and gallery
*/
changeImage() {
  let alert = this.alertCtrl.create({
    title: "Choose Picture",
    buttons: [{
      text: 'Choose from camera',
      handler: () => this.takePhoto()
    },
    {
      text: 'Choose from gallery',
      handler: () => this.uploadPhoto()
    },
    {
      text: 'Remove picture',
      handler: () => this.removePhoto()
    }
    ]
  });
  alert.present();
}
    

/**
* Method to open camera
*/
takePhoto() {
  const options: CameraOptions = {
    quality: 30,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    saveToPhotoAlbum: true
  }
  this.camera.getPicture(options).then((imageData) => {
    this.utilService.showLoader("Updating picture..");
      if(imageData){
        console.log("getting into if condition",imageData);
        this.base64Image = 'data:image/jpeg;base64,' + imageData;
        this.photos = this.base64Image;
        localStorage.setItem("userPicture", this.photos);
        this.utilService.dismissLoader();
      }else{
        console.log("Image data not yet recieved");
        this.utilService.dismissLoader();
      }
  }, 
  (err) => {
    console.log(err);
  });
}
    
  
/**
* Method for open galeery
*/
uploadPhoto() {
  this.camera.getPicture({
    sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
    destinationType: this.camera.DestinationType.DATA_URL, quality: 30,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  }).then((imageData) => {
    this.utilService.showLoader("Updating picture..");
      if(imageData){
        console.log("getting into if condition",imageData);
        this.base64Image = 'data:image/jpeg;base64,' + imageData;
        this.photos = this.base64Image;
        localStorage.setItem("userPicture", this.photos);
        this.utilService.dismissLoader();
      }else{
        console.log("Image data not yet recieved");
        this.utilService.dismissLoader();
      } 
  }, 
  (err) => {
    console.log(err);
  });
}

removePhoto(){
  console.log("Removing picture");
  this.utilService.showLoader("Removing picture..");
  this.photos = ("./assets/icon/avatar.png");
  localStorage.setItem("userPicture", this.photos);
  this.utilService.dismissLoader();
}
          
applyLeave() {

try {
  this.utilService.showLoader("Please wait..");
  this.service.invokeAdapterCall('commonAdapterServices', 'getLeaveBalance', 'get', {payload : false}).then((resultData:any)=>{
    if(resultData){
      if(resultData.status_code == 200) {
        this.mainService.userLeaveBalanceListData = resultData.data;
        console.log(JSON.stringify(this.mainService.userLeaveBalanceListData));
        this.utilService.dismissLoader();
        this.navCtrl.push("ApplyLeavePage");
      }
      else {
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

myRequest() {
  
try {
  this.utilService.showLoader("Please wait..");
  this.service.invokeAdapterCall('commonAdapterServices', 'getMyRequestDetails', 'get', {payload : false}).then((resultData:any)=>{
    if(resultData){
      if(resultData.status_code == 200) {
        this.mainService.myRequestData = resultData.data;
        console.log(JSON.stringify(this.mainService.myRequestData));
        this.utilService.dismissLoader();
        this.navCtrl.push("MyRequestPage");
      }
      else {
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

myTask() {
  this.navCtrl.push("MyTasksPage");
}
     
}