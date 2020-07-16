import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PostListComponent } from './posts/post-list/post-list.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthGuard } from './auth/auth.guard';

//route js object for which url for which our app should be presented
const routes : Routes = [
  {path: '', component: PostListComponent, canActivate: [AuthGuard]},//if localhost -> load component of type PostListComponent that we wrote before
  {path: 'create', component: PostCreateComponent, canActivate: [AuthGuard]},//if /create -> load createComponent
  {path: 'edit/:postId', component: PostCreateComponent, canActivate: [AuthGuard]},
  {path: 'login', component:LoginComponent},
  {path: 'signup',component:SignupComponent}
];

@NgModule({
  imports:[RouterModule.forRoot(routes)],
  exports : [RouterModule],
  providers: [AuthGuard]

})

export class AppRoutingModule{}
