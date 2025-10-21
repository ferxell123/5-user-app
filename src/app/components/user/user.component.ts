import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../../models/user';
import { CommonModule } from '@angular/common';
import { UserFormComponent } from '../user-form/user-form.component';

@Component({
  selector: 'user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user.component.html'
})
export class UserComponent {
  @Input() users: User[] = [];

  @Output() idUserEventEmitter: EventEmitter<number> = new EventEmitter<number>();
  onRemoveUser(id: number): void {
    const confirmDelete = confirm('Are you sure you want to delete this user?');
    if (confirmDelete) {
      this.users = this.users.filter(user => user.id !== id);
      this.idUserEventEmitter.emit(id);
    }
  }
}
