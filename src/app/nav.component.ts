import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

@Component({
 selector: 'navigation',
 templateUrl: './nav.component.html',
 styleUrls: []
})
export class NavComponent {
    constructor(public router : Router,
        public authService: AuthService){}

    userInfo : any;

    getUserInfo(){
    
    // sets logged in user info to var
    this.authService.user$.subscribe(
        (profile) => this.userInfo = (profile));
    }

    


}