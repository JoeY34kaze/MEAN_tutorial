import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { AuthData } from "./auth-data.model";
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: "root" })//to pomeni da providamo na root nivoju in lahko povsod injectamo
export class AuthService {
  private token: string;
  private userIsAuthenticated=false;
private authStatusListener = new Subject<boolean>();

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
    console.log("logged out")
    this.router.navigate(['/']);
  }

  login(email: string, password: string) {
    const authData: AuthData = {email: email, password: password};
    this.http.post<{token: string}>("http://localhost:3000/api/user/login", authData)
      .subscribe(response => {
        const token = response.token;
        console.log("received token : "+token);
        this.token = token;
        if(token){
          this.userIsAuthenticated=true;
          this.authStatusListener.next(true);
          this.router.navigate(['/']);
        }
      })
  }
}
