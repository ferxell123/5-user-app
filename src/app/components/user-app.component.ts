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
  templateUrl: './user-app.component.html'
})
export class UserAppComponent implements OnInit {
  title: string = 'Listado de Usuarios';
  users: User[] = []; // This should ideally be typed with a User model
  constructor(private service: UserService) {
    // Initialization logic can go here
  }

  ngOnInit(): void {
    this.service.findAll().subscribe((users: User[]) => {
      this.users = users;
    });
  }

  addUser(user: User): void {
    this.users= [...this.users, {...user}];
  }
  removeUser(id: number): void {
    this.users = this.users.filter(user => user.id !== id);
  }
}