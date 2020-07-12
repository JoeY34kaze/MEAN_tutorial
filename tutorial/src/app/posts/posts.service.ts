import {Post} from './post.model';
import { Injectable } from '@angular/core';
import {Subject} from 'rxjs'; //ubistvu evenr emitter
import { HttpClient } from "@angular/common/http";


@Injectable({providedIn: 'root'})
export class PostsService{
  private posts : Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient){}//tkole smo injectal http clienta da ga lahko uporablamo. modul za http smo prej nastimal v app.module.ts
  //private keyword v konstruktorju je zelo pomemben ker ga na ta nacin ubistvu pripnemo na class


  getPosts(){//nrdil bomo http request. lahko bo nrdil direkt u list-post ampak je bols da je centraliziran u service

    this.http.get<{message :string , posts : Post[]}>('http://localhost:3000/api/post')//to en nrdi se nic ker rabmo observables zarad angularja
      .subscribe(
        (postData)=>{
          this.posts = postData.posts;
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
    const p:Post = {id:null,title : title,content : content};
    this.posts.push(p);
    this.postsUpdated.next([...this.posts]);//event k spremenimo.
  }
}
