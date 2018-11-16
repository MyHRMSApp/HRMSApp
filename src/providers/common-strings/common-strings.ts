import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable()
export class CommonStringsProvider {
  commonStrings: any;

  constructor(public http: HttpClient) {
    console.log('Hello CommonStringsProvider Provider');

    this.commonStrings = {
      "loginPage": {
        "Forbidden": "Forbidden",
        "FAILURE": "FAILURE",
        "accountLockedText": "Your account is Locked, Please try again after 60 Sec",
        "HomePage": "HomePage",
        "LoginPage": "LoginPage",
        "rememberMe": "rememberMe",
        "enabled": "enabled",
        "none": "none",
        "remember": "remember",
        "rootPage": "rootPage",
        "true": "true",
        "disabled": "disabled",
        "userNameValidate": "Username is required",
        "userNameLenValidate": "Username must be min 4 and max 8 characters",
        "passValidate": "Password is required",
        "E": "E",
        "E0": "E0",
        "E00": "E00",
        "E000": "E000",
        "pleaseWait": "Please Wait...",
        "username": "username",
        "password": "password",
        "SECURITY_TYPE": "SECURITY_TYPE",
        "userPicture": "userPicture",
        "avatar": "./assets/icon/avatar.png",
        "android": "android",
        "webclient4Android": "29768228914-26nbts9h35kghvhckl75lhh7tvgtkv70.apps.googleusercontent.com",
        "webclient4IOS": "29768228914-ba1ss8q936cpi82mhcu6tdgoi6b99hhk.apps.googleusercontent.com",
        "webClientId": "webClientId",
        "offline": "offline",
        "vendor": "vendor",
        "google": "google",
        "token": "token",
        "GMAIL_ID": "GMAIL_ID",
        "platform": "platform",
        "gmailValidate": "Please use Titan Mail ID",
        "NeedHelpPage": "NeedHelpPage",
        "ios": "ios",
        "SAP_LOGIN": "SAP_LOGIN"
      },
      "AlertPageFortextareaPage": {
        "MyRequest": "My Request",
        "reasonValidate": "Please enter the reason",
        "FAILURE": "FAILURE"
      },
      "AllLeavesPage": {
        "userInfo": "userInfo",
        "titleName": "titleName",
        "leaveType": "leaveType",
        "LeaveData": "LeaveData",
        "hamburgerIcon": "./assets/homePageIcons/hamburger.svg",
        "homeIcon": "./assets/homePageIcons/Home.svg",
        "attendanceIcon": "./assets/homePageIcons/attendance.svg",
        "DD_MM_YYYY": "DD-MM-YYYY",
        "ATT1_Approved_ATT2_UA": "ATT1_Approved_ATT2_UA",
        "sechalf": "2nd half",
        "SH": "SH",
        "ATT1_Pending_ATT2_UA": "ATT1_Pending_ATT2_UA",
        "ATT1_Holliday_ATT2_UA": "ATT1_Holliday_ATT2_UA",
        "ATT1_NormalPunch_ATT2_UA": "ATT1_NormalPunch_ATT2_UA",
        "ATT1_NomalPunch_ATT2_UA": "ATT1_NomalPunch_ATT2_UA",
        "ATT1_UA_ATT2_Holliday": "ATT1_UA_ATT2_Holliday",
        "firsthalf": "1st half",
        "FH": "FH",
        "ATT1_UA_ATT2_NormalPunch": "ATT1_UA_ATT2_NormalPunch",
        "ATT1_UA_ATT2_Approved": "ATT1_UA_ATT2_Approved",
        "ATT1_UA_ATT2_Pending": "ATT1_UA_ATT2_Pending",
        "fullday": "full day",
        "FD": "FD",
        "HomePage": "HomePage",
        "userLeave": "userLeave",
        "CustomCalendarModelPage": "CustomCalendarModelPage",
        "YYYY_MM_DD": "YYYY-MM-DD",
        "FQ": "FQ",
        "LQ": "LQ",
        "SQ": "SQ",
        "firstQuarter": "1st Quarter",
        "secQuarter": "2nd Quarter",
        "fromDateValidate": "Please select From Date",
        "FAILURE": "FAILURE",
        "fromDateandPeriodValidate": "Please select the From Date and Period",
        "toDateandPeriodValidate": "Please select the To Date and Period",
        "reasonValidate": "Please enter the Reason field",
        "ApplyLeave": "Apply Leave",
        "pleaseWait": "Please Wait...",
        "YYYYMMDD": "YYYYMMDD",
        "commonAdapterServices": "commonAdapterServices",
        "validateLeaveBalance": "validateLeaveBalance",
        "firstquarter": "first quarter",
        "lastquarter": "last quarter",
        "employeeApplyLeave": "employeeApplyLeave",
        "NEW": "NEW",
        "Submitted": "Submitted"
      },
      "ApplyFtpPage": {
        "userInfo": "userInfo",
        "ftpData": "ftpData",
        "PUNCHIN": "PUNCH IN",
        "PUNCHOUT": "PUNCH OUT",
        "MIDIN": "MID IN",
        "MIDOUT": "MID OUT",
        "Forgottorecordmyattendance": "Forgot to record my attendance",
        "HH_mm": "HH:mm",
        "ZERO_H_M_S": "00:00:00",
        "ApplyFTP": "Apply FTP",
        "inpunchValidate": "Please select proper In Punch",
        "outpunchValidate": "Please select proper Out Punch",
        "inandoutValidate": "Please enter the valid In & Out Time",
        "midinpunchValidate": "Please select proper Mid In Punch",
        "midoutpunchValidate": "Please select proper Mid Out Punch",
        "midinandoutpunchValidate": "Please enter the valid MidIn & MidOut Time",
        "requestTypeValidate": "Please select Request Type",
        "applyFTPRequest": "applyFTPRequest"
      }


    }

  }


}
