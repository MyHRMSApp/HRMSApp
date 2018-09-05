import { Component, ChangeDetectorRef } from '@angular/core';
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
  isDisabled = false;

  tasks = [
    { title: "Vivek", selected: false},
    { title: "Karthi", selected: false},
    { title: "Amit", selected: false},
  ];
  selectedAll: any;
  acceptButton: string;
  rejectButton: string;

  constructor(public menu: MenuController, public events: Events, private camera: Camera, 
    private http: Http, private toast: ToastController, private network: Network, 
    public loadingCtrl: LoadingController, public platform: Platform, 
    public alertCtrl: AlertController, public statusBar: StatusBar, public navCtrl: NavController, 
    public navParams: NavParams, public ref: ChangeDetectorRef) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyTasksPage');
    this.hamburger = ("./assets/homePageIcons/hamburger.svg");
    this.homeIcon = ("./assets/homePageIcons/Home.svg");
    this.acceptButton = ("./assets/couponsImages/my-Task-Approve.svg");
    this.rejectButton = ("./assets/couponsImages/my-Task-Cancel.svg");
  }


  selectAll() {
    for (var i = 0; i < this.tasks.length; i++) {
      this.tasks[i].selected = this.selectedAll;
    }
  }

  shareMe(data) {
    console.log(data);
    this.ref.detectChanges();
  }

  shownGroup = null;
  toggleGroup(group) {
    if (this.isGroupShown(group)) {
        this.shownGroup = null;
    } else {
        this.shownGroup = group;
    }
    this.ref.detectChanges();
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