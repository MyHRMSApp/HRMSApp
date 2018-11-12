import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable()
export class CommonStringsProvider {
  commonStrings: any;

  constructor(public http: HttpClient) {
    console.log('Hello CommonStringsProvider Provider');

    this.commonStrings = {
      "loginPage" : [{
        android: "android",
        iOS: "ios",
        androidWebClientID: "29768228914-26nbts9h35kghvhckl75lhh7tvgtkv70.apps.googleusercontent.com",
        iosWebClientID: "29768228914-ba1ss8q936cpi82mhcu6tdgoi6b99hhk.apps.googleusercontent.com",
           
      }],
      "homePage" : [{

      }],
      "attendancePage" : [{

      }],
      "allLeavesPage" : [{

      }],
      "applyLeavePage" : [{

      }],
      "applyFtpPage" : [{

      }],
      "applyOdPage" : [{

      }],
      "encashmentLeavePage" : [{

      }],
      "couponsPage" : [{
        "watches": "WATCHES",
        "jewellery": "JEWELLERY",
        "eyewear" : "EYE WEAR",
        "taneira" : "TANEIRA",
        "failure": "FAILURE",
        "failureMsg" : "No coupons available"
      }],
      "myRequestPage" : [{

      }],
      "myTasksPage" : [{

      }],
    }
  
  }


}
