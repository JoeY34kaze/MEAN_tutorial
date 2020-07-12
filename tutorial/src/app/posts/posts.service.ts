import {Post} from './post.model';
import { Injectable } from '@angular/core';
import {Subject} from 'rxjs'; //ubistvu evenr emitter

@Injectable({providedIn: 'root'})
export class PostsService{
  private posts : Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  getPosts(){
    if(this.posts.length>0)
      return [...this.posts]; //notacija [...X] naredi novo kopijo X-a sicer bi samo poslal referenco.
  }

  getPostUpdateListener(){
    return this.postsUpdated.asObservable();//mislm da loh tega sedaj samo poslusamo
  }

  addPost(title : string , content : string){
    const p:Post = {title : title,content : content};
    this.posts.push(p);
    this.postsUpdated.next([...this.posts]);//event k spremenimo.
  }
}
