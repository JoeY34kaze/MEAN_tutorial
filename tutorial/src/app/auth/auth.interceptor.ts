import { HttpInterceptor, HttpRequest, HttpHandler } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';


@Injectable()//injectal bomo na drugacen nacin kot druge ker je interceptor mal drugacen? video 105
export class AuthInterceptor implements HttpInterceptor{//interceptor dela to kar je mislen. ujame outgoing http request in mu nalima jwt gor. in poslje naprej po izvajanju

  constructor(private authService : AuthService){}
  intercept(req:HttpRequest<any>  ,  next: HttpHandler){
    console.log("intercepted a http request! adding jwt token to header.");
    const authToken = this.authService.getToken();
    const authRequest = req.clone({
      headers : req.headers.set('Authorization', "Bearer "+authToken)//set ubistvu doda zravn, ce obstaja ga pa povozi. tkole nalimamo nas token na outgoing http request
    });
    return next.handle(authRequest);
  }

}
