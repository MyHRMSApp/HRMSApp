import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Nav, Platform, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { Network } from '@ionic-native/network';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Http, Headers, RequestOptions } from '@angular/http';


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

  constructor(public events: Events, private camera: Camera, private http: Http, private toast: ToastController, private network: Network, public loadingCtrl: LoadingController, public platform: Platform, public alertCtrl: AlertController, public statusBar: StatusBar, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
    this.photos= ("./assets/icon/viv.jpg");
    this.cal = ("./assets/icon/cal.png")
  }

    //Click function to upload the image which gives two options CAMERA and GALLERY
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
    
    //Click function to open CAMERA
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
        //localStorage.setItem("userPhoto", this.photos);
        //this.view();
      }, 
      (err) => {
        console.log(err);
      });
    }
    
    //Put function to update image which is taken from CAMERA
    view(){
      let loading = this.loadingCtrl.create({
        spinner: 'bubbles',
        content: 'Please wait...'
      });
  
      loading.present();
  
      console.log(this.photos);

    }
  
    //Click function to open GALLERY
    uploadPhoto() {
      this.camera.getPicture({
        sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
        destinationType: this.camera.DestinationType.DATA_URL, quality: 30,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
      }).then((imageData) => {
  
        this.base64Image = 'data:image/jpeg;base64,' + imageData;
        this.photos = this.base64Image;
        //localStorage.setItem("userPhoto", this.photos);
        //this.gallery();
      }, 
      (err) => {
        console.log(err);
      });
    }
    
    //Put function to update image which is chosen from GALLERY
    gallery(){
      let loading = this.loadingCtrl.create({
        spinner: 'bubbles',
        content: 'Please wait...'
      });
  
      loading.present();
  
        
    }   
        
       

}
