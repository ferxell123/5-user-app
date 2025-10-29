import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { User } from '../../models/user';
import { CommonModule } from '@angular/common';
import { SharingDataService } from '../../services/sharing-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'user-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './user-form.component.html'
})
export class UserFormComponent {
  user: User;

  constructor(
    private readonly router: Router,
    private readonly sharingDataService: SharingDataService
  ) {
    this.user = this.router.getCurrentNavigation()?.extras.state?.['user'] || new User();
  }

  onSubmit(userForm: NgForm): void {
    if (userForm.invalid) {
      console.log('Form is invalid');
      return;
    }
    this.sharingDataService.newUserEventEmitter.emit(this.user);
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
