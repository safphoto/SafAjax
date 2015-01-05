// Safely create namespace
var SAF = SAF || {};

SAF.AjaxOptions = {
    Url: null,
    QueryString: null,
    RequestType: null,
    Success: null,
    Error: null
};

SAF.AjaxProvider = function () {
    var options = null;

    this.Call = function(ajaxOptions) {
        options = ajaxOptions
    };

    var MakeRequest = function () {
        var ids = ['MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP', 'Microsoft.XMLHTTP'], xhr;

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

        x.onreadystatechange = function () {
            if (x.readyState == 4) {
                if (x.status == 200) {
                    options.Success(x.responseText);
                } else {
                    options.Error(x);
                }
            }
        };

        xhr.open(options.RequestType, options.Url, true);

        if (options.RequestType.toUpperCase() === 'GET') {
            // When initiating a get request, the send function needs no arguments at all.
            xhr.send();
        } else if (options.RequestType.toUpperCase() === 'POST') {
            xhr.send(options.QueryString);
        }

        // If you want to be extra careful, include an else here to handle a bad requestType
    };
};


