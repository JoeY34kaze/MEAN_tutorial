import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule} from  '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import{ MatInputModule } from '@angular/material/input';//https://material.angular.io/components/input/api
import {MatCardModule} from '@angular/material/card';

import { AppComponent } from './app.component';

import{ PostCreateComponent } from './posts/post-create/post-create.component';

@NgModule({
  declarations: [
    AppComponent,
    PostCreateComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatCardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
