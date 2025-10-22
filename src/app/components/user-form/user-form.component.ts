import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { User } from '../../models/user';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'user-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './user-form.component.html'
})
export class UserFormComponent {
@Input () user: User;
@Output() newUserEventEmitter: EventEmitter<User> = new EventEmitter<User>();


constructor() {
    this.user = new User();
  }

  onSubmit(userForm: NgForm): void {
    if (userForm.invalid) {
      console.log('Form is invalid');
      return;
    }
    this.newUserEventEmitter.emit(this.user);
    userForm.resetForm();
    userForm.resetForm();
    this.user = new User(); // Reset the user object for the next submission


    console.log('User submitted:', this.user);
    // Here you can handle the form submission, e.g., send the user data to a server
  }

  clearForm(userForm: NgForm): void {
    userForm.resetForm();
    this.user = new User(); // Reset the user object
  }


}
