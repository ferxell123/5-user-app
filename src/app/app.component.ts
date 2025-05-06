import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
<<<<<<< HEAD
import { UserAppComponent } from "./components/user-app.component";
=======
>>>>>>> 3da6c39 (initial commit)

@Component({
  selector: 'app-root',
  standalone: true,
<<<<<<< HEAD
  imports: [RouterOutlet, UserAppComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'user-app';
=======
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angular-app';
>>>>>>> 3da6c39 (initial commit)
}
