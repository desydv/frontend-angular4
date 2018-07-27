import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from '../../services/authentication/authentication.service';
import {Router} from '@angular/router';
import {ROUTE_DASHBOARD} from '../../framework/constants';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
})
export class SignInComponent implements OnInit {

  authenticationService: AuthenticationService;
  router: Router;
  signInForm: FormGroup;
  username: string;
  password: string;
  anyError: string;

  constructor(private formBuilder: FormBuilder, authenticationService: AuthenticationService, router: Router) {
    this.authenticationService = authenticationService;
    this.router = router;

    if (this.authenticationService.validateSignedInUser()) {
      this.router.navigate([ROUTE_DASHBOARD]);
    }

    this.signInForm = formBuilder.group({
      'username': [null, Validators.required],
      'password': [null, Validators.required]
    });
  }

  ngOnInit() {
  }

  doSignIn(postData) {
    this.username = postData.username;
    this.password = postData.password;

    this.authenticationService.login(this.username, this.password)
      .then(() => {
        this.router.navigate([ROUTE_DASHBOARD]);
      })
      .catch((error) => {
        this.anyError = error;
      });
  }
}
