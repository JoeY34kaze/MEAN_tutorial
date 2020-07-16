import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { AuthData } from "./auth-data.model";
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { time } from 'console';

@Injectable({ providedIn: "root" })//to pomeni da providamo na root nivoju in lahko povsod injectamo
export class AuthService {
  private token: string;
  private userIsAuthenticated=false;
  private authStatusListener = new Subject<boolean>();
  private tokenTimer : NodeJS.Timer;

  constructor(private http: HttpClient, private router : Router) {}

  getAuthStatusListener(){
    return this.authStatusListener.asObservable();//z drugje lahko poslusamo nemormo pa posiljat, samo s tukaj lahko posiljamo
  }

  getToken() {
    return this.token;
  }

  getIsAuth(){
    return this.userIsAuthenticated;
  }

  createUser(email: string, password: string) {
    const authData: AuthData = {email: email, password: password};
    this.http.post("http://localhost:3000/api/user/signup", authData)
      .subscribe(response => {
        console.log(response);
      });
  }

  logout(){
    this.token=null;
    this.userIsAuthenticated=false;
    this.authStatusListener.next(false);
    this.clearAuthData();
    console.log("logged out")
    clearTimeout(this.tokenTimer);
    this.router.navigate(['/']);
  }

  login(email: string, password: string) {
    const authData: AuthData = {email: email, password: password};
    this.http.post<{token: string, time:number}>("http://localhost:3000/api/user/login", authData)
      .subscribe(response => {
        const token = response.token;
        console.log("received token : "+token);
        this.token = token;
        if(token){
          this.start_token_timer(response.time);
          const now = new Date();
          this.saveAuthData(token, new Date(now.getTime()+response.time*1000))
          this.userIsAuthenticated=true;
          this.authStatusListener.next(true);
          this.router.navigate(['/']);
        }
      })

  }

  private saveAuthData(token : string, expirationDate: Date){
    localStorage.setItem('token',token);
    localStorage.setItem('expiration',expirationDate.toISOString());
  }

  private clearAuthData(){
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  private start_token_timer(remaining_time:number){
    this.tokenTimer=setTimeout(()=>{this.logout()},remaining_time*1000);
  }

  autoAuthUser(){
    const authInfo = this.getAuthData();
    if(!authInfo)return;
    const now = new Date();
    const expiresIn = authInfo.epirationDate.getTime()-now.getTime();
    if(expiresIn>0){
      this.token = authInfo.token;
      this.userIsAuthenticated=true;
      this.start_token_timer(expiresIn/1000);
      this.authStatusListener.next(true);
    }
  }

  private getAuthData(){
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    if(token && expirationDate){
      return{token:token, epirationDate:new Date(expirationDate)};
    }return{};
  }
}
