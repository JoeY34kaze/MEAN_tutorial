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
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe((isAuthenticated)=>{
      this.userIsAuthenticated=isAuthenticated;
    });
  }

  ngOnDestroy(){
    this.authListenerSubs.unsubscribe();
  }
}
