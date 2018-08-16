import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Nav, Platform, MenuController, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { Network } from '@ionic-native/network';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Http, Headers, RequestOptions } from '@angular/http';

@IonicPage()
@Component({
  selector: 'page-my-tasks',
  templateUrl: 'my-tasks.html',
})
export class MyTasksPage {
  hamburger: string;
  homeIcon: string;

  tasks = [
    { title: "Vivek"},
    { title: "Karthi"},
    { title: "Amit"},
  ];

  constructor(public menu: MenuController, public events: Events, private camera: Camera, 
    private http: Http, private toast: ToastController, private network: Network, 
    public loadingCtrl: LoadingController, public platform: Platform, 
    public alertCtrl: AlertController, public statusBar: StatusBar, public navCtrl: NavController, 
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyTasksPage');
    this.hamburger = ("./assets/homePageIcons/hamburger.svg");
    this.homeIcon = ("./assets/homePageIcons/Home.svg");
  }

  shownGroup = null;
  toggleGroup(group) {
    if (this.isGroupShown(group)) {
        this.shownGroup = null;
    } else {
        this.shownGroup = group;
    }
};
isGroupShown(group) {
    return this.shownGroup === group;
};

  openMenu() {
    this.menu.toggle();
  }
  
  back(){
    this.navCtrl.pop();
  }

}
