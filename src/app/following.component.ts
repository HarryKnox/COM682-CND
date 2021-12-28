import { Component } from '@angular/core';
import { WebService } from './web.service';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '@auth0/auth0-angular';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { Subject, zip } from 'rxjs';
import { map } from 'rxjs/operators'



@Component({
  selector: 'following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.css']
})
export class followingComponent {
  constructor(private webService: WebService,
    private formBuilder : FormBuilder,
    private http : HttpClient,
    public authService: AuthService,
    public datepipe : DatePipe){}


  // webpage title
  title = 'User Feed';

  // array to hold all posts
  posts : any = [];

  // var to hold add post form
  addPostForm : any;

  // var to hold selected file
  selectedFile : any;

  // var set to hold blob post path for deleting, used as parameter
  myPostPath : any;

  // var set to hold post ID for deleting, used as parameter
  myPostID : any;

  // modal vars set for del + edit Modal
  showDelModal? : boolean;
  showEditModal? : boolean;

  // edit form var set to any
  editForm : any;
  
  // var to be set in <img src =...> edit box
  addImg : any;

  // var for holding img inserted to edit modal
  imgFile : any;

  // array to hold current logged in user info (from auth0)
  userInfo : any = null;

  // var to hold the current date (used in post date)
  currentDate = new Date();

  // array to hold all users
  allUsers : any = [];

  feedType = "all";

  following : any;




  ngOnInit(){
    
    // calls function to get all Posts
    //this.posts = this.webService.getAllPosts();
    
    if(this.feedType=="user"){

      // followed users set to string
      this.getFollowing();

      console.log(this.following);

      var firstIDposts : any;

      this.posts = this.webService.getAllPostsFollowing(this.following);

      // // if multiple followed then split by comma
      // if (this.following.includes(',')){        
      //   var ids = this.following;
      //   ids =  ids.split(',');
      //   this.following = ids;
      // }

      // // loop through for each followed ID
      // for(var id in this.following){

      //   // first id set
      //   if (id == "0"){
      //     firstIDposts = this.webService.getAllPostsFollowing(this.following[id]);
      //   }
      //   // ids after first are merged
      //   else{
      //     zip(firstIDposts,this.webService.getAllPostsFollowing(this.following[id]))
      //     .pipe(map(x => x.flat()))
      //     .subscribe(data => firstIDposts=data)
      //   }
      // }
      // // posts set
      // this.posts = firstIDposts;
    }

    else{
      this.posts = this.webService.getAllPosts();
    }

    // get form builder data, for adding a post
    this.addPostForm = this.formBuilder.group({
      userName : [''],
      userID : [''],
      postText : [''],
      fileName : ['', Validators.required],
      upFile : ['', Validators.required],
      date : ['']
    })

    // get form builder data, for editing a post
    this.editForm = this.formBuilder.group({
      userName : ['', Validators.required],
      userID : [''],
      postText : ['', Validators.required],
      fileName : ['', Validators.required],
      upFile : ['', Validators.required],
      date : ['']
    })

    // sets logged in user info to var
    this.authService.user$.subscribe(
      (profile) => this.userInfo = (profile));


    // calls function to get all Users
    this.allUsers = this.webService.getAllUsers();
  }




  

  // function to fix each date type,to how long ago
  fixDate(aDate:any){
    var fixedDate = this.datepipe.transform(aDate,'yyyy-MM-ddTHH:mm:ss.SSS');
    var dateVar = moment(fixedDate).fromNow();
    return(dateVar);
  }


  // function on submit of adding a post form
  // post form is reset upon post and webpage post feed refreshed
  onSubmit(){

    // adds user to DB upon action
    // not very elegant way of doing this but it works
    this.addUser();

    //selected file set on postForm
    this.addPostForm.controls["upFile"].setValue(this.selectedFile);
    this.addPostForm.controls["userName"].setValue(this.userInfo.name);
    this.addPostForm.controls["userID"].setValue(this.userInfo.sub);
    this.addPostForm.controls["date"].setValue(this.currentDate);


    // POST request sent, form is reset and all posts is refreshed
    this.webService.postUserPost(this.addPostForm.value)
      .subscribe((response : any) =>{
        this.addPostForm.reset();
        this.posts = this.webService.getAllPosts();
      })
  }

    /* validation of form entries  (use pipe to do multiple) */
    isInvalid(control: any){
      return this.addPostForm.controls[control].invalid;
    }
    
    isUntouched(){
      return this.addPostForm.controls.fileName.pristine;
    }
    isIncomplete(){
      return this.isInvalid('fileName') ||
             this.isInvalid('postText')||
             this.isUntouched();
    }

