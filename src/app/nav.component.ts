import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
 selector: 'navigation',
 templateUrl: './nav.component.html',
 styleUrls: []
})
export class NavComponent {
    constructor(public router : Router){}
}