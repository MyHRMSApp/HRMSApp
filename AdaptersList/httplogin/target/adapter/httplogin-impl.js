/*
 *  Licensed Materials - Property of IBM
 *  5725-I43 (C) Copyright IBM Corp. 2011, 2016. All Rights Reserved.
 *  US Government Users Restricted Rights - Use, duplication or
 *  disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

/**
 * @param tag: a topic such as MobileFirst_Platform, Bluemix, Cordova.
 * @returns json list of items.
 */

function getFeed(tag) {
	var input = {
	    method : 'get',
	    returnedContentType : 'xml',
	    path : getPath(tag)
	};

	return MFP.Server.invokeHttp(input);
}

/**
 * Helper function to build the URL path.
 */
function sendFeedback() {

    var document = {
      body: {
        "IP_EMPID": "E0398132",
   		"IP_PASSWORD": "VHENIN@2006"
      }
    };

    MFP.Logger.warn("User feedback inputs " + JSON.stringify(document));

    var requestStructure = {
			method : 'POST',
			headers: {Authorization: "Basic SENNX1NFUlZfVVNSOkhDTV9TRVJWX1VTUkAxMjM="},
            returnedContentType : 'plain',
            path : '/RESTAdapter/UserAuthentication',
        body: {
          contentType:'application/json; charset=UTF-8',
          content: JSON.stringify({
			"IP_EMPID": "E0398132",
			   "IP_PASSWORD": "VHENIN@2006"
		  })
        }
    };

    MFP.Logger.warn("Preparing request structure " + JSON.stringify(requestStructure));

    return MFP.Server.invokeHttp(requestStructure);

}

/**
 * @returns ok
 */
function unprotected(param) {
	return {result : "Hello from unprotected resource"};
}