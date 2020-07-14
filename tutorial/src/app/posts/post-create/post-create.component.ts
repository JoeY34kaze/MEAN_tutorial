import {Component, OnInit} from '@angular/core'
import { FormGroup, FormControl, Validators } from '@angular/forms';
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
  isLoading=false;
  post:Post; //nesme bit private ker dostopamo z postcreate.html
  form : FormGroup;//groups all controlls of a form

  constructor(public postsService: PostsService, public route : ActivatedRoute){}

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),//single control in a  form
      content: new FormControl(null, {validators: [Validators.required, Validators.minLength(1)]}),
      image : new FormControl(null, {validators:[Validators.required]})
    });
    //ker pri kreaciji in pri editanju posta uporabljamo isto angular componento moramo nekak ugotovit kje se nahajamo po url. here is where we do this.
    this.route.paramMap.subscribe((paramMap : ParamMap)=>{
      if(paramMap.has('postId')){
        this.mode='edit';
        this.postId = paramMap.get('postId');
        this.isLoading=true;
        //show spinner
        this.postsService.getPost(this.postId).subscribe(postData =>{
          //hide spinner
          this.isLoading=false;
          this.post = {
            id:postData._id, title:postData.title,
            content : postData.content
          };
          this.form.setValue({
            'title': this.post.title,
            'content': this.post.content
          });
        });
      }else{
        this.mode='create';
        this.postId=null;
      }
    });//nerabmo unsubscribe lekcija 66

  }




  onSavePost(){
    if(!this.form.valid)return;
    this.isLoading=true;
    if(this.mode==='create'){
      this.postsService.addPost(this.form.value.title,this.form.value.content);
    }else{
      this.postsService.updatePost(this.postId, this.form.value.title, this.form.value.content);
    }
    this.form.reset();
  }

  onImagePicked(event : Event){
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image : file});//targets single control
    this.form.get('image').updateValueAndValidity();//updejtej kar smo zamenjal in poglej če je vse valid zdej
  }

}
