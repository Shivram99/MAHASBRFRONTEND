import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { NICGroup } from '../interface/nicgroup';
import { NICDivision } from '../interface/nicdivision';
import { NICCategory } from '../interface/niccategory';

@Injectable({
  providedIn: 'root'
})
export class NICServiceService {
  apiUrl:String="";
  constructor(private http: HttpClient) {
    this.apiUrl=environment.apiUrl;
  }

  // Category API calls
  getCategories(): Observable<NICCategory[]> {
    return this.http.get<NICCategory[]>(`${this.apiUrl}/nic-categories`);
  }

  getCategoryByCode(categoryCode: string): Observable<NICCategory> {
    return this.http.get<NICCategory>(`${this.apiUrl}/nic-categories/${categoryCode}`);
  }

  createCategory(category: NICCategory): Observable<NICCategory> {
    return this.http.post<NICCategory>(`${this.apiUrl}/nic-categories`, category);
  }

  updateCategory(categoryCode: string, category: NICCategory): Observable<NICCategory> {
    return this.http.put<NICCategory>(`${this.apiUrl}/nic-categories/${categoryCode}`, category);
  }

  deleteCategory(categoryCode: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/nic-categories/${categoryCode}`);
  }

  // Division API calls
  getDivisions(): Observable<NICDivision[]> {
    return this.http.get<NICDivision[]>(`${this.apiUrl}/nic-divisions`);
  }

  getDivisionByCode(divisionCode: string): Observable<NICDivision> {
    return this.http.get<NICDivision>(`${this.apiUrl}/nic-divisions/${divisionCode}`);
  }

  createDivision(division: NICDivision): Observable<NICDivision> {
    return this.http.post<NICDivision>(`${this.apiUrl}/nic-divisions`, division);
  }

  updateDivision(divisionCode: string, division: NICDivision): Observable<NICDivision> {
    return this.http.put<NICDivision>(`${this.apiUrl}/nic-divisions/${divisionCode}`, division);
  }

  deleteDivision(divisionCode: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/nic-divisions/${divisionCode}`);
  }

  // Group API calls
  getGroups(): Observable<NICGroup[]> {
    return this.http.get<NICGroup[]>(`${this.apiUrl}/nic-groups`);
  }

  getGroupByCode(groupCode: string): Observable<NICGroup> {
    return this.http.get<NICGroup>(`${this.apiUrl}/nic-groups/${groupCode}`);
  }

  createGroup(group: NICGroup): Observable<NICGroup> {
    return this.http.post<NICGroup>(`${this.apiUrl}/nic-groups`, group);
  }

  updateGroup(groupCode: string, group: NICGroup): Observable<NICGroup> {
    return this.http.put<NICGroup>(`${this.apiUrl}/nic-groups/${groupCode}`, group);
  }

  deleteGroup(groupCode: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/nic-groups/${groupCode}`);
  }
}
