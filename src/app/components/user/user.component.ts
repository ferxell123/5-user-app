import { Component, EventEmitter, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SharingDataService } from '../../services/sharing-data.service';
import { UserService } from '../../services/user.service';
import { PaginatorComponent } from '../paginator/paginator.component';
import { AuthService } from '../../services/auth.service';
import { Store } from '@ngrx/store';

import Swal from 'sweetalert2';
import { load, remove } from '../store/users/users.actions';

@Component({
  selector: 'user',
  standalone: true,
  imports: [CommonModule, RouterModule, PaginatorComponent],
  templateUrl: './user.component.html',
})
export class UserComponent implements OnInit {
  title: string = 'Listado de Usuarios';

  users: User[] = [];
  paginator: any = {};
  constructor(
    private store: Store<{ users: any }>,
    private readonly userService: UserService,
    private readonly router: Router,
    private readonly sharingDataService: SharingDataService,
    private route: ActivatedRoute,
    private readonly authService: AuthService
  ) {
    this.store.select('users').subscribe((state) => {
      this.users = state.users;
      this.paginator = state.paginator;
    });
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) =>
      this.store.dispatch(load({ page: +(params.get('page') || '0') }))
    );
  }

  onRemoveUser(id: number): void {
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
            this.store.dispatch(remove({id}));
        }
      });
  }

  onSelectedUser(user: User): void {
    this.router.navigate(['/users/edit', user.id]);
  }

  get admin() {
    return this.authService.isAdmin();
  }
}
