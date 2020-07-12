import {Component, EventEmitter, Output} from '@angular/core'
import {Post} from '../post.model';
import { NgForm } from '@angular/forms';
@Component({
  selector : 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent{


  enteredContent='';
  enteredTitle='';
  @Output() postCreated = new EventEmitter<Post>();//@Output deklarira ta event kot event kterga lahko poslusas od zunaj (samo od direktnega starsa!!! app.component.html)

  onAddPost(form : NgForm){
    if(!form.valid)return;
    const post: Post = {
      title: form.value.title ,
      content : form.value.content
    }
    this.postCreated.emit(post);
  }

}
