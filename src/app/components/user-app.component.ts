import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user/user.component';
import { UserFormComponent } from './user-form/user-form.component';
import Swal from 'sweetalert2';


@Component({
  selector: 'user-app',
  standalone: true,
  templateUrl: './user-app.component.html',
  imports: [CommonModule, UserComponent, UserFormComponent]
})
export class UserAppComponent implements OnInit {
  title: string = 'Listado de Usuarios';
  users: User[] = [];
  userSelected: User;
  open: boolean = false;
  constructor(
    private readonly service: UserService) {
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
      this.users = [...this.users, { ...user, id: Date.now() }];
    }
    this.userSelected = new User();
    Swal.fire({
      title: "Guardado!",
      text: "Usuario guardado correctamente!",
      icon: "success"
    });
    this.setOpen();
  }
  removeUser(id: number): void {
    console.log('Eliminando usuario con id:', id);
    Swal.fire({
      title: "Estas seguro?",
      text: "No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminarlo!"
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.users = this.users.filter((user) => user.id !== id);
        Swal.fire({
          title: "Eliminado!",
          text: "Usuario eliminado correctamente!",
          icon: "success"
        });
      }
    });
  }
  setSelectedUser(userRow: User): void {
    this.userSelected = { ...userRow };
    this.open = true;
  }

  setOpen(): void {
    this.open = !this.open;
  }

}
