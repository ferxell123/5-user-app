import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import Swal from 'sweetalert2';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { SharingDataService } from '../services/sharing-data.service';
import { AuthService } from '../services/auth.service';
import { Store } from '@ngrx/store';
import { remove} from './store/users.actions';

@Component({
  selector: 'user-app',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './user-app.component.html',
  styleUrls: ['./user-app.component.css']
})
export class UserAppComponent implements OnInit {

  constructor(
    private store: Store<{ users: any }>,
    private readonly service: UserService,
    private readonly sharingDataService: SharingDataService,
    private readonly router: Router,
    private readonly authService: AuthService,
  ) {
    
  }

  ngOnInit(): void {
    this.removeUser();
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
            //this.users = this.users.filter((user) => user.id !== id);
            this.store.dispatch(remove({id}));
            this.router.navigate(['/users/create'], { skipLocationChange: true }).then(() => {
              this.router.navigate(['/users']);
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
