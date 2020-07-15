import {Component, Input, OnInit, OnDestroy} from '@angular/core'
import { Post } from "../post.model";
import { PostsService } from '../posts.service';
import {Subscription} from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector : 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls : ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy{
  posts: Post[] = [];
  private postsSub : Subscription;
  isLoading=false;
  totalPosts=0;
  postsPerPage=2;
  pageSizeOptions = [1,2,5,10]
  currentPage=1;
  constructor(public postsService: PostsService){}

  ngOnInit(){
    this.isLoading=true;
    this.postsService.getPosts(this.postsPerPage,1);//on init sedaj nrdi https request in ob responsu ker smo subscribani se updejta.
    //setup a listener to the subject to service
    //this.postsSub je zato da se unici subscription ko ta class ni vec dela DOM-a. sicer se subscription ne zbrise in imame memory leak
    this.postsSub = this.postsService.getPostUpdateListener().subscribe(
      (postData : {posts: Post[], postCount: number})=>{
        this.isLoading=false;
        this.posts = postData.posts;
        this.totalPosts=postData.postCount;
      }
      );//3 mozni argumenti ( function when new data emitted ,  function on error,  function when observable is completed/ when no more possible posts(to nebo nkol)  )
  }

  onChangedPage(event:PageEvent){
    //event ima podatke o trenutnem page-u
    /*
    length
    pageIndex
    pageSize
    previousPageIndex
    */
    this.isLoading=true;//spinner
    this.postsPerPage=event.pageSize;
    this.currentPage= event.pageIndex+1;//+1 zato ker smo retardi in stejemo na backendu z 1 anprej.
    this.postsService.getPosts(this.postsPerPage,this.currentPage);

  }

  onDelete(id : string){
    this.isLoading=true;
    this.postsService.deletePost(id).subscribe(()=>{
      this.postsService.getPosts(this.postsPerPage,this.currentPage); //video 92
    });
  }

  ngOnDestroy(){//za memory leak prevention
    this.postsSub.unsubscribe();
  }
}
