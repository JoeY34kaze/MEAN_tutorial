import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';



@Injectable({providedIn:"root"})//we are providing it on root level! kar pomen da jo lahko drugje direkt injectamo
export class AuthService{

  constructor(private http:HttpClient){}

  createUser(email:string, password:string){
    const authData:AuthData={email:email, password:password};
    this.http.post<{data:any}>('http://localhost:3000/api/user/signup',authData).subscribe(
      (response)=>{
          console.log(response);
      }
    );
  }

}
