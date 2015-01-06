// Safely create namespace
var SAF = SAF || {};

/* EXAMPLE USAGE

Ajax.request({
        url: 'data.php',
        method: 'post',
        data: {
            select: 'users',
            orderBy: 'date'
        },
        headers: {
            'custom-header': 'custom-value'
        }
    })
    .success(function(result) {
        console.log("done", result);
    })
    .error(function(xhr) {
        console.log("fail");
    })
    .always(function(xhr) {
        console.log("always");
    });

*/

SAF.Ajax = {
    request: function(options) {
        if(typeof options == 'string') options = { url: options };

        options.url = options.url || '';
        options.method = options.method || 'get'
        options.data = options.data || {};

        var getParams = function(data, url) {
            var arr = [];
            var str;

            for(var name in data) {
                arr.push(name + '=' + encodeURIComponent(data[name]));
            }

            str = arr.join('&');

            if(str != '') {
                return url ? (url.indexOf('?') < 0 ? '?' + str : '&' + str) : str;
            }

            return '';
        };

        var api = {
            host: {},
            process: function(options) {
                var self = this;
                this.xhr = null;

                if(window.ActiveXObject) {
                    this.xhr = new ActiveXObject('Microsoft.XMLHTTP');
                }
                else if(window.XMLHttpRequest) {
                    this.xhr = new XMLHttpRequest();
                }

                if(this.xhr) {
                    this.xhr.onreadystatechange = function() {
                        if(self.xhr.readyState == 4 && self.xhr.status == 200) {
                            var result = self.xhr.responseText;

                            if(options.json === true && typeof JSON != 'undefined') {
                                result = JSON.parse(result);
                            }

                            self.successCallback && self.successCallback.apply(self.host, [result, self.xhr]);
                        }
                        else if(self.xhr.readyState == 4) {
                            self.errorCallback && self.errorCallback.apply(self.host, [self.xhr]);
                        }

                        self.alwaysCallback && self.alwaysCallback.apply(self.host, [self.xhr]);
                    }
                }

                if(options.method == 'get') {
                    this.xhr.open("GET", options.url + getParams(options.data, options.url), true);
                }
                else {
                    this.xhr.open(options.method, options.url, true);
                    this.setHeaders({
                        'X-Requested-With': 'XMLHttpRequest',
                        'Content-type': 'application/x-www-form-urlencoded'
                    });
                }

                if(options.headers && typeof options.headers == 'object') {
                    this.setHeaders(options.headers);
                }

                setTimeout(function() {
                    (options.method == 'get') ? self.xhr.send() : self.xhr.send(getParams(options.data));
                }, 20);

                return this;
            },
            success: function(callback) {
                this.successCallback = callback;
                return this;
            },
            error: function(callback) {
                this.errorCallback = callback;
                return this;
            },
            always: function(callback) {
                this.alwaysCallback = callback;
                return this;
            },
            setHeaders: function(headers) {
                for(var name in headers) {
                    this.xhr && this.xhr.setRequestHeader(name, headers[name]);
                }
            }
        };

        return api.process(options);
    }
}



