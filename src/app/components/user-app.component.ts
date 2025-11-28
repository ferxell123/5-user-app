import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { UserService } from '../services/user.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { SharingDataService } from '../services/sharing-data.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'user-app',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './user-app.component.html',
  styleUrls: ['./user-app.component.css']
})
export class UserAppComponent implements OnInit {
  users: User[] = [];
  paginator: any = {}

  constructor(
    private readonly service: UserService,
    private readonly sharingDataService: SharingDataService,
    private readonly router: Router,
    private route: ActivatedRoute,
    private readonly authService: AuthService
  ) { }

  ngOnInit(): void {
    //this.service.findAll().subscribe((users: User[]) => { this.users = users; });

    this.addUser();
    this.removeUser();
    this.findUserById();
    this.pageUsersEvent();
    this.handlerLogin();
  }

  handlerLogin() {
    this.sharingDataService.handlerLoginEventEmitter.subscribe(({ username, password }) => {
      console.log(username + ' ' + password);
      this.authService.loginUser({ username, password }).subscribe({
        next: response => {
          console.log(response + ': ' + response);
          const token = response.token;
          const payload = this.authService.getPayload(token);

          const user = { username: payload.sub };
          const login = {
            user,
            isAuth: true,
            isAdmin: payload.isAdmin
          }
          this.authService.token = token;
          this.authService.user = login;
          this.router.navigate(['/users/page/0'])

        },
        error: error => {
          if (error.status == "401") {
            Swal.fire('Error en el loging', error.error.message, 'error');
          } else {
            throw error;
          }

        }
      })
    })
  }

  findUserById() {
    this.sharingDataService.findUserByIdEventEmitter.subscribe((id: number) => {
      const user = this.users.find((u) => u.id === id);
      this.sharingDataService.selectUserEventEmitter.emit(user);
    });
  }

  pageUsersEvent() {
    this.sharingDataService.pageUsersEventEmitter.subscribe(pageable => {
      this.users = pageable.users;
      this.paginator = pageable.paginator
    });
  }

  addUser(): void {
    this.sharingDataService.newUserEventEmitter.subscribe((user: User) => {
      if (user.id > 0) {
        this.service.update(user).subscribe({
          next: (updatedUser) => {
            this.users = this.users.map((u) => (u.id === updatedUser.id ? updatedUser : u));
            this.router.navigate(['/users'], {
              state: {
                users: this.users,
                paginator: this.paginator
              }
            });
            Swal.fire({
              title: "Actualizado!",
              text: "Usuario actualizado correctamente!",
              icon: "success"
            });
          },
          error: (err) => {
            console.log(err);
            if (err.status === 400) {
              this.sharingDataService.errorEventEmitter.emit(err.error);
            }
          }
        });
      } else {
        this.service.create(user).subscribe({
          next: createdUser => {
            this.users = [...this.users, { ...createdUser }];
            this.router.navigate(['/users'], {
              state: {
                users: this.users,
                paginator: this.paginator
              }
            });
            Swal.fire({
              title: "Creado!",
              text: "Usuario creado correctamente!",
              icon: "success"
            });
          },
          error: (err) => {
            if (err.status === 400) {
              this.sharingDataService.errorEventEmitter.emit(err.error);
            }
          }
        });
      }

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
          this.service.delete(id).subscribe(() => {
            this.users = this.users.filter((user) => user.id !== id);
            this.router.navigate(['/users/create'], { skipLocationChange: true }).then(() => {
              this.router.navigate(['/users'], {
                state: {
                  users: this.users,
                  paginator: this.paginator
                }
              });
            });
            Swal.fire({
              title: "Eliminado!",
              text: "Usuario eliminado correctamente!",
              icon: "success"
            });
          });
        }
      });
    });
  }

}
