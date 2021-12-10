import { Component } from '@angular/core';
import { WebService } from './web.service';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';


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
      // this.addPostForm.patchValue({
      //   "upFile" : file
      // })
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

      // old post deleted
      //this.webService.deleteUserPost(this.myPostPath,this.myPostID);

      // new edited post is re-posted
      //selected file set on edit postForm
      this.editForm.controls["upFile"].setValue(this.selectedFile);


      // // POST request sent, form is reset and all posts is refreshed
      // this.webService.postUserPost(this.editForm.value)
      //   .subscribe((response : any) =>{
      //     this.editForm.reset();
      //     this.posts = this.webService.getAllPosts();
      //   })
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
    this.showEditModal = true;

    // set selected file using post.filePath
    //this.selectedFile=(this.http.get("https://com682blob.blob.core.windows.net"+post.filePath))

    this.selectedFile = fetch("https://com682blob.blob.core.windows.net"+post.filePath).then(r=>
    r.blob());

    console.log(this.selectedFile);

    this.editForm.patchValue({
      'userName' : post.userName,
      'userID' : post.userID,
      'fileName' : post.fileName,
      'upFile' : this.selectedFile
    })

    // post ID and path set 
    this.myPostID = post.id
    this.myPostPath = post.filePath





  }
  hideEdit(){
    this.showEditModal = false;
  }



} // component closed
