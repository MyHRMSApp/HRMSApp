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
import { UtilsProvider } from '../../providers/utils/utils';

@IonicPage()
@Component({
  selector: 'page-all-leaves',
  templateUrl: 'all-leaves.html',
})
export class AllLeavesPage {
  hamburger: string;
  homeIcon: string;
  public allLeaveData:any;
  public leaveFromDate:any;
  public leaveToDate:any;
  public leaveFromTime:any;
  public leaveToTime:any;
  
  title: any;

  constructor(public menu: MenuController, public events: Events, private camera: Camera, 
    private http: Http, private toast: ToastController, private network: Network, 
    public loadingCtrl: LoadingController, public platform: Platform, 
    public alertCtrl: AlertController, public statusBar: StatusBar, public navCtrl: NavController, 
    public navParams: NavParams, public storage:StorageProvider, public modalCtrl: ModalController,
    public utilService: UtilsProvider) {

    this.title = this.navParams.get("titleName");
    this.leaveFromDate = " ";
    this.leaveToDate = " ";
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
      let myCalendar = this.modalCtrl.create("CustomCalendarModelPage", { "Cal": "from" });
      myCalendar.present();
      myCalendar.onDidDismiss((data) => {
        console.log(data);
        if(data !== undefined && data.leaveFromDate !== undefined && data.leaveFromTime !== undefined){
          this.leaveFromDate = data.leaveFromDate;
          this.leaveFromTime = data.leaveFromTime;
        }
        
      });
  }

  toDateCalendar(){
    if(this.leaveFromDate !== undefined && this.leaveFromTime !== undefined ){
      let myCalendar = this.modalCtrl.create("CustomCalendarModelPage", { "Cal": "to", "leaveFromDate": this.leaveFromDate, "leaveFromTime": this.leaveFromTime });
      myCalendar.present();
      myCalendar.onDidDismiss((data) => {
        console.log(data);
        if(data !== undefined && data.leaveToDate !== undefined && data.leaveToTime !== undefined){
          this.leaveToDate = data.leaveToDate;
          this.leaveToTime = data.leaveToTime;
        }
      });
    }else{
      this.utilService.showCustomPopup4Error(this.title, "Please select From Date..", "FAILURE")
    }
    
  }

}
