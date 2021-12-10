import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { WebService } from './web.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { userFeedComponent } from './userFeed.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NavComponent } from './nav.component';



var routes: any = [
  {
    path : '',
    component : HomeComponent
  },

  {
    path : 'feed',
    component : userFeedComponent
  }
];

@NgModule({
  declarations: [
    AppComponent, HomeComponent, userFeedComponent, NavComponent
  ],
  imports: [
    BrowserModule, HttpClientModule,
    RouterModule.forRoot(routes),
    ReactiveFormsModule
  ],
  providers: [WebService],
  bootstrap: [AppComponent]
})
export class AppModule { }
