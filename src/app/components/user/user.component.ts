import { Component, EventEmitter, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SharingDataService } from '../../services/sharing-data.service';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'user',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user.component.html',
})
export class UserComponent implements OnInit {


  title: string = 'Listado de Usuarios';
  users: User[] = [];
  constructor(
    private readonly userService: UserService,
    private readonly router: Router,
    private readonly sharingDataService: SharingDataService
  ) {
    if (this.router.getCurrentNavigation()?.extras.state) {
      this.users = this.router.getCurrentNavigation()?.extras.state!['users'];
    }
  }
  ngOnInit(): void {
    if (this.users?.length === 0) {
      console.log('Consulta de usuarios findAll');
      this.userService.findAll().subscribe(users => this.users = users);
    }
  }

  onRemoveUser(id: number): void {
    this.sharingDataService.idUserEventEmitter.emit(id);
  }

  onSelectedUser(user: User): void {
    this.router.navigate(['/users/edit', user.id]);
  }
}
