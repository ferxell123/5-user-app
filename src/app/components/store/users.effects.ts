import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UserService } from '../../services/user.service';
import {
  add,
  addSuccess,
  findAllPageable,
  load,
  setErrors,
  update,
  updateSuccess,
} from './users.actions';
import { catchError, EMPTY, exhaustMap, map, of, tap } from 'rxjs';
import { User } from '../../models/user';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private service: UserService,
    private router: Router
  ) {}

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(load),
      exhaustMap((action) =>
        this.service.findAllPageable(action.page).pipe(
          map((pageable) => {
            const users = pageable.content as User[];
            const paginator = pageable;
            return findAllPageable({ users, paginator });
          }),
          catchError(() => EMPTY)
        )
      )
    )
  );

  addUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(add),
      exhaustMap((action) =>
        this.service.create(action.userNew).pipe(
          map((userNew) => addSuccess({ userNew })),
          catchError((error) =>
            error.status == 400 ? of(setErrors({ errors: error.error })) : EMPTY
          )
        )
      )
    )
  );
  
  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(update),
      exhaustMap((action) =>
        this.service.create(action.updatedUser).pipe(
          map((updatedUser) => updateSuccess({ updatedUser })),
          catchError((error) =>
            error.status == 400 ? of(setErrors({ errors: error.error })) : EMPTY
          )
        )
      )
    )
  );

  addSuccessUser$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(addSuccess),
        tap(() => {
          this.router.navigate(['/users']);
          Swal.fire({
            title: 'Creado!',
            text: 'Usuario creado correctamente!',
            icon: 'success',
          });
        })
      ),
    { dispatch: false }
  );

  updateSuccessUser$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(updateSuccess),
        tap(() => {
          this.router.navigate(['/users']);
          Swal.fire({
            title: 'Actualizado!',
            text: 'Usuario actualizado correctamente!',
            icon: 'success',
          });
        })
      ),
    { dispatch: false }
  );
}
