import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable()
export class CommonStringsProvider {
  commonStrings: any;

  constructor(public http: HttpClient) {
    console.log('Hello CommonStringsProvider Provider');

    this.commonStrings = {
      "loginPage" : [{
           
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
