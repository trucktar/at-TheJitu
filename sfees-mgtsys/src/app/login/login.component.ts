import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(private _router: Router, private _authService: AuthService) {}

  ngOnInit(): void {}

  logIn() {
    this._authService.logIn();
    this._router.navigate(['/']);
  }
}
