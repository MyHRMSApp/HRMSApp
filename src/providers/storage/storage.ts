
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/**
 * Common Storage Provider
 * @author Vivek
 */

declare var WL;
var collections = {
  userImage:{},
  userInfo:{}

};

var options = {};
@Injectable()
export class StorageProvider {

constructor(public http: Http) { 
}
/*
*  JSON Store Common Method to access and read data from Local Json Store
*  Useful in doing CRUD operations in the devices at Offline also
*  Procedure to initialize the Json Store collections
*/
jsonstoreInitialize() {
  console.log("JsonStore Initialization Success", collections);
  return WL.JSONStore.init(collections, options);
}
/**
 * Procedure for Add data into then collection data based on the collection name in the Json store
 * @param data
 * @param CollectionName
 */
jsonstoreAdd(CollectionName,data) {
  console.log('Storing CollectionName and Data',CollectionName,data);
  let dataToStore = (typeof data == "object") ? JSON.stringify(data) : data;
  let dataValue = {'value':dataToStore};
  console.log('value,', dataValue);
  return new Promise((resolve,reject)=> {
    WL.JSONStore.get(CollectionName).add(dataValue, options).then((Response) => {
      console.log("Data Added to "+CollectionName+"is Successful",dataValue);
      resolve(Response);
    }).fail((error) => {
      console.log('Data Added Error', error);
      reject(error);
    });
  });
}
/**
 * Procedure for Read all collection data based on the collection name from the Json store
 * @param collectionName
 */
jsonstoreReadAll(collectionName) {
  return new Promise((resolve)=>{
    var response = WL.JSONStore.get(collectionName).findAll(options);
    resolve(response);
  });
}
/**
 * Procedure for clearing the data inside the collection
 */
jsonstoreClearCollection(collectionName){
  return WL.JSONStore.get(collectionName).clear()
  .then((data)=>{
    console.log(collectionName+"data is cleared",data);
  },(errorObject)=>{
    console.log(collectionName+"error in data is clearing",errorObject);
  });
}
/**
 * Procedure for Removing a collection from the list of collections
 * @param collectionName
 */
jsonstoreRemoveCollec(collectionName) {
  return WL.JSONStore.get(collectionName).removeCollection();
}
/**
 * Procedure for Replace a collection value which is already exsist
 * @param collectionName
 */
jsonstoreReplaceCollec(collectionName, data) {
  return WL.JSONStore.get(collectionName).replace(data);
}
/**
 * Procedure for Read all collection data based on the collection name from the Json store
 * @param collectionName
 */
jsonstoreRead(collectionName) {
    return WL.JSONStore.get(collectionName);
}
}