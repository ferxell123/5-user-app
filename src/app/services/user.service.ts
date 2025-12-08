import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/users';

  private users: User[] = [ ];


  constructor(private http: HttpClient) { }
  findAll(): Observable<User[]> {
    return this.http.get<User[]>('http://localhost:8080/api/users');
  }

  findAllPageable(page: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/page/${page}`);
  }

  findById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  create(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  update(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${user.id}`, user);
  }

  remove(id: number): Observable<number> {
    return this.http.delete<number>(`${this.apiUrl}/${id}`).pipe(
      map(()=>id)
    )
    ;
  }
}
