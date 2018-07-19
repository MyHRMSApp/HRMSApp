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
    var methodVal = (method == 'get')?WLResourceRequest.GET : WLResourceRequest.POST;
    return new Promise((resolve,reject)=>{
      var resourceRequest = new WLResourceRequest(
        "/adapters/"+adaptername+"/"+adaptermethodname,
        methodVal
      );
      //resourceRequest.setQueryParameter("parameterName", payload);
      resourceRequest.setHeaders("Content-Type","application/json");
      resourceRequest.send().then((responseData:any)=>{
        if(responseData.responseJSON){
          resolve(responseData.responseJSON);
        }
      },(Error)=>{
        reject(Error);
      });
    });
  }

}
