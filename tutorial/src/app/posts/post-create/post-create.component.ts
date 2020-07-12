import {Component, EventEmitter, Output} from '@angular/core'
import { NgForm } from '@angular/forms';
import { PostsService } from '../posts.service';
@Component({
  selector : 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent{

  constructor(public postsService: PostsService){}


  enteredContent='';
  enteredTitle='';


  onAddPost(form : NgForm){
    if(!form.valid)return;
    this.postsService.addPost(form.value.title,form.value.content);
  }

}
