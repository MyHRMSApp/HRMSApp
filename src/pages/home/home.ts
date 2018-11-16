import { Component, ChangeDetectorRef } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Nav, Platform, MenuController, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { Network } from '@ionic-native/network';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Http, Headers, RequestOptions } from '@angular/http';
import { StorageProvider } from '../../providers/storage/storage';
import { MyApp } from '../../app/app.component';
import { ServiceProvider } from '../../providers/service/service';
import { UtilsProvider } from '../../providers/utils/utils';
import { AuthHandlerProvider } from '../../providers/auth-handler/auth-handler';
import { ImageResizer, ImageResizerOptions } from '@ionic-native/image-resizer';
import { normalizeURL } from 'ionic-angular';
import moment from 'moment';
import { LoginPage } from '../login/login';
import { CommonStringsProvider } from '../../providers/common-strings/common-strings';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  public photos: any;
  public defaultAvatar: any;
  public cal: any;
  public cameraPhoto: any;
  public base64Image: any;
  public imageOne: any;
  public userInfo: any;
  public userName: any;
  public customMsg: any;
  jsondata: any;
  attendanceIcon: string;
  couponsIcon: any;
  leavesIcon: any;
  my_requestIcon: any;
  my_taskIcon: any;
  hamburger: string;
  public attendanceInterval: any;
  public showCustomMsg: boolean = false;
  public showTasks: boolean = false;
  showTemplate: string;
  public eyeWearCounts: any[];
  public jewelleryCounts: any[];
  public taneiraCounts: any[];
  public watchCounts: any[];
  eyeWearLength: number;
  jewelleryLength: number;
  taneiraLength: number;
  watchLength: number;
  public attanaceCallFlag: boolean = true;
  public exitAlertFlag: boolean = false;


  constructor(public menu: MenuController, public events: Events, private camera: Camera,
    private http: Http, private toast: ToastController, private network: Network,
    public loadingCtrl: LoadingController, public platform: Platform,
    public alertCtrl: AlertController, public statusBar: StatusBar, public navCtrl: NavController,
    public navParams: NavParams, public storage: StorageProvider, public mainService: MyApp,
    public service: ServiceProvider, public utilService: UtilsProvider, public ref: ChangeDetectorRef,
    public authHandler: AuthHandlerProvider, private imageResizer: ImageResizer,
    public commonString: CommonStringsProvider) {

    this.menu.swipeEnable(false);
    this.eyeWearCounts = [];
    this.jewelleryCounts = [];
    this.taneiraCounts = [];
    this.watchCounts = [];

    this.photos = localStorage.getItem("userPicture");
    this.userName = "";
    this.customMsg = "false";
    this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
    this.userName = this.userInfo.EP_ENAME;
    console.log(this.userInfo);
    if (this.userInfo.EP_USERTYPE == "MSS") {
      this.showCustomMsg = true;
    } else {
      this.showCustomMsg = false;
    }
  }

  openMenu() {
    this.menu.toggle();
  }

  attendance() {

    this.utilService.showLoader(this.commonString.commonStrings.HomePage.PLEASE_WAIT);

    if (this.mainService.attendanceCallFlag && this.mainService.attendanceN_NP1_DataFlag && !this.attanaceCallFlag) {
      this.attendanceDataFetch();
    } else {
      var counter = 0;
      this.attendanceInterval = setInterval(() => {
        console.log("turn no. " + counter);
        if (this.mainService.attanancePageData !== undefined) {
          this.mainService.attanancePageData = this.mainService.attendanceN_NP1_Data;
          this.navCtrl.push(this.commonString.commonStrings.HomePage.ATTENDANCE_NAV);
          this.routerOnDeactivate();
        } else if (counter == 29) {
          this.utilService.dismissLoader();
          this.utilService.showCustomPopup4Error(this.commonString.commonStrings.HomePage.FAILURE_TITLE_ATT, this.commonString.commonStrings.HomePage.FAILURE_MSG_ONE, this.commonString.commonStrings.HomePage.FAILURE_TITLE_TEXT);
          this.mainService.attendanceCallFlag = true;
          this.mainService.attendanceN_NP1_DataFlag = true;
          this.attanaceCallFlag = false;
          this.routerOnDeactivate();
        }
        counter++;
      }, 1000);
    }
  }

  attendanceDataFetch() {
    this.utilService.showLoaderProfile(this.commonString.commonStrings.HomePage.PLEASE_WAIT);
    var payloadData = {
      "IP_SMONTH": -1,
      "IP_EMONTH": 0
    }
    // if(this.mainService.internetConnectionCheck){
    this.service.invokeAdapterCall('commonAdapterServices', 'getEmployeeAttendanceData', 'post', {
      payload: true,
      length: 2,
      payloadData: payloadData
    }).then((resultData: any) => {
      if (resultData) {
        if (resultData.status_code == 0) {
          this.mainService.attanancePageData = resultData.data;
          this.mainService.attendanceN_NP1_Data = resultData.data;
          this.mainService.attendanceN_NP1_DataFlag = false;
          console.log(JSON.stringify(this.mainService.attanancePageData));
          this.utilService.dismissLoader();
          this.navCtrl.push(this.commonString.commonStrings.HomePage.ATTENDANCE_NAV);
        } else {
          this.utilService.dismissLoader();
          this.utilService.showCustomPopup4Error(this.commonString.commonStrings.HomePage.FAILURE_TITLE_ATT, this.commonString.commonStrings.HomePage.FAILURE_MSG_ONE, this.commonString.commonStrings.HomePage.FAILURE_TITLE_TEXT);
        }
      };
    }, (error) => {
      console.log(error);
      this.utilService.dismissLoader();
      this.utilService.showCustomPopup4Error(this.commonString.commonStrings.HomePage.FAILURE_TITLE_ATT, this.commonString.commonStrings.HomePage.FAILURE_MSG_ONE, this.commonString.commonStrings.HomePage.FAILURE_TITLE_TEXT);
    });
    // }else{
    //   this.utilService.showCustomPopup(this.commonString.commonStrings.HomePage.FAILURE_TITLE_TEXT, "You are in offline, Please check you internet..");
    // }
  }

  routerOnDeactivate() {
    clearInterval(this.attendanceInterval);
  }

  /**
  Method for pushing 
  */
  coupons() {
    // if(this.mainService.internetConnectionCheck){
    this.utilService.showLoader(this.commonString.commonStrings.HomePage.PLEASE_WAIT);
    this.service.invokeAdapterCall('commonAdapterServices', 'getCouponsList', 'get', {
      payload: false
    }).then((resultData: any) => {
        if (resultData) {
          if (resultData.status_code == 0) {
            this.mainService.couponPageData = resultData;

            /**
             * ET_EYEWEAR
             */
            if (resultData.data.ET_EYEWEAR !== "") {
              if (resultData.data.ET_EYEWEAR.item.length === undefined) {
                this.eyeWearCounts.push(resultData.data.ET_EYEWEAR.item);
                this.eyeWearLength = this.eyeWearCounts.length;
              } else {
                for (let i = 0; resultData.data.ET_EYEWEAR.item[i]; i++) {
                  this.eyeWearCounts.push(resultData.data.ET_EYEWEAR.item[i]);
                }
                this.eyeWearLength = this.eyeWearCounts.length;
              }
            } else {
              this.eyeWearLength = 0;
            }

            /**
             * ET_JEWELLERY
             */
            if (resultData.data.ET_JEWELLERY !== "") {
              if (resultData.data.ET_JEWELLERY.item.length === undefined) {
                this.jewelleryCounts.push(resultData.data.ET_JEWELLERY.item);
                this.jewelleryLength = this.jewelleryCounts.length;
                console.log(this.jewelleryLength);
              } else {
                for (let i = 0; resultData.data.ET_JEWELLERY.item[i]; i++) {
                  this.jewelleryCounts.push(resultData.data.ET_JEWELLERY.item[i]);
                }
                this.jewelleryLength = this.jewelleryCounts.length;
              }
            } else {
              this.jewelleryLength = 0;
            }

            /**
             * ET_TANEIRA
             */
            if (resultData.data.ET_TANEIRA !== "") {
              if (resultData.data.ET_TANEIRA.item.length === undefined) {
                this.taneiraCounts.push(resultData.data.ET_TANEIRA.item);
                this.taneiraLength = this.taneiraCounts.length;
              } else {
                for (let i = 0; resultData.data.ET_TANEIRA.item[i]; i++) {
                  this.taneiraCounts.push(resultData.data.ET_TANEIRA.item[i]);
                }
                this.taneiraLength = this.taneiraCounts.length;
              }
            } else {
              this.taneiraLength = 0;
            }

            /**
             * ET_WATCH
             */
            if (resultData.data.ET_WATCH !== "") {
              if (resultData.data.ET_WATCH.item.length === undefined) {
                this.watchCounts.push(resultData.data.ET_WATCH.item);
                this.watchLength = this.watchCounts.length;
              } else {
                for (let i = 0; resultData.data.ET_WATCH.item[i]; i++) {
                  this.watchCounts.push(resultData.data.ET_WATCH.item[i]);
                }
                this.watchLength = this.watchCounts.length;
              }
            } else {
              this.watchLength = 0;
            }

            this.navCtrl.push("CouponsPage", {
              "eyeWearLength": this.eyeWearLength,
              "jewelleryLength": this.jewelleryLength,
              "taneiraLength": this.taneiraLength,
              "watchLength": this.watchLength,
            });

          } else {
            // this.utilService.showPopup(this.commonString.commonStrings.HomePage.FAILURE_TITLE_COUPONS, resultData.message);
            this.utilService.showCustomPopup4Error(this.commonString.commonStrings.HomePage.FAILURE_TITLE_COUPONS, this.commonString.commonStrings.HomePage.FAILURE_MSG_ONE, this.commonString.commonStrings.HomePage.FAILURE_TITLE_TEXT);
          }
        };
      },
      (error) => {
        console.log(error);
        this.utilService.dismissLoader();
        // this.utilService.showPopup(this.commonString.commonStrings.HomePage.FAILURE_TITLE_ATT,error.statusText);
        this.utilService.showCustomPopup4Error(this.commonString.commonStrings.HomePage.FAILURE_TITLE_COUPONS, this.commonString.commonStrings.HomePage.FAILURE_MSG_ONE, this.commonString.commonStrings.HomePage.FAILURE_TITLE_TEXT);

      });
    // }else{
    //   this.utilService.showCustomPopup(this.commonString.commonStrings.HomePage.FAILURE_TITLE_TEXT, "You are in offline, Please check you internet..");
    // }
  }

  ionViewCanEnter() {

    this.platform.registerBackButtonAction(() => {
      let nav = this.navCtrl.getActive();
      if (nav.instance instanceof HomePage) {
        if (!this.exitAlertFlag) {
          this.exitAlertFlag = true;
          let message = "<div class='exitApplication'>Do you really want to exit this application?</div>";
          const alert = this.alertCtrl.create({
            title: "My Compass",
            message: message,
            cssClass: "SHOWALERT",
            enableBackdropDismiss: false
          });

          alert.addButton({
            text: 'CANCEL',
            handler: data => {
              this.exitAlertFlag = false;
            }
          });
          alert.addButton({
            text: 'OK',
            handler: data => {
              this.exitAlertFlag = false;
              this.platform.exitApp();
            }
          });

          alert.present();
        }

      } else if (nav.instance instanceof LoginPage) {
        this.platform.exitApp();
      } else {
        this.navCtrl.pop();
      }
    });


    this.eyeWearLength = 0;
    this.jewelleryLength = 0;
    this.taneiraLength = 0;
    this.watchLength = 0;

    this.eyeWearCounts = [];
    this.jewelleryCounts = [];
    this.taneiraCounts = [];
    this.watchCounts = [];



    try {
      this.mainService.attendanceN_NP1_DataFlag = true;
      this.mainService.attendanceNP2_DataFlag = true;
      this.mainService.attendanceNA1_DataFlag = true;
      this.mainService.attendanceNA2_DataFlag = true;
      this.mainService.attendanceCallFlag = true;
      this.mainService.selectedDateDataFromAttendance = undefined;
      this.mainService.attanancePageData = undefined;
      if (this.mainService.attendanceCallFlag && this.mainService.attendanceN_NP1_DataFlag) {
        this.attanaceCallFlag = true;
        this.mainService.attendanceCallFlag = false;
        this.mainService.attendanceN_NP1_DataFlag = false;
        var payloadData = {
          "IP_SMONTH": -1,
          "IP_EMONTH": 0
        }
        // if(this.mainService.internetConnectionCheck){
        this.service.invokeAdapterCall('commonAdapterServices', 'getEmployeeAttendanceData', 'post', {
          payload: true,
          length: 2,
          payloadData: payloadData
        }).then((resultData: any) => {
          if (resultData) {
            if (resultData.status_code == 0) {
              this.mainService.attanancePageData = resultData.data;
              this.mainService.attendanceN_NP1_Data = resultData.data;
              this.mainService.attendanceN_NP1_DataFlag = false;
            } else {
              // this.utilService.showPopup(this.commonString.commonStrings.HomePage.FAILURE_TITLE_ATT, resultData.message);
            }

          };
        }, (error) => {
          console.log(error);
          this.mainService.attendanceCallFlag = true;
          this.mainService.attendanceN_NP1_DataFlag = true;
          this.attanaceCallFlag = false;
        });

        this.service.invokeAdapterCall('commonAdapterServices', 'getCustomUserMessage', 'get', {
          payload: false
        }).then((resultData: any) => {
          if (resultData) {
            if (resultData.customMessage != "false") {
              this.customMsg = resultData.customMessage;
              setTimeout(() => {
                this.showTasks = true;
                this.ref.detectChanges();
              }, 100);
            } else {
              this.customMsg = "false";
              setTimeout(() => {
                this.showTasks = false;
                this.ref.detectChanges();
              }, 100);
            }
          }
        }, (error) => {
          console.log(error);
        });
      }

    } catch (error) {
      console.log(error);
    }
  }


  ionViewDidLoad() {
    this.attendanceIcon = (this.commonString.commonStrings.HomePage.ATTENDANCE_IMG);
    this.couponsIcon = (this.commonString.commonStrings.HomePage.COUPON_IMG);
    this.leavesIcon = (this.commonString.commonStrings.HomePage.LEAVE_IMG);
    this.my_requestIcon = (this.commonString.commonStrings.HomePage.MYREQUEST_IMG);
    this.my_taskIcon = (this.commonString.commonStrings.HomePage.MYTASK_IMG);
    this.hamburger = (this.commonString.commonStrings.HomePage.HAMBURGERICON_IMG);
  }

  /**
   * Method which gives two options to open camera and gallery
   */
  changeImage() {
    let alert = this.alertCtrl.create({
      title: "Choose Picture",
      buttons: [{
          text: 'Choose from camera',
          handler: () => this.takePhoto()
        },
        {
          text: 'Choose from gallery',
          handler: () => this.uploadPhoto()
        },
        {
          text: 'Remove picture',
          handler: () => this.removePhoto()
        }
      ]
    });
    alert.present();
  }


  /**
   * Method to open camera
   */
  takePhoto() {
    var destinationType: any = this.camera.DestinationType.DATA_URL;
    if (this.platform.is('ios')) {
      destinationType = this.camera.DestinationType.FILE_URI;
    }

    const options: CameraOptions = {
      quality: 30,
      destinationType: destinationType,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: true,
      allowEdit: true,
      correctOrientation: true
    }
    this.camera.getPicture(options).then((imageData) => {
        this.imageResizer.resize({
          uri: imageData,
          quality: 30,
          width: 1000,
          height: 1000
        })
        this.utilService.showLoader(this.commonString.commonStrings.HomePage.UPDATING_PIC);
        if (imageData) {

          //get photo from the camera based on platform type
          if (this.platform.is('ios')) {
            this.base64Image = normalizeURL(imageData);
          } else {
            this.base64Image = 'data:image/jpeg;base64,' + imageData;
          }
          this.photos = this.base64Image;
          localStorage.setItem("userPicture", this.photos);
          this.utilService.dismissLoader();
        } else {
          this.utilService.dismissLoader();
        }
      },
      (err) => {
        console.log(err);
      });
  }


  /**
   * Method for open galeery
   */
  uploadPhoto() {
    var destinationType: any = this.camera.DestinationType.DATA_URL;
    if (this.platform.is('ios')) {
      destinationType = this.camera.DestinationType.FILE_URI;
    }

    this.camera.getPicture({
      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
      destinationType: destinationType,
      quality: 30,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      allowEdit: true,
      correctOrientation: true
    }).then((imageData) => {
        this.imageResizer.resize({
          uri: imageData,
          quality: 30,
          width: 1000,
          height: 1000
        })
        this.utilService.showLoader(this.commonString.commonStrings.HomePage.UPDATING_PIC);
        if (imageData) {

          //get photo from the camera based on platform type
          if (this.platform.is('ios')) {
            this.base64Image = normalizeURL(imageData);
          } else {
            this.base64Image = 'data:image/jpeg;base64,' + imageData;
          }
          this.photos = this.base64Image;
          localStorage.setItem("userPicture", this.photos);
          this.utilService.dismissLoader();
        } else {
          console.log("Image data not yet recieved");
          this.utilService.dismissLoader();
        }
      },
      (err) => {
        console.log(err);
      });
  }

  removePhoto() {
    console.log(this.commonString.commonStrings.HomePage.REMOVING_PIC);
    this.utilService.showLoader(this.commonString.commonStrings.HomePage.REMOVING_PIC);
    this.photos = (this.commonString.commonStrings.HomePage.AVATAR_IMG);
    localStorage.setItem("userPicture", this.photos);
    this.utilService.dismissLoader();
  }

  applyLeave() {

    try {
      // if(this.mainService.internetConnectionCheck){
      this.utilService.showLoader(this.commonString.commonStrings.HomePage.PLEASE_WAIT);
      this.service.invokeAdapterCall('commonAdapterServices', 'getLeaveBalance', 'get', {
        payload: false
      }).then((resultData: any) => {
        if (resultData) {
          if (resultData.status_code == 0) {
            this.mainService.userLeaveBalanceListData = resultData.data;
            console.log(JSON.stringify(this.mainService.userLeaveBalanceListData));
            this.utilService.dismissLoader();
            this.navCtrl.push(this.commonString.commonStrings.HomePage.APPLYLEAVE_NAV);
          } else {
            this.utilService.dismissLoader();
            // this.utilService.showCustomPopup(this.commonString.commonStrings.HomePage.FAILURE_TITLE_TEXT,resultData.message);
            this.utilService.showCustomPopup4Error(this.commonString.commonStrings.HomePage.FAILURE_TITLE_LEAVES, resultData.message, this.commonString.commonStrings.HomePage.FAILURE_TITLE_TEXT);
          }
        };
      }, (error) => {
        console.log(error);
        this.utilService.dismissLoader();
        // this.utilService.showCustomPopup(this.commonString.commonStrings.HomePage.FAILURE_TITLE_TEXT,error.statusText);
        this.utilService.showCustomPopup4Error(this.commonString.commonStrings.HomePage.FAILURE_TITLE_LEAVES, this.commonString.commonStrings.HomePage.FAILURE_MSG_ONE, this.commonString.commonStrings.HomePage.FAILURE_TITLE_TEXT);
      });
      // }else{
      //   this.utilService.showCustomPopup(this.commonString.commonStrings.HomePage.FAILURE_TITLE_TEXT, "You are in offline, Please check you internet..");
      // } 
    } catch (error) {
      console.log(error);
    }

  }

  myRequest() {

    try {
      // if(this.mainService.internetConnectionCheck){
      this.utilService.showLoader(this.commonString.commonStrings.HomePage.PLEASE_WAIT);
      this.service.invokeAdapterCall('commonAdapterServices', 'getMyRequestDetails', 'get', {
        payload: false
      }).then((resultData: any) => {
        if (resultData) {
          if (resultData.status_code == 0) {
            this.mainService.myRequestData = resultData.data;
            console.log(JSON.stringify(this.mainService.myRequestData));
            this.utilService.dismissLoader();
            this.navCtrl.push(this.commonString.commonStrings.HomePage.MYREQUEST_NAV);
          } else {
            this.utilService.dismissLoader();
            // this.utilService.showCustomPopup(this.commonString.commonStrings.HomePage.FAILURE_TITLE_TEXT,resultData.message);
            this.utilService.showCustomPopup4Error(this.commonString.commonStrings.HomePage.FAILURE_TITLE_MYREQUEST, resultData.message, this.commonString.commonStrings.HomePage.FAILURE_TITLE_TEXT);
          }
        };
      }, (error) => {
        console.log("Data readed from jsonstore error", error);
        this.utilService.dismissLoader();
        // this.utilService.showCustomPopup(this.commonString.commonStrings.HomePage.FAILURE_TITLE_TEXT,error.statusText);
        this.utilService.showCustomPopup4Error(this.commonString.commonStrings.HomePage.FAILURE_TITLE_MYREQUEST, this.commonString.commonStrings.HomePage.FAILURE_MSG_ONE, this.commonString.commonStrings.HomePage.FAILURE_TITLE_TEXT);
      });
      // }else{
      //   this.utilService.showCustomPopup(this.commonString.commonStrings.HomePage.FAILURE_TITLE_TEXT, "You are in offline, Please check you internet..");
      // }  
    } catch (error) {
      console.log("catch-->>", error);
    }

  }

  myTask() {
    try {
      // if(this.mainService.internetConnectionCheck){
      this.utilService.showLoader(this.commonString.commonStrings.HomePage.PLEASE_WAIT);
      this.service.invokeAdapterCall('commonAdapterServices', 'getMyTaskDetails', 'get', {
        payload: false
      }).then((resultData: any) => {
        if (resultData) {
          if (resultData.status_code == 0) {
            this.mainService.myTaskData = resultData.data;
            console.log(JSON.stringify(this.mainService.myTaskData));
            if (resultData.data.ET_OD == "" && resultData.data.ET_FTP == "" && resultData.data.ET_LEAVE == "") {
              this.utilService.dismissLoader();
              this.utilService.showCustomPopup4Error(this.commonString.commonStrings.HomePage.FAILURE_TITLE_MYTASKS, this.commonString.commonStrings.HomePage.FAILURE_MSG_TWO, this.commonString.commonStrings.HomePage.FAILURE_TITLE_TEXT);
            } else {
              this.utilService.dismissLoader();
              this.navCtrl.push(this.commonString.commonStrings.HomePage.MYTASKS_NAV);
            }
          } else {
            this.utilService.dismissLoader();
            this.utilService.showCustomPopup4Error(this.commonString.commonStrings.HomePage.FAILURE_TITLE_MYTASKS, resultData.message, this.commonString.commonStrings.HomePage.FAILURE_TITLE_TEXT);
          }
        };
      }, (error) => {
        console.log(error);
        this.utilService.dismissLoader();
        this.utilService.showCustomPopup4Error(this.commonString.commonStrings.HomePage.FAILURE_TITLE_MYTASKS, this.commonString.commonStrings.HomePage.FAILURE_MSG_ONE, this.commonString.commonStrings.HomePage.FAILURE_TITLE_TEXT);
      });
      // }else{
      //   this.utilService.showCustomPopup(this.commonString.commonStrings.HomePage.FAILURE_TITLE_TEXT, "You are in offline, Please check you internet..");
      // }    
    } catch (error) {
      console.log(error);
    }
  }
}
