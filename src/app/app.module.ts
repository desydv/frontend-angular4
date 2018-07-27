import {BrowserModule} from '@angular/platform-browser';
import {NgModule, Injector} from '@angular/core';

import {AppComponent} from './app.component';
import {RouterModule} from "@angular/router";
import {TranslateModule, TranslateLoader} from "@ngx-translate/core";
import {HttpClientModule, HttpClient, HTTP_INTERCEPTORS} from "@angular/common/http";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {appRoutes} from "./framework/routes";
import { GenericErrorComponent } from './components/generic-error/generic-error.component';
import {AuthenticationService} from './services/authentication/authentication.service';
import {HttpResponseInterceptor} from './framework/http-response.interceptor';
import {HttpAuthInterceptor} from './framework/http-auth.interceptor';
import {ServiceLocator} from './framework/service.locator';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegisterComponent } from './components/register/register.component';
import { UpdatePasswordComponent } from './components/update-password/update-password.component';
import { UpdateProfileComponent } from './components/update-profile/update-profile.component';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import { ShowErrorsModule } from "./validators/show-errors.module";
import { GlobalService } from './services/global.service';
import { AlertService } from "./services/alert.service";
import { Md5 } from 'ts-md5';
import { StorageServiceModule } from 'angular-webstorage-service';
import { CookieService } from 'ngx-cookie-service';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    GenericErrorComponent,
    SignInComponent,
    DashboardComponent,
    RegisterComponent,
    UpdatePasswordComponent,
    UpdateProfileComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    HttpModule,
    ReactiveFormsModule,
    ShowErrorsModule,
    BrowserModule,
    StorageServiceModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    AuthenticationService, GlobalService, AlertService, Md5, CookieService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpAuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpResponseInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private injector: Injector) {
    ServiceLocator.injector = this.injector;
  }
}
