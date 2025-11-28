import { Component, EventEmitter, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SharingDataService } from '../../services/sharing-data.service';
import { UserService } from '../../services/user.service';
import { PaginatorComponent } from '../paginator/paginator.component';
import { AuthService } from '../../services/auth.service';


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
    private readonly userService: UserService,
    private readonly router: Router,
    private readonly sharingDataService: SharingDataService,
    private route: ActivatedRoute,
    private readonly authService: AuthService
  ) {
    if (this.router.getCurrentNavigation()?.extras.state) {
      this.users = this.router.getCurrentNavigation()?.extras.state!['users'];
      this.paginator = this.router.getCurrentNavigation()?.extras.state!['paginator'];
    }
  }
  ngOnInit(): void {
    if (this.users?.length === 0) {
      console.log('Consulta de usuarios findAll');
      //this.userService.findAll().subscribe(users => this.users = users);
      this.route.paramMap.subscribe(params => {
        const page = +(params.get('page') || '0');
        this.userService.findAllPageable(page).subscribe(pageable => {
          this.users = pageable.content as User[]
          this.paginator = pageable;
          this.sharingDataService.pageUsersEventEmitter.emit({ users: this.users, paginator: this.paginator });

        });
      });
    }
  }

  onRemoveUser(id: number): void {
    this.sharingDataService.idUserEventEmitter.emit(id);
  }

  onSelectedUser(user: User): void {
    this.router.navigate(['/users/edit', user.id]);
  }

  get admin() {
    return this.authService.isAdmin();
  }
}
