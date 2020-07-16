import {Component, OnInit, OnDestroy} from "@angular/core";
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  //selector: 'app-login', //ker gre nekak prek routinga ga lahko omitas
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit , OnDestroy{
  isLoading=false;
  private authStatusSub:Subscription;

  constructor(private authService:AuthService){}

  ngOnInit(){
    this.authStatusSub= this.authService.getAuthStatusListener().subscribe(
      authStatus =>{
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy(){
    this.authStatusSub.unsubscribe();
  }

  onSignup(form :NgForm){
    //form.email, form.password
    if(form.invalid)return;

    this.isLoading=true;
    this.authService.createUser(form.value.email, form.value.password);
  }

}
