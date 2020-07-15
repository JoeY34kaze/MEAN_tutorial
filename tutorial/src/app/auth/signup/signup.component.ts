import {Component} from "@angular/core";
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  //selector: 'app-login', //ker gre nekak prek routinga ga lahko omitas
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent {
  isLoading=false;

  constructor(private authService:AuthService){}


  onSignup(form :NgForm){
    //form.email, form.password
    if(form.invalid)return;

    this.authService.createUser(form.value.email, form.value.password);
  }

}
