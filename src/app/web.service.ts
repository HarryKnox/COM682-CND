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

        return this.http.post("https://prod-20.ukwest.logic.azure.com:443/workflows/c8db98db22d74da6b1b876c495f082e2/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=ZBFHy0ncUy3EmPPeY0hK53MIy0s_4Pbf-9rAZ6G3wVA",postData);

    }


    // function to delete a user's post img from Blob storage + delete item from Cosmos DB
    deleteUserPost(path:any, postID:any){
        
        let delData =  new FormData();
        delData.append("filePath",path);
        delData.append("id",postID);
        
        return this.http.post("https://prod-205.westeurope.logic.azure.com:443/workflows/5013b90a9dfb4fce84070eddf633f705/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=fi9D5zrRYfCu9PLqPvP9t0eoxl1-BgN5iuvtfw46tSA",delData);
    }



}