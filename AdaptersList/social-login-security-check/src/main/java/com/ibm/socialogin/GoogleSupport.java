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
package com.ibm.socialogin;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.ibm.mfp.server.registration.external.model.AuthenticatedUser;

import javax.net.ssl.SSLSocketFactory;

import java.io.Console;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import java.util.logging.Logger;

/**
 * Configuration and verification of google ID token
 * as descibed at https://developers.google.com/identity/sign-in/android/backend-auth
 * <p/>
 * The only configuration property is {@link #CLIENT_ID_CONFIG_PROPERTY}, which contains the OAuth 2.0 client ID for MFP server.
 * This client ID should be obtained from the <a href="https://console.developers.google.com/apis/credentials">Google Developers Console</a>
 *
 * @author artem on 3/3/16.
 */
public class GoogleSupport implements LoginVendor {

    private static final Logger logger = Logger.getLogger(GoogleSupport.class.getName());

    private static final String CLIENT_ID_CONFIG_PROPERTY = "google.clientId";
    private static final String CLIENT_ID_CONFIG_PROPERTY_IOS = "googleclientId4IOS";
    private static final String CLIENT_ID_CONFIG_PROPERTY_ANDROID = "googleclientId4Android";
    private String clientId_IOS = "";
    private String clientId_ANDROID = "";

    private NetHttpTransport transport;
    private JsonFactory jsonFactory;

    private GoogleIdTokenVerifier[] verifiers_IOS;
    private GoogleIdTokenVerifier[] verifiers_ANDROID;

    public String[] getConfigurationPropertyNames_IOS() {
        return new String[]{CLIENT_ID_CONFIG_PROPERTY_IOS};
    }

    public String[] getConfigurationPropertyNames_ANDROID() {
        return new String[]{CLIENT_ID_CONFIG_PROPERTY_ANDROID};
    }

    @Override
    public void setConfiguration(Properties properties, SSLSocketFactory sslSocketFactory) {
        transport = new NetHttpTransport.Builder().setSslSocketFactory(sslSocketFactory).build();
        jsonFactory = new JacksonFactory();
        

        clientId_IOS = properties.getProperty(CLIENT_ID_CONFIG_PROPERTY_IOS);
        clientId_ANDROID = properties.getProperty(CLIENT_ID_CONFIG_PROPERTY_ANDROID);

        if (clientId_IOS != null && !clientId_IOS.isEmpty() && clientId_IOS.endsWith("apps.googleusercontent.com")) {
            verifiers_IOS = new GoogleIdTokenVerifier[]{
                    createTokenVerifier(clientId_IOS, "https://accounts.google.com"),
                    createTokenVerifier(clientId_IOS, "accounts.google.com"),
            };
        } else {
            verifiers_IOS = null;
        }

        if (clientId_ANDROID != null && !clientId_ANDROID.isEmpty() && clientId_ANDROID.endsWith("apps.googleusercontent.com")) {
            verifiers_ANDROID = new GoogleIdTokenVerifier[]{
                    createTokenVerifier(clientId_ANDROID, "https://accounts.google.com"),
                    createTokenVerifier(clientId_ANDROID, "accounts.google.com"),
            };
        } else {
            verifiers_ANDROID = null;
        }
    }

    private GoogleIdTokenVerifier createTokenVerifier(String clientId, String issuer) {
        return new GoogleIdTokenVerifier.Builder(transport, jsonFactory)
               .setAudience(Collections.singletonList(clientId))
               .setIssuer(issuer)
               .build();
    }

    public boolean isEnabled() {
        return verifiers_IOS != null;
    }

    public AuthenticatedUser validateTokenAndCreateUser(String idTokenStr, String checkName, String platform) {
        
        GoogleIdToken idToken = null;
        String errorMsg = "";
        // int temp = (platform == "android")
        if(platform.equalsIgnoreCase("android")){
            System.out.println("DevicePlatform-android===>>>"+ verifiers_ANDROID.toString());
            for (GoogleIdTokenVerifier verifier : verifiers_ANDROID) {
                System.out.println("idTokenStr=---------aaaaa->>"+ idTokenStr);
                try {
                    idToken = verifier.verify(idTokenStr);
                    if (idToken != null) break;
                } catch (Exception e) {
                    errorMsg = e.toString() + "\n";
                }
            }
        }else{
            System.out.println("DevicePlatform-ios===>>>"+ verifiers_IOS.toString());
            int temp = 0;
            for (GoogleIdTokenVerifier verifier_IOS : verifiers_IOS) {
                if(temp == 0){
                    System.out.println("idTokenStr=-----iiiii----->>"+ idTokenStr);
                    try {
                        idToken = verifier_IOS.verify(idTokenStr);
                        if (idToken != null) break;
                    } catch (Exception e) {
                        errorMsg = e.toString() + "\n";
                    }
                    temp++;
                }
                
            }
        }
        
        if (idToken == null) {
            logger.info("Failed to validate google Id token:\n" + errorMsg);
            return null;
        }

        GoogleIdToken.Payload payload = idToken.getPayload();
        String userId = payload.getSubject();
        String name = (String) payload.get("name");
        Map<String, Object> attributes = new HashMap<>();

        String email = payload.getEmail();
        if (email != null) {
            attributes.put("email", email);
            attributes.put("email_verified", payload.getEmailVerified());
        }

        copyProperty("picture", payload, attributes);
        copyProperty("family_name", payload, attributes);
        copyProperty("given_name", payload, attributes);
        copyProperty("locale", payload, attributes);

        AuthenticatedUser user = new AuthenticatedUser(userId, name, checkName, attributes);

        return user;
    }

    private void copyProperty(String propertyName, GoogleIdToken.Payload from, Map<String, Object> to) {
        Object value = from.get(propertyName);
        if (value != null)
            to.put(propertyName, value);
    }

}
