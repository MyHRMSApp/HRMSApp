import { Component, ViewChild, Renderer } from '@angular/core';
import { Nav, Platform,AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { StorageProvider } from '../providers/storage/storage';
import { AuthHandlerProvider } from '../providers/auth-handler/auth-handler';
import { UtilsProvider } from '../providers/utils/utils';

declare var WL;
declare var WLAuthorizationManager;
declare var document:any;
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = "LoginPage";

  pages: Array<{title: string, component: any}>;
  jsondata: any;
  public photos: any;
  public attanancePageData: any;
  public couponPageData: any;
  public userInformation: any;
  public userLeaveBalanceListData: any;
  public userFrishLogin:boolean  = true;
  public attendanceCallFlag:boolean = true;
  public attendanceNA1_Data:any;
  public attendanceNA2_Data:any;
  public attendanceN_NP1_Data:any;
  public attendanceNP2_Data:any;
  public attendanceN_NP1_DataFlag:boolean = true;
  public attendanceNP2_DataFlag:boolean = true;
  public attendanceNA1_DataFlag:boolean = true;
  public attendanceNA2_DataFlag:boolean = true;
  public leaveEncashData:any;
  public myRequestData:any;
  
  constructor(public platform: Platform,
    public statusBar: StatusBar,
    public render:Renderer,
    private authHandler: AuthHandlerProvider,
    public storage:StorageProvider,
    public alert:AlertController,
    public splashScreen: SplashScreen, public utilService: UtilsProvider) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      
      
    });

    this.render.listenGlobal('document','wlInitFinished',()=>{
      console.log("wlclient init event recieved");
     // this.authHandler.init();
      this.authHandler.gmailAuthInit();
    });
    console.log("localStorage.getItem-->>>"+localStorage.getItem("userLogout"));
    if(localStorage.getItem("userLogout") === null){
      localStorage.setItem("userLogout", "1");
      console.log("--userLogout-->>>"+localStorage.getItem("userLogout"));
    }else{
      console.log("--userLogout-->>>"+localStorage.getItem("userLogout"));
    }

  //   document.addEventListener('pause', function () {
  //     console.log('App going to background');

  //     if(localStorage.getItem("userLogout") == "1"){
  //       localStorage.setItem("userLogout", "0");
  //     }else if(localStorage.getItem("userLogout") == "0"){
  //       localStorage.setItem("userLogout", "1");
  //     }
  //   });

  //   document.addEventListener('resume', function () {
  //     console.log('App coming to foreground');
  //     if(localStorage.getItem("userLogout") == "1"){
  //       localStorage.setItem("userLogout", "0");
  //     }else if(localStorage.getItem("userLogout") == "0"){
  //       localStorage.setItem("userLogout", "1");
  //     }
  // });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
    this.storage.jsonstoreInitialize();
  }

  /**
   * Method for logging out user from app and MFP Server
   */
  logout() {
    //let checkName = sessionStorage.getItem("securityName");
    this.authHandler.logout().then((resp)=>{
      if(resp) {
        localStorage.setItem("userLogout", "1");
        this.nav.setRoot("LoginPage");
      }
      else {
        console.log("logout failure");
        this.utilService.showCustomPopup("FAILURE","Logout failure, Please try again..");
      }
    });
  }

  profile() {
    this.nav.push("ProfilePage");
  }

  helpline() {
    this.nav.push("HrHelplinePage");
  }


  
}
