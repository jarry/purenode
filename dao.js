'use strict';
const http = require('http');
const querystring = require('querystring');
const arrProto = Array.prototype;
const config = {
    'authHost': 'auth.hello.com',
    'dataHost': 'data.hello.com'
};
class Dao {

   httpInvoke(method, postData, options) {
      options = Object.assign({
          hostname: '',
          port: 80,
          path: '',
          method: method || 'POST',
          encoding: 'utf8'
        }, options);
        return new Promise((resolve, reject) => {
            let requestObj = typeof (postData) == 'string' ? postData: options;
            let chrunks = [];
            console.log('httpInvoke->requestObj:', requestObj);
            let req = http.request(requestObj, (response) => {
                response.on('data', (chrunk) => {
                    chrunks.push(chrunk);
                });
                response.on('end', () => {
                   let result = Buffer.concat(chrunks).toString(options.encoding);
                   console.log('httpInvokte success:', result);
                   resolve(result);
                });
            }).on('error', (error) => {
                console.log('httpInvokte error:', error);
                reject(error);
            });

            req.write(postData);
            req.end();

        });
    }

    httpGet(url, options) {
        return this.httpInvoke('GET', url, options);
    }

    httpPost(postData, options) {
        options = Object.assign({
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': postData.length
            }
        }, options);
        return this.httpInvoke('POST', querystring.stringify(postData), options);
    }

    getUserInfo(params) {
        let path = '/auth-api/services/user/resources'
        params = params || { uid: 400000020, appName: 'lequ' };
        // let url = 'http://auth.hello.com/auth-api/user/resources?uid=400000020&appName=pigeon';
        let url = 'http://' + config.authHost + path + '?'+ querystring.stringify(params); 
        console.log('request url:', url);
        return this.httpGet(url);
    }

    getVideo(params) {
        let path = '/int/entity/nocache'
        params = params || { uid: 400000020, appName: 'lequ', entityId: 597436100 };
        // let url = http://data.hello.com/entity/597436100.json
        let url = 'http://' + config.dataHost + path + '/' + params.entityId + '.json'; 
        console.log('request url:', url);
        return this.httpGet(url);
    }
}

module.exports = Dao;
