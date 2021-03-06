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
        "MYREQUEST_TEXT": "My Request",
        "REASON_VALIDATE_ERROR_MSG": "Please enter the reason",
        "FAILURE_TITLE_TEST": "FAILURE"
      },
      "AllLeavesPage": {
        "USERINFO_TEXT": "userInfo",
        "TITLENAME_TEXT": "titleName",
        "LEAVETYPE_TEXT": "leaveType",
        "LEAVEDATE_TEXT": "LeaveData",
        "HAMBURGERICON_IMG": "./assets/homePageIcons/hamburger.svg",
        "HOMEICON_IMG": "./assets/homePageIcons/Home.svg",
        "ATTANDENCEICON_IMG": "./assets/homePageIcons/attendance.svg",
        "DD_MM_YYYY": "DD-MM-YYYY",
        "ATT1_Approved_ATT2_UA_TEXT": "ATT1_Approved_ATT2_UA",
        "SECONDHALF_TEXT": "2nd half",
        "SH_TEXT": "SH",
        "ATT1_Pending_ATT2_UA_TEXT": "ATT1_Pending_ATT2_UA",
        "ATT1_Holliday_ATT2_UA_TEXT": "ATT1_Holliday_ATT2_UA",
        "ATT1_NormalPunch_ATT2_UA_TEXT": "ATT1_NormalPunch_ATT2_UA",
        "ATT1_NomalPunch_ATT2_UA_TEXT": "ATT1_NomalPunch_ATT2_UA",
        "ATT1_UA_ATT2_Holliday_TEXT": "ATT1_UA_ATT2_Holliday",
        "FIRSTHALF_TEXT": "1st half",
        "FH_TEXT": "FH",
        "ATT1_UA_ATT2_NormalPunch_TEXT": "ATT1_UA_ATT2_NormalPunch",
        "ATT1_UA_ATT2_Approved_TEXT": "ATT1_UA_ATT2_Approved",
        "ATT1_UA_ATT2_Pending_TEXT": "ATT1_UA_ATT2_Pending",
        "FULLDAY_TEXT": "full day",
        "FD_TEXT": "FD",
        "HOMEPAGE_TEXT": "HomePage",
        "USERLEAVE_TEXT": "userLeave",
        "CUSTOMCALENDAEMODELPAGE_TEXT": "CustomCalendarModelPage",
        "YYYY_MM_DD": "YYYY-MM-DD",
        "FQ_TEXT": "FQ",
        "LQ_TEXT": "LQ",
        "SQ_TEXT": "SQ",
        "FIRSTQUARTER_TEXT": "1st Quarter",
        "SECQUARTER_TEXT": "2nd Quarter",
        "FROMDATEVALIDATE_TEXT": "Please select From Date",
        "FAILURE_TEXT": "FAILURE",
        "FROMDATEANDPERIODVALIDATE_TEXT": "Please select the From Date and Period",
        "TODATEANDPERIODVALIDATE_TEXT": "Please select the To Date and Period",
        "REASONVALIDATE_TEXT": "Please enter the Reason field",
        "APPLYLEAVE_TEXT": "Apply Leave",
        "PLEASEWAIT_TEXT": "Please Wait...",
        "YYYYMMDD": "YYYYMMDD",
        "COMMONADAPTERSERVICES_TEXT": "commonAdapterServices",
        "VALIDATELEAVEBALANCE_TEXT": "validateLeaveBalance",
        "firstquarter": "first quarter",
        "lastquarter": "last quarter",
        "EMPLOYEEAPPLYLEAVE_TEXT": "employeeApplyLeave",
        "NEW": "NEW",
        "SUBMITTED_TEXT": "Submitted",
        "ALLEAVESPAGE_TEXT": "AllLeavesPage",
        "FAILURE_TITLE_TEXT": "FAILURE"
      },
      "ApplyFtpPage": {
        "USERINFO_TEXT": "userInfo",
        "FTPDATA_TEXT": "ftpData",
        "PUNCHIN": "PUNCH IN",
        "PUNCHOUT": "PUNCH OUT",
        "MIDIN": "MID IN",
        "MIDOUT": "MID OUT",
        "FORGOTTORECORDMYATTENDANCE_ERROR_MSG": "Forgot to record my attendance",
        "HH_mm": "HH:mm",
        "ZERO_H_M_S": "00:00:00",
        "APPLYFTP_TEXT": "Apply FTP",
        "INPUNCHVALIDATE_TEXT": "Please select proper In Punch",
        "OUTPUNCHVALIDATE_TEXT": "Please select proper Out Punch",
        "INANDOUTVALIDATE_TEXT": "Please enter the valid In & Out Time",
        "MIDINPUNCHVALIDATE_TEXT": "Please select proper Mid In Punch",
        "MIDOUTPUNCHVALIDATE_TEXT": "Please select proper Mid Out Punch",
        "MIDINANDOUTPUNCHVALIDATE_TEXT": "Please enter the valid MidIn & MidOut Time",
        "REQUESTTYPEVALIDATE_TEXT": "Please select Request Type",
        "APPLYFTPREQUEST_TEXT": "applyFTPRequest",
      },
      "ApplyLeavePage": {
        "PRIVILEGELEAVE": "PRIVILEGE LEAVE",
        "SICKLEAVE": "SICK LEAVE",
        "GENERALLEAVE": "GENERAL LEAVE",
        "CASUALLEAVE": "CASUAL LEAVE",
        "GETLEAVEENCASHBALANCE_TEXT": "getLeaveEncashBalance",
        "ENCASHMENTLEAVEPAGE_TEXT": "EncashmentLeavePage",
        "LEAVEENCASHMENT": "LEAVE ENCASHMENT",
        "internetVlidate": "You are in offline, please check you internet",
        "CL": "CL",
        "SL": "SL",
        "GL": "GL",
        "PL": "PL"
      },
      "ApplyOdPage": {
        "timeData": {
          Hours: [{
              description: "00"
            },
            {
              description: "01"
            },
            {
              description: "02"
            },
            {
              description: "03"
            },
            {
              description: "04"
            },
            {
              description: "05"
            },
            {
              description: "06"
            },
            {
              description: "07"
            },
            {
              description: "08"
            },
            {
              description: "09"
            },
            {
              description: "10"
            },
            {
              description: "11"
            },
            {
              description: "12"
            },
            {
              description: "13"
            },
            {
              description: "14"
            },
            {
              description: "15"
            },
            {
              description: "16"
            },
            {
              description: "17"
            },
            {
              description: "18"
            },
            {
              description: "19"
            },
            {
              description: "20"
            },
            {
              description: "21"
            },
            {
              description: "22"
            },
            {
              description: "23"
            }
          ],
          Minutes: [{
              description: "00"
            },
            {
              description: "05"
            },
            {
              description: "10"
            },
            {
              description: "15"
            },
            {
              description: "20"
            },
            {
              description: "25"
            },
            {
              description: "30"
            },
            {
              description: "35"
            },
            {
              description: "40"
            },
            {
              description: "45"
            },
            {
              description: "50"
            },
            {
              description: "55"
            }
          ]
        },
        "twoZero": "00:00",
        "ODData": "ODData",
        "STARTTIME": "START TIME",
        "ENDTIME": "END TIME",
        "CustomCalendarModelPage": "CustomCalendarModelPage",
      },
      "ProfilePage": {
        "HOMEPAGE_NAV": "HomePage",
        "HAMBURGERICON_IMG": "./assets/homePageIcons/hamburger.svg",
        "HOMEICON_IMG": "./assets/homePageIcons/Home.svg",
      },
      "HRHelplinePage": {
        "HOMEPAGE_NAV": "HomePage",
        "HAMBURGERICON_IMG": "./assets/homePageIcons/hamburger.svg",
        "HOMEICON_IMG": "./assets/homePageIcons/Home.svg",
      },
      "NeedHelpPage": {
        "HAMBURGERICON_IMG": "./assets/homePageIcons/hamburger.svg",
        "HOMEICON_IMG": "./assets/homePageIcons/Home.svg",
      },
      "CouponsPage": {
        "HAMBURGERICON_IMG": "./assets/homePageIcons/hamburger.svg",
        "HOMEICON_IMG": "./assets/homePageIcons/Home.svg",
        "WATCHES_IMG": "./assets/couponsImages/watch.svg",
        "JEWELLERIES_IMG": "./assets/couponsImages/jewellery.svg",
        "SAREE_IMG": "./assets/couponsImages/saree.svg",
        "EYEWEARS_IMG": "./assets/couponsImages/glass-IMG.svg",
        "FAILURE_TITLE_TEXT": "FAILURE",
        "NO_COUPONS": "No Coupons Available",
        "SHARECOUPONSPAGE_NAV": "ShareCouponsPage",
        "HOMEPAGE_NAV": "HomePage",
      },
      "ShareCouponsPage": {
        "HAMBURGERICON_IMG": "./assets/homePageIcons/hamburger.svg",
        "HOMEICON_IMG": "./assets/homePageIcons/Home.svg",
        "SHAREICON_IMG": "./assets/couponsImages/share.svg",
        "COUPONSBG_IMG": "./assets/couponsImages/coupons-BG.svg",
        "MAIL_SUBJECT": "mailto:?cc=&subject=TITAN%20DISCOUNT%20COUPONS&body=",
        "FAILURE_TITLE_TEXT": "FAILURE",
        "HOMEPAGE_NAV": "HomePage",
        "FAILURE_ANDROID": "Whatsapp is not installed",
        "FAILURE_IOS": "Sorry! Unable to open whatsapp",
        "FAILURE_MSG": "Messaging is not installed",
      },
      "MyRequestsPage": {
        "HAMBURGERICON_IMG": "./assets/homePageIcons/hamburger.svg",
        "HOMEICON_IMG": "./assets/homePageIcons/Home.svg",
        "PLEASE_WAIT": "Please Wait...",
        "FAILURE_TITLE_TEXT": "FAILURE",
        "HOMEPAGE_NAV": "HomePage",
        "ALERTPAGETEXTAREA": "AlertPageFortextareaPage"
      },
      "MyTasksPage": {
        "HAMBURGERICON_IMG": "./assets/homePageIcons/hamburger.svg",
        "HOMEICON_IMG": "./assets/homePageIcons/Home.svg",
        "APPROVE_IMG" : "./assets/couponsImages/my-Task-Approve.svg",
        "REJECT_IMG": "./assets/couponsImages/my-Task-Cancel.svg",
        "HOMEPAGE_NAV": "HomePage",
        "FAILURE_TITLE_TEXT": "FAILURE",
        "PLEASE_WAIT": "Please Wait...",
        "ALERTPAGETEXTAREA": "AlertPageFortextareaPage"
      },
      "EncashmentLeavePage" : {
        "HAMBURGERICON_IMG": "./assets/homePageIcons/hamburger.svg",
        "HOMEICON_IMG": "./assets/homePageIcons/Home.svg",
        "HOMEPAGE_NAV": "HomePage",
        "FAILURE_TITLE_TEXT": "FAILURE",
        "PLEASE_WAIT": "Please Wait...",
        "FAILURE_MSG_ONE": "Please enter the Days", 
        "FAILURE_MSG_TWO": "Please enter the Days less than or equal to Eligible Days",
        "FAILURE_TITLE": "Leave Encashment"
      },
      "CustomCalendarPage" : {
        "FAILURE_TITLE": "Apply Leave",
        "FAILURE_TITLE_TEXT": "FAILURE",
        "FAILURE_MSG_ONE": "Invalid Date Selection", 
        "FAILURE_MSG_TWO": "Please Select the Period",
      },
      "AttendanceViewPage" : {
        "HAMBURGERICON_IMG": "./assets/homePageIcons/hamburger.svg",
        "HOMEICON_IMG": "./assets/homePageIcons/Home.svg",
        "HOMEPAGE_NAV": "HomePage",
        "APPLYLEAVE_NAV": "ApplyLeavePage",
        "APPLYOD_NAV": "ApplyLeavePage",
        "APPLYFTP_NAV": "ApplyLeavePage",
        "PLEASE_WAIT": "Please Wait...",
        "FAILURE_TITLE_LEAVE": "Apply Leave",
        "FAILURE_TITLE_OD": "Apply OD",
        "FAILURE_TITLE_FTP": "Apply FTP",
        "FAILURE_TITLE_TEXT": "FAILURE",
        "FAILURE_MSG_ONE": "Invalid Date Selection", 
        "FAILURE_MSG_TWO": "102: Oops! Something went wrong, Please try again",
        "FAILURE_MSG_THREE": "Please select date",
      },
      "HomePage" : {
        "ATTENDANCE_IMG": "./assets/homePageIcons/attendance.svg",
        "COUPON_IMG": "./assets/homePageIcons/coupon.svg",
        "LEAVE_IMG": "./assets/homePageIcons/leave.svg",
        "MYREQUEST_IMG": "./assets/homePageIcons/my_request.svg",
        "MYTASK_IMG": "./assets/homePageIcons/my_task.svg",
        "AVATAR_IMG": "./assets/icon/avatar.png",
        "HAMBURGERICON_IMG": "./assets/homePageIcons/hamburger-01.svg",
        "PLEASE_WAIT": "Please Wait...",
        "FAILURE_TITLE_TEXT": "FAILURE",
        "FAILURE_MSG_ONE": "102: Oops! Something went wrong, Please try again",
        "FAILURE_MSG_TWO": "101: No tasks found",
        "MYTASKS_NAV": "MyTasksPage",
        "MYREQUEST_NAV": "MyRequestPage",
        "APPLYLEAVE_NAV": "ApplyLeavePage",
        "COUPONS_NAV": "CouponsPage",
        "ATTENDANCE_NAV": "AttendanceViewPage",
        "FAILURE_TITLE_ATT": "Attendance",
        "FAILURE_TITLE_LEAVES": "Leaves",
        "FAILURE_TITLE_COUPONS": "Coupons",
        "FAILURE_TITLE_MYREQUEST": "My Request",
        "FAILURE_TITLE_MYTASKS": "My Task",
        "UPDATING_PIC" : "Updating picture",
        "REMOVING_PIC" : "Removing picture"
      }
    }
  }
}