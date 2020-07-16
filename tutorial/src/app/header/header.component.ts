import {Component, OnInit, OnDestroy} from "@angular/core";
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit, OnDestroy {//subscribal bomo na observable za gledanje avtorizacije in ker je to nas subscription mormo porihtat tud onDestroy

  private authListenerSubs:Subscription;
  userIsAuthenticated=false;
  constructor(private authService : AuthService){};

  onLogout(){
    console.log("logging out")
    this.authService.logout();
  }

  ngOnInit(){
    this.userIsAuthenticated = this.authService.getIsAuth();//ker pri automatski avtorizaciji ki jo sprozimo iz appcpmponent se izvede preden se sploh nrdi header. rabmo iz headerja poklicat pa pogledat kaksno je dejansko stanje avtorizacije na zacetku
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe((isAuthenticated)=>{
      this.userIsAuthenticated=isAuthenticated;
    });
  }

  ngOnDestroy(){
    this.authListenerSubs.unsubscribe();
  }
}
