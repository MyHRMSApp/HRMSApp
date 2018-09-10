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
  tasks = [{ title: "Vivek", selected: false, type: "CL"},
           { title: "Karthi", selected: false, type: "OD"},
           { title: "Amit", selected: false, type: "FTP"}];
  selectedAll: any;
  acceptButton: string;
  rejectButton: string;
  public selectAllCheckmark: boolean = false;
  public showApprove: boolean = false;
  selectedLeaves: any = [];

  constructor(public menu: MenuController, public events: Events, private camera: Camera, 
    private http: Http, private toast: ToastController, private network: Network, 
    public loadingCtrl: LoadingController, public platform: Platform, 
    public alertCtrl: AlertController, public statusBar: StatusBar, public navCtrl: NavController, 
    public navParams: NavParams, public ref: ChangeDetectorRef) {

    this.menu.swipeEnable(false);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyTasksPage');
    this.hamburger = ("./assets/homePageIcons/hamburger.svg");
    this.homeIcon = ("./assets/homePageIcons/Home.svg");
    this.acceptButton = ("./assets/couponsImages/my-Task-Approve.svg");
    this.rejectButton = ("./assets/couponsImages/my-Task-Cancel.svg");
  }


  selectAll(data) {
    //console.log(data);
    this.ref.detectChanges();
    if (data == true) {
      this.showApprove = true;
      this.ref.detectChanges();
      for (var i = 0; i < this.tasks.length; i++) {
        this.tasks[i].selected = true;
      }
    }
    else {
      this.showApprove = false;
      this.ref.detectChanges();
      for (var j = 0; j < this.tasks.length; j++) {
        this.tasks[j].selected = false;
      }
    }
  }

  selectMe(data) {
    //console.log(data);
    if (data.selected == true) {
      this.showApprove = true;
      this.ref.detectChanges();
      data = {
        emp_name: data.title,
        type: data.type,
      }
      this.selectedLeaves.push(data);
      
    }
    else {
      let uncheckedLeave = data.type;
      console.log("Checked == false", uncheckedLeave);
      this.ref.detectChanges();
      for (let i = 0; i < this.selectedLeaves.length; i++) {
        console.log(this.selectedLeaves[i].type);
        if (this.selectedLeaves[i].type == uncheckedLeave) {
          this.selectedLeaves.splice(i, 1);
          console.log(this.selectedLeaves);
          console.log(this.selectedLeaves.length);
          if (this.selectedLeaves.length == "0") {
            this.showApprove = false;
            this.ref.detectChanges();
          }
        }
    }
  }
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

  home() {
    this.navCtrl.setRoot("HomePage");
  }

}