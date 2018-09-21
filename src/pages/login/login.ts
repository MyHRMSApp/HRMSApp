import { UtilsProvider } from './../../providers/utils/utils';
import { Component, Renderer, ChangeDetectorRef } from '@angular/core';
import { HomePage } from './../home/home';
import { IonicPage, MenuController, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ServiceProvider } from '../../providers/service/service';
import { StorageProvider } from '../../providers/storage/storage';
import { GooglePlus } from '@ionic-native/google-plus';
import { MyApp } from '../../app/app.component'
import { AuthHandlerProvider } from '../../providers/auth-handler/auth-handler';
import { NetworkProvider } from '../../providers/network-service/network-service';
/**
 * Login Functionalities
 * @author Vivek
 */

declare var WL;
declare var WLAuthorizationManager;

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  public adapterResult: any = "";
  public AuthHandler: any;
  AuthHandlerMessage: String = "";
  public gmailHandler: any;
  public employee_id: any;
  public password: any;
  public isChallenged: boolean = false;
  jsondata: any;
  photos: string;
  form;
  loader: any;
  public gmailLoginFlag:boolean = false;
  public userLoginFlag:boolean = false;
  remember: boolean = false;

  constructor(public alert: AlertController, public service: ServiceProvider, public navCtrl: NavController,
    public navParams: NavParams, public loadingCtrl: LoadingController, public storage: StorageProvider,
    private googlePlus: GooglePlus, public utilService: UtilsProvider, public authHandler: AuthHandlerProvider,
    public render: Renderer, public mainService: MyApp, public menu: MenuController, public ref:ChangeDetectorRef,
    public networkProvider: NetworkProvider  ) {
    
    localStorage.setItem("rememberMe", "disabled");
    
    this.menu.swipeEnable(false);
    this.form = new FormGroup({
      // username: new FormControl("E1596739", Validators.required),
      // password: new FormControl("init@123", Validators.required)
      username: new FormControl("", Validators.required),
      password: new FormControl("", Validators.required)
    });

    this.authHandler.setLoginFailureCallback((error) => {
          this.utilService.dismissLoader();
          if(error.status == 403 && error.statusText == "Forbidden"){
            this.utilService.showCustomPopup("FAILURE", "Your account is Locked, Please try again after 60 Sec");
          }else if(error.errorMsg !== undefined && error.errorMsg !== null){
            this.utilService.showCustomPopup("FAILURE", error.errorMsg);
          } 
    });

    this.authHandler.setLoginSuccessCallback(() => {
      this.utilService.dismissLoader();
      let view = this.navCtrl.getActive();
      if (!(view.instance instanceof HomePage)) {
        this.navCtrl.setRoot("HomePage");
      }
    });

    this.authHandler.setHandleChallengeCallback((error) => {
      this.utilService.dismissLoader();
      this.navCtrl.setRoot("LoginPage");
      if(error.remainingAttempts !== undefined && error.remainingAttempts != 3){
        if(error.errorMsg !== undefined && error.errorMsg !== null){
          this.utilService.showCustomPopup("FAILURE", error.errorMsg);
        }  
      }
    }); 

    console.log("internetConnectionCheck-->>"+this.mainService.internetConnectionCheck);
  }

  sampleLogin() {
    this.navCtrl.setRoot("HomePage");
  }
  
  rememberMe(e:any) {
    console.log("remember", e.checked);
    if(e.checked == true) {
      localStorage.setItem("rememberMe", "enabled");
    }
    else {
      localStorage.setItem("rememberMe", "disabled");
    }
    this.ref.detectChanges();
  }

  processForm() {
    // if(this.mainService.internetConnectionCheck){
      let username = this.form.value.username;
    let password = this.form.value.password;
    if (username === "") {
      this.utilService.showCustomPopup("FAILURE", "Username is required");
      return;
    }else if(username.length < 4){
      this.utilService.showCustomPopup("FAILURE", "Username must be min 4 and max 8 characters");
      return;
    }else if (password === "") {
      this.utilService.showCustomPopup("FAILURE", "Password is required");
      return;
    }else{
      var userNameLength = username;
      switch (userNameLength.length) {
        case 7:
          username = "E"+username;
          break;
        case 6:
          username = "E0"+username;
          break;
        case 5:
          username = "E00"+username;
          break;
        case 4:
          username = "E000"+username;
          break;
      }
      this.utilService.showLoader("Please Wait...");
      setTimeout(() => {
        let credentials = {
          "username": username,
          "password": password,
          "SECURITY_TYPE": "SAP_LOGIN"
        };
        this.authHandler.login(credentials);
      }, 100);
    }
    // }else{
    //   this.utilService.showCustomPopup("FAILURE", "You are in offline, Please check you internet..");
    // }

  }

  ionViewDidLoad() {
            this.photos = localStorage.getItem("userPicture");
            if(this.photos == null) {
              this.photos = ("./assets/icon/avatar.png");
              localStorage.setItem("userPicture", this.photos);
            }
            else {
            localStorage.setItem("userPicture", this.photos);
            }
  }

  /**
   * Method to handle user login via google plus option
   */
  userLoginViagooglePlus() {
    // if(this.mainService.internetConnectionCheck){
      this.googlePlus.login({
        'webClientId': '29768228914-26nbts9h35kghvhckl75lhh7tvgtkv70.apps.googleusercontent.com',
        'offline': true
      }).then((res) => {
        console.log(res);
        if (/@titan\.co\.in$/.test(res.email)) {
            let inputParams = {
              "vendor": "google",
              "token": res.idToken,
              "SECURITY_TYPE": "GMAIL_LOGIN",
              "GMAIL_ID": "nagarajan@titan.co.in"
            };
            this.utilService.showLoader("Please Wait...");
            setTimeout(() => {
              this.authHandler.login(inputParams);
            }, 100);
        }else{
          this.googlePlus.disconnect().then((res) => {
            this.utilService.showCustomPopup("FAILURE", "Please use Titan Mail ID");
          })
        }
      });
    // }else{
    //   this.utilService.showCustomPopup("FAILURE", "You are in offline, Please check you internet..");
    // }
    
  }

  help(){
    this.navCtrl.push("NeedHelpPage");
  }

}
