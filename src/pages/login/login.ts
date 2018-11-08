import { UtilsProvider } from './../../providers/utils/utils';
import { Component, Renderer, ChangeDetectorRef } from '@angular/core';
import { HomePage } from './../home/home';
import { IonicPage, Platform, MenuController, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ServiceProvider } from '../../providers/service/service';
import { StorageProvider } from '../../providers/storage/storage';
import { GooglePlus } from '@ionic-native/google-plus';
import { MyApp } from '../../app/app.component'
import { AuthHandlerProvider } from '../../providers/auth-handler/auth-handler';
import { NetworkProvider } from '../../providers/network-service/network-service';
import { Network } from '@ionic-native/network';
import { CommonStringsProvider } from '../../providers/common-strings/common-strings'

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
    public networkProvider: NetworkProvider,  public network: Network, public platform: Platform, public commonString: CommonStringsProvider ) {
    
    this.menu.swipeEnable(false);
    this.form = new FormGroup({
      // username: new FormControl("E1596739", Validators.required),
      // password: new FormControl("init@123", Validators.required)
      username: new FormControl("", Validators.required),
      password: new FormControl("", Validators.required)
    });

    this.authHandler.setLoginFailureCallback((error) => {
          this.utilService.dismissLoader();
          if(error.status == 403 && error.statusText == this.commonString.commonStrings.loginPage.Forbidden){
            this.utilService.showCustomPopup(this.commonString.commonStrings.loginPage.FAILURE, this.commonString.commonStrings.loginPage.accountLockedText);
          }else if(error.errorMsg !== undefined && error.errorMsg !== null){
            this.utilService.showCustomPopup(this.commonString.commonStrings.loginPage.FAILURE, error.errorMsg);
          } 
    });
    
    this.authHandler.setLoginSuccessCallback(() => {
      let view = this.navCtrl.getActive();
      if (!(view.instance instanceof HomePage)) {
        this.utilService.dismissLoader();
        this.navCtrl.setRoot(this.commonString.commonStrings.loginPage.HomePage);
      }
    });

    this.authHandler.setHandleChallengeCallback((error) => {
      this.utilService.dismissLoader();
      this.navCtrl.setRoot(this.commonString.commonStrings.loginPage.LoginPage);
      if(error.remainingAttempts !== undefined && error.remainingAttempts != 3){
        if(error.errorMsg !== undefined && error.errorMsg !== null){
          this.utilService.showCustomPopup(this.commonString.commonStrings.loginPage.FAILURE, error.errorMsg);
        }  
      }
    }); 

    console.log("internetConnectionCheck-->>"+ this.mainService.internetConnectionCheck);

    if(localStorage.getItem(this.commonString.commonStrings.loginPage.rememberMe) == this.commonString.commonStrings.loginPage.enabled){
      this.remember = true;
    }else{
      this.remember = false;
    }

    this.network.onConnect().subscribe(() => {
      //   // this.internetConnectionCheck = (this.network.type=="none")?false:true;
      //   let view = this.nav.getActive();
      //   if (view.instance instanceof LoginPage) {
        console.log("this.network.onConnect().subscribe-->>"+ this.network.type);
        if(this.network.type !== this.commonString.commonStrings.loginPage.none){
          this.authHandler.gmailAuthInit();
          this.utilService.showCustomPopupClose();
          this.authHandler.checkIsLoggedIn();
        }

      //   }
      });
  }

  sampleLogin() {
    this.navCtrl.setRoot(this.commonString.commonStrings.loginPage.HomePage);
  }
  
  rememberMe(e:any) {
    console.log("remember", e.checked);
    if(e.checked == true) {
      localStorage.setItem(this.commonString.commonStrings.loginPage.rememberMe, this.commonString.commonStrings.loginPage.enabled);
      localStorage.setItem(this.commonString.commonStrings.loginPage.rootPage, this.commonString.commonStrings.loginPage.true);
    }
    else {
      localStorage.setItem(this.commonString.commonStrings.loginPage.rememberMe, this.commonString.commonStrings.loginPage.disabled);
    }
    console.log("localStorage.getItem(rememberMe)-------------->>"+localStorage.getItem("rememberMe"));
    this.ref.detectChanges();
  }


  processForm() {
    // if(this.mainService.internetConnectionCheck){
      let username = this.form.value.username;
    let password = this.form.value.password;
    if (username === "") {
      this.utilService.showCustomPopup(this.commonString.commonStrings.loginPage.FAILURE, this.commonString.commonStrings.loginPage.userNameValidate);
      return;
    }else if(username.length < 4){
      this.utilService.showCustomPopup(this.commonString.commonStrings.loginPage.FAILURE, this.commonString.commonStrings.loginPage.userNameLenValidate);
      return;
    }else if (password === "") {
      this.utilService.showCustomPopup(this.commonString.commonStrings.loginPage.FAILURE, this.commonString.commonStrings.loginPage.passValidate);
      return;
    }else{
      var userNameLength = username;
      switch (userNameLength.length) {
        case 7:
          username = this.commonString.commonStrings.loginPage.E+username;
          break;
        case 6:
          username = this.commonString.commonStrings.loginPage.E0+username;
          break;
        case 5:
          username = this.commonString.commonStrings.loginPage.E00+username;
          break;
        case 4:
          username = this.commonString.commonStrings.loginPage.E000+username;
          break;
      }
      this.utilService.showLoader(this.commonString.commonStrings.loginPage.pleaseWait);
      console.log("Remember Me Option : " + localStorage.getItem("rememberMe"));
      var rememberMeOption = false;
      if(localStorage.getItem(this.commonString.commonStrings.loginPage.rememberMe) == this.commonString.commonStrings.loginPage.enabled){
        rememberMeOption = true;
      }
      setTimeout(() => {
        let credentials = {
          "username": username,
          "password": password,
          "SECURITY_TYPE": this.commonString.commonStrings.loginPage.SAP_LOGIN,
          "rememberMe": rememberMeOption
        };
        this.authHandler.login(credentials);
      }, 100);
    }
    // }else{
    //   this.utilService.showCustomPopup("FAILURE", "You are in offline, Please check you internet..");
    // }

  }

  ionViewDidLoad() {
            this.photos = localStorage.getItem(this.commonString.commonStrings.loginPage.userPicture);
            if(this.photos == null) {
              this.photos = (this.commonString.commonStrings.loginPage.avatar);
              localStorage.setItem(this.commonString.commonStrings.loginPage.userPicture, this.photos);
            }
            else {
            localStorage.setItem(this.commonString.commonStrings.loginPage.userPicture, this.photos);
            }
  }

  /**
   * Method to handle user login via google plus option
   */
  userLoginViagooglePlus() {
    // if(this.mainService.internetConnectionCheck){
      var platform = this.commonString.commonStrings.loginPage.android;
      var webclientID = this.commonString.commonStrings.loginPage.webclient4Android
      if (this.platform.is(this.commonString.commonStrings.loginPage.ios)) {
        platform = this.commonString.commonStrings.loginPage.ios;
        webclientID = this.commonString.commonStrings.loginPage.webclient4IOS;
      }
      var rememberMeOption = false;
      if(localStorage.getItem(this.commonString.commonStrings.loginPage.rememberMe) == this.commonString.commonStrings.loginPage.enabled){
        rememberMeOption = true;
      }
      this.googlePlus.login({
        'webClientId': webclientID,
        'offline': true
      }).then((res) => {
        console.log(res);
        if (/@titan\.co\.in$/.test(res.email)) {
            let inputParams = {
              "vendor": this.commonString.commonStrings.loginPage.google,
              "token": res.idToken,
              "SECURITY_TYPE": this.commonString.commonStrings.loginPage.GMAIL_LOGIN,
              "GMAIL_ID": res.email,
              "rememberMe": rememberMeOption,
              "platform": platform
            };
            this.utilService.showLoader(this.commonString.commonStrings.loginPage.pleaseWait);
            setTimeout(() => {
              this.authHandler.login(inputParams);
            }, 100);
        }else{
          this.googlePlus.disconnect().then((res) => {
            this.utilService.showCustomPopup(this.commonString.commonStrings.loginPage.FAILURE, this.commonString.commonStrings.loginPage.gmailValidate);
          })
        }
      });
    // }else{
    //   this.utilService.showCustomPopup("FAILURE", "You are in offline, Please check you internet..");
    // }
    
  }

  help(){
    this.navCtrl.push(this.commonString.commonStrings.loginPage.NeedHelpPage);
  }

}
