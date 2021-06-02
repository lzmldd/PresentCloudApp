import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import axios from 'axios';
import axiosAdapterUniapp from 'axios-adapter-uniapp'
// @Injectable({providedIn: 'root'})
// export class ServiceNameService {
//   constructor(private httpClient: HttpClient) { }
  
// }
@Injectable({
  providedIn: 'root'
})
export class HttpServiceService {

  constructor(
    // public http: HttpClient,
    public router: Router,
    public alertController: AlertController,
    public toastController: ToastController,
    ) {
  }

  //axios方法
  // commonUrl = 'http://www.sunago.top'; 
  commonUrl = "/api";
  
  setToken() {
    //请求拦截器 头部设置token
    axios.interceptors.request.use((config) => {
      if (localStorage.getItem("token")) {
        config.headers['Authorization'] = localStorage.getItem("token");
        // config.headers['Content-Type'] = 'application/json';
      }
      console.log(config)
      return config;
    }, (error) => {
      return Promise.reject(error);
    });
    //响应拦截器
    axios.interceptors.response.use((success) => {
      console.log(success)
      if (success.status==500)
      {
        this.presentToast('服务器错误')
      } else if (success.data.code == 404) {
        this.presentToast('找不到你想要的页面！')
      }else if (success.data.code == 403) {
        this.presentToast('权限不足，请联系管理员！')
        this.router.navigateByUrl('/home-tabs/mylesson');
      }else{
        console.log(success.data)
      }
      if (success.status == 200)
        return success;
      else 
        this.presentToast('未知错误')
    }, (error) => {
      Promise.reject(error);
    });
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  //获取
  get(api, params) {
    
    return new Promise((resolve, reject) => {
      this.setToken();
      axios({
        method: 'get',
        url: this.commonUrl + api,
        params:params,
      }).then(function (response) {
        resolve(response);
      })
        .catch(function (error) {
          reject(error);
        })
    })
    
  }
  //获取（不携带参数）
  getAll(api) {
     return new Promise((resolve, reject) => {
      this.setToken();
      axios({
        // headers: {
        //   'Content-Type': 'application/json'
        // },
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
        // headers: {
        //   'Content-Type': 'application/json'
        // },
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
        // headers: {
        //   'Content-Type': 'x-www-form-urlencoded '
        // },
      }).then(function (response) {
        resolve(response);
      })
        .catch(function (error) {
          reject(error);
        });
    })
  }

  putAll(api) {
    this.setToken();
    return new Promise((resolve, reject) => {
      axios({
        method: 'put',
        url: this.commonUrl + api,
        // data: params,
        headers: {
          'Content-Type': 'x-www-form-urlencoded '
        },
      }).then(function (response) {
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
  //删除
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
  deleteAll(api) {
    return new Promise((resolve, reject) => {
      this.setToken();
      axios({
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'delete',
        url: this.commonUrl + api,
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
  

}
