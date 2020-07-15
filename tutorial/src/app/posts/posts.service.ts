import {Post} from './post.model';
import { Injectable } from '@angular/core';
import {Subject} from 'rxjs'; //ubistvu evenr emitter
import { HttpClient } from "@angular/common/http";
import {map} from 'rxjs/operators'
import { Router } from '@angular/router';


@Injectable({providedIn: 'root'})
export class PostsService{
  private posts : Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router:Router){}//tkole smo injectal http clienta da ga lahko uporablamo. modul za http smo prej nastimal v app.module.ts
  //private keyword v konstruktorju je zelo pomemben ker ga na ta nacin ubistvu pripnemo na class

  getPost(id:string)
  {
    return this.http.get<{_id:string, title:string, content:string}>('http://localhost:3000/api/post/'+id);
  }

  getPosts(){//nrdil bomo http request. lahko bo nrdil direkt u list-post ampak je bols da je centraliziran u service

    this.http.get<{message :string , posts : any}>('http://localhost:3000/api/post')//to en nrdi se nic ker rabmo observables zarad angularja
      .pipe(map((postData)=>{
        return postData.posts.map(post =>{//tole je samo da transformiramo field _id na id. lahko bi popravli v modelu ampak je za vajo nrjeno tkole.
          return {
            title : post.title,
            content : post.content,
            id: post._id,
            imagePath : post.imagePath//z serverja bi mogl bit tkole.
          };
        });
      }))
      .subscribe(
        (transformedPosts)=>{
          this.posts = transformedPosts;
          this.postsUpdated.next([...this.posts]);
        },
        ()=>{console.log("there was an error!");}
      );//sedaj bo kul. also nerabmo skrbet za unicenje ker za http in druge module ki so direktno u angularju se to pohandla avtomatsko



    //tole je lokalno blo dokler nismo zrihtal http requesta.!
    //return [...this.posts]; //notacija [...X] naredi novo kopijo X-a sicer bi samo poslal referenco.
  }

  getPostUpdateListener(){
    return this.postsUpdated.asObservable();//mislm da loh tega sedaj samo poslusamo
  }

  addPost(title : string , content : string, image : File){
    const postData = new FormData();//allows us to combine text data and blob. blob = file
    postData.append("title",title);
    postData.append("content",content);
    postData.append("image",image, title);//mora bit image zarad backenda kjer smo nastavli. title -> name of image
    this.http.post<{message : String , post : Post}>('http://localhost:3000/api/post',postData).subscribe(
      (responseData)=>{
        const post :Post={
          id : responseData.post.id,
          title : responseData.post.title,
          content : responseData.post.content,
          imagePath : responseData.post.imagePath
        };
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);//event k spremenimo.
        this.router.navigate(["/"]);//po dodajanju ga redirectej na /

      });
  }

  updatePost(id:string, title:string, content:string, file:File){
    const post : Post = {id:id, title:title, content:content, imagePath:null}
    this.http.put<{message : String , postId : String}>('http://localhost:3000/api/post/'+id,post).subscribe(
      ()=>{
        var post:Post;
        const updatedPosts=[...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p=>p.id===id);
        updatedPosts[oldPostIndex] = post;
        this.posts=updatedPosts;
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(["/"]);//po dodajanju ga redirectej na /
      });
  }

  deletePost(id : string){
    console.log("sending delete http request in service..");
    this.http.delete<{message:String}>('http://localhost:3000/api/post/'+id).subscribe(
      (responseData)=>{
          console.log("received result of deleted post on server: "+responseData.message);
          const postsUpdated = this.posts.filter(post=>post.id!==id);//returns a subset of posts based on the function that is passed as parameter that will be executed on every element. if true the element is kept, else dropped
          this.posts = postsUpdated;
          this.postsUpdated.next([...this.posts]);
        }
    )
  }



}
