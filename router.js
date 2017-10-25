'use strict';
const objProto = Object.prototype;
const arrProto = Array.prototype;
const ENCODING = 'utf-8';
const RESULT_TYPES = {
    'json': {
        contentType: 'application/json'
     },
    'html': {
        contentType: 'text/html'
    }
};
class Router {
    constructor() {};

    static renderDefault(response) {
        response.writeHead(200, {
            "Content-Type": "text/html;charset=UTF-8"
        }); 
        response.write("Hello，NodeJS服务器.");
        response.end();
    }

    static renderNotFound(response) {
        response.writeHead(404, {
            "Content-Type": "text/html"
        }); 
        response.write("404 Not found. <br>");
        response.write("<hr>api.hello.com");
        response.end();
    }

    static doResponse(data, render, request, response, methodName) {
        try {
            // the context is current controller
            let routerMap = this.rules[methodName];
            let routerMapConfig = Array.isArray(routerMap) ? routerMap[1] : {}; 
            let type = routerMapConfig.type || 'html';
            let resultType = RESULT_TYPES[type];
            let contentType = resultType.contentType + ';charset=' + (routerMapConfig.encoding || ENCODING);
            console.log('[Controller>doResponse]:[routerMap][contentType]', routerMap, contentType);
            render = render || function() {
                response.writeHead(200, {
                    'Content-Type': contentType, 
                    'ServerName': 'PCWeb NML' 
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



    static doRequest(controllers, mapping, request, response) {
        console.log('[Router>doRequest]:[mapping]' + mapping);
        let controller;
        for (controller of controllers) {
            if (controllers[mapping]) {
                controller = controllers[mapping];
                break;
            }
        }

        function _render() {
            let args = arrProto.slice.call(arguments, 0).concat([request, response, mapping]);
            Router.doResponse.apply(controller, args);
        }

        if (mapping == '' || mapping == '/') {
            Router.renderDefault(response);
        } else if (objProto.toString.call(controller[mapping]) === '[object Function]') {
            controller[mapping](request, response, _render);
        } else {
            console.log("[Router>renderNotFound]:[No request controller found for mapping]" + mapping);
            Router.renderNotFound(response);
        }
    };

    static dispatch(contorller, mapping) {
        let key;
        for(let item in mapping) {
            key = mapping[item];
            key = Array.isArray(key) ? key[0] : key;
            contorller.rules['' + key] = mapping[item];
            if (Array.isArray(mapping[item])) {
                mapping[item] = mapping[item][0];
            }
        };
        return mapping;
    }

    static getMapping(controller) {
        return Router.dispatch(controller, {
            '/': 'index',
            '/test': 'test',
            '/test2': ['test', {'type': 'json'}],
            '/helloworld': ['helloworld', {'type': 'html'}],
            '/api/users': ['getUsers', {'type': 'json', 'encoding': 'utf-8'}],
            '/api/video': ['getVideo', {'type': 'json', 'encoding': 'utf-8'}]
        });
    };
}

module.exports = Router;
