/*
    Copyright © 2015 Scott Flaherty

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/

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
        'use strict';

        if(typeof options === 'string') {
            options = { url: options };
        }

        options.url = options.url || '';
        options.method = options.method || 'get'
        options.data = options.data || {};

        var getFullUrl = function(data, url) {
            var parms = [];
            var queryString;

            for(var name in data) {
                if(data.hasOwnProperty(name)) {
                    parms.push(name + '=' + encodeURIComponent(data[name]));
                }
            }

            queryString = parms.join('&');

            if(queryString !== '') {
                return url ? (url.indexOf('?') < 0 ? '?' + queryString : '&' + queryString) : queryString;
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
                        if(self.xhr.readyState === 4 && self.xhr.status === 200) {
                            var result = self.xhr.responseText;

                            if(options.json === true && typeof JSON !== 'undefined') {
                                result = JSON.parse(result);
                            }

                            self.successCallback && self.successCallback.apply(self.host, [result, self.xhr]);
                        }
                        else if(self.xhr.readyState === 4) {
                            self.errorCallback && self.errorCallback.apply(self.host, [self.xhr]);
                        }

                        self.alwaysCallback && self.alwaysCallback.apply(self.host, [self.xhr]);
                    };
                }

                if(options.method === 'get') {
                    this.xhr.open("GET", options.url + getFullUrl(options.data, options.url), true);
                }
                else {
                    this.xhr.open(options.method, options.url, true);
                    this.setHeaders({
                        'X-Requested-With': 'XMLHttpRequest',
                        'Content-type': 'application/x-www-form-urlencoded'
                    });
                }

                if(options.headers && typeof options.headers === 'object') {
                    this.setHeaders(options.headers);
                }

                setTimeout(function() {
                    (options.method === 'get') ? self.xhr.send() : self.xhr.send(getFullUrl(options.data));
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
                    if(headers.hasOwnProperty(name)) {
                        this.xhr && this.xhr.setRequestHeader(name, headers[name]);
                    }
                }
            }
        };

        return api.process(options);
    }
};



