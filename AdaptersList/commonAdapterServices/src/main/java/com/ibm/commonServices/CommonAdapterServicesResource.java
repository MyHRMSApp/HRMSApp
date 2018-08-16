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

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.Base64;
import java.util.ArrayList;
import java.util.*;
import java.util.List;
import java.util.Properties;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

import java.net.*;
import java.io.*;

import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.ws.rs.ext.MessageBodyWriter;

import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.WebResource;
import com.sun.jersey.api.client.ClientHandlerException;

import com.ibm.mfp.adapter.api.ConfigurationAPI;
import com.ibm.mfp.adapter.api.AdaptersAPI;
import com.ibm.mfp.adapter.api.OAuthSecurity;

// import com.ibm.json.java.JSONArray;
// import com.ibm.json.java.JSONObject;

import org.json.JSONArray;
import org.json.JSONObject;

// import com.google.gson.Gson;
// import com.google.gson.GsonBuilder;

import com.ibm.mfp.server.registration.external.model.ClientData;
import com.ibm.mfp.server.security.external.resource.AdapterSecurityContext;
import com.ibm.mfp.server.registration.external.model.AuthenticatedUser;

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
	private static final String SAP_COMMON_URL = "https://pirdev.titan.co.in:50401/RESTAdapter/";
	private static final String AUTH_STRING = SAP_USERNAME + ":" + SAP_PASSWORD;
	private static final String[] PENDING_LEAVES = {"ODP", "FTP", "CLP", "SLP", "GLP", "QLP", "PLP"};
	private static final String[] APPROVED_LEAVES = {"ODA", "FTA", "CLA", "SLA", "GLA", "QLA", "PLA"};
	
	// public Variable declration PART
	public String authorizationStringEncrypted = null;
	public String commonResponceStr = "{\"message\": \"\",\"status_code\": 200,\"data\": \"\"}";
	public int STATUS_CODE = 0;

	// Static JSONObject declration PART
	public JSONObject commonServerResponce = new JSONObject();
	
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
		commonServerResponce = new JSONObject(commonResponceStr);
		JSONObject userInformation = (JSONObject) this.getActiveUserProperties();
		JSONObject inputJSON = new JSONObject();
		JSONObject serverResJSON = new JSONObject();
		inputJSON.put("IV_PERNR", userInformation.getString("EP_PERNR"));
		serverResJSON = this.postService(inputJSON.toString(), SAP_COMMON_URL+"GetCouponDetail");
		
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
		JSONObject userInformation = (JSONObject) this.getActiveUserProperties();
		inputJSON.put("IP_EMPTYP", userInformation.getString("EP_USERTYPE"));
		inputJSON.put("IP_PERNR", userInformation.getString("EP_PERNR"));						
		JSONObject serverResJSON = new JSONObject();
		serverResJSON = this.postService(inputJSON.toString(), SAP_COMMON_URL+"GetLeaveBalance");
		
		return serverResJSON.toString();
	}

	/* *
	 * @Funtion - (validateLeaveBalance) this function is using for validation befor user Apply Leave
	 * @QueryParam - IP_EMPTYP which contains user Employee Type [ESS, MSS], IV_PERNR which contains user Pernr Number
	 * @return - Leave Balance (type - JSON String format)
	 * */
	@POST
	@Path("/validateLeaveBalance")
	@Produces(MediaType.APPLICATION_JSON)
	@OAuthSecurity(scope = "socialLogin")
	public String validateLeaveBalance(	@QueryParam("IP_LTYP") String IP_LTYP,@QueryParam("IP_FDATE") String IP_FDATE,
										@QueryParam("IP_TDATE") String IP_TDATE,@QueryParam("IP_FHALF") String IP_FHALF,
										@QueryParam("IP_THALF") String IP_THALF	) {
		
		JSONObject inputJSON = new JSONObject();
		JSONObject userInformation = (JSONObject) this.getActiveUserProperties();
		inputJSON.put("IP_PERNR", userInformation.getString("EP_PERNR"));
		inputJSON.put("IP_LTYP", IP_LTYP);	
		inputJSON.put("IP_FDATE", IP_FDATE);
		inputJSON.put("IP_TDATE", IP_TDATE);
		inputJSON.put("IP_FHALF", IP_FHALF);
		inputJSON.put("IP_THALF", IP_THALF);					
		JSONObject serverResJSON = new JSONObject();
		serverResJSON = this.postService(inputJSON.toString(), SAP_COMMON_URL+"BalanceValidation");

		return serverResJSON.toString();
	}

	/* *
	 * @Funtion - (validateLeaveBalance) this function is using for validation befor user Apply Leave
	 * @QueryParam - IP_EMPTYP which contains user Employee Type [ESS, MSS], IV_PERNR which contains user Pernr Number
	 * @return - Leave Balance (type - JSON String format)
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
		serverResJSON = this.postService(inputJSON.toString(), SAP_COMMON_URL+"ApplyLeave");

		return serverResJSON.toString();
	}

	/* *
	 * @Funtion - (getEmployeeAttendanceData) this funtion will return Employee Attanance for five months default which will come from SAP
	 * @QueryParam - IP_PERNR which contains user Pernr Number
	 * @return - Attanance Object (type - JSON String format)
	 * */
	@GET
	@Path("/getEmployeeAttendanceData")
	@Produces(MediaType.APPLICATION_JSON)
	@OAuthSecurity(scope = "socialLogin")
	public String getEmployeeAttendanceData() throws IOException {
		JSONObject inputJSON = new JSONObject();
		JSONObject userInformation = (JSONObject) this.getActiveUserProperties();
		JSONObject  responceJSON = new JSONObject();
		List resultJSONarrlist = new ArrayList(); 
		DateFormat sdf = new SimpleDateFormat("yyyyMMdd");

		Calendar BEGDA = Calendar.getInstance();
		BEGDA.add(Calendar.MONTH, -2);
		BEGDA.set(Calendar.DAY_OF_MONTH, 1);
		inputJSON.put("IP_BEGDA", sdf.format(BEGDA.getTime()));

		Calendar ENDDA = Calendar.getInstance();
		ENDDA.add(Calendar.MONTH, 2);
		ENDDA.set(Calendar.DATE, 1);
		int lastDate = ENDDA.getActualMaximum(Calendar.DATE);
		ENDDA.set(Calendar.DATE, lastDate);
		inputJSON.put("IP_ENDDA", sdf.format(ENDDA.getTime()));
		inputJSON.put("IP_PERNR", userInformation.getString("EP_PERNR"));

		responceJSON = this.postService(inputJSON.toString(), SAP_COMMON_URL+"GetAttendanceStatus");
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
	@Produces(MediaType.APPLICATION_JSON)
	@OAuthSecurity(scope = "socialLogin")
	public String getCustomUserMessage() throws IOException {
		
		return configurationAPI.getPropertyValue(GET_CUSTOMUSER_MSG);
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
	 * @Funtion - (postService) this funtion is the common interface connection with SAP backend
	 * @QueryParam - InputString [This is String format which is having SAP Inputs], restURL [This is also String which is having the REST URL to connect SAP Backend]
	 * @return - resultJSON OBJECT (type - JSONObject format SAP RESPONCE)
	 * */
	public JSONObject postService(String inputString, String restURL){ 
		JSONObject resultJSON = new JSONObject();
		commonServerResponce = new JSONObject(commonResponceStr);
		try {
				LOGGER.info("\n SAP Request Sending from MFP Adapter :");
				LOGGER.info("\n "+inputString+" \n\n");
				authorizationStringEncrypted = Base64.getEncoder().encodeToString(AUTH_STRING.getBytes("utf-8"));
				Client client = Client.create();
				WebResource webResource = client.resource(restURL);
				ClientResponse response = webResource.type("application/json").header("Authorization", "Basic " + authorizationStringEncrypted).post(ClientResponse.class, inputString);
				this.STATUS_CODE = response.getStatus();
				resultJSON = new JSONObject(response.getEntity(String.class));
				commonServerResponce.put("message", "");
				commonServerResponce.put("status_code", STATUS_CODE);
				commonServerResponce.put("data", resultJSON);
				LOGGER.info("\n SAP Responce : "+resultJSON.toString() +"\n\n");
			}
			catch (ClientHandlerException  exception) {
				LOGGER.log(Level.SEVERE, "[ ClientHandlerException ]  : "+exception.toString());
				commonServerResponce.put("message", "Internal Server Error, Please try again");
				commonServerResponce.put("status_code", 500);
				commonServerResponce.put("data", "");
			}
			catch (IOException  exception) {
				LOGGER.log(Level.SEVERE, "[ IOException ]  : "+exception.toString());
				commonServerResponce.put("message", "Some Input/Output Error, Please try again");
				commonServerResponce.put("status_code", 403);
				commonServerResponce.put("data", "");
			}
			catch (Exception  exception) {
				LOGGER.log(Level.SEVERE, exception.toString());
				commonServerResponce.put("message", "Internal Server Error, Please try again");
				commonServerResponce.put("status_code", 400);
				commonServerResponce.put("data", "");
			}

		return commonServerResponce;
	}



}
