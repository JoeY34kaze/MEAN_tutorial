import {Component, EventEmitter, Output} from '@angular/core'
import {Post} from '../post.model';
@Component({
  selector : 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent{


  enteredContent='';
  enteredTitle='';
  @Output() postCreated = new EventEmitter<Post>();//@Output deklarira ta event kot event kterga lahko poslusas od zunaj (samo od direktnega starsa!!! app.component.html)

  onAddPost(){
    const post: Post = {
      title: this.enteredTitle ,
      content : this.enteredContent
    }
    this.postCreated.emit(post);
  }

}
