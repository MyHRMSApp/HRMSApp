/*
 *    Licensed Materials - Property of IBM
 *    5725-I43 (C) Copyright IBM Corp. 2015, 2016. All Rights Reserved.
 *    US Government Users Restricted Rights - Use, duplication or
 *    disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

package titan.ibm.attanance.getattanance;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import jdk.nashorn.api.scripting.JSObject;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;
import java.util.Base64;
import java.util.ArrayList;
import java.util.*;
import java.util.List;

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

import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.WebResource;

import com.ibm.mfp.adapter.api.ConfigurationAPI;
import com.ibm.mfp.adapter.api.OAuthSecurity;


import org.json.JSONArray;
import org.json.JSONObject;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

@Api(value = "Sample Adapter Resource")
@Path("/resource")
public class AttananceRequestResource {
	/*
	 * For more info on JAX-RS see
	 * https://jax-rs-spec.java.net/nonav/2.0-rev-a/apidocs/index.html
	 */

	// Define logger (Standard java.util.Logger)
	static Logger logger = Logger.getLogger(AttananceRequestResource.class.getName());

	// Inject the MFP configuration API:
	@Context
	ConfigurationAPI configApi;

	/*
	 * Path for method:
	 * "<server address>/mfp/api/adapters/attananceRequest/resource"
	 */


	@POST
	@Produces(MediaType.APPLICATION_JSON)
	@OAuthSecurity(enabled = false)
	public String getAttananceData(	@QueryParam("IP_BEGDA") String IP_BEGDA,
									@QueryParam("IP_ENDDA") String IP_ENDDA,
									@QueryParam("IP_PERNR") String IP_PERNR) throws IOException {

		System.out.println(IP_BEGDA+"--"+IP_ENDDA+"--"+IP_PERNR);

		JSONObject  responceJSON = new JSONObject();
		String serverResJSON = null;
		// ArrayList<JSONObject> resultJSONarrlist = new ArrayList<JSONObject>();
		List resultJSONarrlist = new ArrayList(); 

		String name = "HCM_SERV_USR";
		String password = "HCM_SERV_USR@123";
		String authString = name + ":" + password;
		String authStringEnc = Base64.getEncoder().encodeToString(authString.getBytes("utf-8"));
		String input = "{\"IP_BEGDA\":\""+IP_BEGDA+"\",\"IP_ENDDA\":\""+IP_ENDDA+"\",\"IP_PERNR\":\""+IP_PERNR+"\"}";
		String baseuri = "http://pirdev.titan.co.in:50400/RESTAdapter/GetAttendanceStatus";

		// String singleOject = "{\"ET_DATA\":{\"item\":[{\"LDATE\": \"2018-06-01\",\"SHIFT\": \"OFF\",\"ATT_1\": \"\",\"COL_1\": \"00\",\"ATT_2\": \"0\",\"COL_2\": \"00\",\"PUN_P10\": \"00:00:00\",\"PUN_P15\": \"00:00:00\",\"PUN_P25\": \"00:00:00\",\"PUN_P20\": \"00:00:00\",\"LATE_MINS\": \"00000\",\"MID_LATE\": \"00000\",\"ABS\": \"0\",\"ATT\": \"0\",\"RS_ATT1\": \"\",\"RS_ATT2\": \"\"},{\"LDATE\": \"2018-06-02\",\"SHIFT\": \"OFF\",\"ATT_1\": \"\",\"COL_1\": \"00\",\"ATT_2\": \"0\",\"COL_2\": \"00\",\"PUN_P10\": \"00:00:00\",\"PUN_P15\": \"00:00:00\",\"PUN_P25\": \"00:00:00\",\"PUN_P20\": \"00:00:00\",\"LATE_MINS\": \"00000\",\"MID_LATE\": \"00000\",\"ABS\": \"0\",\"ATT\": \"0\",\"RS_ATT1\": \"ODA,FTP\",\"RS_ATT2\": \"FTA,ODP\"},{\"LDATE\": \"2018-06-03\",\"SHIFT\": \"G\",\"ATT_1\": \"UA\",\"COL_1\": \"00\",\"ATT_2\": \"G\",\"COL_2\": \"00\",\"PUN_P10\": \"00:00:00\",\"PUN_P15\": \"00:00:00\",\"PUN_P25\": \"00:00:00\",\"PUN_P20\": \"00:00:00\",\"LATE_MINS\": \"00000\",\"MID_LATE\": \"00000\",\"ABS\": \"0\",\"ATT\": \"0\",\"RS_ATT1\": \"\",\"RS_ATT2\": \"\"},{\"LDATE\": \"2018-06-01\",\"SHIFT\": \"G\",\"ATT_1\": \"CL\",\"COL_1\": \"00\",\"ATT_2\": \"UA\",\"COL_2\": \"00\",\"PUN_P10\": \"00:00:00\",\"PUN_P15\": \"00:00:00\",\"PUN_P25\": \"00:00:00\",\"PUN_P20\": \"00:00:00\",\"LATE_MINS\": \"00000\",\"MID_LATE\": \"00000\",\"ABS\": \"0\",\"ATT\": \"0\",\"RS_ATT1\": \"CLA\",\"RS_ATT2\": \"CLP\"},{\"LDATE\": \"2018-06-01\",\"SHIFT\": \"OFF\",\"ATT_1\": \"UA\",\"COL_1\": \"00\",\"ATT_2\": \"OD\",\"COL_2\": \"00\",\"PUN_P10\": \"00:00:00\",\"PUN_P15\": \"00:00:00\",\"PUN_P25\": \"00:00:00\",\"PUN_P20\": \"00:00:00\",\"LATE_MINS\": \"00000\",\"MID_LATE\": \"00000\",\"ABS\": \"0\",\"ATT\": \"0\",\"RS_ATT1\": \"\",\"RS_ATT2\": \"ODP\"},{\"LDATE\": \"2018-06-01\",\"SHIFT\": \"OFF\",\"ATT_1\": \"HO\",\"COL_1\": \"00\",\"ATT_2\": \"G\",\"COL_2\": \"00\",\"PUN_P10\": \"00:00:00\",\"PUN_P15\": \"00:00:00\",\"PUN_P25\": \"00:00:00\",\"PUN_P20\": \"00:00:00\",\"LATE_MINS\": \"00000\",\"MID_LATE\": \"00000\",\"ABS\": \"0\",\"ATT\": \"0\",\"RS_ATT1\": \"\",\"RS_ATT2\": \"ODP\"},{\"LDATE\": \"2018-06-01\",\"SHIFT\": \"G\",\"ATT_1\": \"OD\",\"COL_1\": \"00\",\"ATT_2\": \"CL\",\"COL_2\": \"00\",\"PUN_P10\": \"00:00:00\",\"PUN_P15\": \"00:00:00\",\"PUN_P25\": \"00:00:00\",\"PUN_P20\": \"00:00:00\",\"LATE_MINS\": \"00000\",\"MID_LATE\": \"00000\",\"ABS\": \"0\",\"ATT\": \"0\",\"RS_ATT1\": \"ODA\",\"RS_ATT2\": \"CLA\"},{\"LDATE\": \"2018-06-30\",\"SHIFT\": \"G\",\"ATT_1\": \"G\",\"COL_1\": \"00\",\"ATT_2\": \"CL\",\"COL_2\": \"00\",\"PUN_P10\": \"00:00:00\",\"PUN_P15\": \"00:00:00\",\"PUN_P25\": \"00:00:00\",\"PUN_P20\": \"00:00:00\",\"LATE_MINS\": \"00000\",\"MID_LATE\": \"00000\",\"ABS\": \"0\",\"ATT\": \"0\",\"RS_ATT1\": \"\",\"RS_ATT2\": \"CLA\"},{\"LDATE\": \"2018-06-20\",\"SHIFT\": \"G\",\"ATT_1\": \"OD\",\"COL_1\": \"00\",\"ATT_2\": \"CL\",\"COL_2\": \"00\",\"PUN_P10\": \"00:00:00\",\"PUN_P15\": \"00:00:00\",\"PUN_P25\": \"00:00:00\",\"PUN_P20\": \"00:00:00\",\"LATE_MINS\": \"00000\",\"MID_LATE\": \"00000\",\"ABS\": \"0\",\"ATT\": \"0\",\"RS_ATT1\": \"ODA\",\"RS_ATT2\": \"CLA\"}]}}}";
		String[] raisedReqList = {"ODP", "FTP", "CLP", "SLP", "GLP", "QLP", "PLP"};
		String[] approvedReqList = {"ODA", "FTA", "CLA", "SLA", "GLA", "QLA", "PLA"};
		try {
			Client client = Client.create();
			WebResource webResource = client.resource(baseuri);
			ClientResponse response = webResource.type("application/json").header("Authorization", "Basic " + authStringEnc).post(ClientResponse.class, input);
			responceJSON = new JSONObject(response.getEntity(String.class));
			System.out.println("--"+responceJSON);
			// responceJSON = new JSONObject(singleOject);
			JSONObject innerObject = responceJSON.getJSONObject("ET_DATA");
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

				String[] temp_reqState_ATT_1 = RS_ATT1.isEmpty()?null:RS_ATT1.split(",");
				String[] temp_reqState_ATT_2 = RS_ATT2.isEmpty()?null:RS_ATT2.split(",");
				System.out.println(temp_reqState_ATT_1+"--"+temp_reqState_ATT_2);

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
							if (Arrays.asList( approvedReqList ).contains( temp_reqState_ATT_1[ii].toString() ) && ATT1_Aprd != false) {
								ATT1_Aprd = false;
								ATT_1_Req.add(temp_reqState_ATT_1[ii]);
							}
							
						}
					}

					if(temp_reqState_ATT_2 != null){
						for(int ii = 0; ii < temp_reqState_ATT_2.length; ii++){
							if (Arrays.asList( approvedReqList ).contains( temp_reqState_ATT_2[ii].toString() ) && ATT2_Aprd != false) {
								ATT2_Aprd = false;
								ATT_2_Req.add(temp_reqState_ATT_2[ii]);
							}
							
						}
					}

					if(temp_reqState_ATT_1 != null){
						for(int ii = 0; ii < temp_reqState_ATT_1.length; ii++){
							if (Arrays.asList( raisedReqList ).contains( temp_reqState_ATT_1[ii].toString() ) && ATT1_CLR != false) {
								ATT1_CLR = false;
								ATT_1_Req.add(temp_reqState_ATT_1[ii]);
							}
							
						}
					}

					if(temp_reqState_ATT_2 != null){
						for(int ii = 0; ii < temp_reqState_ATT_2.length; ii++){
							if (Arrays.asList( raisedReqList ).contains( temp_reqState_ATT_2[ii].toString() ) && ATT2_CLR != false) {
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
					resultJSON.put("Holiday", false);
					resultJSON.put("Absence", false);
					resultJSON.put("RequestState", true);

					System.out.println(resultJSON);
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
							if (Arrays.asList( approvedReqList ).contains( temp_reqState_ATT_1[ii].toString() ) && ATT1_Aprd != false) {
								ATT1_Aprd = false;
								ATT_1_Req.add(temp_reqState_ATT_1[ii]);
							}
							
						}
					}

					if(temp_reqState_ATT_2 != null){
						for(int ii = 0; ii < temp_reqState_ATT_2.length; ii++){
							if (Arrays.asList( approvedReqList ).contains( temp_reqState_ATT_2[ii].toString() ) && ATT2_Aprd != false) {
								ATT2_Aprd = false;
								ATT_2_Req.add(temp_reqState_ATT_2[ii]);
							}
							
						}
					}

					if(temp_reqState_ATT_1 != null){
						for(int ii = 0; ii < temp_reqState_ATT_1.length; ii++){
							if (Arrays.asList( raisedReqList ).contains( temp_reqState_ATT_1[ii].toString() ) && ATT1_CLR != false) {
								ATT1_CLR = false;
								ATT_1_Req.add(temp_reqState_ATT_1[ii]);
							}
							
						}
					}

					if(temp_reqState_ATT_2 != null){
						for(int ii = 0; ii < temp_reqState_ATT_2.length; ii++){
							if (Arrays.asList( raisedReqList ).contains( temp_reqState_ATT_2[ii].toString() ) && ATT2_CLR != false) {
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
							if (Arrays.asList( approvedReqList ).contains( temp_reqState_ATT_1[ii].toString() ) && ATT1_Aprd != false) {
								ATT1_Aprd = false;
								ATT_1_Req.add(temp_reqState_ATT_1[ii]);
							}
							
						}
					}

					if(temp_reqState_ATT_2 != null){
						for(int ii = 0; ii < temp_reqState_ATT_2.length; ii++){
							if (Arrays.asList( approvedReqList ).contains( temp_reqState_ATT_2[ii].toString() ) && ATT2_Aprd != false) {
								ATT2_Aprd = false;
								ATT_2_Req.add(temp_reqState_ATT_2[ii]);
							}
							
						}
					}

					if(temp_reqState_ATT_1 != null){
						for(int ii = 0; ii < temp_reqState_ATT_1.length; ii++){
							if (Arrays.asList( raisedReqList ).contains( temp_reqState_ATT_1[ii].toString() ) && ATT1_CLR != false) {
								ATT1_CLR = false;
								ATT_1_Req.add(temp_reqState_ATT_1[ii]);
							}
							
						}
					}

					if(temp_reqState_ATT_2 != null){
						for(int ii = 0; ii < temp_reqState_ATT_2.length; ii++){
							if (Arrays.asList( raisedReqList ).contains( temp_reqState_ATT_2[ii].toString() ) && ATT2_CLR != false) {
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
					resultJSON.put("Holiday", false);
					resultJSON.put("Absence", false);
					resultJSON.put("RequestState", false);
				}

				resultJSONarrlist.add(resultJSON);
				System.out.println("-->>>"+resultJSONarrlist);
			}
			GsonBuilder gsonBuilder = new GsonBuilder();
			Gson gson = gsonBuilder.create();
			serverResJSON = gson.toJson(resultJSONarrlist);
		} catch (Exception e) {
			System.out.println("-->"+ e);
		}
	return serverResJSON;
	}

}
