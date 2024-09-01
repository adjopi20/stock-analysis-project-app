import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss'
})
export class SigninComponent {
  constructor(private router: Router) {}

  onSignIn() {
    this.router.navigate(['/']);
  }
  
  onSignUp() {
    this.router.navigate(['auth/register']);
  }
}
