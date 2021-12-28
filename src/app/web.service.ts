import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable()
export class WebService {
    constructor(private http: HttpClient) {}
    
    // function to get all posts from AZ Cosmos DB
    getAllPosts(){
        return this.http.get("https://prod-127.westeurope.logic.azure.com:443/workflows/742289d76471459687550d10e0772b6f/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=_Izco_BiFf3fsBOFcGLOjHh9i5vbeb1mV5szdAf3K4Q");
    }

    // function to get all video posts from AZ Cosmos DB
    getAllVideoPosts(){
        return this.http.get("https://prod-87.westeurope.logic.azure.com:443/workflows/8d6be9aaf6bf44e0bafe4dbcb3914537/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=ALbfM6pg8td8WamJ5ESCI0OM85aDdHIcyQuoR1kMeZw");
    }

    // function to post a user's post to the Cosmos DB and file to Blob storage
    postUserPost(post : any){

        let postData = new FormData();

        postData.append("fileName",post.fileName);
        postData.append("userName",post.userName);
        postData.append("userID",post.userID);
        postData.append("File",post.upFile);
        postData.append("postText",post.postText);
        postData.append("date",post.date);
        postData.append("fileType",post.upFile.type);

        return this.http.post("https://prod-12.ukwest.logic.azure.com:443/workflows/99f3e108aacf4ee0a7ba480b86125e9c/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=Cew4GEukuNNyJ40GSTbf9h7BIvAo-gD2VdXgaa5FgCI",postData);

    }


    // function to delete a user's post img from Blob storage + delete item from Cosmos DB
    deleteUserPost(path:any, postID:any){

        let delData =  new FormData();
        delData.append("filePath",path);
        delData.append("id",postID);

        return this.http.post("https://prod-205.westeurope.logic.azure.com:443/workflows/5013b90a9dfb4fce84070eddf633f705/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=fi9D5zrRYfCu9PLqPvP9t0eoxl1-BgN5iuvtfw46tSA",delData);
    }

    // makes an edit to a user post
    postUserEdit(post : any, blobPath : any){

        let postData = new FormData();

        postData.append("fileName",post.fileName);
        postData.append("userName",post.userName);
        postData.append("userID",post.userID);
        postData.append("File",post.upFile);
        postData.append("blobPath", blobPath);
        postData.append("postText",post.postText);
        postData.append("date",post.date);
        postData.append("fileType",post.upFile.type);

        return this.http.post("https://prod-12.ukwest.logic.azure.com:443/workflows/99f3e108aacf4ee0a7ba480b86125e9c/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=Cew4GEukuNNyJ40GSTbf9h7BIvAo-gD2VdXgaa5FgCI",postData);
    }

    // adds a logged in user to the user's DB
    addUser(userForm : any){
        return this.http.post("https://prod-167.westeurope.logic.azure.com:443/workflows/c733c9a7d75b4748b48243e0ab18542f/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=CnlqWbQqyhTUQQWNfASQPaewurhnicTSyxs5WFj83G8",userForm);
    }

    // function to get all users from the cosmos DB
    getAllUsers(){
        return this.http.get("https://prod-175.westeurope.logic.azure.com:443/workflows/2f115536a8a14de2b71dea6b151a2183/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=RcABIOSo7M8LQs6h4bJj36irJZD1HRd4LAar_ZtrS1o").toPromise();
    }

    // function to follow a user
    followUser(followForm : any){
        return this.http.post("https://prod-128.westeurope.logic.azure.com:443/workflows/3dd6d46664324b8487df1b1cb5ce4349/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=QfOyQX8xErbyH0aQdVzF-Cz9pruT4OH-gNoCwylXOMY",followForm);
    }

    // function to get all posts, from a users followed accounts
    getAllPostsFollowing(userID : any){

        let params = new HttpParams()
        .set("userID",userID);

        return this.http.get("https://prod-31.westeurope.logic.azure.com:443/workflows/9dd6ddb3229f488fad71202b5063f87f/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=r1E_t7xoADl32l3ml5ADJqtwwCK4oX1I78496X_C6IA",{params: params});
    }

    // function to post a comment
    postComment(commentForm : any, postPath : any){

        let postData = new FormData();

        postData.append("userName", commentForm.userName);
        postData.append("commentText", commentForm.commentText);
        postData.append("postPath", postPath);

        return this.http.post("https://prod-140.westeurope.logic.azure.com:443/workflows/8a79b8c51ee64aee84da4ee8b7eb57b2/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=wBuWQAa4RNV7XZJUM6fG3YW7nmeMZDfgDkg1WIVYBH0",postData);
    }

}