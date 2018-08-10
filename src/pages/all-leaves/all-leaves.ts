import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Nav, Platform, MenuController, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { Network } from '@ionic-native/network';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Http, Headers, RequestOptions } from '@angular/http';
import { StorageProvider } from '../../providers/storage/storage';
import { CalendarModal, CalendarModalOptions, DayConfig, CalendarResult } from "ion2-calendar";
import { ModalController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-all-leaves',
  templateUrl: 'all-leaves.html',
})
export class AllLeavesPage {
  hamburger: string;
  homeIcon: string;
  public allLeaveData:any;
  
  title: any;

  constructor(public menu: MenuController, public events: Events, private camera: Camera, 
    private http: Http, private toast: ToastController, private network: Network, 
    public loadingCtrl: LoadingController, public platform: Platform, 
    public alertCtrl: AlertController, public statusBar: StatusBar, public navCtrl: NavController, 
    public navParams: NavParams, public storage:StorageProvider, public modalCtrl: ModalController) {

    this.title = this.navParams.get("titleName");
  }

  ionViewDidLoad() {
    this.hamburger = ("./assets/homePageIcons/hamburger.svg");
    this.homeIcon = ("./assets/homePageIcons/Home.svg");
    console.log('ionViewDidLoad AllLeavesPage');
  }

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
    this.allLeaveData = this.navParams.get("userLeave");
  }

  fromDateCalendar(){
      // const options: CalendarModalOptions = {
      //   title: 'BASIC',
      // };
  
      // let myCalendar = this.modalCtrl.create("CalenderModelPage");
  
      // myCalendar.present();
  
      // myCalendar.onDidDismiss((date) => {
      //   console.log(date);
      // });

  }

}