    // function that takes selected upload file and assigns to var
    onFileSelect(event:any){
      const file =  event.target.files[0];

      this.selectedFile = file;
    }

    // function that takes blobPath and postID and call a delete HTTP call, deleting a post
    onDelete(){

      this.webService.deleteUserPost(this.myPostPath,this.myPostID)
      .subscribe((response : any) => {
        this.hideDel();
        this.ngOnInit();
      })
    }

    // function for editing a post
    onEdit() {

      // file from form input is set
      this.editForm.controls["upFile"].setValue(this.selectedFile);
      this.editForm.controls["userID"].setValue(this.userInfo.sub);
      this.editForm.controls["date"].setValue(this.currentDate);

      // POST request sent if no new file provided
      if (this.editForm.value["upFile"] == undefined){
        this.webService.postUserEdit(this.editForm.value,this.myPostPath)
          .subscribe((response : any) =>{
            this.editForm.reset();
            this.deleteAfterEdit();
          })
      } // if closed

      // POST request sent if a new file provided
      else{
        this.webService.postUserPost(this.editForm.value)
        .subscribe((response : any) =>{
          this.editForm.reset(); 
          this.deleteAfterEdit();
        })
      }


      // edit modal hidden
      this.hideEdit();
    }

    // function to delete a post after it has been edited + reposted
    deleteAfterEdit(){
      this.webService.deleteUserPost(this.myPostPath,this.myPostID)
      .subscribe((response : any) => {
        this.ngOnInit();
      })
    }




  /* functions for delete modal appearance/disappearance */
  showDel(post:any){
    this.showDelModal = true;

    // go to top of page
    window.scroll(0,0)

    // post ID and blob path vars updated
    this.myPostPath = post.filePath
    this.myPostID = post.id

    // adds user to DB upon action
    // not very elegant way of doing this but it works
    this.addUser();
  }

  hideDel(){
    this.showDelModal = false;
  }



  // functions for edit modal appearance/disappearance
  showEdit(post:any){


    //shows modal
    this.showEditModal = true;
    
    // go to top of page
    window.scroll(0,0);

    this.editForm.patchValue({
      'userName' : post.userName,
      'postText' : post.postText,
      'fileName' : post.fileName
    })

    // post ID and path set 
    this.myPostID = post.id;
    this.myPostPath = post.filePath;

    // Insert current img to edit container
    var imgFile = "https://com682blob.blob.core.windows.net"+post.filePath;
    this.addImg = "<img src="+imgFile+">"

    // adds user to DB upon action
    // not very elegant way of doing this but it works
    this.addUser();
  }

  hideEdit(){
    this.showEditModal = false;
  }


  // function to add a logged in user to the Users Cosmos DB
  async addUser(){

    // check that user info has been found
    if(this.userInfo!=null){

      // boolean to see if user in user DB
      var userCheck = false;
      
      // gets all current users
      var allMyUsers:any = await this.webService.getAllUsers();

      // checks if user already exists
      for(var userIndex in allMyUsers){
        if (allMyUsers[userIndex].id == this.userInfo.sub){
          userCheck = true;
        }
      }
      
      // if user not in db 
      if(userCheck == false){
        let userData = new FormData();

        userData.append("userName", this.userInfo.name);
        userData.append("userID", this.userInfo.sub);
        userData.append("email", this.userInfo.email);
        userData.append("profilePic", this.userInfo.picture);
  
        //user added to DB
        this.webService.addUser(userData)
        .subscribe((response : any) => {
          this.ngOnInit();
        })
      }
    }
  } // add user function closed



  // function to follow a user
  async followUser(post : any){

    let followUserData = new FormData();

    followUserData.append("followID", post.userID);
    followUserData.append("userID", this.userInfo.sub);

    this.webService.followUser(followUserData)
    .subscribe((response : any) =>{
      this.ngOnInit();
    })

    // adds user to DB upon action
    // not very elegant way of doing this but it works
    this.addUser();
  }

  

  async setFeedUser(){
    this.feedType="user";
    this.ngOnInit();
  }

  async setFeedAll(){
    this.feedType="all";
    this.ngOnInit();
  }


  async getFollowing(){

    // gets all current users
    var allMyUsers:any = await this.webService.getAllUsers();

    // check for logged in user
    for(var userIndex in allMyUsers){
      if (allMyUsers[userIndex].id == this.userInfo.sub){
        this.following = allMyUsers[userIndex].following;
      }
    }

  }





} // component closed

