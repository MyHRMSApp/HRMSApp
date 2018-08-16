import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { Nav, Platform, MenuController, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { Network } from '@ionic-native/network';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Http, Headers, RequestOptions } from '@angular/http';
import { StorageProvider } from '../../providers/storage/storage';


@IonicPage()
@Component({
  selector: 'page-apply-od',
  templateUrl: 'apply-od.html',
})
export class ApplyOdPage {
  attendanceIcon: string;
  hamburger: string;
  homeIcon: string;

  constructor(public menu: MenuController, public events: Events, private camera: Camera, 
    private http: Http, private toast: ToastController, private network: Network, 
    public loadingCtrl: LoadingController, public platform: Platform, 
    public alertCtrl: AlertController, public statusBar: StatusBar, public navCtrl: NavController, 
    public navParams: NavParams, public storage:StorageProvider, public modalCtrl: ModalController) {
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
    let myCalendar = this.modalCtrl.create("CustomTimePickerPage", {title: "START TIME"});
    myCalendar.present();
    myCalendar.onDidDismiss((data) => {
      console.log(data);
    });
  }

  toTimeSelection(){
    let myCalendar = this.modalCtrl.create("CustomTimePickerPage", {title: "END TIME"});
    myCalendar.present();
    myCalendar.onDidDismiss((data) => {
      console.log(data);
    });
  }

}
