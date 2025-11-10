import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { User } from '../../models/user';
import { CommonModule } from '@angular/common';
import { SharingDataService } from '../../services/sharing-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'user-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './user-form.component.html'
})
export class UserFormComponent implements OnInit {
  user: User;
  
  
  SPECIAL_CHAR_MESSAGE = 'La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial como . , @ $ ! % * # ? & - _';
  // Patrón de ejemplo (permite letras, números, espacios, '.', ',', '#', '-')

  constructor(
    private readonly route: ActivatedRoute,
    private readonly sharingDataService: SharingDataService,
    private readonly userService: UserService
  ) {
    this.user = new User();
    
  }
  ngOnInit(): void {
    // *** Alternative event emitter subscription
      // this.sharingDataService.selectUserEventEmitter.subscribe((user: User) => { this.user = user; });
    this.route.paramMap.subscribe(params => {
      const id = +(params.get('id') || '0');
      if (id > 0) {

        // *** Alternative direct assignment
          //this.userService.findById(id).subscribe(user => this.user = user) 

        // *** Alternatively, using RxJS
        this.userService.findById(id).subscribe(user => {  this.user = user; });
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
    this.user = new User(); // Reset the user object for the next submission


    console.log('User submitted:', this.user);
    // Here you can handle the form submission, e.g., send the user data to a server
  }

  clearForm(userForm: NgForm): void {
    userForm.resetForm();
    this.user = new User(); // Reset the user object
  }

}
