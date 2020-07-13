import {Post} from './post.model';
import { Injectable } from '@angular/core';
import {Subject} from 'rxjs'; //ubistvu evenr emitter
import { HttpClient } from "@angular/common/http";
import {map} from 'rxjs/operators'


@Injectable({providedIn: 'root'})
export class PostsService{
  private posts : Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient){}//tkole smo injectal http clienta da ga lahko uporablamo. modul za http smo prej nastimal v app.module.ts
  //private keyword v konstruktorju je zelo pomemben ker ga na ta nacin ubistvu pripnemo na class


  getPosts(){//nrdil bomo http request. lahko bo nrdil direkt u list-post ampak je bols da je centraliziran u service

    this.http.get<{message :string , posts : any}>('http://localhost:3000/api/post')//to en nrdi se nic ker rabmo observables zarad angularja
      .pipe(map((postData)=>{
        return postData.posts.map(post =>{//tole je samo da transformiramo field _id na id. lahko bi popravli v modelu ampak je za vajo nrjeno tkole.
          return {
            title : post.title,
            content : post.content,
            id: post._id
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

  addPost(title : string , content : string){
    const post:Post = {id:null,title : title,content : content};
    this.http.post<{message:String}>('http://localhost:3000/api/post',post).subscribe(
      (responseData)=>{
        console.log(responseData.message);//updejtamo sele ko dobimo konfirmacijo z serverja.
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);//event k spremenimo.
      });
  }
}
