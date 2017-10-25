'use strict';
const Service  = require('./service');
const Template = require('./template');
const url = require('url');

class Controller {
    constructor(service, rules) {
        this.rules = rules || {/* '/helloworld': ['helloworld', {'type': 'html'}], ... */};
        this.template = Template; 
        console.log('[Controller>constructor]:[this]', this);
        this.service = service || new Service();
    }
  
    index(request, response, render) {
        let data = this.template.test({test: 'index', greeting: 'Hi, Welcome!'});
        return render(data, null);
    }

    test(request, response, render) {
        let test = 'TEST';
        let data = this.template.test({test: test, greeting: 'Hi,'});
        return render(data, null);
    }

    helloworld(request, response, render) {
        let params = url.parse(request.url, true).query;
        console.log('[Controller>helloworld]:[params]', params);
        let name = params.name || 'PCW developer';
        let renderTool = function() {
          response.end(this.template.helloworld.replace(/\{\{([.:a-z0-9_ ]+?)user([.:a-z0-9_ ]+?)\}\}/g, name));
        }; 
        // complie template width data
        console.log(this.template); 
        return render(null, renderTool);
    }

    getUsers (request, response, render) {
        let params = null;
        let userInfo; 
        let self = this;

        // three method for invoke
        
        // 1. use promise only
        /*
        this.service.getUserInfo(params, (data) => {
            console.log('[Controller>getUsers]:[data]', data);
            userInfo = data;
            return render(JSON.stringify(userInfo), null);
        });
        */
        
        // 2. use generator with promise
        /*
        function* callAsync() {
            yield self.service.getUserInfo(params);
        }
        let asyncInvoke = callAsync();
        asyncInvoke.next().value.then(function(data) {
            return render(data, null);
        });
        */

        // 3. use async and await
        async function callAsync() {
            let data = await self.service.getUserInfo(params);
            return render(data, null);
        }
        callAsync();
    }

    getVideo (request, response, render) {
        let query = url.parse(request.url, true).query;
        console.log('[Controller>getVideo]:[query]', query);
        let entityId = query.entityId || 597436100;
        let params = { entityId: entityId };
        this.service.getVideo(params, (data) => {
            console.log('[Controller>getVideo]:[data]', data);
            return render(JSON.stringify(data), null);
        });
    }
}

module.exports = Controller;
