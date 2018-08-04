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
package com.sample;

import com.ibm.mfp.security.checks.base.UserAuthenticationSecurityCheck;
import com.ibm.mfp.server.registration.external.model.AuthenticatedUser;

import java.util.HashMap;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONObject;

public class titan_UserLogin extends UserAuthenticationSecurityCheck {

    private String userId, displayName;
    private String errorMsg;
    private static UserManager userManager = new UserManager();

    @Override
    protected AuthenticatedUser createUser() {
        return new AuthenticatedUser(userId, displayName, this.getName());
    }

    /**
     * Get the currently authenticated user
     * @return AuthenticatedUser
     */
    public AuthenticatedUser getUser(){
        return authorizationContext.getActiveUser();
    }

    public boolean isLoggedIn(){
        return this.getState().equals(STATE_SUCCESS);
    }

    @Override
    protected boolean validateCredentials(Map<String, Object> credentials) {
        JSONObject jsonObject = new JSONObject();
        if(credentials!=null && credentials.containsKey("username") && credentials.containsKey("password")){
            String username = credentials.get("username").toString();
            String password = credentials.get("password").toString();

            //Look for this user in the database
            try {
                jsonObject = userManager.getUser(username, password);
                if(jsonObj.getString("EP_RESULT").toString() == "0"){
                    userId = username;
                    displayName = username;
                    errorMsg = jsonObject;
                    return true;
                }
            } catch (Exception e) {
                System.out.println("---"+e);
                errorMsg = "Please provide valid Username or Password";
                return false;
            }
        }
        else{
            errorMsg = "Please provide valid Username or Password";
        }
        return false;
    }

    @Override
    protected Map<String, Object> createChallenge() {
        Map challenge = new HashMap();
        challenge.put("errorMsg",errorMsg);
        return challenge;
    }
}
