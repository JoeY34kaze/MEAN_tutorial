import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PostListComponent } from './posts/post-list/post-list.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';

//route js object for which url for which our app should be presented
const routes : Routes = [
  {path: '', component: PostListComponent},//if localhost -> load component of type PostListComponent that we wrote before
  {path: 'create', component: PostCreateComponent},//if /create -> load createComponent
  {path: 'edit/:postId', component: PostCreateComponent}
];

@NgModule({
  imports:[RouterModule.forRoot(routes)],
  exports : [RouterModule]

})

export class AppRoutingModule{}
