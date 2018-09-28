/**
 *    © Copyright 2016 IBM Corp.
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
package com.github.mfpdev.sample.socialogin;

import com.ibm.mfp.security.checks.base.UserAuthenticationSecurityCheck;
import com.ibm.mfp.server.registration.external.model.AuthenticatedUser;
import com.ibm.mfp.server.security.external.checks.AuthorizationResponse;
import com.ibm.mfp.server.security.external.checks.SecurityCheckConfiguration;


import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.json.JSONArray;
import org.json.JSONObject;

/**
 * Security check that aggregates different login vendors - Google, Facebook, etc.
 * <p/>
 * The challenge sent by this check includes a list of available vendors, so that the client can choose which one to use.
 * Upon successful authentication the client sends the challenge response containing the chosen vendor name and the token.
 * The security checks delegates the token validation to the appropriate {@link LoginVendor#validateTokenAndCreateUser(String, String)}<br/>
 * If the validation succeeds the return value is set as the authenticated user.
 * If the validation fails, a failure response containing the vendor name is sent to the client.
 *
 * @author artem on 3/3/16.
 */
public class SocialLoginSecurityCheck extends UserAuthenticationSecurityCheck {

    private static final String VENDOR_KEY = "vendor";
    private static final String TOKEN_KEY = "token";
    private static final String USER_NAME = "username";
    private static final String PASSWORD = "password";
    private static final String SAP_LOGIN = "SAP_LOGIN";
    private static final String GMAIL_LOGIN = "GMAIL_LOGIN";
    private static final String SECURITY_TYPE = "SECURITY_TYPE";
    private static final String VENDOR_ATTRIBUTE = "socialLoginVendor";
    private static final String ORIGINAL_TOKEN_ATTRIBUTE = "originalToken";
    private static final String GMAIL_ID = "GMAIL_ID"; 

    private transient String vendorName;
    private transient AuthenticatedUser user;
    private String userId, displayName, empCode;
    private String errorMsg;
    private boolean rememberMe = false;


    private static UserManager userManager = new UserManager();

        // Define logger (Standard java.util.Logger)
	private static final Logger LOGGER = Logger.getLogger(UserManager.class.getName());

    @Override
    public SecurityCheckConfiguration createConfiguration(Properties properties) {
        return new SocialLoginConfiguration(properties);
    }

    @Override
    public void authorize(Set<String> scope, Map<String, Object> credentials, HttpServletRequest request, AuthorizationResponse response) {
        super.authorize(scope, credentials, request, response);
        if (response.getType() == AuthorizationResponse.ResponseType.FAILURE) {
            Map<String, Object> failure = new HashMap<>();
            if (vendorName != null) {
                failure.put(vendorName, "invalid token");
            } else {
                failure.put("invalid_vendor_name", "vendor name cannot be null");
            }
            response.addFailure(getName(), failure);
        }
    }

    @Override
    protected Map<String, Object> createChallenge() {
        Map<String, Object> res = new HashMap<>();
        // res.put("vendorList", getConfiguration().getEnabledVendors().keySet().toArray());
        res.put("errorMsg",errorMsg);
        res.put("remainingAttempts",getRemainingAttempts());
        errorMsg = null;
        return res;
    }

