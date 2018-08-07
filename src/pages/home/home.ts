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
    public navParams: NavParams, public storage:StorageProvider, public mainService: MyApp, public service: ServiceProvider) {
    
    this.photos = localStorage.getItem("userPicture");
    this.userName = "";
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
  this.service.invokeAdapterCall('attananceRequest', 'resource', 'post', {payload : true,length: 3,payloadData: {"IP_BEGDA": "20180601","IP_ENDDA": "20180731","IP_PERNR": "00477072"}}).then((resultDate:any)=>{
    if(resultDate){
      console.log("-->>"+resultDate);
    };
  }, (error)=>{
    console.log("Data readed from jsonstore error",error);
  });
  // this.mainService.attanancePageData = tempResponceData.__zone_symbol__value;
  // console.log(this.mainService.attanancePageData);

  // this.navCtrl.push("AttendanceViewPage");
}

coupons() {
  /**
  Method for pushing 
  */
  this.navCtrl.push("CouponsPage");
}

ionViewCanEnter() {
  this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
  this.userName = this.userInfo.EP_ENAME;
  console.log(this.userInfo);
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
  this.navCtrl.push("ApplyLeavePage");
}
     
}