import {
  HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import {Observable} from 'rxjs';
import 'rxjs/add/operator/do';
import {Router} from '@angular/router';
import {ERROR_UNAUTHORIZED, ROUTE_UNAUTHORIZED} from './constants';
import {ServiceLocator} from './service.locator';

export class HttpResponseInterceptor implements HttpInterceptor {

  router: Router;

  constructor() {
    this.router = ServiceLocator.injector.get(Router);
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(request).do((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        // do stuff with response if you want, currently stub
      }
    }, (errorResponse: any) => {
      if (errorResponse instanceof HttpErrorResponse) {
        if (errorResponse.error && errorResponse.error.error && errorResponse.error.error === 'token_invalid') {
          this.router.navigate([ROUTE_UNAUTHORIZED]);
        }
        if (errorResponse.status === 401) {
          if (errorResponse.error && errorResponse.error.error && errorResponse.error.error === 'invalid_credentials') {
            //skip re-reouting
          } else {
            this.router.navigate([ROUTE_UNAUTHORIZED]);
          }
        }
      }
    });
  }
}
