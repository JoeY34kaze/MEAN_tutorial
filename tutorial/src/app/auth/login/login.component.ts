import {Component} from "@angular/core";
import { NgForm } from '@angular/forms';

@Component({
  //selector: 'app-login', //ker gre nekak prek routinga ga lahko omitas
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  isLoading=false;

  onLogin(form :NgForm){
    //form.email, form.password
  }

}
