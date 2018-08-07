import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Nav, Platform, MenuController, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { Network } from '@ionic-native/network';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Http, Headers, RequestOptions } from '@angular/http';
import { StorageProvider } from '../../providers/storage/storage';
import { CalendarComponentOptions } from 'ion2-calendar';
import { MyApp } from '../../app/app.component';
import moment from 'moment';


@IonicPage()
@Component({
  selector: 'page-attendance-view',
  templateUrl: 'attendance-view.html',
})
export class AttendanceViewPage {
  public calenderVIew:boolean = false;
 
  public optionsRange:any;
  public dateRange:any;
  public showingDate:any;
  public showingMonth:any;
  public totalHoursWorked:any;
  public punchIN:any;
  public punchOUT:any;
  public midIN:any;
  public midOUT:any;
  public firstHalfStatus:any;
  public secHalfStatus:any;
  public currentDate:any = "30";
  public currentMonth:any = "JUL";
  public currentCssClass:any;
  public requests_ATT_1:any;
  public requests_ATT_2:any;
  public calStartDate:any;
  public calEndDate:any;
  homeIcon: string;
  hamburger: string;
  

  // dateRange: string[] = ['2018-07-021', '2018-01-02', '2018-01-05'];

  constructor(public menu: MenuController, public events: Events, private camera: Camera, 
    private http: Http, private toast: ToastController, private network: Network, 
    public loadingCtrl: LoadingController, public platform: Platform, 
    public alertCtrl: AlertController, public statusBar: StatusBar, public navCtrl: NavController, 
    public navParams: NavParams, public storage:StorageProvider, public mainService: MyApp) {
  }
  
  /**
  *Method for Menu Toggle
  */
  openMenu() {
    this.menu.toggle();
  }

  /**
  *Method for pushing 
  */
  home() {
    this.navCtrl.setRoot("HomePage");
  }

  ionViewDidLoad() {
    this.hamburger = ("./assets/homePageIcons/hamburger.svg");
    this.homeIcon = ("./assets/homePageIcons/Home.svg");
    console.log('ionViewDidLoad AttendanceViewPage');
  }

  onChange($event) {
    console.log(moment($event._d).format("YYYY-MM-DD"));
    var currentDayData = this.mainService.attanancePageData.find(x=>x.map.LDATE == moment($event._d).format("YYYY-MM-DD"));
    if(currentDayData){
      this.currentDate = moment(currentDayData.map.LDATE).format("DD").toString();
      this.currentMonth = moment(currentDayData.map.LDATE).format("MMM").toString();
      this.punchIN = currentDayData.map.PUN_P10;
      this.punchOUT = currentDayData.map.PUN_P20;
      this.midIN = currentDayData.map.PUN_P25;
      this.midOUT = currentDayData.map.PUN_P15;
      this.currentCssClass = "Cur_"+currentDayData.map.cssClass;
      this.totalHoursWorked = currentDayData.map.ATT;
      this.requests_ATT_1 = (currentDayData.map.RS_ATT1)?currentDayData.map.RS_ATT1:null;
      this.requests_ATT_2 = (currentDayData.map.RS_ATT2)?currentDayData.map.RS_ATT2:null;
      console.log(currentDayData);
    }else{
      this.currentDate = moment().format("DD").toString();
      this.currentMonth = moment().format("MMM").toString();
      this.punchIN = "00:00:00";
      this.punchOUT = "00:00:00";
      this.midIN = "00:00:00";
      this.midOUT = "00:00:00";
      this.currentCssClass = "Cur_ATT1_NomalPunch_ATT2_NormalPunch";
      this.totalHoursWorked = "0";
      this.requests_ATT_1 = null;
      this.requests_ATT_2 = null;
    }
    
  }

  ionViewCanEnter() {

    console.log('ionViewCanEnter HomePage');
    var date = new Date(), y = date.getFullYear(), m = date.getMonth();

    var firstDay = new Date(y, m - 2, 1);
    var lastDay = new Date(y, m + 3, 0);

    this.calStartDate = moment(firstDay).format("YYYY, MM, DD").toString();
    this.calEndDate = moment(lastDay).format("YYYY, MM, DD").toString();

    // setTimeout(() => {
    // this.mfpAuthInit();
    // }, 2000);
    // this.mainService.attanancePageData = this.mainService.attanancePageData.__zone_symbol__value;
    console.log(this.mainService.attanancePageData.length);
    var jsonArr = [];
    for (var i = 0; i < this.mainService.attanancePageData.length; i++) {
      console.log(moment().format("YYYY-MM-DD").toString()+"=="+this.mainService.attanancePageData[i].map.LDATE.toString());
      if(this.mainService.attanancePageData[i].map.LDATE.toString() == moment().format("YYYY-MM-DD").toString()){
        this.currentDate = moment().format("DD").toString();
        this.currentMonth = moment().format("MMM").toString();
        this.punchIN = this.mainService.attanancePageData[i].map.PUN_P10;
        this.punchOUT = this.mainService.attanancePageData[i].map.PUN_P20;
        this.midIN = this.mainService.attanancePageData[i].map.PUN_P25;
        this.midOUT = this.mainService.attanancePageData[i].map.PUN_P15;
        this.currentCssClass = "Cur_"+this.mainService.attanancePageData[i].map.cssClass;
        this.totalHoursWorked = this.mainService.attanancePageData[i].map.ATT;
        this.requests_ATT_1 = (this.mainService.attanancePageData[i].map.RS_ATT1)?this.mainService.attanancePageData[i].map.RS_ATT1:null;
        this.requests_ATT_2 = (this.mainService.attanancePageData[i].map.RS_ATT2)?this.mainService.attanancePageData[i].map.RS_ATT2:null;
      }
      jsonArr.push({
        date: this.mainService.attanancePageData[i].map.LDATE,
        cssClass: (moment().format("YYYY-MM-DD").toString() == this.mainService.attanancePageData[i].map.LDATE.toString())?this.mainService.attanancePageData[i].map.cssClass+" todayClass":this.mainService.attanancePageData[i].map.cssClass,
        subTitle: (moment().format("YYYY-MM-DD").toString() == this.mainService.attanancePageData[i].map.LDATE.toString())?"Today":""
      });
  }

  console.log(jsonArr);
    var tempoptionsRange : CalendarComponentOptions = {
      color : 'danger',
      from: this.calStartDate,
      to: this.calEndDate,
      daysConfig: jsonArr,
      showMonthPicker: false,
      weekStart: 1
    };

    setTimeout(() => {
      this.optionsRange = tempoptionsRange;
      this.calenderVIew = true;
    }, 100);
  
  }
  

  applyLeave() {
    this.navCtrl.push("ApplyLeavePage");
  }
  applyOD(){
    this.navCtrl.push("ApplyOdPage");
  }
  applyFTP(){
    this.navCtrl.push("ApplyFtpPage");
  }
}
