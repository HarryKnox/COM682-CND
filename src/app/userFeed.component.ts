import { Component } from '@angular/core';
import { WebService } from './web.service';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';


@Component({
  selector: 'userFeed',
  templateUrl: './userFeed.component.html',
  styleUrls: ['./userFeed.component.css']
})
export class userFeedComponent {
  constructor(private webService: WebService,
    private formBuilder : FormBuilder,
    private http : HttpClient){}


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

  // var for holding img -> file conversion
  imgFile : any;

  myPng : any;


  ngOnInit(){

    
    // calls function to get all Posts
    this.posts = this.webService.getAllPosts();

    // get form builder data, for adding a post
    this.addPostForm = this.formBuilder.group({
      userName : ['', Validators.required],
      userID : ['', Validators.required],
      fileName : ['', Validators.required],
      upFile : ['', Validators.required]
    })

    // get form builder data, for editing a post
    this.editForm = this.formBuilder.group({
      userName : ['', Validators.required],
      userID : ['', Validators.required],
      fileName : ['', Validators.required],
      upFile : ['', Validators.required]
    })
  }


  // function on submit of adding a post form
  // post form is reset upon post and webpage post feed refreshed
  onSubmit(){

    //selected file set on postForm
    this.addPostForm.controls["upFile"].setValue(this.selectedFile);

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
      return this.addPostForm.controls.userName.pristine;
    }
    isIncomplete(){
      return this.isInvalid('userName')||
             this.isInvalid('userID') ||
             this.isInvalid('fileName') ||
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


      // POST request sent if no new file provided
      if (this.editForm.value["upFile"] == undefined){
        this.webService.postUserEdit(this.editForm.value,this.myPostPath)
          .subscribe((response : any) =>{
            this.editForm.reset();
          })
      } // if closed

      // POST request sent if a new file provided
      else{
        this.webService.postUserPost(this.editForm.value)
        .subscribe((response : any) =>{
          this.editForm.reset();
        })
      }

      // old post deleted
      this.webService.deleteUserPost(this.myPostPath,this.myPostID)
      .subscribe((response : any) => {
        this.ngOnInit();
      })

      // edit modal hidden
      this.hideEdit();
    }




  /* functions for delete modal appearance/disappearance */
  showDel(post:any){
    this.showDelModal = true;

    // go to top of page
    window.scroll(0,0)

    // post ID and blob path vars updated
    this.myPostPath = post.filePath
    this.myPostID = post.id
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
      'userID' : post.userID,
      'fileName' : post.fileName
    })

    // post ID and path set 
    this.myPostID = post.id;
    this.myPostPath = post.filePath;

    // Insert current img to edit container
    var imgFile = "https://com682blob.blob.core.windows.net"+post.filePath;
    this.addImg = "<img src="+imgFile+">"
  }


  

  

  hideEdit(){
    this.showEditModal = false;
  }



} // component closed
