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
import java.util.logging.Level;
import java.util.logging.Logger;
import java.net.*;
import java.io.*;
import javax.ws.rs.core.Context;

import com.ibm.mfp.adapter.api.ConfigurationAPI;
import com.ibm.mfp.adapter.api.OAuthSecurity;

import org.json.JSONArray;
import org.json.JSONObject;

import com.ibm.mfp.server.registration.external.model.ClientData;
import com.ibm.mfp.server.security.external.resource.AdapterSecurityContext;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.auth.AuthScope;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.CredentialsProvider;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.BasicCredentialsProvider;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.apache.http.entity.StringEntity;

/**
 * This class hardcodes a list of valid users.
 * Replace this with your own implementation, such as a DataBase layer.
 */
public class UserManager {
    /*
	 * For more info on JAX-RS see
	 * https://jax-rs-spec.java.net/nonav/2.0-rev-a/apidocs/index.html
	 */
    @Context
	ConfigurationAPI configurationAPI;

    // Define logger (Standard java.util.Logger)
	private static final Logger LOGGER = Logger.getLogger(UserManager.class.getName());
    private static final String SAP_USERNAME = "HCM_SERV_USR";
    private static final String SAP_PASSWORD = "HCM_SERV_USR@123";
    private static final String USER_AUTH_CONTEXT_PATH = "UserAuthentication";
    private static final String AUTH_SCOPE_URL = "pirdev.titan.co.in";
	private static final int AUTH_SCOPE_PORT = 50401;
	private static final int TIMEOUT_MILLIS = 30000;
    JSONObject jsonObject = new JSONObject();

       public JSONObject getUserDetials(String IP_EMPID, String IP_PASSWORD, String EMP_MAILID, String REQ_URL, Boolean FLAG) throws Exception{
              System.out.println(IP_EMPID+"--"+IP_PASSWORD+"--"+EMP_MAILID+"--"+REQ_URL+USER_AUTH_CONTEXT_PATH+"--"+FLAG);
            if(FLAG){
                CredentialsProvider credsProvider = new BasicCredentialsProvider();
                StringEntity params =new StringEntity("{\"IP_EMPID\":\""+IP_EMPID+"\",\"IP_PASSWORD\":\""+IP_PASSWORD+"\"}");
                LOGGER.log(Level.INFO,"\n SAP Request Sending from MFP Adapter : \n"+ params+"\n");
                credsProvider.setCredentials(
                        new AuthScope(AUTH_SCOPE_URL, AUTH_SCOPE_PORT),
                        new UsernamePasswordCredentials(SAP_USERNAME, SAP_PASSWORD));
                CloseableHttpClient httpclient = HttpClients.custom()
                        .setDefaultCredentialsProvider(credsProvider)
                        .build();
                try {
                    HttpPost httpPost = new HttpPost(REQ_URL+USER_AUTH_CONTEXT_PATH);
                    httpPost.addHeader("User-Agent", "Mozilla/5.0");
                    httpPost.setEntity(params);
                    
                    ResponseHandler<String> responseHandler = new ResponseHandler<String>() {
        
                        @Override
                        public String handleResponse(
                                final HttpResponse response) throws ClientProtocolException, IOException {
                            int status = response.getStatusLine().getStatusCode();
                            if (status >= 200 && status < 300) {
                                HttpEntity entity = response.getEntity();
                                return entity != null ? EntityUtils.toString(entity) : null;
                            } else {
                                jsonObject.put("EP_RESULT", 1234510);
                                throw new ClientProtocolException("Unexpected response status: " + status);
                            }
                        }
            
                    };
                    String responseBody = httpclient.execute(httpPost, responseHandler);
                    jsonObject = new JSONObject(responseBody);
                    LOGGER.log(Level.INFO,"\n SAP Responce : "+jsonObject.toString() +"\n\n");

                } finally {
                    httpclient.close();
                }

                return jsonObject;
            }else{
                CloseableHttpClient httpclient = HttpClients.createDefault();
                try {
                HttpGet httpget = new HttpGet(REQ_URL+EMP_MAILID); 
                LOGGER.log(Level.INFO,"\n SAP Request Sending from MFP Adapter : \n"+ REQ_URL+EMP_MAILID+"\n");
                ResponseHandler<String> responseHandler = new ResponseHandler<String>() {
        
                    @Override
                    public String handleResponse(
                            final HttpResponse response) throws ClientProtocolException, IOException {
                        int status = response.getStatusLine().getStatusCode();
                        if (status >= 200 && status < 300) {
                            HttpEntity entity = response.getEntity();
                            return entity != null ? EntityUtils.toString(entity) : null;
                        } else {
                            throw new ClientProtocolException("Unexpected response status: " + status);
                        }
                    }
        
                };
                String responseBody = httpclient.execute(httpget, responseHandler);
                jsonObject = new JSONObject(responseBody);
                LOGGER.log(Level.INFO,"\n SAP Responce : "+jsonObject.toString() +"\n\n");
                }finally {
                httpclient.close();
                } 
                return jsonObject;
            }
       }
}