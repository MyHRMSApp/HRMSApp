import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

declare var WLResourceRequest;
@Injectable()
export class ServiceProvider {

  constructor(public http: HttpClient) {
    console.log('Hello ServiceProvider Provider');
  }


  /**
   * Method for calling mfp adapters
   * @param adaptername
   * @param adaptermethodname
   * @param payload
   */
  invokeAdapterCall(adaptername, adaptermethodname, method, payload){
    // var methodVal = (method == 'get')?WLResourceRequest.GET : WLResourceRequest.POST;
    // return new Promise((resolve,reject)=>{
    //   var resourceRequest = new WLResourceRequest(
    //     "/adapters/"+adaptername+"/"+adaptermethodname,
    //     methodVal
    //   );
    //   if(payload.payloadVal = true){
    //     for (var key in payload.payloadData) {
    //         console.log(key + " -> " + payload.payloadData[key]);
    //         resourceRequest.setQueryParameter(key, payload.payloadData[key]);
    //     }
    //     //resourceRequest.setQueryParameter("parameterName", payload);
    //   }
    //   resourceRequest.setHeaders("Content-Type","application/json");
    //   resourceRequest.send().then((responseData:any)=>{
    //     if(responseData.responseJSON){
    //       console.log('-->>'+responseData.responseJSON);
    //       resolve(responseData.responseJSON);
    //     }
    //   },(Error)=>{
    //     reject(Error);
    //   });
    // });

     // console.log('--> MyWardDataProvider getting Object Storage AuthToken from adapter ...');
    var grievance = {
      "IP_BEGDA": "20180601",
      "IP_ENDDA":"20180605",
      "IP_PERNR":"00477072"
    }
    
     let dataRequest = new WLResourceRequest("/adapters/attananceRequest/getAttananceData", WLResourceRequest.POST, 3000);
     dataRequest.setHeader("Content-Type","application/json");
     dataRequest.setQueryParameter("IP_BEGDA", "20180601");
     dataRequest.setQueryParameter("IP_ENDDA", "20180605");
     dataRequest.setQueryParameter("IP_PERNR", "00477072");
     dataRequest.send().then(
       (response) => {
         console.log('--> MyWardDataProvider: Upload successful:\n', response);
       }, (failure) => {
         console.log('--> MyWardDataProvider: Upload failed:\n', failure);
       });

  }

}
