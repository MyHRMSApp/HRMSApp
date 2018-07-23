import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Nav, Platform, MenuController, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { Network } from '@ionic-native/network';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Http, Headers, RequestOptions } from '@angular/http';
import { StorageProvider } from '../../providers/storage/storage';


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
  public cal:any;
  public cameraPhoto: any;
  public base64Image: any;
  public imageOne: any;

constructor(public menu: MenuController, public events: Events, private camera: Camera, 
    private http: Http, private toast: ToastController, private network: Network, 
    public loadingCtrl: LoadingController, public platform: Platform, 
    public alertCtrl: AlertController, public statusBar: StatusBar, public navCtrl: NavController, 
    public navParams: NavParams, public storage:StorageProvider) {
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
  this.navCtrl.push("AttendanceViewPage");
}

coupons() {
  /**
  Method for pushing 
  */
  this.navCtrl.push("CouponsPage");
}
  
ionViewCanEnter() {
  /**
  * Method for Initializing JSONStore
  */
  this.storage.jsonstoreInitialize();
  /**
  * Method for reading  json data from local jsonstore
  */
  this.storage.jsonstoreReadAll("userData").then((jsonData:any)=>{
    if(jsonData){
      console.log("Data readed from jsonstore", jsonData);
    };
  }, (error)=>{
    console.log("Data readed from jsonstore error",error);
  });
    
}

ionViewDidLoad() {   
  console.log('ionViewDidLoad HomePage');
  this.photos= ("./assets/icon/viv.jpg");
  this.cal = ("./assets/icon/cal.png")
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
    this.base64Image = 'data:image/jpeg;base64,' + imageData;
    this.photos = this.base64Image;
  }, 
  (err) => {
    console.log(err);
  });
}
    

/**
* Method for update image which is taken from camera
*/
view(){
  let loading = this.loadingCtrl.create({
    spinner: 'bubbles',
    content: 'Please wait...'
  });
  loading.present();
  console.log(this.photos);
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
    this.base64Image = 'data:image/jpeg;base64,' + imageData;
    this.photos = this.base64Image;
    this.storage.jsonstoreAdd("userData", this.photos).then((response:any)=>{
      if(response){
        console.log("data added sucessfully");
      }
    },(error)=>{
      console.log("data added  from jsonstore error",error);
    });
  }, 
  (err) => {
    console.log(err);
  });
}
    
/**
* Put function to update image which is chosen from gallery
*/
gallery(){
  let loading = this.loadingCtrl.create({
    spinner: 'bubbles',
    content: 'Please wait...'
});
  loading.present();  
}   
        
       

}