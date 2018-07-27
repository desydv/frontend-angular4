import {Injectable} from '@angular/core';
import {HttpInterceptor, HttpRequest, HttpHandler, HttpEvent} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';

@Injectable()
export class HttpAuthInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // let ratingToken = this.configuration.getAuthToken();
    req = req.clone({
      setHeaders: {
        // Authorization: `Bearer ${ratingToken}`,
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache'
      },

    });
    return next.handle(req);
  }
}
