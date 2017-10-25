'use strict';
const Dao = require('./dao');

// Model基类，用于数据模型的处理，service调用它来处理业务数据
class Model {
   constructor() {
   }
   valueOf() {
      return JSON.stringify(this);
   }
}
// 业务模型，对于input尤其是output的数据，稍复杂的对象需要提前构建模型
class User extends Model {
    constructor(user) {
        super(user);
        Object.assign(this, user);
        console.log('[User>constructor]:[user]', user);
    }
    // protected method
    setDate(date) {
        this.date = date;
    }
    echoName() {
        console.log(this.name);
    }
}
class Service {
    constructor(dao) {
        this.users = new Set();
        this.dao = dao || new Dao();
    }

    setUsers(arr) {
        // covert params to users Set;
        arr.map(item => {
            this.users.add(new User(item));
        });
        console.log('[Service>setUsers]:[arr][this.users]', arr, this.users);
    }

    processUsers() {
        // modify users data;
        if (this.users) {
            this.users.forEach((user) => {
                user.setDate(user.date || new Date().toString());
                user.echoName();
           });
        }
        console.log('[Service>processUsers]:[this.users]', this.users);
    }

    getUserInfo(params, callback) {
        let result = {};
        let userInfoResult = this.dao.getUserInfo(params);
        userInfoResult.then((data) => {
            if (data) {
                data = JSON.parse(data);
                this.setUsers(data.data);
                this.processUsers();
                result.code = 'success';
                result.data = Array.from(this.users);
                callback.call(this, result);
            }
        }, (reason) => {
            result.code = 'error';
            result.data = reason;
            console.log('[Service>getUserInfo]:[reject]', reason);
            callback.call(this, result);
        }).catch((error) => {
            result.code = 'error';
            console.log('[Service>getUserInfo]:[error]', error);
            callback.call(this, error);
        }); 
        return userInfoResult;
    }

    getVideo(params, callback) {
        let result = {};
        let userInfoResult = this.dao.getVideo(params);
        userInfoResult.then((data) => {
            if (data) {
                console.log('resolve done:', data.length);
                result.code = 'success';
                result.data = JSON.parse(data);
                callback.call(this, result);
            }
        }, (reason) => {
            result.code = 'error';
            result.data = reason;
            callback.call(this, result);
            console.log('[Service>getVideo]:[reject]', reason);
        }).catch((error) => {
            result.code = 'error';
            callback.call(this, error);
            console.log('[Service>getVideo]:[error]', error);
        });
        return userInfoResult;
    }

}
module.exports = Service;
