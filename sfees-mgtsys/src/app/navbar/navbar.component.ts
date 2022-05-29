import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  isMenuCollapsed = true;
  isLoggedIn = false;

  constructor(private _router: Router, private _authService: AuthService) {}

  ngOnInit(): void {
    this.isLoggedIn = this._authService.isLoggedIn();
  }

  gotoLogin() {
    if (this.isLoggedIn) this._authService.logOut();
    this._router.navigate(['/login']);
    this.isMenuCollapsed = true;
  }
}
