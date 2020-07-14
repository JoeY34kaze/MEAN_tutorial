import {Component, Input, OnInit, OnDestroy} from '@angular/core'
import { Post } from "../post.model";
import { PostsService } from '../posts.service';
import {Subscription} from 'rxjs';

@Component({
  selector : 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls : ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy{
  posts: Post[] = [];
  private postsSub : Subscription;
  isLoading=false;
  constructor(public postsService: PostsService){}

  ngOnInit(){
    this.isLoading=true;
    this.postsService.getPosts();//on init sedaj nrdi https request in ob responsu ker smo subscribani se updejta.
    //setup a listener to the subject to service
    //this.postsSub je zato da se unici subscription ko ta class ni vec dela DOM-a. sicer se subscription ne zbrise in imame memory leak
    this.postsSub = this.postsService.getPostUpdateListener().subscribe(
      (posts : Post[])=>{
        this.isLoading=false;
        this.posts = posts;
      }
      );//3 mozni argumenti ( function when new data emitted ,  function on error,  function when observable is completed/ when no more possible posts(to nebo nkol)  )
  }

  onDelete(id : string){
    console.log("deleting in component..");
    this.postsService.deletePost(id);
  }

  ngOnDestroy(){//za memory leak prevention
    this.postsSub.unsubscribe();
  }
}
