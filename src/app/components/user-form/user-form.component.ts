import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { User } from '../../models/user';
import { CommonModule } from '@angular/common';
import { SharingDataService } from '../../services/sharing-data.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'user-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './user-form.component.html'
})
export class UserFormComponent implements OnInit {
  user: User;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly sharingDataService: SharingDataService
  ) {
    this.user = new User();
    
  }
  ngOnInit(): void {
    this.sharingDataService.selectUserEventEmitter.subscribe((user: User) => {
      this.user = user;
    });
    this.route.paramMap.subscribe(params => {
      const id = +(params.get('id') || '0');
      if (id > 0) {
       this.sharingDataService.findUserByIdEventEmitter.emit(id);
      }
     
    });
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
