import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user/user.component';
import { UserFormComponent } from './user-form/user-form.component';

@Component({
  selector: 'user-app',
  standalone: true,
  imports: [CommonModule, UserComponent, UserFormComponent],
  templateUrl: './user-app.component.html',
})
export class UserAppComponent implements OnInit {
  title: string = 'Listado de Usuarios';
  users: User[] = []; // This should ideally be typed with a User model
  userSelected: User;
  constructor(private service: UserService) {
    this.userSelected = new User();
    // Initialization logic can go here
  }

  ngOnInit(): void {
    this.service.findAll().subscribe((users: User[]) => {
      this.users = users;
    });
  }

  addUser(user: User): void {
    if (user.id > 0) {
      this.users = this.users.map((u) => (u.id === user.id ? { ...user } : u));
    } else {
      this.users = [...this.users, { ...user, id: new Date().getTime() }];
    }
    this.userSelected = new User();
  }
  removeUser(id: number): void {
    this.users = this.users.filter((user) => user.id !== id);
  }
  setSelectedUser(userRow: User): void {
    this.userSelected = { ...userRow };
  }
}
