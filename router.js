'use strict';
const objProto = Object.prototype;
class Router {
    constructor() {};

    static renderDefault(response) {
        response.writeHead(200, {
            "Content-Type": "text/html;charset=UTF-8"
        }); 
        response.write("Hello，欢迎使用PureNode中间层服务器.");
        response.end();
    }

    static renderNotFound(response) {
        response.writeHead(404, {
            "Content-Type": "text/html"
        }); 
        response.write("404 Not found. <br>");
        response.write("<hr>api.company.com");
        response.end();
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

        if (mapping == '' || mapping == '/') {
            Router.renderDefault(response);
        } else if (objProto.toString.call(controller[mapping]) === '[object Function]') {
            controller[mapping](request, response);
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
            '/helloworld': ['helloworld', {'type': 'html'}],
            '/api/users': ['getUsers', {'type': 'json', 'encoding': 'utf-8'}],
            '/api/video': ['getVideo', {'type': 'json', 'encoding': 'utf-8'}]
        });
    };
}

module.exports = Router;
