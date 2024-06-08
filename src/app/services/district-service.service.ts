import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { District } from '../interface/district';
import { environment } from '../../environments/environment';
import { Talukas } from '../interface/talukas';

@Injectable({
  providedIn: 'root'
})
export class DistrictServiceService {
  
  apiUrl:String="";
  constructor(private http: HttpClient) {
    this.apiUrl=environment.apiUrl;
   }

  getAllDistricts(): Observable<District[]> {
    return this.http.get<District[]>(`${this.apiUrl}/user/getAllDistricts`);
  }
  getAllTaluka(selectedValue:number): Observable<Talukas[]> {
    return this.http.get<Talukas[]>(`${this.apiUrl}/user/getDistrictTaluka/${selectedValue}`);
  }

  getDashBoardData(fromvalue: any) {
    return this.http.post<any>(`${this.apiUrl}/user/getDistrictTaluka`, fromvalue);
  }

  // getDashBoardData(fromvalue:any){
  //   this.http.post<any>(`${this.apiUrl}/user/getDistrictTaluka`, fromvalue).subscribe(
  //     (response) => {
  //       // Handle the response here
  //       console.log(response);
  //     },
  //     (error) => {
  //       // Handle errors here
  //       console.error('Error occurred:', error);
  //     }
  //   );
  //   //return this.http.get<Talukas[]>(`${this.apiUrl}/user/getDistrictTaluka/${fromvalue}`);
  // }

  
}
