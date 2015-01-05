var ajax = {
    request: function (url, requestType, callback, queryString) {
        var ids = ['MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP', 'Microsoft.XMLHTTP'], xhr;

        // Simplification of this check while essentially doing the same thing
        if (window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
        } else {
            for (var i = 0; i < ids.length; i++) {
                try {
                    xhr = new ActiveXObject(ids[i]);
                    break;
                } catch (e) {
                }
            }
        }
        // Calling a function to return a function is redundant.
        // Do what you're trying to with as little extra as possible.
        //xhr.onreadystatechange = function() {
        //    callback(xhr);
        //};
        x.onreadystatechange = function () {
            if (x.readyState == 4) {
                if (x.status == 200) {
                    callbackFunction(x.responseText);
                } else {
                    // request error
                }
            }
        };

        xhr.open(requestType, url, true);
        if (requestType.toUpperCase() === 'GET') {
            // When initiating a get request, the send function needs no arguments at all.
            xhr.send();
        } else if (requestType.toUpperCase() === 'POST') {
            xhr.send(queryString);
        }

        // If you want to be extra careful, include an else here to handle a bad requestType
    };