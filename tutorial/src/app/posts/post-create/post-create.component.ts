import {Component, OnInit} from '@angular/core'
import { NgForm } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
@Component({
  selector : 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit{
  enteredContent='';
  enteredTitle='';
  private mode = 'create';
  private postId:string;
  post:Post; //nesme bit private ker dostopamo z postcreate.html

  constructor(public postsService: PostsService, public route : ActivatedRoute){}

  ngOnInit(): void {
    //ker pri kreaciji in pri editanju posta uporabljamo isto angular componento moramo nekak ugotovit kje se nahajamo po url. here is where we do this.
    this.route.paramMap.subscribe((paramMap : ParamMap)=>{
      if(paramMap.has('postId')){
        this.mode='edit';
        this.postId = paramMap.get('postId');
        this.postsService.getPost(this.postId).subscribe(postData =>{
          this.post = {id:postData._id, title:postData.title, content : postData.content};
        });
      }else{
        this.mode='create';
        this.postId=null;
      }
    });//nerabmo unsubscribe lekcija 66

  }




  onSavePost(form : NgForm){
    if(!form.valid)return;

    if(this.mode==='create'){
      this.postsService.addPost(form.value.title,form.value.content);
    }else{
      this.postsService.updatePost(this.postId, form.value.title, form.value.content);
    }
    form.resetForm();
  }

}