    @Override
    protected boolean validateCredentials(Map<String, Object> credentials) {
        JSONObject jsonObject = new JSONObject();
        AuthenticatedUser user = new AuthenticatedUser();
        if(credentials!=null){
            switch (credentials.get(SECURITY_TYPE).toString()) {
                case SAP_LOGIN:
                        if(credentials.containsKey(USER_NAME) && credentials.containsKey(PASSWORD)){
                            String username = (String) credentials.get(USER_NAME);
                            String password = (String) credentials.get(PASSWORD);
                            rememberMe = Boolean.valueOf(credentials.get("rememberMe").toString());
                            //Look for this user in the database
                            try {
                                jsonObject = (JSONObject) userManager.getUserDetials(username, password, "", this.getConfiguration().getQaServerURL(), true);
                                errorMsg = "sample";
                                if(jsonObject.getInt("EP_RESULT") == 0){
                                    userId = jsonObject.getString("EP_ENAME");
                                    jsonObject.put("rememberMe", rememberMe);
                                    displayName = jsonObject.toString();
                                    this.user = new AuthenticatedUser(userId, displayName, this.getName());
                                    return true;
                                }else if(jsonObject.getInt("EP_RESULT") == 1234510){
                                    errorMsg = "Internal Server Error, Please try again";
                                    return false;
                                }else{
                                    errorMsg = "Please provide valid Username or Password";
                                    return false;
                                }
                            } catch (Exception exception) {
                                LOGGER.log(Level.SEVERE,"\n [ Exception ] : "+exception);
                                errorMsg = "Please provide valid Username or Password";
                                return false;
                            }
                        }
                    break;
                case GMAIL_LOGIN:
                    if(credentials.containsKey(GMAIL_ID)){
                        String gmailID = (String) credentials.get(GMAIL_ID);
                        vendorName = (String) credentials.get(VENDOR_KEY);
                        String token = (String) credentials.get(TOKEN_KEY);
                        //Look for this user in the database
                        System.out.println(gmailID +"<---->"+vendorName+"<---->"+token);
                        try {
                            if (vendorName != null && token != null) {
                                LoginVendor vendor = getConfiguration().getEnabledVendors().get(vendorName);
                                if (vendor != null) {
                                    AuthenticatedUser resultUser = vendor.validateTokenAndCreateUser(token, getName());
                                    System.out.println("-->>firebase-->>"+  resultUser.getId()+"<<-->>"+ resultUser.getDisplayName()+"<<-->>"+ getName());
                                    if (resultUser != null) {
                                        JSONObject employeeNO = (JSONObject) userManager.getUserDetials("", "", gmailID, this.getConfiguration().getGmailAuthURL(), false);
                                        if(employeeNO.getInt("EmpCode") != 0){
                                            empCode = Integer.toString(employeeNO.getInt("EmpCode"));
                                            jsonObject = (JSONObject) userManager.getUserDetials("Gmail", empCode, "", this.getConfiguration().getQaServerURL(), true);
                                            if(jsonObject.getInt("EP_RESULT") == 0){
                                                userId = jsonObject.getString("EP_ENAME");
                                                jsonObject.put("rememberMe", rememberMe);
                                                displayName = jsonObject.toString();
                                                // AuthenticatedUser userNew = new AuthenticatedUser();
                                                this.user = new AuthenticatedUser(userId, displayName, this.getName());
                                                return true;
                                            }else if(jsonObject.getInt("EP_RESULT") == 1234510){
                                                errorMsg = "Internal Server Error, Please try again";
                                                return false;
                                            }else{
                                                errorMsg = "Please try with valid Titan Mail ID";
                                                return false;
                                            }
                                        }else if(employeeNO.getInt("EmpCode") != 00){
                                            errorMsg = "Login process getting error, Please try again";
                                            return false;
                                        }
                                        else{
                                            errorMsg = "Please try with valid Titan Mail ID";
                                            return false;
                                        }
                                    }else{
                                        errorMsg = "token is not giving user details...";
                                        return false;
                                    }
                                }
                            }
                        } catch (Exception exception) {
                            LOGGER.log(Level.SEVERE,"\n [ Exception ] : "+exception);
                            errorMsg = "Internal Server Error, Please try again";
                            return false;
                        }
                    }
                    else{
                        errorMsg = "Please try with valid Titan Mail ID";
                    }
                break;
            }
        }
        

        return false;
    }

    @Override
    protected AuthenticatedUser createUser() {
        return user;
    }

    // @Override
    // protected AuthenticatedUser createUserforSAPLogin() {
    //     return new AuthenticatedUser(userId, displayName, this.getName());
    // }

    @Override
    protected SocialLoginConfiguration getConfiguration() {
        return (SocialLoginConfiguration) super.getConfiguration();
    }

    @Override
    protected boolean rememberCreatedUser() {
        return rememberMe;
    }
}