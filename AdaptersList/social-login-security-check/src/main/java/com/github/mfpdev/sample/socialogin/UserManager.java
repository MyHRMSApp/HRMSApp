/**
 * Copyright 2016 IBM Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.github.mfpdev.sample.socialogin;

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

import com.ibm.mfp.adapter.api.ConfigurationAPI;
import com.ibm.mfp.adapter.api.OAuthSecurity;

import org.json.JSONArray;
import org.json.JSONObject;

import com.ibm.mfp.server.registration.external.model.ClientData;
import com.ibm.mfp.server.security.external.resource.AdapterSecurityContext;

/**
 * This class hardcodes a list of valid users.
 * Replace this with your own implementation, such as a DataBase layer.
 */
public class UserManager {

    // Define logger (Standard java.util.Logger)
	private static final Logger LOGGER = Logger.getLogger(UserManager.class.getName());

    private static final String GET_AUTHSTRING = "HCM_SERV_USR" + ":" + "HCM_SERV_USR@123";
    private static final String GET_USERAUTH_URL = "https://pirdev.titan.co.in:50401/RESTAdapter/UserAuthentication";
    private static final String GET_GMAIL_URL = "https://script.google.com/macros/s/AKfycbz8ORIE4cyT3TJ9drTSIOoA-EyQdoBSq2wmz-M6ttuPMcx_hvY/exec?email=";
    
    @Produces(MediaType.APPLICATION_JSON)
    public JSONObject getUser(String IP_EMPID, String IP_PASSWORD) throws IOException {
        String input = "{\"IP_EMPID\":\""+IP_EMPID+"\",\"IP_PASSWORD\":\""+IP_PASSWORD+"\"}";
        JSONObject jsonObject = new JSONObject();

		try {
            LOGGER.log(Level.SEVERE,"\n SAP Request Sending from MFP Adapter \n\n");

            String authStringEnc = Base64.getEncoder().encodeToString(GET_AUTHSTRING.getBytes("utf-8"));
            URL url = new URL(GET_USERAUTH_URL);

            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestProperty("Authorization", "Basic "+authStringEnc);
            conn.setConnectTimeout(30000);
            conn.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
            conn.setDoOutput(true);
            conn.setDoInput(true);
            conn.setRequestMethod("POST");

            OutputStream os = conn.getOutputStream();
            os.write(input.getBytes("UTF-8"));
            os.close();

            // read the response
            InputStream in = new BufferedInputStream(conn.getInputStream());
            String result = org.apache.commons.io.IOUtils.toString(in, "UTF-8");
            jsonObject = new JSONObject(result);
            in.close();
            conn.disconnect();
            LOGGER.log(Level.SEVERE,"\n SAP Responce : "+jsonObject.toString() +"\n\n");
            return jsonObject;
		} catch (Exception exception) {
            LOGGER.log(Level.SEVERE, "[ Exception ]  : "+exception.toString());
            jsonObject.put("EP_RESULT", 1234510);
            return jsonObject;
        }
        
    }

    @Produces(MediaType.APPLICATION_JSON)
    public JSONObject getEmployeeNumber(String EMP_MAILID) throws IOException {

		String input = "{\"email\":\""+EMP_MAILID+"\"}";
        JSONObject jsonObject = new JSONObject();

		try {
            LOGGER.log(Level.SEVERE,"\n SAP Request Sending from MFP Adapter \n\n");

            // String authStringEnc = Base64.getEncoder().encodeToString(GET_AUTHSTRING.getBytes("utf-8"));
            URL url = new URL("https://script.google.com/macros/s/AKfycbz8ORIE4cyT3TJ9drTSIOoA-EyQdoBSq2wmz-M6ttuPMcx_hvY/exec?email=nagarajan%40titan.co.in");

            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            // conn.setRequestProperty("Authorization", "Basic "+authStringEnc);
            conn.setConnectTimeout(30000);
            conn.setRequestProperty("Content-Type", "text/plain; charset=utf-8");
            conn.setDoOutput(true);
            conn.setDoInput(true);
            conn.setRequestMethod("GET");

            // read the response
            InputStream in = new BufferedInputStream(conn.getInputStream());
            String result = org.apache.commons.io.IOUtils.toString(in, "UTF-8");
            jsonObject = new JSONObject(result);
            in.close();
            conn.disconnect();
            LOGGER.log(Level.SEVERE,"\n SAP Responce : "+jsonObject.toString() +"\n\n");
            return jsonObject;
		} catch (Exception exception) {
            LOGGER.log(Level.SEVERE, "[ Exception ]  : "+exception.toString());
            jsonObject.put("EmpCode", 00);
            return jsonObject;
        }
        
    }
}