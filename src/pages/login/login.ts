import { UtilsProvider } from './../../providers/utils/utils';
import { Component, Renderer } from '@angular/core';
import { HomePage } from './../home/home';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ServiceProvider } from '../../providers/service/service';
import { StorageProvider } from '../../providers/storage/storage';
import { GooglePlus } from '@ionic-native/google-plus';
import { MyApp } from '../../app/app.component'
import { AuthHandlerProvider } from '../../providers/auth-handler/auth-handler';


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
  //storage: any;
  photos: string;
  form;
  loader: any;
  public gmailLoginFlag:boolean = false;
  public userLoginFlag:boolean = false;

  constructor(public alert: AlertController, public service: ServiceProvider, public navCtrl: NavController,
    public navParams: NavParams, public loadingCtrl: LoadingController, public storage: StorageProvider,
    private googlePlus: GooglePlus, public utilService: UtilsProvider, public authHandler: AuthHandlerProvider,
    public render: Renderer, public mainService: MyApp) {

    this.form = new FormGroup({
      // username: new FormControl("E1596739", Validators.required),
      // password: new FormControl("init@123", Validators.required)
      username: new FormControl("", Validators.required),
      password: new FormControl("", Validators.required)
    });

    // this.userLoginFlag = (localStorage.getItem("userLoginFlag") == "true")? true:false;
    // this.gmailLoginFlag = (localStorage.getItem("gmailLoginFlag") == "true")? true:false;

    this.authHandler.setLoginFailureCallback((error) => {
          this.utilService.dismissLoader();
          this.utilService.showCustomPopup("FAILURE", error.errorMsg);
    });

    this.authHandler.setLoginSuccessCallback(() => {
      let view = this.navCtrl.getActive();
      if (!(view.instance instanceof HomePage)) {
        this.utilService.dismissLoader();
        this.navCtrl.setRoot("HomePage");
      }
    });

    this.authHandler.setHandleChallengeCallback(() => {
      this.utilService.dismissLoader();
      this.navCtrl.setRoot("LoginPage");
    });
    
  }

  sampleLogin() {
    this.navCtrl.setRoot("HomePage");
  }

  processForm() {
    // this.userLoginFlag = true;
    // this.gmailLoginFlag = false;
    // localStorage.setItem("userLoginFlag", "true");
    // localStorage.setItem("gmailLoginFlag", "false");
    let username = this.form.value.username;
    let password = this.form.value.password;
    let credentials = {
      "username": username,
      "password": password,
      "SECURITY_TYPE": "SAP_LOGIN"
    };
    if (username === "" || password === "") {
      this.utilService.showCustomPopup("FAILURE", "Username and password are required");
      return;
    }
    console.log('--> Sign-in with user: ', username);

    if(this.utilService.loader === undefined || !this.utilService.loader.hasOwnProperty('data')){
      this.utilService.showLoader("Please Wait..");
    }

    console.log(this.utilService.loader);

    setTimeout(() => {
      this.authHandler.login(credentials);
    }, 100);
  }


  /**
   * Method for reading  json data from local jsonstore
   */
  ionViewDidLoad() {
    setTimeout(() => {
      this.storage.jsonstoreInitialize().then(() => {
        this.storage.jsonstoreReadAll("userImage").then((jsonData: any) => {
          if (jsonData) {
            if (jsonData.length == 0) {
              this.photos = ("./assets/icon/avatar.png");
              localStorage.setItem("userPicture", this.photos);
            } else {
              this.photos = jsonData.json.value;
              localStorage.setItem("userPicture", this.photos);
            }
          };
        }, (error) => {
          console.log("Data readed from jsonstore error", error);
        });
      });
    }, 2000);
  }

  /**
   * Method to handle user login via google plus option
   */
  userLoginViagooglePlus() {
    // this.userLoginFlag = false;
    // this.gmailLoginFlag = true;
    // localStorage.setItem("userLoginFlag", "false");
    // localStorage.setItem("gmailLoginFlag", "true");
    // console.log("1");
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
          this.utilService.showLoader("Please Wait..");
          setTimeout(() => {
            this.authHandler.login(inputParams);
          }, 100);
      }else{
        this.googlePlus.disconnect().then((res) => {
          this.utilService.showCustomPopup("FAILURE", "Please use Titan Mail ID...");
        })
        
      }

    });
  }

}
