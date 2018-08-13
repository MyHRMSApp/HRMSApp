import { Component } from '@angular/core';
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

constructor(public menu: MenuController, public events: Events, private camera: Camera, 
    private http: Http, private toast: ToastController, private network: Network, 
    public loadingCtrl: LoadingController, public platform: Platform, 
    public alertCtrl: AlertController, public statusBar: StatusBar, public navCtrl: NavController, 
    public navParams: NavParams, public storage:StorageProvider, public mainService: MyApp, 
    public service: ServiceProvider, public utilService: UtilsProvider) {
    
    this.photos = localStorage.getItem("userPicture");
    this.userName = "";
    this.customMsg = "";
    this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
    this.userName = this.userInfo.EP_ENAME;
    this.customMsg = this.userInfo.customMsg;
    console.log(this.userInfo);
  }
  
openMenu() {
  /**
  Method for Menu Toggle
  */
  this.menu.toggle();
} 
  
attendance() {
  /**
  Method for pushing 
  */
 this.utilService.showLoader("Please wait..");
 var date = new Date(), y = date.getFullYear(), m = date.getMonth();
 var firstDay = new Date(y, m - 2, 1);
 var lastDay = new Date(y, m + 3, 0);
 var calStartDate = moment(firstDay).format("YYYYMMDD").toString();
 var calEndDate = moment(lastDay).format("YYYYMMDD").toString();

  this.service.invokeAdapterCall('commonAdapterServices', 'getEmployeeAttendanceData', 'get', {payload : false}).then((resultData:any)=>{
    if(resultData){
      if(resultData.status_code == 200){
        this.mainService.attanancePageData = resultData.data;
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
  // this.mainService.attanancePageData = tempResponceData.__zone_symbol__value;
  // console.log(this.mainService.attanancePageData);

  // this.navCtrl.push("AttendanceViewPage");
}

  /**
  Method for pushing 
  */
coupons() {
  this.service.invokeAdapterCall('commonAdapterServices', 'getCouponsList', 'get', {payload : true, length:1, payloadData: {"IV_PERNR": "00477072"}}).then((resultData:any)=>{
  this.mainService.couponPageData = resultData;
  console.log(resultData);
  this.navCtrl.push("CouponsPage");
  },
  (error)=>{
   console.log(error);
  });
}

// ionViewCanEnter() {
//   this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
//   this.userName = this.userInfo.EP_ENAME;
//   this.customMsg = this.userInfo.customMsg;
//   console.log(this.userInfo);
// }


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
    buttons: [{
      text: 'Camera',
      handler: () => this.takePhoto()
    },
    {
      text: 'Gallery',
      handler: () => this.uploadPhoto()
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
          
applyLeave() {
  this.utilService.showLoader("Please wait..");
  this.service.invokeAdapterCall('commonAdapterServices', 'getLeaveBalance', 'get', {payload : false}).then((resultData:any)=>{
    if(resultData){
      if(resultData.status_code == 200){
        this.mainService.userLeaveBalanceListData = resultData.data;
        console.log(JSON.stringify(this.mainService.userLeaveBalanceListData));
        this.navCtrl.push("ApplyLeavePage");
      }else{
        this.utilService.showPopup("Leave Balance", resultData.message);
      }

    };
  }, (error)=>{
    console.log("Data readed from jsonstore error",error);
    this.utilService.dismissLoader();
    this.utilService.showPopup("Leave Balance",error.statusText);
  });

}
     
}