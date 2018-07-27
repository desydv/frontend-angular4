import {Routes} from "@angular/router";
import {GenericErrorComponent} from '../components/generic-error/generic-error.component';
import * as Constants from './constants';
import { SignInComponent } from '../components/sign-in/sign-in.component';
import {DashboardComponent} from '../components/dashboard/dashboard.component';
import { RegisterComponent } from '../components/register/register.component';
import { UpdatePasswordComponent } from '../components/update-password/update-password.component';
import { UpdateProfileComponent } from '../components/update-profile/update-profile.component';

export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: Constants.ROUTE_REGISTER,
    pathMatch: 'full'
  },
  {
    path: Constants.ROUTE_SIGN_IN,
    component: SignInComponent
  },
  {
    path: Constants.ROUTE_DASHBOARD,
    component: DashboardComponent
  },
  {
    path: Constants.ROUTE_REGISTER,
    component: RegisterComponent,
    // loadChildren: "..\/components\/register\/register.module#RegisterModule",
  },
  {
    path: Constants.ROUTE_UPDATE_PASSWORD,
    component: UpdatePasswordComponent
  },
  {
    path: Constants.ROUTE_UPDATE_PROFILE,
    component: UpdateProfileComponent
  },

  //error routes
  {
    path: Constants.ROUTE_PAGE_NOT_FOUND,
    component: GenericErrorComponent,
    data: [{errorType: Constants.ERROR_PAGE_NOT_FOUND}]
  },
  {
    path: Constants.ROUTE_SESSION_EXPIRED,
    component: GenericErrorComponent,
    data: [{errorType: Constants.ERROR_SESSION_EXPIRED}]
  },
  {
    path: Constants.ROUTE_PERMISSION_DENIED,
    component: GenericErrorComponent,
    data: [{errorType: Constants.ERROR_PERMISSION_DENIED}]
  },
  {
    path: Constants.ROUTE_UNAUTHORIZED,
    component: GenericErrorComponent,
    data: [{errorType: Constants.ERROR_UNAUTHORIZED}]
  },
  {
    path: Constants.ROUTE_TOKEN_INVALID,
    component: GenericErrorComponent,
    data: [{errorType: Constants.ERROR_TOKEN_INVALID}]
  },
  {
    path: Constants.ROUTE_API_NOT_AVAILABLE,
    component: GenericErrorComponent,
    data: [{errorType: Constants.ERROR_API_NOT_AVAILABLE}]
  },
  {
    path: Constants.ROUTE_DEFAULT_ERROR,
    component: GenericErrorComponent,
    data: [{errorType: Constants.ERROR_DEFAULT}]
  }
]
