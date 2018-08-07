import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the ConsoleServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ConsoleServiceProvider {

  constructor(public http: HttpClient) {
    console.log('Hello ConsoleServiceProvider Provider');
  }

  /**
   * This is the common method to print the Console, Example Logs, Errors, Infos
   * @param consoleMsg
   * @param consoleType
   */
  consolePrintService(consoleMsg, consoleType){
    switch (consoleType) {
      case "Log":
          console.log(consoleMsg);
        break;
      case "info":
          console.info(consoleMsg);
        break;
      case "error":
          console.error(consoleMsg);
        break;
    }
  }

}
