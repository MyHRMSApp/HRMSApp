import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ServiceProvider } from '../providers/service/service';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { Network } from '@ionic-native/network';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { StorageProvider } from '../providers/storage/storage';
import { SocialSharing } from '@ionic-native/social-sharing';

import { CalendarModule } from 'ion2-calendar';
import { GooglePlus } from '@ionic-native/google-plus';
//import { AngularFireModule } from 'angularfire2';
import * as firebase from 'firebase';

import { MyApp } from './app.component';
import { UtilsProvider } from '../providers/utils/utils';
import { AuthHandlerProvider } from '../providers/auth-handler/auth-handler';
import { ConsoleServiceProvider } from '../providers/console-service/console-service';

export const firebaseConfig = {
  apiKey: "AIzaSyDc0EYCDmJ3SZh5fiyk9M3qeYqDTBAYXgY",
  authDomain: "myhrms-8f727.firebaseapp.com",
  databaseURL: "https://myhrms-8f727.firebaseio.com",
  projectId: "myhrms-8f727",
  storageBucket: "myhrms-8f727.appspot.com",
  messagingSenderId: "29768228914"
}
firebase.initializeApp(firebaseConfig)


@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    CalendarModule,
    //AngularFireModule.initializeApp(firebaseConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    Network,
    GooglePlus,
    SocialSharing,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ServiceProvider,
    StorageProvider,
    UtilsProvider,
    AuthHandlerProvider,
    ConsoleServiceProvider,
    MyApp
  ]
})
export class AppModule {}
