/*
 *    Licensed Materials - Property of IBM
 *    5725-I43 (C) Copyright IBM Corp. 2015, 2016. All Rights Reserved.
 *    US Government Users Restricted Rights - Use, duplication or
 *    disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

package com.ibm.titan.leaveRequest;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;

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

@Api(value = "Sample Adapter Resource")
@Path("/resource")
public class LeaveRequestResource {
	/*
	 * For more info on JAX-RS see
	 * https://jax-rs-spec.java.net/nonav/2.0-rev-a/apidocs/index.html
	 */

	// Define logger (Standard java.util.Logger)
	static Logger logger = Logger.getLogger(LeaveRequestResource.class.getName());
	String authString = "HCM_SERV_USR" + ":" + "HCM_SERV_USR@123";
	String getLeaveBalanceURL = "http://pirdev.titan.co.in:50400/RESTAdapter/GetLeaveBalance";

	// Inject the MFP configuration API:
	@Context
	ConfigurationAPI configApi;

	/*
	 * Path for method:
	 * "<server address>/mfp/api/adapters/leaveRequest/resource/unprotected"
	 */

	@POST
	@Path("/getLeaveBalance")
	@Produces(MediaType.APPLICATION_JSON)
	@OAuthSecurity(enabled = false)
	public String getLeaveBalance(	@QueryParam("IP_EMPTYP") String IP_EMPTYP,
									@QueryParam("IP_PERNR") String IP_PERNR	) throws IOException {

		String input = "{\"IP_EMPTYP\":\""+IP_EMPTYP+"\",\"IP_PERNR\":\""+IP_PERNR+"\"}";
		String  serverResJSON = null;
		JSONObject resultJSON = new JSONObject();

		try {
			String authStringEnc = Base64.getEncoder().encodeToString(authString.getBytes("utf-8"));
			Client client = Client.create();
			WebResource webResource = client.resource(getLeaveBalanceURL);
			ClientResponse response = webResource.type("application/json").header("Authorization", "Basic " + authStringEnc).post(ClientResponse.class, input);
			resultJSON = new JSONObject(response.getEntity(String.class));
			serverResJSON = resultJSON.toString();
		} catch (Exception e) {
			System.out.println("-->"+ e);
		}

		return serverResJSON;

	}



}
