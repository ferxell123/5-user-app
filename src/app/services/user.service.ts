import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private users: User[] = [{
    id: 1,
    name: 'christian',
    lastName: 'solano',
    email: ' csolano@correo.com',
    username: 'csolano',
    password: '123456'
  },
  {
    id: 2,
    name: 'john',
    lastName: 'doe',
    email: 'jdoe@correo.com',
    username: 'jdoe',
    password: '123456'
  },
  ];

  constructor() { }
  findAll(): Observable<User[]> {
    return of(this.users);
  }
}
