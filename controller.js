'use strict';
const Service  = require('./service');
const Template = require('./template');
const url = require('url');
const ENCODING = 'utf-8';
const RESULT_TYPES = {
    'json': {
        contentType: 'application/json'
     },
    'html': {
        contentType: 'text/html'
    }
};
class Controller {
    constructor(service, rules) {
        this.rules = rules || {};
        this.template = Template; 
        console.log('[Controller>constructor]:[this]', this);
        this.service = service || new Service();
    }
  
    doResponse(request, response, data, render, methodName) {
        try {
            let routerMap = this.rules[methodName];
            let routerMapConfig = Array.isArray(routerMap) ? routerMap[1] : {}; 
            let type = routerMapConfig.type || 'html';
            let resultType = RESULT_TYPES[type];
            let contentType = resultType.contentType + ';charset=' + (routerMapConfig.encoding || ENCODING);
            console.log('[Controller>doResponse]:[routerMap][contentType]', routerMap, contentType);
            render = render || function() {
                response.writeHead(200, {
                    'Content-Type': contentType, 
                    'ServerName': 'NML' 
                });
                response.end(data);
            };

            request.addListener('data', (data) => {
                console.log('input data:', data); 	
            }); 

            request.addListener('end', () => {
                render.call(this);
            });

        } catch (ex) {
            console.log('[Controller>doResponse]:[error]', ex);
        }
    }

    index(request, response) {
        const __name__ = 'index';
        let data = this.template.test({test: 'index', greeting: 'Hi, Welcome!'});
        return this.doResponse(request, response, data, null, __name__);
    }

    test(request, response) {
        const __name__ = 'test';
        let test = 'TEST';
        let data = this.template.test({test: test, greeting: 'Hi,'});
        return this.doResponse(request, response, data, null, __name__);
    }

    helloworld(request, response) {
        const __name__ = 'helloworld';
        let params = url.parse(request.url, true).query;
        console.log('[Controller>helloworld]:[params]', params);
        let name = params.name || 'Node developer';
        let render = function() {
          response.end(this.template.helloworld.replace(/\{\{([.:a-z0-9_ ]+?)user([.:a-z0-9_ ]+?)\}\}/g, name));
        }; 
        // complie template width data
        console.log(this.template); 
        return this.doResponse(request, response, null, render, __name__);
    }

    getUsers (request, response) {
        const __name__ = 'getUsers';
        let params = null;
        let userInfo; 
        this.service.getUserInfo(params, (data) => {
            console.log('[Controller>getUsers]:[data]', data);
            userInfo = data;
            this.doResponse(request, response, JSON.stringify(userInfo), null, __name__);
        });

        /* using generator
        function asyncRequest() {
            userInfo = this.service.getUserInfo(params);
            asyncInvoke.next();
        }
        function* callAsync() {
            yield asyncRequest(); 
            return this.doResponse(request, response, userInfo, null, __name__);
        }
        let asyncInvoke = callAsync().next();
        */
        }

    getVideo (request, response) {
        const __name__ = 'getVideo';
        let query = url.parse(request.url, true).query;
        console.log('[Controller>getVideo]:[query]', query);
        let entityId = query.entityId;
        let params = { entityId: entityId };
        this.service.getVideo(params, (data) => {
            console.log(']Controller>getVideo]:[data]', data);
            this.doResponse(request, response, JSON.stringify(data), null, __name__);
        });
    }
}

module.exports = Controller;
