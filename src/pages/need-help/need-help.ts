import { Component, ChangeDetectorRef } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Nav, Platform, MenuController, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { Network } from '@ionic-native/network';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Http, Headers, RequestOptions } from '@angular/http';

@IonicPage()
@Component({
  selector: 'page-need-help',
  templateUrl: 'need-help.html',
})
export class NeedHelpPage {
  hamburger: string;
  homeIcon: string;

  constructor(public menu: MenuController, public events: Events, private camera: Camera, 
    private http: Http, private toast: ToastController, private network: Network, 
    public loadingCtrl: LoadingController, public platform: Platform, 
    public alertCtrl: AlertController, public statusBar: StatusBar, public navCtrl: NavController, 
    public navParams: NavParams, public ref: ChangeDetectorRef) {

    this.menu.swipeEnable(false);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NeedHelpPage');
    this.hamburger = ("./assets/homePageIcons/hamburger.svg");
    this.homeIcon = ("./assets/homePageIcons/Home.svg");
  }

  // openMenu() {
  //   this.menu.toggle();
  // }
  
  back(){
    this.navCtrl.pop();
  }

}
