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

import { CalendarModule } from 'ion2-calendar';
import { GooglePlus } from '@ionic-native/google-plus';
//import { AngularFireModule } from 'angularfire2';
import * as firebase from 'firebase';

import { MyApp } from './app.component';

export const firebaseConfig = {
  apiKey: "AIzaSyAiXhrXqGqPMW025LuYVGTnlYsZb6GkcLs",
  authDomain: "myhr-da310.firebaseapp.com",
  databaseURL: "https://myhr-da310.firebaseio.com",
  projectId: "myhr-da310",
  storageBucket: "myhr-da310.appspot.com",
  messagingSenderId: "609753179467"
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
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ServiceProvider,
    StorageProvider
  ]
})
export class AppModule {}
