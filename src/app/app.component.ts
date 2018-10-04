import { Component, ViewChild, Renderer } from '@angular/core';
import { Nav, Platform,AlertController, ToastController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Network } from '@ionic-native/network';
import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { StorageProvider } from '../providers/storage/storage';
import { AuthHandlerProvider } from '../providers/auth-handler/auth-handler';
import { UtilsProvider } from '../providers/utils/utils';
import { CommonStringsProvider } from '../providers/common-strings/common-strings';
import { NetworkProvider } from '../providers/network-service/network-service';
import { AppAvailability } from '@ionic-native/app-availability';
import { ImageResizer, ImageResizerOptions } from '@ionic-native/image-resizer';

declare var WL;
declare var WLAuthorizationManager;
declare var document:any;
declare var MFPPush;
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage:any = "LoginPage";

  

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
  public myTaskData:any;
  public internetConnectionCheck:boolean = (this.network.type=="none")?false:true;
  public selectedDateDataFromAttendance:any;
  public globalProfileData:any;
  constructor(public platform: Platform,
    public statusBar: StatusBar, public network: Network,
    public render:Renderer,
    private authHandler: AuthHandlerProvider,
    public storage:StorageProvider,
    public alert:AlertController, public toast: ToastController,
    public splashScreen: SplashScreen, public utilService: UtilsProvider, 
    public networkProvider: NetworkProvider, public events: Events, private appAvailability: AppAvailability) {
    this.initializeApp();

    // let rootLocation = localStorage.getItem("rootPage");
    // console.log("rootPage", rootLocation);
    // let remember = localStorage.getItem("rememberMe");
    
    // if(rootLocation == "true"){
    //   if(remember === "enabled"){
    //     this.rootPage = "HomePage";
    //   }
    //   else {
    //     setTimeout(()=> {
    //       this.rootPage = "LoginPage"; 
    //       this.logout(); 
    //     }, 1500);
       
    //   }
    // }
    // else{
    //   this.rootPage = "LoginPage";
    // }
    console.log("localStorage.getItem(rememberMe)-------------->>"+localStorage.getItem("rememberMe"));
      if(localStorage.getItem("rememberMe") === null){
        localStorage.setItem("rememberMe", "enabled");
      }

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      // this.network.onDisconnect().subscribe(() => {
      //   this.internetConnectionCheck = (this.network.type=="none")?false:true;
      // });
      // this.network.onConnect().subscribe(() => {
      //   this.internetConnectionCheck = (this.network.type=="none")?false:true;
      // });
      this.splashScreen.hide();
    });

    this.render.listenGlobal('document','wlInitFinished',()=>{
      console.log("wlclient init event recieved");
        this.authHandler.gmailAuthInit();
      // if(this.internetConnectionCheck){
        this.authHandler.checkIsLoggedIn();
      // }else{
      //   this.utilService.showCustomPopup("FAILURE", "You are in offline, Please check you internet..");
      // }

      var notificationReceived = (message) => {
        // alert(JSON.stringify(message));
        this.utilService.showCustomPopup4Error("Notification", message.alert, "NOTIFY");
    };

    MFPPush.isPushSupported (
      function(successResponse) {
          console.log("Push Supported-->>"+successResponse);
          MFPPush.initialize (
            function(successResponse) {
              console.log("Successfully initialize-->>"+successResponse);
                MFPPush.registerNotificationsCallback(notificationReceived);
            },
            function(failureResponse) {
              console.log("Failed to initialize===>>"+failureResponse);
            }
        );
      },
      function(failureResponse) {
        console.log("Failed to get push support status===>"+failureResponse);
      }
    );
    });

let app;
if (this.platform.is('ios')) {
  app = 'net.whatsapp.WhatsApp.ShareExtension';
} else if (this.platform.is('android')) {
  app = 'com.whatsapp.android';
}

this.appAvailability.check(app)
  .then(
    (yes: boolean) => {
      console.log(app + ' is available');
      localStorage.setItem("platform", "yes");
    },

    (no: boolean) =>  {
      console.log(app + ' is NOT available');
      localStorage.setItem("platform", "no");
    } 
  );
  }


  openPage(page) {
    this.nav.setRoot(page.component);
  }

  /**
   * Method for logging out user from app and MFP Server
   */
  logout() {
    //localStorage.setItem("rememberMe", "disabled");
    //console.log("came to logout");
    this.authHandler.logout().then((resp)=>{
      if(resp) {
        localStorage.setItem("userLogout", "1");
        // this.authHandler.checkIsLoggedIn();
        // this.nav.setRoot("LoginPage");
      }
      else {
        console.log("logout failure");
        this.utilService.showCustomPopup("FAILURE","Logout failure, Please try again..");
      }
    });
    this.photos = ("./assets/icon/avatar.png");
    localStorage.setItem("userPicture", this.photos);
  }

  profile() {
    this.nav.push("ProfilePage");
  }

  helpline() {
    this.nav.push("HrHelplinePage");
  }


  
}
