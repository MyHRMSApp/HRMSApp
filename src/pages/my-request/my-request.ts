import { Component, ChangeDetectorRef } from '@angular/core';
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
    public navParams: NavParams, private ref: ChangeDetectorRef) { 
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
      this.ref.detectChanges();
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
      this.ref.detectChanges();
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
      this.ref.detectChanges();
    };
    isGroupFTP(group) {
      return this.shownFTP === group;
    };

    cancelLeave(){
      this.cancelButtonLeave=!this.cancelButtonLeave;
      this.ref.detectChanges();
    }
    cancelOD(){
      this.cancelButtonOD=true;
      this.ref.detectChanges();
    }
    cancelFTP(){
      this.cancelButtonFTP=true;
      this.ref.detectChanges();
    }

    confirmCancelLeave(){
      this.cancelButtonLeave=false;
      this.ref.detectChanges();
    }
    confirmCancelOD(){
      this.cancelButtonOD=false;
      this.ref.detectChanges();
    }
    confirmCancelFTP(){
      this.cancelButtonFTP=false;
      this.ref.detectChanges();
    }

  openMenu() {
    this.menu.toggle();
  }

  back(){
    this.navCtrl.pop();
  }

}
