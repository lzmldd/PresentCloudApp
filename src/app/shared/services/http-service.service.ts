import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import axios from 'axios';
@Injectable({providedIn: 'root'})
export class ServiceNameService {
  constructor(private httpClient: HttpClient) { }
  
}
@Injectable({
  providedIn: 'root'
})
export class HttpServiceService {

  constructor(public http: HttpClient,
    
    ) {
  }

  //axios方法
  commonUrl = 'http://172.17.174.174:8888';
  // commonUrl = 'http://fy7u76.natappfree.cc';
  // instance = axios.create({
  //   headers: { 'token': localStorage.getItem("token") }
  // });
  //获取
  get(api, params) {
    
    return new Promise((resolve, reject) => {
      this.setToken();
      axios.interceptors.request.use((config) => {
        if (localStorage.getItem("token")) {
          config.headers['token']=localStorage.getItem("token");
        }
        console.log(this.commonUrl);
        return config;
      },(error) =>{
        console.log('错误参数')
        return Promise.reject(error);
      });
      
      axios.get(this.commonUrl + api, {
        params:params,
      }).then(function (response) {
        console.log('a')
        resolve(response);
      })
        .catch(function (error) {
          console.log('b')
          reject(error);
        })
    })
  }
  //获取（不携带参数）
  getAll(api) {
    return new Promise((resolve, reject) => {
      this.setToken();
      axios({
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'get',
        url: this.commonUrl + api
      }).then(function (response) {
        resolve(response);
      })
        .catch(function (error) {
          reject(error);
        })
    })
  }
  //新增
  post(api, params) {
    return new Promise((resolve, reject) => {
      this.setToken();
      axios({
        method: 'post',
        url: this.commonUrl + api,
        data: params,
        headers: {
          'Content-Type': 'application/json'
        },
      }).then(function (response) {
        resolve(response);
      })
        .catch(function (error) {
          reject(error);
        });
    })
  }

  postAll(api) {
    return new Promise((resolve, reject) => {
      this.setToken();
      axios({
        method: 'post',
        url: this.commonUrl + api
      }).then(function (response) {
        resolve(response);
      })
        .catch(function (error) {
          reject(error);
        });
    })
  }

  put(api, params) {
    this.setToken();
    return new Promise((resolve, reject) => {
      axios({
        method: 'put',
        url: this.commonUrl + api,
        data: params,
      }).then(function (response) {
        // console.log(response);
        resolve(response);
      })
        .catch(function (error) {
          reject(error);
        });
    })
  }
  //编辑
  patch(api, params) {
    return new Promise((resolve, reject) => {
      this.setToken();
      axios({
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'patch',
        url: this.commonUrl + api,
        data: params
      }).then(function (response) {
        resolve(response);
      })
        .catch(function (error) {
          reject(error);
        });
    })
  }
  //   //删除
  delete(api, params) {
    return new Promise((resolve, reject) => {
      this.setToken();
      axios({
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'delete',
        url: this.commonUrl + api,
        data: params
      }).then(function (response) {
        resolve(response);
      })
        .catch(function (error) {
          reject(error);
        })
    })
  }
  //设置同步
  runAfter(function1,function2){
    axios.all([function1])
    .then(axios.spread(function2))
  }
  setToken(){
    //拦截器 头部设置token
    axios.interceptors.request.use((config) => {
      // this.setToken();
     if (localStorage.getItem("token")) {
       config.headers['token']=localStorage.getItem("token");
     }
     return config;
   },(error) =>{
     console.log('错误参数')
     return Promise.reject(error);
   });
 }

}
