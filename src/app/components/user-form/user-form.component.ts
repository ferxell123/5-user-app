import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { User } from '../../models/user';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  add,
  find,
  resetUser,
  setUserForm,
  update,
} from '../store/users.actions';

@Component({
  selector: 'user-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './user-form.component.html',
})
export class UserFormComponent implements OnInit {
  user: User;
  errors: any = {};

  SPECIAL_CHAR_MESSAGE =
    'La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial como . , @ $ ! % * # ? & - _';
  // Patrón de ejemplo (permite letras, números, espacios, '.', ',', '#', '-')

  constructor(
    private store: Store<{ users: any }>,
    private readonly route: ActivatedRoute
  ) {
    this.user = new User();
    this.store.select('users').subscribe((state) => {
      this.errors = state.errors;
      this.user = { ...state.user };
    });
  }
  ngOnInit(): void {
    this.store.dispatch(resetUser());
    this.route.paramMap.subscribe((params) => {
      const id = +(params.get('id') || '0');
      if (id > 0) {
        this.store.dispatch(find({ id }));
      }
    });
  }

  onSubmit(userForm: NgForm): void {
    this.store.dispatch(setUserForm({ user: this.user }));
    if (this.user.id && this.user.id > 0) {
      this.store.dispatch(update({ updatedUser: this.user }));
    } else {
      this.store.dispatch(add({ userNew: this.user }));
    }
    this.store.dispatch(resetUser());
  }

  onClear(userForm: NgForm): void {
    this.store.dispatch(resetUser());
    userForm.reset();
    userForm.resetForm();
  }
}
