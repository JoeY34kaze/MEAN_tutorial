import {Component} from '@angular/core'

@Component({
  selector : 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls : ['./post-list.component.css']
})
export class PostListComponent{
  posts = [
    {title:'First Post', content : 'Content of First Post.'},
    {title:'Second Post', content : 'Content of second Post.'},
    {title:'3 Post', content : 'Content of 3 Post.'},
    {title:'4 Post', content : 'Content of 4 Post.'}
  ];

}
