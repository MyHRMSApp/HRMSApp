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
  

constructor(public menu: MenuController, public events: Events, private camera: Camera, 
    private http: Http, private toast: ToastController, private network: Network, 
    public loadingCtrl: LoadingController, public platform: Platform, 
    public alertCtrl: AlertController, public statusBar: StatusBar, public navCtrl: NavController, 
    public navParams: NavParams, public storage:StorageProvider, public mainService: MyApp, 
    public service: ServiceProvider, public utilService: UtilsProvider, public ref: ChangeDetectorRef) {
    
    this.photos = localStorage.getItem("userPicture");
    this.userName = "";
    this.customMsg = "false";
    this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
    this.userName = this.userInfo.EP_ENAME;
    console.log(this.userInfo);
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
  this.mainService.couponPageData = resultData;
  console.log(resultData);
  this.navCtrl.push("CouponsPage");
  },
  (error)=>{
   console.log(error);
  });
}

ionViewCanEnter() {
  try {
    this.utilService.showLoader("Please wait..");
    
    if(this.mainService.attendanceCallFlag && this.mainService.attendanceN_NP1_DataFlag){
      this.mainService.attendanceCallFlag = false;
      this.mainService.attendanceN_NP1_DataFlag = false;
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
          }else{
            // this.utilService.showPopup("Attendance", resultData.message);
          }
    
        };
      }, (error)=>{
        console.log("Data readed from jsonstore error",error);
      });
  }


    this.service.invokeAdapterCall('commonAdapterServices', 'getCustomUserMessage', 'get', {payload : false}).then((resultData:any)=>{
      if(resultData){
          if(resultData.customMessage != "false"){
            this.customMsg = resultData.customMessage;
            this.showCustomMsg = true;
            this.ref.detectChanges();
          }else{
            this.customMsg = "false";
            this.showCustomMsg = false;
            this.ref.detectChanges();
          }
      }
      this.utilService.dismissLoader();
    }, (error)=>{
      console.log("Data readed from jsonstore error",error);
      this.utilService.dismissLoader();
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
    setTimeout(()=>{
      if(imageData){
        console.log("getting into if condition",imageData);
        this.base64Image = 'data:image/jpeg;base64,' + imageData;
        this.photos = this.base64Image;
        this.storage.jsonstoreInitialize().then(()=>{
          this.storage.jsonstoreClearCollection("userImage").then((response:any)=>{
            if(response){
              console.log("data cleared sucessfully");
            }
          },(error)=>{
            console.log("data cleared error",error);
          });
          this.storage.jsonstoreAdd("userImage", this.photos).then((response:any)=>{
            if(response){
              console.log("data added sucessfully");
              localStorage.setItem("userPicture", this.photos);
            }
          },(error)=>{
            console.log("data added from jsonstore error",error);
          });
        });
      }else{
        console.log("Image data not yet recieved");
      } 
    },1000); 
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
    setTimeout(()=>{
      if(imageData){
        console.log("getting into if condition",imageData);
        this.base64Image = 'data:image/jpeg;base64,' + imageData;
        this.photos = this.base64Image;
        this.storage.jsonstoreInitialize().then(()=>{
          this.storage.jsonstoreClearCollection("userImage").then((response:any)=>{
            if(response){
              console.log("data cleared sucessfully");
            }
          },(error)=>{
            console.log("data cleared error",error);
          });
          this.storage.jsonstoreAdd("userImage", this.photos).then((response:any)=>{
            if(response){
              console.log("data added sucessfully");
              localStorage.setItem("userPicture", this.photos);
            }
          },(error)=>{
            console.log("data added from jsonstore error",error);
          });
        });
      }else{
        console.log("Image data not yet recieved");
      } 
    },1000); 
  }, 
  (err) => {
    console.log(err);
  });
}

removePhoto(){
  console.log("Remove Picture");
  this.photos = ("./assets/icon/avatar.png");
  this.storage.jsonstoreInitialize().then(()=>{
    this.storage.jsonstoreClearCollection("userImage").then((response:any)=>{
      if(response){
        console.log("data cleared sucessfully");
      }
    },(error)=>{
      console.log("data cleared error",error);
    });
    this.storage.jsonstoreAdd("userImage", this.photos).then((response:any)=>{
      if(response){
        console.log("data added sucessfully");
        localStorage.setItem("userPicture", this.photos);
      }
    },(error)=>{
      console.log("data added from jsonstore error",error);
    });
  });
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

myRequest() {
  this.navCtrl.push("MyRequestPage");
}

myTask() {
  this.navCtrl.push("MyTasksPage");
}
     
}