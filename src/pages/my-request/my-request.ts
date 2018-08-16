import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Nav, Platform, MenuController, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { Network } from '@ionic-native/network';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Http, Headers, RequestOptions } from '@angular/http';


@IonicPage()
@Component({
  selector: 'page-my-request',
  templateUrl: 'my-request.html',
})
export class MyRequestPage {
  hamburger: string;
  homeIcon: string;
  cancelButtonLeave: boolean = false;
  cancelButtonFTP: boolean = false;
  cancelButtonOD: boolean = false;

  constructor(public menu: MenuController, public events: Events, private camera: Camera, 
    private http: Http, private toast: ToastController, private network: Network, 
    public loadingCtrl: LoadingController, public platform: Platform, 
    public alertCtrl: AlertController, public statusBar: StatusBar, public navCtrl: NavController, 
    public navParams: NavParams) { 
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyRequestPage');
    this.hamburger = ("./assets/homePageIcons/hamburger.svg");
    this.homeIcon = ("./assets/homePageIcons/Home.svg");
  }
 
    /*Acordion function for Leave*/ 
    shownLeave = null;
    toggleLeave(group) {
      if (this.isGroupLeave(group)) {
          this.shownLeave = null;
      } else {
          this.shownLeave = group;
      }
    };
    isGroupLeave(group) {
      return this.shownLeave === group;
    };

    /*Acordion function for OD*/  
    shownOD = null;
    toggleOD(group) {
      if (this.isGroupOD(group)) {
          this.shownOD = null;
      } else {
          this.shownOD = group;
      }
    };
    isGroupOD(group) {
      return this.shownOD === group;
    };
 
    /*Acordion function for FTP*/ 
    shownFTP = null;
    toggleFTP(group) {
      if (this.isGroupFTP(group)) {
          this.shownFTP = null;
      } else {
          this.shownFTP = group;
      }
    };
    isGroupFTP(group) {
      return this.shownFTP === group;
    };

    cancelLeave(){
      this.cancelButtonLeave=true;
    }
    cancelOD(){
      this.cancelButtonOD=true;
    }
    cancelFTP(){
      this.cancelButtonFTP=true;
    }

    confirmCancelLeave(){
      this.cancelButtonLeave=false;
    }
    confirmCancelOD(){
      this.cancelButtonOD=false;
    }
    confirmCancelFTP(){
      this.cancelButtonFTP=false;
    }

  openMenu() {
    this.menu.toggle();
  }

  back(){
    this.navCtrl.pop();
  }

}
