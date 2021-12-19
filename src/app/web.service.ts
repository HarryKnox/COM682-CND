import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable()
export class WebService {
    constructor(private http: HttpClient) {}
    
    // function to get all posts from AZ Cosmos DB
    getAllPosts(){
        return this.http.get("https://prod-127.westeurope.logic.azure.com:443/workflows/742289d76471459687550d10e0772b6f/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=_Izco_BiFf3fsBOFcGLOjHh9i5vbeb1mV5szdAf3K4Q");
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

        return this.http.post("https://prod-12.ukwest.logic.azure.com:443/workflows/99f3e108aacf4ee0a7ba480b86125e9c/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=Cew4GEukuNNyJ40GSTbf9h7BIvAo-gD2VdXgaa5FgCI",postData);
    }

    // adds a logged in user to the user's DB
    addUser(userForm:any){
        return this.http.post("https://prod-167.westeurope.logic.azure.com:443/workflows/c733c9a7d75b4748b48243e0ab18542f/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=CnlqWbQqyhTUQQWNfASQPaewurhnicTSyxs5WFj83G8",userForm);
    }

    // function to get all users from the cosmos DB
    getAllUsers(){
        return this.http.get("https://prod-175.westeurope.logic.azure.com:443/workflows/2f115536a8a14de2b71dea6b151a2183/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=RcABIOSo7M8LQs6h4bJj36irJZD1HRd4LAar_ZtrS1o").toPromise();
    }


}