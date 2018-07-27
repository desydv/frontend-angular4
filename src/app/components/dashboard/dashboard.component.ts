import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../services/authentication/authentication.service';
import { ROUTE_SIGN_IN, ROUTE_REGISTER} from '../../framework/constants';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  authenticationService: AuthenticationService;

  constructor(authenticationService: AuthenticationService) {

    this.authenticationService = authenticationService;
  }

  ngOnInit() {
  }

  doLogout() {
    this.authenticationService.logout(ROUTE_REGISTER);
  }

}
