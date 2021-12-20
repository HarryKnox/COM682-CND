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
import { AuthModule } from '@auth0/auth0-angular';
import { DatePipe } from '@angular/common';
import { followingComponent} from './following.component';


var routes: any = [
  {
    path : '',
    component : HomeComponent
  },

  {
    path : 'feed',
    component : userFeedComponent
  },

  {
    path : 'following',
    component : followingComponent    
  }
];

@NgModule({
  declarations: [
    AppComponent, HomeComponent, userFeedComponent, NavComponent, followingComponent
  ],
  imports: [
    BrowserModule, HttpClientModule,
    RouterModule.forRoot(routes),
    ReactiveFormsModule,
    AuthModule.forRoot({
      domain : 'dev-7r2t6u-n.us.auth0.com',
      clientId : 'qPFVtJ5Z9ZhoqcJtr7ba0WauPeEx7MRC'
    })
  ],
  providers: [WebService,DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
