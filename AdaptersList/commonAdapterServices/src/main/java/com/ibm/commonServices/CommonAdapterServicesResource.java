/*
 *    Licensed Materials - Property of IBM
 *    5725-I43 (C) Copyright IBM Corp. 2015, 2016. All Rights Reserved.
 *    US Government Users Restricted Rights - Use, duplication or
 *    disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

package com.ibm.commonServices;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;

import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.*;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.net.*;
import java.io.*;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.MessageBodyWriter;

import com.ibm.mfp.adapter.api.ConfigurationAPI;
import com.ibm.mfp.adapter.api.AdaptersAPI;
import com.ibm.mfp.adapter.api.OAuthSecurity;

import org.json.JSONArray;
import org.json.JSONObject;

import com.ibm.mfp.server.registration.external.model.ClientData;
import com.ibm.mfp.server.security.external.resource.AdapterSecurityContext;
import com.ibm.mfp.server.registration.external.model.AuthenticatedUser;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.auth.AuthScope;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.CredentialsProvider;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.impl.client.BasicCredentialsProvider;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.apache.http.entity.StringEntity;

@Api(value = "This is Common Adapter service for Titan Interface [SAP]")
@Path("/services")
public class CommonAdapterServicesResource {
	/*
	 * For more info on JAX-RS see
	 * https://jax-rs-spec.java.net/nonav/2.0-rev-a/apidocs/index.html
	 */

	@Context
	ConfigurationAPI configurationAPI;

	@Context
    AdapterSecurityContext securityContext;

	// Define logger (Standard java.util.Logger)
	private static final Logger LOGGER = Logger.getLogger(CommonAdapterServicesResource.class.getName());

	// Static Variable declration PART
	private static final String GET_CUSTOMUSER_MSG = "UserCustomMessage";
	private static final String SAP_USERNAME = "HCM_SERV_USR";
    private static final String SAP_PASSWORD = "HCM_SERV_USR@123";
	private static final String AUTH_STRING = SAP_USERNAME + ":" + SAP_PASSWORD;
	private static final String[] PENDING_LEAVES = {"ODP", "FTP", "CLP", "SLP", "GLP", "QLP", "PLP"};
	private static final String[] APPROVED_LEAVES = {"ODA", "FTA", "CLA", "SLA", "GLA", "QLA", "PLA"};
	private static final String DEVServer = "DEVServer";
	private static final String UATServer = "UATServer";
	private static final String GetCouponDetail = "GetCouponDetail";
	private static final String GetLeaveBalance = "GetLeaveBalance";
	private static final String BalanceValidation = "BalanceValidation";
	private static final String ApplyLeave = "ApplyLeave";
	private static final String GetAttendanceStatus = "GetAttendanceStatus";
	private static final String ApplyOnDuty = "ApplyOnDuty";
	private static final String ApplyFTP = "ApplyFTP";
	private static final String GetLeaveEncashment = "GetLeaveEncashment";
	private static final String ApplyLeaveEncash = "ApplyLeaveEncash";
	private static final String GetMyRequests = "GetMyRequests";
	private static final String ApplyCancelLeave = "ApplyCancelLeave";
	private static final String GetMyTask = "GetMyTask";
	private static final String MyTaskApprove = "MyTaskApprove";
	private static final String GetMyProfile = "GetMyProfile";
	private static final String AUTH_SCOPE_URL = "pirqa.titan.co.in";
	private static final int AUTH_SCOPE_PORT = 50401;
	private static final int TIMEOUT_MILLIS = 30000;
	
	// public Variable declration PART
	public String authorizationStringEncrypted = null;
	public String commonResponceStr = "{\"message\": \"\",\"status_code\": 1,\"data\": \"\"}";
	public int STATUS_CODE = 0;
	public JSONObject commonServerResponce;
	public CloseableHttpClient httpclient = null;
	/* *
	 * @Funtion - (getCouponsList) this funtion will return Coupon List which will come from SAP
	 * @QueryParam - IV_PERNR which contains user Pernr Number
	 * @return - Coupon List (type - JSON String format)
	 * */
	@GET
	@Path("/getCouponsList")
	@Produces(MediaType.APPLICATION_JSON)
	@OAuthSecurity(scope = "socialLogin")
	public String getCouponsList() {
		// JSONObject commonServerResponce = new JSONObject(commonResponceStr);
		String methodName = new Object() {}.getClass().getEnclosingMethod().getName();
		JSONObject userInformation = (JSONObject) this.getActiveUserProperties();
		JSONObject inputJSON = new JSONObject();
		JSONObject serverResJSON = new JSONObject();
		inputJSON.put("IV_PERNR", userInformation.getString("EP_PERNR"));
		serverResJSON = this.postService(inputJSON.toString(), GetCouponDetail, methodName);
		
		return serverResJSON.toString();
	}

	/* *
	 * @Funtion - (getLeaveBalance) this funtion will return Leave Balance which will come from SAP
	 * @QueryParam - IP_EMPTYP which contains user Employee Type [ESS, MSS], IV_PERNR which contains user Pernr Number
	 * @return - Leave Balance (type - JSON String format)
	 * */
	@GET
	@Path("/getLeaveBalance")
	@Produces(MediaType.APPLICATION_JSON)
	@OAuthSecurity(scope = "socialLogin")
	public String getLeaveBalance() {
		JSONObject inputJSON = new JSONObject();
		String methodName = new Object() {}.getClass().getEnclosingMethod().getName();
		JSONObject userInformation = (JSONObject) this.getActiveUserProperties();
		inputJSON.put("IP_EMPTYP", userInformation.getString("EP_USERTYPE"));
		inputJSON.put("IP_PERNR", userInformation.getString("EP_PERNR"));						
		JSONObject serverResJSON = new JSONObject();
		serverResJSON = this.postService(inputJSON.toString(), GetLeaveBalance, methodName);
		
		return serverResJSON.toString();
	}

	/* *
	 * @Funtion - (validateLeaveBalance) this function is using for validation befor user Apply Leave
	 * @QueryParam - IP_EMPTYP which contains user Employee Type [ESS, MSS], IV_PERNR which contains user Pernr Number
	 * @return - SAP Responce (type - JSON String format)
	 * */
	@POST
	@Path("/validateLeaveBalance")
	@Produces(MediaType.APPLICATION_JSON)
	@OAuthSecurity(scope = "socialLogin")
	public String validateLeaveBalance(	@QueryParam("IP_LTYP") String IP_LTYP,@QueryParam("IP_FDATE") String IP_FDATE,
										@QueryParam("IP_TDATE") String IP_TDATE,@QueryParam("IP_FHALF") String IP_FHALF,
										@QueryParam("IP_THALF") String IP_THALF	) {
		
		JSONObject inputJSON = new JSONObject();
		String methodName = new Object() {}.getClass().getEnclosingMethod().getName();
		JSONObject userInformation = (JSONObject) this.getActiveUserProperties();
		inputJSON.put("IP_PERNR", userInformation.getString("EP_PERNR"));
		inputJSON.put("IP_LTYP", IP_LTYP);	
		inputJSON.put("IP_FDATE", IP_FDATE);
		inputJSON.put("IP_TDATE", IP_TDATE);
		inputJSON.put("IP_FHALF", IP_FHALF);
		inputJSON.put("IP_THALF", IP_THALF);					
		JSONObject serverResJSON = new JSONObject();
		serverResJSON = this.postService(inputJSON.toString(), BalanceValidation, methodName);

		return serverResJSON.toString();
	}

	/* *
	 * @Funtion - (employeeApplyLeave) this function is using for validation befor user Apply Leave
	 * @QueryParam - IP_FDATE [Start Date], IP_TDATE [End Date], IP_FHALF [Start Period], IP_THALF [End Period], IP_DAY [Current Day], R_LEAVE [Reson Content], IP_REQ_TYPE [Request Type], IP_WF_STATUS [Work Flow Status], IP_LTYP [Leave Type]
	 * @return - SAP Responce (type - JSON String format)
	 * */
	@POST
	@Path("/employeeApplyLeave")
	@Produces(MediaType.APPLICATION_JSON)
	@OAuthSecurity(scope = "socialLogin")
	public String employeeApplyLeave(	@QueryParam("IP_FDATE") String IP_FDATE, @QueryParam("IP_TDATE") String IP_TDATE,
										@QueryParam("IP_FHALF") String IP_FHALF, @QueryParam("IP_THALF") String IP_THALF,
										@QueryParam("IP_DAY") String IP_DAY, @QueryParam("R_LEAVE") String R_LEAVE,
										@QueryParam("IP_REQ_TYPE") String IP_REQ_TYPE, @QueryParam("IP_WF_STATUS") String IP_WF_STATUS,
										@QueryParam("IP_LTYP") String IP_LTYP) {
		
		JSONObject inputJSON = new JSONObject();
		JSONObject userInformation = (JSONObject) this.getActiveUserProperties();
		String methodName = new Object() {}.getClass().getEnclosingMethod().getName();
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMdd");
		SimpleDateFormat timeFormat = new SimpleDateFormat("HH:mm:ss");   
		Date date = new Date();  
	
		inputJSON.put("IP_PERNR", userInformation.getString("EP_PERNR"));
		inputJSON.put("IP_LTYP", IP_LTYP);	
		inputJSON.put("IP_FDATE", IP_FDATE);
		inputJSON.put("IP_TDATE", IP_TDATE);
		inputJSON.put("IP_FHALF", IP_FHALF);
		inputJSON.put("IP_THALF", IP_THALF);
		inputJSON.put("IP_DAY", IP_DAY);
		inputJSON.put("R_LEAVE", R_LEAVE);	
		inputJSON.put("IP_REQ_TYPE", IP_REQ_TYPE);
		inputJSON.put("IP_WF_STATUS", IP_WF_STATUS);
		inputJSON.put("IP_CREATE_DATE", dateFormat.format(date));
		inputJSON.put("IP_CREATE_TIME", timeFormat.format(date));				
		JSONObject serverResJSON = new JSONObject();
		serverResJSON = this.postService(inputJSON.toString(), ApplyLeave, methodName);

		return serverResJSON.toString();
	}

	/* *
	 * @Funtion - (getEmployeeAttendanceData) this funtion will return Employee Attanance for five months default which will come from SAP
	 * @QueryParam - IP_PERNR which contains user Pernr Number
	 * @return - Attanance Object (type - JSON String format)
	 * */
	@POST
	@Path("/getEmployeeAttendanceData")
	@Produces(MediaType.APPLICATION_JSON)
	@OAuthSecurity(scope = "socialLogin")
	public String getEmployeeAttendanceData( @QueryParam("IP_SMONTH") Integer IP_SMONTH, @QueryParam("IP_EMONTH") Integer IP_EMONTH) throws IOException {
		JSONObject inputJSON = new JSONObject();
		String methodName = new Object() {}.getClass().getEnclosingMethod().getName();
		JSONObject userInformation = (JSONObject) this.getActiveUserProperties();
		JSONObject  responceJSON = new JSONObject();
		List resultJSONarrlist = new ArrayList(); 
		DateFormat sdf = new SimpleDateFormat("yyyyMMdd");

		Calendar BEGDA = Calendar.getInstance();
		BEGDA.add(Calendar.MONTH, IP_SMONTH);
		BEGDA.set(Calendar.DAY_OF_MONTH, 1);
		inputJSON.put("IP_BEGDA", sdf.format(BEGDA.getTime()));
		// inputJSON.put("IP_BEGDA", "20180701");
		// inputJSON.put("IP_ENDDA", "20180831");

		Calendar ENDDA = Calendar.getInstance();
		ENDDA.add(Calendar.MONTH, IP_EMONTH);
		ENDDA.set(Calendar.DATE, 1);
		int lastDate = ENDDA.getActualMaximum(Calendar.DATE);
		ENDDA.set(Calendar.DATE, lastDate);
		inputJSON.put("IP_ENDDA", sdf.format(ENDDA.getTime()));
		inputJSON.put("IP_PERNR", userInformation.getString("EP_PERNR"));

		responceJSON = this.postService(inputJSON.toString(), GetAttendanceStatus, methodName);
		JSONObject innerObject = responceJSON.getJSONObject("data").getJSONObject("ET_DATA");
		JSONArray jsonArray = innerObject.getJSONArray("item");
			
			for (int i = 0, size = jsonArray.length(); i < size; i++)
			{
				JSONObject resultJSON = new JSONObject();
				JSONObject objectInArray = jsonArray.getJSONObject(i);
				String[] elementNames = JSONObject.getNames(objectInArray);

				String LDATE = objectInArray.get("LDATE").toString();
				String SHIFT = objectInArray.get("SHIFT").toString();
				String ATT_1 = objectInArray.get("ATT_1").toString();
				String ATT_2 = objectInArray.get("ATT_2").toString();
				String COL_1 = objectInArray.get("COL_1").toString();
				String COL_2 = objectInArray.get("COL_2").toString();
				String PUNIN = objectInArray.get("PUN_P10").toString();
				String MIDOUT = objectInArray.get("PUN_P15").toString();
				String MIDIN = objectInArray.get("PUN_P25").toString();
				String PUNOUT = objectInArray.get("PUN_P20").toString();
				String LATE_MINS = objectInArray.get("LATE_MINS").toString();
				String MID_LATE = objectInArray.get("MID_LATE").toString();
				String RS_ATT1 = objectInArray.get("RS_ATT1").toString();
				String RS_ATT2 = objectInArray.get("RS_ATT2").toString();
				RS_ATT1 = RS_ATT1.replaceAll("\\s+","");
				RS_ATT2 = RS_ATT2.replaceAll("\\s+","");
				String ABS = objectInArray.get("ABS").toString();
				String ATT = objectInArray.get("ATT").toString();
				String SHF_IN = objectInArray.get("SHF_IN").toString();
				String SHF_OUT = objectInArray.get("SHF_OUT").toString();

				String[] temp_reqState_ATT_1 = RS_ATT1.isEmpty()?null:RS_ATT1.split(",");
				String[] temp_reqState_ATT_2 = RS_ATT2.isEmpty()?null:RS_ATT2.split(",");

				if(SHIFT.equals("OFF") && temp_reqState_ATT_1 == null && temp_reqState_ATT_2 == null){
					resultJSON.put("cssClass", "HollydayClass");
					resultJSON.put("LDATE", LDATE);
					resultJSON.put("PUN_P10", PUNIN);
					resultJSON.put("PUN_P15", MIDOUT);
					resultJSON.put("PUN_P20", PUNOUT);
					resultJSON.put("PUN_P25", MIDIN);
					resultJSON.put("ATT", ATT);
					resultJSON.put("RS_ATT1", temp_reqState_ATT_1);
					resultJSON.put("RS_ATT2", temp_reqState_ATT_2);
					resultJSON.put("SHF_IN", SHF_IN);
					resultJSON.put("SHF_OUT", SHF_OUT);
					resultJSON.put("Holiday", true);
					resultJSON.put("Absence", false);
					resultJSON.put("RequestState", false);
				}
				else if(SHIFT.equals("G") && ATT_1.equals("HO") && ATT_2.equals("HO")){
					resultJSON.put("cssClass", "HollydayClass");
					resultJSON.put("LDATE", LDATE);
					resultJSON.put("PUN_P10", PUNIN);
					resultJSON.put("PUN_P15", MIDOUT);
					resultJSON.put("PUN_P20", PUNOUT);
					resultJSON.put("PUN_P25", MIDIN);
					resultJSON.put("ATT", ATT);
					resultJSON.put("RS_ATT1", temp_reqState_ATT_1);
					resultJSON.put("RS_ATT2", temp_reqState_ATT_2);
					resultJSON.put("SHF_IN", SHF_IN);
					resultJSON.put("SHF_OUT", SHF_OUT);
					resultJSON.put("Holiday", true);
					resultJSON.put("Absence", false);
					resultJSON.put("RequestState", false);
				}
				else if(SHIFT.equals("OFF") && temp_reqState_ATT_1 != null || temp_reqState_ATT_2 != null){
					List ATT_1_Req = new ArrayList(); 
					List ATT_2_Req = new ArrayList();
					String cssClass = "";
					boolean ATT1_CLR = true;
					boolean ATT2_CLR = true;
					boolean ATT1_Aprd = true;
					boolean ATT2_Aprd = true;

					if(temp_reqState_ATT_1 != null){
						for(int ii = 0; ii < temp_reqState_ATT_1.length; ii++){
							if (Arrays.asList( APPROVED_LEAVES ).contains( temp_reqState_ATT_1[ii].toString() ) && ATT1_Aprd != false) {
								ATT1_Aprd = false;
								ATT_1_Req.add(temp_reqState_ATT_1[ii]);
							}
							
						}
					}

					if(temp_reqState_ATT_2 != null){
						for(int ii = 0; ii < temp_reqState_ATT_2.length; ii++){
							if (Arrays.asList( APPROVED_LEAVES ).contains( temp_reqState_ATT_2[ii].toString() ) && ATT2_Aprd != false) {
								ATT2_Aprd = false;
								ATT_2_Req.add(temp_reqState_ATT_2[ii]);
							}
							
						}
					}

					if(temp_reqState_ATT_1 != null){
						for(int ii = 0; ii < temp_reqState_ATT_1.length; ii++){
							if (Arrays.asList( PENDING_LEAVES ).contains( temp_reqState_ATT_1[ii].toString() ) && ATT1_CLR != false) {
								ATT1_CLR = false;
								ATT_1_Req.add(temp_reqState_ATT_1[ii]);
							}
							
						}
					}

					if(temp_reqState_ATT_2 != null){
						for(int ii = 0; ii < temp_reqState_ATT_2.length; ii++){
							if (Arrays.asList( PENDING_LEAVES ).contains( temp_reqState_ATT_2[ii].toString() ) && ATT2_CLR != false) {
								ATT2_CLR = false;
								ATT_2_Req.add(temp_reqState_ATT_2[ii]);
							}
							
						}
					}

					if(!ATT1_CLR && !ATT2_CLR){
						cssClass = "ATT1_Pending_ATT2_Pending";
					}else if(ATT1_CLR && !ATT2_CLR){
						if(ATT_1.equals("WO") || ATT_1.equals("HO")){
							cssClass = "ATT1_Holliday_ATT2_Pending";
						}else if(ATT_1.equals("G")){
							cssClass = "ATT1_NormalPunch_ATT2_Pending";
						}else if(ATT_1.equals("UA") && temp_reqState_ATT_1 == null){
							cssClass = "ATT1_UA_ATT2_Pending";
						}else{
							cssClass = "ATT1_Approved_ATT2_Pending";
						}
					}else if(!ATT1_CLR && ATT2_CLR){
						if(ATT_2.equals("WO") || ATT_1.equals("HO")){
							cssClass = "ATT1_Pending_ATT2_Holliday";
						}else if(ATT_2.equals("G")){
							cssClass = "ATT1_Pending_ATT2_NormalPunch";
						}else if(ATT_2.equals("UA") && temp_reqState_ATT_2 == null){
							cssClass = "ATT1_Pending_ATT2_UA";
						}else{
							cssClass = "ATT1_Pending_ATT2_Approved";
						}
					}else if(ATT1_CLR && ATT2_CLR){
						if(ATT_1.equals("WO") || ATT_1.equals("HO")){
							if(ATT_2.equals("WO") || ATT_2.equals("HO")){
								cssClass = "ATT1_Holliday_ATT2_Holliday";
							}else if(ATT_2.equals("G")){
								cssClass = "ATT1_Holliday_ATT2_NormalPunch";
							}else if(ATT_2.equals("UA") && temp_reqState_ATT_2 == null){
								cssClass = "ATT1_Holliday_ATT2_UA";
							}else if(ATT_2.equals("UA") && temp_reqState_ATT_2 != null){
								cssClass = "ATT1_Holliday_ATT2_Pending";
							}else{
								cssClass = "ATT1_Holliday_ATT2_Approved";
							}	
						}else if(ATT_1.equals("G")){
							if(ATT_2.equals("WO") || ATT_2.equals("HO")){
								cssClass = "ATT1_NomalPunch_ATT2_Holliday";
							}else if(ATT_2.equals("G")){
								cssClass = "ATT1_NomalPunch_ATT2_NormalPunch";
							}else if(ATT_2.equals("UA") && temp_reqState_ATT_2 == null){
								cssClass = "ATT1_NomalPunch_ATT2_UA";
							}else if(ATT_2.equals("UA") && temp_reqState_ATT_2 != null){
								cssClass = "ATT1_NomalPunch_ATT2_Pending";
							}else{
								cssClass = "ATT1_NomalPunch_ATT2_Approved";
							}
						}else if(ATT_1.equals("UA") && temp_reqState_ATT_1 == null){
							if(ATT_2.equals("WO") || ATT_2.equals("HO")){
								cssClass = "ATT1_UA_ATT2_Holliday";
							}else if(ATT_2.equals("G")){
								cssClass = "ATT1_UA_ATT2_NormalPunch";
							}else if(ATT_2.equals("UA") && temp_reqState_ATT_2 == null){
								cssClass = "ATT1_UA_ATT2_UA";
							}else if(ATT_2.equals("UA") && temp_reqState_ATT_2 != null){
								cssClass = "ATT1_UA_ATT2_Pending";
							}else{
								cssClass = "ATT1_UA_ATT2_Approved";
							}
						}else if(ATT_1.equals("UA") && temp_reqState_ATT_1 != null){
							if(ATT_2.equals("WO") || ATT_2.equals("HO")){
								cssClass = "ATT1_Pending_ATT2_Holliday";
							}else if(ATT_2.equals("G")){
								cssClass = "ATT1_Pending_ATT2_NormalPunch";
							}else if(ATT_2.equals("UA") && temp_reqState_ATT_2 == null){
								cssClass = "ATT1_Pending_ATT2_UA";
							}else if(ATT_2.equals("UA") && temp_reqState_ATT_2 != null){
								cssClass = "ATT1_Pending_ATT2_Pending";
							}else{
								cssClass = "ATT1_Pending_ATT2_Approved";
							}
						}else if(!ATT1_Aprd && temp_reqState_ATT_1 != null){
							if(ATT_2.equals("WO") || ATT_2.equals("HO")){
								cssClass = "ATT1_Approved_ATT2_Holliday";
							}else if(ATT_2.equals("G")){
								cssClass = "ATT1_Approved_ATT2_NormalPunch";
							}else if(ATT_2.equals("UA") && temp_reqState_ATT_2 == null){
								cssClass = "ATT1_Approved_ATT2_UA";
							}else if(ATT_2.equals("UA") && temp_reqState_ATT_2 != null){
								cssClass = "ATT1_Approved_ATT2_Pending";
							}else{
								cssClass = "ATT1_Approved_ATT2_Approved";
							}
						}else if(!ATT2_Aprd && temp_reqState_ATT_2 != null){
							if(ATT_1.equals("WO") || ATT_1.equals("HO")){
								cssClass = "ATT1_Holliday_ATT2_Approved";
							}else if(ATT_1.equals("G")){
								cssClass = "ATT1_NormalPunch_ATT2_Approved";
							}else if(ATT_1.equals("UA") && temp_reqState_ATT_1 == null){
								cssClass = "ATT1_UA_ATT2_Approved";
							}else if(ATT_1.equals("UA") && temp_reqState_ATT_1 != null){
								cssClass = "ATT1_Pending_ATT2_Approved";
							}else{
								cssClass = "ATT1_Approved_ATT2_Approved";
							}
						}
					}
					resultJSON.put("cssClass", cssClass);
					resultJSON.put("LDATE", LDATE);
					resultJSON.put("PUN_P10", PUNIN);
					resultJSON.put("PUN_P15", MIDOUT);
					resultJSON.put("PUN_P20", PUNOUT);
					resultJSON.put("PUN_P25", MIDIN);
					resultJSON.put("ATT", ATT);
					resultJSON.put("RS_ATT1", temp_reqState_ATT_1);
					resultJSON.put("RS_ATT2", temp_reqState_ATT_2);
					resultJSON.put("SHF_IN", SHF_IN);
					resultJSON.put("SHF_OUT", SHF_OUT);
					resultJSON.put("Holiday", false);
					resultJSON.put("Absence", false);
					resultJSON.put("RequestState", true);
				}
				
				else if(ATT_1.equals("UA") || ATT_2.equals("UA")){
					List ATT_1_Req = new ArrayList(); 
					List ATT_2_Req = new ArrayList();
					String cssClass = "";
					boolean ATT1_CLR = true;
					boolean ATT2_CLR = true;
					boolean ATT1_Aprd = true;
					boolean ATT2_Aprd = true;

					if(temp_reqState_ATT_1 != null){
						for(int ii = 0; ii < temp_reqState_ATT_1.length; ii++){
							if (Arrays.asList( APPROVED_LEAVES ).contains( temp_reqState_ATT_1[ii].toString() ) && ATT1_Aprd != false) {
								ATT1_Aprd = false;
								ATT_1_Req.add(temp_reqState_ATT_1[ii]);
							}
							
						}
					}

					if(temp_reqState_ATT_2 != null){
						for(int ii = 0; ii < temp_reqState_ATT_2.length; ii++){
							if (Arrays.asList( APPROVED_LEAVES ).contains( temp_reqState_ATT_2[ii].toString() ) && ATT2_Aprd != false) {
								ATT2_Aprd = false;
								ATT_2_Req.add(temp_reqState_ATT_2[ii]);
							}
							
						}
					}

					if(temp_reqState_ATT_1 != null){
						for(int ii = 0; ii < temp_reqState_ATT_1.length; ii++){
							if (Arrays.asList( PENDING_LEAVES ).contains( temp_reqState_ATT_1[ii].toString() ) && ATT1_CLR != false) {
								ATT1_CLR = false;
								ATT_1_Req.add(temp_reqState_ATT_1[ii]);
							}
							
						}
					}

					if(temp_reqState_ATT_2 != null){
						for(int ii = 0; ii < temp_reqState_ATT_2.length; ii++){
							if (Arrays.asList( PENDING_LEAVES ).contains( temp_reqState_ATT_2[ii].toString() ) && ATT2_CLR != false) {
								ATT2_CLR = false;
								ATT_2_Req.add(temp_reqState_ATT_2[ii]);
							}
							
						}
					}
					if(!ATT1_CLR && !ATT2_CLR){
						cssClass = "ATT1_Pending_ATT2_Pending";
					}else if(ATT1_CLR && !ATT2_CLR){
						if(ATT_1.equals("WO") || ATT_1.equals("HO")){
							cssClass = "ATT1_Holliday_ATT2_Pending";
						}else if(ATT_1.equals("G")){
							cssClass = "ATT1_NormalPunch_ATT2_Pending";
						}else if(ATT_1.equals("UA") && temp_reqState_ATT_1 == null){
							cssClass = "ATT1_UA_ATT2_Pending";
						}else{
							cssClass = "ATT1_Approved_ATT2_Pending";
						}
					}else if(!ATT1_CLR && ATT2_CLR){
						if(ATT_2.equals("WO") || ATT_1.equals("HO")){
							cssClass = "ATT1_Pending_ATT2_Holliday";
						}else if(ATT_2.equals("G")){
							cssClass = "ATT1_Pending_ATT2_NormalPunch";
						}else if(ATT_2.equals("UA") && temp_reqState_ATT_2 == null){
							cssClass = "ATT1_Pending_ATT2_UA";
						}else{
							cssClass = "ATT1_Pending_ATT2_Approved";
						}
					}else if(ATT1_CLR && ATT2_CLR){
						if(ATT_1.equals("WO") || ATT_1.equals("HO")){
							if(ATT_2.equals("WO") || ATT_2.equals("HO")){
								cssClass = "ATT1_Holliday_ATT2_Holliday";
							}else if(ATT_2.equals("G")){
								cssClass = "ATT1_Holliday_ATT2_NormalPunch";
							}else if(ATT_2.equals("UA") && temp_reqState_ATT_2 == null){
								cssClass = "ATT1_Holliday_ATT2_UA";
							}else if(ATT_2.equals("UA") && temp_reqState_ATT_2 != null){
								cssClass = "ATT1_Holliday_ATT2_Pending";
							}else{
								cssClass = "ATT1_Holliday_ATT2_Approved";
							}	
						}else if(ATT_1.equals("G")){
							if(ATT_2.equals("WO") || ATT_2.equals("HO")){
								cssClass = "ATT1_NomalPunch_ATT2_Holliday";
							}else if(ATT_2.equals("G")){
								cssClass = "ATT1_NomalPunch_ATT2_NormalPunch";
							}else if(ATT_2.equals("UA") && temp_reqState_ATT_2 == null){
								cssClass = "ATT1_NomalPunch_ATT2_UA";
							}else if(ATT_2.equals("UA") && temp_reqState_ATT_2 != null){
								cssClass = "ATT1_NomalPunch_ATT2_Pending";
							}else{
								cssClass = "ATT1_NomalPunch_ATT2_Approved";
							}
						}else if(ATT_1.equals("UA") && temp_reqState_ATT_1 == null){
							if(ATT_2.equals("WO") || ATT_2.equals("HO")){
								cssClass = "ATT1_UA_ATT2_Holliday";
							}else if(ATT_2.equals("G")){
								cssClass = "ATT1_UA_ATT2_NormalPunch";
							}else if(ATT_2.equals("UA") && temp_reqState_ATT_2 == null){
								cssClass = "ATT1_UA_ATT2_UA";
							}else if(ATT_2.equals("UA") && temp_reqState_ATT_2 != null){
								cssClass = "ATT1_UA_ATT2_Pending";
							}else{
								cssClass = "ATT1_UA_ATT2_Approved";
							}
						}else if(ATT_1.equals("UA") && temp_reqState_ATT_1 != null){
							if(ATT_2.equals("WO") || ATT_2.equals("HO")){
								cssClass = "ATT1_Pending_ATT2_Holliday";
							}else if(ATT_2.equals("G")){
								cssClass = "ATT1_Pending_ATT2_NormalPunch";
							}else if(ATT_2.equals("UA") && temp_reqState_ATT_2 == null){
								cssClass = "ATT1_Pending_ATT2_UA";
							}else if(ATT_2.equals("UA") && temp_reqState_ATT_2 != null){
								cssClass = "ATT1_Pending_ATT2_Pending";
							}else{
								cssClass = "ATT1_Pending_ATT2_Approved";
							}
						}else if(!ATT1_Aprd && temp_reqState_ATT_1 != null){
							if(ATT_2.equals("WO") || ATT_2.equals("HO")){
								cssClass = "ATT1_Approved_ATT2_Holliday";
							}else if(ATT_2.equals("G")){
								cssClass = "ATT1_Approved_ATT2_NormalPunch";
							}else if(ATT_2.equals("UA") && temp_reqState_ATT_2 == null){
								cssClass = "ATT1_Approved_ATT2_UA";
							}else if(ATT_2.equals("UA") && temp_reqState_ATT_2 != null){
								cssClass = "ATT1_Approved_ATT2_Pending";
							}else{
								cssClass = "ATT1_Approved_ATT2_Approved";
							}
						}else if(!ATT2_Aprd && temp_reqState_ATT_2 != null){
							if(ATT_1.equals("WO") || ATT_1.equals("HO")){
								cssClass = "ATT1_Holliday_ATT2_Approved";
							}else if(ATT_1.equals("G")){
								cssClass = "ATT1_NormalPunch_ATT2_Approved";
							}else if(ATT_1.equals("UA") && temp_reqState_ATT_1 == null){
								cssClass = "ATT1_UA_ATT2_Approved";
							}else if(ATT_1.equals("UA") && temp_reqState_ATT_1 != null){
								cssClass = "ATT1_Pending_ATT2_Approved";
							}else{
								cssClass = "ATT1_Approved_ATT2_Approved";
							}
						}
					}
					resultJSON.put("cssClass", cssClass);
					resultJSON.put("LDATE", LDATE);
					resultJSON.put("PUN_P10", PUNIN);
					resultJSON.put("PUN_P15", MIDOUT);
					resultJSON.put("PUN_P20", PUNOUT);
					resultJSON.put("PUN_P25", MIDIN);
					resultJSON.put("ATT", ATT);
					resultJSON.put("RS_ATT1", temp_reqState_ATT_1);
					resultJSON.put("RS_ATT2", temp_reqState_ATT_2);
					resultJSON.put("SHF_IN", SHF_IN);
					resultJSON.put("SHF_OUT", SHF_OUT);
					resultJSON.put("Holiday", false);
					resultJSON.put("Absence", false);
					resultJSON.put("RequestState", true);
				}
				
				else if(ATT_1.equals("G") || ATT_2.equals("G")){
					List ATT_1_Req = new ArrayList(); 
					List ATT_2_Req = new ArrayList();
					String cssClass = "";
					boolean ATT1_CLR = true;
					boolean ATT2_CLR = true;
					boolean ATT1_Aprd = true;
					boolean ATT2_Aprd = true;

					if(temp_reqState_ATT_1 != null){
						for(int ii = 0; ii < temp_reqState_ATT_1.length; ii++){
							if (Arrays.asList( APPROVED_LEAVES ).contains( temp_reqState_ATT_1[ii].toString() ) && ATT1_Aprd != false) {
								ATT1_Aprd = false;
								ATT_1_Req.add(temp_reqState_ATT_1[ii]);
							}
							
						}
					}

					if(temp_reqState_ATT_2 != null){
						for(int ii = 0; ii < temp_reqState_ATT_2.length; ii++){
							if (Arrays.asList( APPROVED_LEAVES ).contains( temp_reqState_ATT_2[ii].toString() ) && ATT2_Aprd != false) {
								ATT2_Aprd = false;
								ATT_2_Req.add(temp_reqState_ATT_2[ii]);
							}
							
						}
					}

					if(temp_reqState_ATT_1 != null){
						for(int ii = 0; ii < temp_reqState_ATT_1.length; ii++){
							if (Arrays.asList( PENDING_LEAVES ).contains( temp_reqState_ATT_1[ii].toString() ) && ATT1_CLR != false) {
								ATT1_CLR = false;
								ATT_1_Req.add(temp_reqState_ATT_1[ii]);
							}
							
						}
					}

					if(temp_reqState_ATT_2 != null){
						for(int ii = 0; ii < temp_reqState_ATT_2.length; ii++){
							if (Arrays.asList( PENDING_LEAVES ).contains( temp_reqState_ATT_2[ii].toString() ) && ATT2_CLR != false) {
								ATT2_CLR = false;
								ATT_2_Req.add(temp_reqState_ATT_2[ii]);
							}
							
						}
					}

					if(!ATT1_CLR && !ATT2_CLR){
						cssClass = "ATT1_Pending_ATT2_Pending";
					}else if(ATT1_CLR && !ATT2_CLR){
						if(ATT_1.equals("WO") || ATT_1.equals("HO")){
							cssClass = "ATT1_Holliday_ATT2_Pending";
						}else if(ATT_1.equals("G")){
							cssClass = "ATT1_NormalPunch_ATT2_Pending";
						}else if(ATT_1.equals("UA") && temp_reqState_ATT_1 == null){
							cssClass = "ATT1_UA_ATT2_Pending";
						}else{
							cssClass = "ATT1_Approved_ATT2_Pending";
						}
					}else if(!ATT1_CLR && ATT2_CLR){
						if(ATT_2.equals("WO") || ATT_1.equals("HO")){
							cssClass = "ATT1_Pending_ATT2_Holliday";
						}else if(ATT_2.equals("G")){
							cssClass = "ATT1_Pending_ATT2_NormalPunch";
						}else if(ATT_2.equals("UA") && temp_reqState_ATT_2 == null){
							cssClass = "ATT1_Pending_ATT2_UA";
						}else{
							cssClass = "ATT1_Pending_ATT2_Approved";
						}
					}else if(ATT1_CLR && ATT2_CLR){
						if(ATT_1.equals("WO") || ATT_1.equals("HO")){
							if(ATT_2.equals("WO") || ATT_2.equals("HO")){
								cssClass = "ATT1_Holliday_ATT2_Holliday";
							}else if(ATT_2.equals("G")){
								cssClass = "ATT1_Holliday_ATT2_NormalPunch";
							}else if(ATT_2.equals("UA") && temp_reqState_ATT_2 == null){
								cssClass = "ATT1_Holliday_ATT2_UA";
							}else if(ATT_2.equals("UA") && temp_reqState_ATT_2 != null){
								cssClass = "ATT1_Holliday_ATT2_Pending";
							}else{
								cssClass = "ATT1_Holliday_ATT2_Approved";
							}	
						}else if(ATT_1.equals("G")){
							if(ATT_2.equals("WO") || ATT_2.equals("HO")){
								cssClass = "ATT1_NomalPunch_ATT2_Holliday";
							}else if(ATT_2.equals("G")){
								cssClass = "ATT1_NomalPunch_ATT2_NormalPunch";
							}else if(ATT_2.equals("UA") && temp_reqState_ATT_2 == null){
								cssClass = "ATT1_NomalPunch_ATT2_UA";
							}else if(ATT_2.equals("UA") && temp_reqState_ATT_2 != null){
								cssClass = "ATT1_NomalPunch_ATT2_Pending";
							}else{
								cssClass = "ATT1_NomalPunch_ATT2_Approved";
							}
						}else if(ATT_1.equals("UA") && temp_reqState_ATT_1 == null){
							if(ATT_2.equals("WO") || ATT_2.equals("HO")){
								cssClass = "ATT1_UA_ATT2_Holliday";
							}else if(ATT_2.equals("G")){
								cssClass = "ATT1_UA_ATT2_NormalPunch";
							}else if(ATT_2.equals("UA") && temp_reqState_ATT_2 == null){
								cssClass = "ATT1_UA_ATT2_UA";
							}else if(ATT_2.equals("UA") && temp_reqState_ATT_2 != null){
								cssClass = "ATT1_UA_ATT2_Pending";
							}else{
								cssClass = "ATT1_UA_ATT2_Approved";
							}
						}else if(ATT_1.equals("UA") && temp_reqState_ATT_1 != null){
							if(ATT_2.equals("WO") || ATT_2.equals("HO")){
								cssClass = "ATT1_Pending_ATT2_Holliday";
							}else if(ATT_2.equals("G")){
								cssClass = "ATT1_Pending_ATT2_NormalPunch";
							}else if(ATT_2.equals("UA") && temp_reqState_ATT_2 == null){
								cssClass = "ATT1_Pending_ATT2_UA";
							}else if(ATT_2.equals("UA") && temp_reqState_ATT_2 != null){
								cssClass = "ATT1_Pending_ATT2_Pending";
							}else{
								cssClass = "ATT1_Pending_ATT2_Approved";
							}
						}else if(!ATT1_Aprd && temp_reqState_ATT_1 != null){
							if(ATT_2.equals("WO") || ATT_2.equals("HO")){
								cssClass = "ATT1_Approved_ATT2_Holliday";
							}else if(ATT_2.equals("G")){
								cssClass = "ATT1_Approved_ATT2_NormalPunch";
							}else if(ATT_2.equals("UA") && temp_reqState_ATT_2 == null){
								cssClass = "ATT1_Approved_ATT2_UA";
							}else if(ATT_2.equals("UA") && temp_reqState_ATT_2 != null){
								cssClass = "ATT1_Approved_ATT2_Pending";
							}else{
								cssClass = "ATT1_Approved_ATT2_Approved";
							}
						}else if(!ATT2_Aprd && temp_reqState_ATT_2 != null){
							if(ATT_1.equals("WO") || ATT_1.equals("HO")){
								cssClass = "ATT1_Holliday_ATT2_Approved";
							}else if(ATT_1.equals("G")){
								cssClass = "ATT1_NormalPunch_ATT2_Approved";
							}else if(ATT_1.equals("UA") && temp_reqState_ATT_1 == null){
								cssClass = "ATT1_UA_ATT2_Approved";
							}else if(ATT_1.equals("UA") && temp_reqState_ATT_1 != null){
								cssClass = "ATT1_Pending_ATT2_Approved";
							}else{
								cssClass = "ATT1_Approved_ATT2_Approved";
							}
						}
					}
					resultJSON.put("cssClass", cssClass);
					resultJSON.put("LDATE", LDATE);
					resultJSON.put("PUN_P10", PUNIN);
					resultJSON.put("PUN_P15", MIDOUT);
					resultJSON.put("PUN_P20", PUNOUT);
					resultJSON.put("PUN_P25", MIDIN);
					resultJSON.put("ATT", ATT);
					resultJSON.put("RS_ATT1", temp_reqState_ATT_1);
					resultJSON.put("RS_ATT2", temp_reqState_ATT_2);
					resultJSON.put("SHF_IN", SHF_IN);
					resultJSON.put("SHF_OUT", SHF_OUT);
					resultJSON.put("Holiday", false);
					resultJSON.put("Absence", false);
					resultJSON.put("RequestState", true);
				}else{
					resultJSON.put("cssClass", "");
					resultJSON.put("LDATE", LDATE);
					resultJSON.put("PUN_P10", PUNIN);
					resultJSON.put("PUN_P15", MIDOUT);
					resultJSON.put("PUN_P20", PUNOUT);
					resultJSON.put("PUN_P25", MIDIN);
					resultJSON.put("ATT", ATT);
					resultJSON.put("RS_ATT1", temp_reqState_ATT_1);
					resultJSON.put("RS_ATT2", temp_reqState_ATT_2);
					resultJSON.put("SHF_IN", SHF_IN);
					resultJSON.put("SHF_OUT", SHF_OUT);
					resultJSON.put("Holiday", false);
					resultJSON.put("Absence", false);
					resultJSON.put("RequestState", false);
				}

				resultJSONarrlist.add(resultJSON);
			}
			commonServerResponce.put("data", resultJSONarrlist);

		return commonServerResponce.toString();
	}

	/* *
	 * @Funtion - (getCustomUserMessage) this funtion will return Custom User Message which is congigure with MFP Console
	 * @QueryParam - No input Pram
	 * @return - CUSTOMUSER MSG (type - String format)
	 * */
	@GET
	@Path("/getCustomUserMessage")
	@OAuthSecurity(scope = "socialLogin")
	public String getCustomUserMessage(){
		JSONObject customMessage = new JSONObject();
		customMessage.put("customMessage", configurationAPI.getPropertyValue(GET_CUSTOMUSER_MSG));
		return customMessage.toString();
	}

	/* *
	 * @Funtion - (getActiveUserProperties) this funtion is the common and i will give the current user informations
	 * @Input 
	 * @return - UserInformation OBJECT (type - JSONObject)
	 * */
	public JSONObject getActiveUserProperties(){

		AuthenticatedUser currentUser = securityContext.getAuthenticatedUser();
		JSONObject userInformation = new JSONObject(currentUser.getDisplayName());
		LOGGER.log(Level.INFO, "[ USER INFO ]  : "+userInformation.toString());
		return userInformation;
	}


	/* *
	 * @Funtion - (applyOnDutyRequest) this function is using for Apply OD Request
	 * @QueryParam - IP_SDATE [Start Date], IP_EDATE [End Date], LV_STIME [Start Time], LV_ETIME [End Time], LV_PLACE [Visited Place], LV_ORG [Visited Organization], LV_PER, LV_COMMENTS [User Comment]
	 * @return - SAP Responce (type - JSON String format)
	 * */
	@POST
	@Path("/applyOnDutyRequest")
	@Produces(MediaType.APPLICATION_JSON)
	@OAuthSecurity(scope = "socialLogin")
	public String applyOnDutyRequest(	@QueryParam("IP_SDATE") String IP_SDATE,@QueryParam("IP_EDATE") String IP_EDATE,
										@QueryParam("LV_STIME") String LV_STIME,@QueryParam("LV_ETIME") String LV_ETIME,
										@QueryParam("LV_PLACE") String LV_PLACE,@QueryParam("LV_ORG") String LV_ORG,
										@QueryParam("LV_PER") String LV_PER, @QueryParam("LV_COMMENTS") String LV_COMMENTS	) {
		
		JSONObject inputJSON = new JSONObject();
		String methodName = new Object() {}.getClass().getEnclosingMethod().getName();
		JSONObject userInformation = (JSONObject) this.getActiveUserProperties();
		inputJSON.put("IV_PERNR", userInformation.getString("EP_PERNR"));
		inputJSON.put("IP_SDATE", IP_SDATE);	
		inputJSON.put("IP_EDATE", IP_EDATE);
		inputJSON.put("LV_STIME", LV_STIME);
		inputJSON.put("LV_ETIME", LV_ETIME);
		inputJSON.put("LV_PLACE", LV_PLACE);	
		inputJSON.put("LV_ORG", LV_ORG);
		inputJSON.put("LV_PER", LV_PER);
		inputJSON.put("LV_COMMENTS", LV_COMMENTS);				
		JSONObject serverResJSON = new JSONObject();
		serverResJSON = this.postService(inputJSON.toString(), ApplyOnDuty, methodName);

		return serverResJSON.toString();
	}


	/* *
	 * @Funtion - (applyFTPRequest) this function is using for Apply FTP Request
	 * @QueryParam - DATUM [FTP Apply Date], SFT_IN [Shift In Time punch], SFT_OUT [Shift Out Time punch], LUN_IN [Shift Mid in Time punch], LUN_OUT [Shift Mid Out Time punch], LUN_IN_FLAG, LUN_OUT_FLAG, SFT_IN_FLAG, SFT_OUT_FLAG [Flag will be 'X' if user change time for FTP], R_TYPE [FTP Request Type]
	 * @return - SAP Responce (type - JSON String format)
	 * */
	@POST
	@Path("/applyFTPRequest")
	@Produces(MediaType.APPLICATION_JSON)
	@OAuthSecurity(scope = "socialLogin")
	public String applyFTPRequest(	@QueryParam("DATUM") String DATUM,@QueryParam("SFT_IN") String SFT_IN,
									@QueryParam("SFT_OUT") String SFT_OUT,@QueryParam("LUN_IN") String LUN_IN,
									@QueryParam("LUN_OUT") String LUN_OUT,@QueryParam("LUN_IN_FLAG") String LUN_IN_FLAG,
									@QueryParam("LUN_OUT_FLAG") String LUN_OUT_FLAG, @QueryParam("SFT_IN_FLAG") String SFT_IN_FLAG,
									@QueryParam("SFT_OUT_FLAG") String SFT_OUT_FLAG, @QueryParam("R_TYPE") String R_TYPE	) {
		
		JSONObject inputJSON = new JSONObject();
		JSONObject IS_FTP = new JSONObject();
		String methodName = new Object() {}.getClass().getEnclosingMethod().getName();
		JSONObject userInformation = (JSONObject) this.getActiveUserProperties();
		inputJSON.put("PERNR", userInformation.getString("EP_PERNR"));
		inputJSON.put("DATUM", DATUM);	
		inputJSON.put("SFT_IN", SFT_IN);
		inputJSON.put("SFT_OUT", SFT_OUT);
		inputJSON.put("LUN_IN", LUN_IN);
		inputJSON.put("LUN_OUT", LUN_OUT);	
		inputJSON.put("LUN_IN_FLAG", LUN_IN_FLAG);
		inputJSON.put("LUN_OUT_FLAG", LUN_OUT_FLAG);
		inputJSON.put("SFT_IN_FLAG", SFT_IN_FLAG);
		inputJSON.put("SFT_OUT_FLAG", SFT_OUT_FLAG);
		inputJSON.put("R_TYPE", R_TYPE);	
		IS_FTP.put("IS_FTP", inputJSON);		
		JSONObject serverResJSON = new JSONObject();
		serverResJSON = this.postService(IS_FTP.toString(), ApplyFTP, methodName);

		return serverResJSON.toString();
	}

	/* *
	 * @Funtion - (getLeaveEncashBalance) this funtion will return Coupon List which will come from SAP
	 * @QueryParam - IV_PERNR which contains user Pernr Number
	 * @return - Leave Encashment Balance List (type - JSON String format)
	 * */
	@GET
	@Path("/getLeaveEncashBalance")
	@Produces(MediaType.APPLICATION_JSON)
	@OAuthSecurity(scope = "socialLogin")
	public String getLeaveEncashBalance() {
		// commonServerResponce = new JSONObject(commonResponceStr);
		JSONObject userInformation = (JSONObject) this.getActiveUserProperties();
		String methodName = new Object() {}.getClass().getEnclosingMethod().getName();
		JSONObject inputJSON = new JSONObject();
		JSONObject serverResJSON = new JSONObject();
		inputJSON.put("IP_PERNR", userInformation.getString("EP_PERNR"));
		serverResJSON = this.postService(inputJSON.toString(), GetLeaveEncashment, methodName);
		
		return serverResJSON.toString();
	}

	/* *
	 * @Funtion - (applyEncashmentRequest) this function is using for Apply FTP Request
	 * @QueryParam - 
	 * @return - SAP Responce (type - JSON String format)
	 * */
	@POST
	@Path("/applyEncashmentRequest")
	@Produces(MediaType.APPLICATION_JSON)
	@OAuthSecurity(scope = "socialLogin")
	public String applyEncashmentRequest(@QueryParam("IP_NO_DAYS") String IP_NO_DAYS) {
		
		JSONObject inputJSON = new JSONObject();
		String methodName = new Object() {}.getClass().getEnclosingMethod().getName();
		JSONObject userInformation = (JSONObject) this.getActiveUserProperties();

		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMdd");
		SimpleDateFormat timeFormat = new SimpleDateFormat("HH:mm:ss");   
		Date date = new Date(); 
		
		inputJSON.put("IP_PERNR", userInformation.getString("EP_PERNR"));
		inputJSON.put("IP_DATE", dateFormat.format(date));	
		inputJSON.put("IP_TIME", timeFormat.format(date));
		inputJSON.put("IP_NO_DAYS", IP_NO_DAYS);		
		JSONObject serverResJSON = new JSONObject();
		serverResJSON = this.postService(inputJSON.toString(), ApplyLeaveEncash, methodName);

		return serverResJSON.toString();
	}

	/* *
	 * @Funtion - (getMyRequestDetails) this funtion will return My Request List which will come from SAP
	 * @QueryParam - IV_PERNR which contains user Pernr Number
	 * @return - Leave Encashment Balance List (type - JSON String format)
	 * */
	@GET
	@Path("/getMyRequestDetails")
	@Produces(MediaType.APPLICATION_JSON)
	@OAuthSecurity(scope = "socialLogin")
	public String getMyRequestDetails() {
		// commonServerResponce = new JSONObject(commonResponceStr);
		JSONObject userInformation = (JSONObject) this.getActiveUserProperties();
		String methodName = new Object() {}.getClass().getEnclosingMethod().getName();
		JSONObject inputJSON = new JSONObject();
		JSONObject serverResJSON = new JSONObject();
		inputJSON.put("IP_PERNR", userInformation.getString("EP_PERNR"));
		serverResJSON = this.postService(inputJSON.toString(), GetMyRequests, methodName);
		
		return serverResJSON.toString();
	}

	/* *
	 * @Funtion - (applyCancelandDeleteRequest) this function is using for Apply Cancel and Delete Request which is in MyRequestList
	 * @QueryParam - 
	 * @return - SAP Responce (type - JSON String format)
	 * */
	@POST
	@Path("/applyCancelandDeleteRequest")
	@Produces(MediaType.APPLICATION_JSON)
	@OAuthSecurity(scope = "socialLogin")
	public String applyCancelandDeleteRequest(@QueryParam("IP_RNO") String IP_RNO, @QueryParam("IP_LTYPE") String IP_LTYPE,
										 @QueryParam("IP_FLAG") String IP_FLAG, @QueryParam("IP_CMNT") String IP_CMNT) {
		
		JSONObject inputJSON = new JSONObject();
		JSONObject userInformation = (JSONObject) this.getActiveUserProperties();
		String methodName = new Object() {}.getClass().getEnclosingMethod().getName();
		inputJSON.put("IP_PERNR", userInformation.getString("EP_PERNR"));
		inputJSON.put("IP_RNO", IP_RNO);	
		inputJSON.put("IP_LTYPE", IP_LTYPE);
		inputJSON.put("IP_FLAG", IP_FLAG);		
		inputJSON.put("IP_CMNT", IP_CMNT);		
		JSONObject serverResJSON = new JSONObject();
		serverResJSON = this.postService(inputJSON.toString(), ApplyCancelLeave, methodName);

		return serverResJSON.toString();
	}

	/* *
	 * @Funtion - (getMyTaskDetails) this funtion will return My Task List which will come from SAP
	 * @QueryParam - IV_PERNR which contains user Pernr Number
	 * @return - Leave Encashment Balance List (type - JSON String format)
	 * */
	@GET
	@Path("/getMyTaskDetails")
	@Produces(MediaType.APPLICATION_JSON)
	@OAuthSecurity(scope = "socialLogin")
	public String getMyTaskDetails() {
		// commonServerResponce = new JSONObject(commonResponceStr);
		JSONObject userInformation = (JSONObject) this.getActiveUserProperties();
		String methodName = new Object() {}.getClass().getEnclosingMethod().getName();
		JSONObject inputJSON = new JSONObject();
		JSONObject serverResJSON = new JSONObject();
		inputJSON.put("IP_PERNR", userInformation.getString("EP_PERNR"));
		serverResJSON = this.postService(inputJSON.toString(), GetMyTask, methodName);
		
		return serverResJSON.toString();
	}

	/* *
	 * @Funtion - (applyRejectTaskRequest) this function is using for Apply and Reject Request which is in MyTaskList
	 * @QueryParam - 
	 * @return - SAP Responce (type - JSON String format)
	 * */
	@POST
	@Path("/applyRejectTaskRequest")
	@Produces(MediaType.APPLICATION_JSON)
	@OAuthSecurity(scope = "socialLogin")
	public String applyRejectTaskRequest(@QueryParam("approvedRejectList") String approvedRejectList) {
			
		JSONObject serverResJSON = new JSONObject();
		String methodName = new Object() {}.getClass().getEnclosingMethod().getName();
		serverResJSON = this.postService(approvedRejectList.toString(), MyTaskApprove, methodName);

		return serverResJSON.toString();
	}

	/* *
	 * @Funtion - (GetMyProfileDetails) this funtion will return Employee Information which will come from SAP
	 * @QueryParam - IP_PERNR which contains user Pernr Number
	 * @return - LEmployee Information Details (type - JSON String format)
	 * */
	@GET
	@Path("/GetMyProfileDetails")
	@Produces(MediaType.APPLICATION_JSON)
	@OAuthSecurity(scope = "socialLogin")
	public String GetMyProfileDetails() {
		// commonServerResponce = new JSONObject(commonResponceStr);
		JSONObject userInformation = (JSONObject) this.getActiveUserProperties();
		String methodName = new Object() {}.getClass().getEnclosingMethod().getName();
		JSONObject inputJSON = new JSONObject();
		JSONObject serverResJSON = new JSONObject();
		inputJSON.put("IP_PERNR", userInformation.getString("EP_PERNR"));
		serverResJSON = this.postService(inputJSON.toString(), GetMyProfile, methodName);
		
		return serverResJSON.toString();
	}

	/* *
	 * @Funtion - (postService) this funtion is the common interface connection with SAP backend
	 * @QueryParam - InputString [This is String format which is having SAP Inputs], restURL [This is also String which is having the REST URL to connect SAP Backend]
	 * @return - commonServerResponce OBJECT (type - JSONObject format SAP RESPONCE)
	 * */
	public JSONObject postService(String inputString, String contextPathName, String methodName){
		JSONObject resultJSON = new JSONObject();
		commonServerResponce = new JSONObject(commonResponceStr);
		LOGGER.log(Level.INFO, "\n SAP Request Sending from Procedure Name : " + methodName + "\n");
		LOGGER.log(Level.INFO, "\n SAP Request Sending from URL : " + configurationAPI.getPropertyValue(UATServer)+contextPathName + "\n");
		LOGGER.log(Level.INFO, "\n SAP Request Sending from Procedure Inputs : " + inputString + "\n");
		
		try {
			StringEntity params = new StringEntity(inputString);
			CredentialsProvider credsProvider = new BasicCredentialsProvider();
			credsProvider.setCredentials(new AuthScope(AUTH_SCOPE_URL, AUTH_SCOPE_PORT),new UsernamePasswordCredentials("HCM_SERV_USR", "HCM_SERV_USR@123"));
			httpclient = HttpClients.custom().setDefaultCredentialsProvider(credsProvider).build();
			HttpPost httpPost = new HttpPost(configurationAPI.getPropertyValue(UATServer)+contextPathName);
			// httpPost.addHeader("User-Agent", "Mozilla/5.0");
			httpPost.setEntity(params);
			RequestConfig requestConfig = RequestConfig.custom()
				.setSocketTimeout(TIMEOUT_MILLIS)
				.setConnectTimeout(TIMEOUT_MILLIS)
				.setConnectionRequestTimeout(TIMEOUT_MILLIS)
				.build();
			httpPost.setConfig(requestConfig);
			 
			ResponseHandler<String> responseHandler = new ResponseHandler<String>() {
	
			 @Override
				public String handleResponse(
						final HttpResponse response) throws ClientProtocolException, IOException {
					int status = response.getStatusLine().getStatusCode();
					if (status >= 200 && status < 300) {
						HttpEntity entity = response.getEntity();
						return entity != null ? EntityUtils.toString(entity) : null;
					} else {
						LOGGER.log(Level.SEVERE, "\n Unexpected response status: " + status + "\n");
						commonServerResponce.put("message", "Internal Server Error, Please try again");
						// commonServerResponce.put("status_code", status);
						// commonServerResponce.put("data", "");
						throw new ClientProtocolException("Unexpected response status: " + status);
					}
				}
	 
			};
			String responseBody = httpclient.execute(httpPost, responseHandler);
			resultJSON = new JSONObject(responseBody);
			// commonServerResponce.put("message", "");
			commonServerResponce.put("status_code", STATUS_CODE);
			commonServerResponce.put("data", resultJSON);
			LOGGER.log(Level.INFO, "\n SAP Responce outPuts : " + resultJSON.toString() + "\n");

			}catch(IOException ioException){
				LOGGER.log(Level.SEVERE, "[ IOException ]  : "+ioException.toString());
				commonServerResponce.put("message", ioException.toString());
				// commonServerResponce.put("status_code", "400");
				// commonServerResponce.put("data", "");
			}finally {
				try {
					httpclient.close();
				} catch (IOException ioException) {
					LOGGER.log(Level.SEVERE, "[ IOException httpclient Close]  : "+ioException.toString());
				}
			}


		return commonServerResponce;
	}



}
