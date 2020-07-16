import {Component} from "@angular/core";
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  //selector: 'app-login', //ker gre nekak prek routinga ga lahko omitas
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  isLoading=false;

  constructor(private authService:AuthService){}

  onLogin(form :NgForm){
    //form.email, form.password
    if(form.valid){
      this.authService.login(form.value.email, form.value.password);
    }
  }

}
