import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Nav, Platform, MenuController, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { Network } from '@ionic-native/network';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Http, Headers, RequestOptions } from '@angular/http';
import { StorageProvider } from '../../providers/storage/storage';
import { CalendarComponentOptions } from 'ion2-calendar';


@IonicPage()
@Component({
  selector: 'page-attendance-view',
  templateUrl: 'attendance-view.html',
})
export class AttendanceViewPage {

  // dateRange: { from: string; to: string; };
  type: 'string'; // 'string' | 'js-date' | 'moment' | 'time' | 'object'
  optionsRange: CalendarComponentOptions = {
    color : 'danger',
    from: new Date(2018, 4, 1),
    to: new Date(2018, 7, 15),
    daysConfig: [{
                  date: new Date(),
                  subTitle: 'Today',
                  cssClass : 'todayClass'
                },
                {
                  date: new Date(2018, 6, 5),
                  cssClass : 'yellow'
                },
                {
                  date: new Date(2018, 6, 1),
                  cssClass : 'green'
                },
                {
                  date: new Date(2018, 6, 15),
                  cssClass : 'red'
                },
                {
                  date: new Date(2018, 6, 16),
                  cssClass : 'holiday'
                },
                {
                  date: new Date(2018, 6, 30),
                  cssClass : 'greenyellow'
                },
                {
                  date: new Date(2018, 6, 29),
                  cssClass : 'greentran'
                },
                {
                  date: new Date(2018, 6, 25),
                  cssClass : 'greenyellow'
                }],
    showMonthPicker: false
  };

  dateRange = {from: '2018-07-21'};

  // dateRange: string[] = ['2018-07-021', '2018-01-02', '2018-01-05'];

  constructor(public menu: MenuController, public events: Events, private camera: Camera, 
    private http: Http, private toast: ToastController, private network: Network, 
    public loadingCtrl: LoadingController, public platform: Platform, 
    public alertCtrl: AlertController, public statusBar: StatusBar, public navCtrl: NavController, 
    public navParams: NavParams, public storage:StorageProvider) {
  }

  openMenu() {
    /**
    Method for Menu Toggle
    */
    this.menu.toggle();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AttendanceViewPage');
  }

  onChange($event) {
    console.log($event);
  }

}
