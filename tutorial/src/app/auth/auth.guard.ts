import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import {Observable} from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate{

  constructor(private authService : AuthService, private router : Router){}

  canActivate(
    route: ActivatedRouteSnapshot,
     state: RouterStateSnapshot
     ):
      boolean |
      Observable<boolean> |
      Promise<boolean>
    {
      const isAuth = this.authService.getIsAuth();//this is updated when we log in or out so we can rely on this being current
      if(!isAuth){
        this.router.navigate(['/login']);
      }

      return isAuth;
    //if we return true -> router will go there else not there-> redirect him away somewhere


  }
//angular adds interfaces which this class impolements which forces angular routers to check the routes on whether it should proceed or not

}
