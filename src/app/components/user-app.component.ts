import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { UserService } from '../services/user.service';
import Swal from 'sweetalert2';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { SharingDataService } from '../services/sharing-data.service';

@Component({
  selector: 'user-app',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './user-app.component.html',
  styleUrls: ['./user-app.component.css']
})
export class UserAppComponent implements OnInit {
  users: User[] = [];
  
  constructor(
    private readonly service: UserService,
    private readonly sharingDataService: SharingDataService,
    private readonly router: Router
  ) {
    

  }

  ngOnInit(): void {
    this.service.findAll().subscribe((users: User[]) => {
      this.users = users;
    });
    this.addUser();
    this.removeUser();
  }

  addUser(): void {
    this.sharingDataService.newUserEventEmitter.subscribe((user: User) => {
      if (user.id > 0) {
        this.users = this.users.map((u) => (u.id === user.id ? { ...user } : u));
      } else {
        this.users = [...this.users, { ...user, id: Date.now() }];
      }
      this.router.navigate(['/users'], { state: { users: this.users } });
      Swal.fire({
        title: "Guardado!",
        text: "Usuario guardado correctamente!",
        icon: "success"
      });
    });

  }
  removeUser(): void {
    this.sharingDataService.idUserEventEmitter.subscribe((id: number) => {
      Swal.fire({
        title: "Estas seguro?",
        text: "No podrás revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminarlo!"
      }).then((result) => {
        if (result.isConfirmed) {
          this.users = this.users.filter((user) => user.id !== id);
          this.router.navigate(['/users/create'], { skipLocationChange: true }).then(() => {
            this.router.navigate(['/users'], { state: { users: this.users } });
          });
          Swal.fire({
            title: "Eliminado!",
            text: "Usuario eliminado correctamente!",
            icon: "success"
          });
        }
      });
    });
  }

}
