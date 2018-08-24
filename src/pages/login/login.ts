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

  constructor(public alert: AlertController, public service: ServiceProvider, public navCtrl: NavController,
    public navParams: NavParams, public loadingCtrl: LoadingController, public storage: StorageProvider,
    private googlePlus: GooglePlus, public utilService: UtilsProvider, public authHandler: AuthHandlerProvider,
    public render: Renderer, public mainService: MyApp) {

    this.form = new FormGroup({
      username: new FormControl("E1596739", Validators.required),
      password: new FormControl("init@123", Validators.required)
    });

    this.authHandler.setLoginFailureCallback((error) => {
      
      if (error !== null) {
        if(error == "Remaining attempts = undefinedundefined"){
          // this.utilService.showCustomPopup("FAILURE", "Failed to login, Please try again");
          this.processForm();
        }else{
          this.utilService.dismissLoader();
          this.utilService.showCustomPopup("FAILURE", error);
        }
        console.log("setLoginFailureCallback-FAILURE---->>>"+ error);
        
      } else {
        this.utilService.dismissLoader();
        this.utilService.showCustomPopup("FAILURE", "Failed to login, Please try again");
      }
    });
    this.authHandler.setLoginSuccessCallback(() => {
      let view = this.navCtrl.getActive();
      if (!(view.instance instanceof HomePage)) {
        localStorage.setItem("userLogout", "0");
        this.utilService.dismissLoader();
        this.navCtrl.setRoot("HomePage");
      }
    });
    this.authHandler.setHandleChallengeCallback(() => {
      this.utilService.dismissLoader();
      this.navCtrl.setRoot("LoginPage");
    });

    setTimeout(() => {
      // this.loaderCreate();
      console.log("userLogout-->>"+localStorage.getItem("userLogout")+" "+"userFrishLogin Flag---->>"+this.mainService.userFrishLogin)
      if(this.mainService.userFrishLogin){
        this.mainService.userFrishLogin = false;
        if(localStorage.getItem("userLogout") == "0"){
          this.utilService.showLoader("Please Wait..");
          this.authHandler.checkIsLoggedIn();
        } 
      }
      
    }, 1000);
  }

  sampleLogin() {
    this.navCtrl.setRoot("HomePage");
  }

  processForm() {
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
    this.utilService.showLoader("Please Wait..");
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
              //console.log("JSON data has image");
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
    console.log("1");
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
            "GMAIL_ID": res.email
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

  // showAlert(alertTitle, alertMessage) {
  //   let prompt = this.alert.create({
  //     title: alertTitle,
  //     message: alertMessage,
  //     buttons: [{
  //       text: 'Ok',
  //     }]
  //   });
  //   prompt.present();
  // }
}
