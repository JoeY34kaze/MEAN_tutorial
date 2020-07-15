import {Post} from './post.model';
import { Injectable } from '@angular/core';
import {Subject} from 'rxjs'; //ubistvu evenr emitter
import { HttpClient } from "@angular/common/http";
import {map} from 'rxjs/operators'
import { Router } from '@angular/router';


@Injectable({providedIn: 'root'})
export class PostsService{
  private posts : Post[] = [];
  private postsUpdated = new Subject<{posts:Post[], postCount:number}>();

  constructor(private http: HttpClient, private router:Router){}//tkole smo injectal http clienta da ga lahko uporablamo. modul za http smo prej nastimal v app.module.ts
  //private keyword v konstruktorju je zelo pomemben ker ga na ta nacin ubistvu pripnemo na class

  getPost(id:string)
  {
    return this.http.get<{_id:string, title:string, content:string, imagePath:string}>('http://localhost:3000/api/post/'+id);
  }

  getPosts(pageSize:number, currentPage:number){//nrdil bomo http request. lahko bo nrdil direkt u list-post ampak je bols da je centraliziran u service
    const queryParams = `?pageSize=${pageSize}&currentPage=${currentPage}`; //BACKTICKS special js feature to add values to strings
    this.http.get<{message :string , posts : any, maxPosts: number}>('http://localhost:3000/api/post'+queryParams)//to en nrdi se nic ker rabmo observables zarad angularja
      .pipe(map((postData)=>{
        return { posts : postData.posts.map(post =>{//tole je samo da transformiramo field _id na id. lahko bi popravli v modelu ampak je za vajo nrjeno tkole.
          return {
            title : post.title,
            content : post.content,
            id: post._id,
            imagePath : post.imagePath//z serverja bi mogl bit tkole.
          };
        }), maxPosts : postData.maxPosts};
      }))
      .subscribe(
        (transformedPostData)=>{
          this.posts = transformedPostData.posts;
          this.postsUpdated.next({posts: [...this.posts],postCount:transformedPostData.maxPosts});
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
        this.router.navigate(["/"]);//po dodajanju ga redirectej na /
      });
  }

  updatePost(id:string, title:string, content:string, image:File | string){
    let postData: Post | FormData;
    if(typeof(image)==='object')
    {//ce je image potem hocmo nrdit FormData ker je user uploadal novo sliko
      postData = new FormData();
      postData.append('id',id);//nujno rabmo za lahko na bazi dostopamo sploh do pravega elementa.
      postData.append("title",title);
      postData.append("content",content);
      postData.append("image",image, title);
    }else{//ni spremenil slike. je string
      postData = {id:id, title:title, content:content, imagePath:image}
    }

    this.http.put<{message : String , postId : String, imagePath:string}>('http://localhost:3000/api/post/'+id,postData).subscribe(
      (responseData)=>{
        this.router.navigate(["/"]);//po dodajanju ga redirectej na /
      });
  }

  deletePost(id : string){
    console.log("sending delete http request in service..");
    return this.http.delete<{message:String}>('http://localhost:3000/api/post/'+id);
  }



}
