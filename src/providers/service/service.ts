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
   * @param method
   */
  invokeAdapterCall(adaptername, adaptermethodname, method, payload){
    var methodVal = (method == 'get')?WLResourceRequest.GET : WLResourceRequest.POST;
    var resourceRequest = new WLResourceRequest(
      "/adapters/"+adaptername+"/services/"+adaptermethodname,
      methodVal
    );
    if(payload.payload == true){
      for(var i=0; i<payload.length; i++){
        var key = Object.keys(payload.payloadData)[i];
        var value = payload.payloadData[key];
        console.log(key+"----"+value)
        resourceRequest.setQueryParameter(key, value);
      }
    }
    resourceRequest.setHeaders("Content-Type","application/json");
    
    return new Promise((resolve,reject)=>{
      resourceRequest.send().then((responseData:any)=>{
        if(responseData.responseJSON){
         setTimeout(() => {
          resolve(responseData.responseJSON);
         }, 1000);
        }
      },(error)=>{
        setTimeout(() => {
          reject(error);
         }, 1000);
        reject(error);
      });
    });
  }





  

}
