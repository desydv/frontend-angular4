import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {environment} from 'environments/environment';
import {Router} from '@angular/router';
import {
  HTTP_STATUSCODE_OK,
  ROUTE_API_NOT_AVAILABLE,
  ROUTE_REGISTER,
  ROUTE_DEFAULT_ERROR
} from '../../framework/constants';
import {Token} from '../../models/token';

const heartbeatPath = '/alive';
const authPath = '/jwtAuth';
const renewPath = '/jwtRenew';
const renewTimestampIntervalInMilis = 3600000;

@Injectable()
export class AuthenticationService {

  httpClient: HttpClient;
  router: Router;
  public token: string;

  constructor(httpClient: HttpClient, router: Router) {
    this.httpClient = httpClient;
    this.router = router;

    // set token if saved in local storage
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.token = currentUser && currentUser.token;
  }

  /*
   * Logs the user in
   */
  login(username: string, password: string): Promise<any> {
    // if config misses directly return
    if (!environment.apiBaseUrl) {
      return new Promise((resolve, reject) => {
        reject('Config error');
      });
    }

    return new Promise((resolve, reject) => {
      this.checkIfApiIsAlive()
        .then(() => {
          resolve(this.executeLogin(username, password));
        }, () => {
          // error from checkIfApiIsAlive
          reject('API not available');
        })
        .catch(() => {
          //error from promise chain
          reject('API not available');
        })
    });
  }

  executeLogin(username: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpClient.post(environment.apiBaseUrl + authPath, JSON.stringify({
        username: username,
        password: password
      }), {
        observe: 'response'
      }).toPromise()
        .then((response: HttpResponse<Token>) => {
          // login successful if there's a jwt token in the response
          let token = response.body && response.body.token;
          if (token) {
            this.token = token;
            localStorage.setItem('currentUser', JSON.stringify({username: username, token: token}));
            this.setTokenFetchedTimestamp();
            resolve();
          } else {
            reject('Wrong credentials');
          }
        })
        .catch((response: HttpResponse<any>) => {
          reject('Wrong credentials');
        })
    })
  }

  /*
   * Logs the user out
   */
  logout(redirectTo: string) {
    this.token = null;
    localStorage.removeItem('currentUser');
    if (redirectTo) {
      this.router.navigate([redirectTo]);
    }
  }

  /*
   * Checks if the user is signed in
   */
  validateSignedInUser() {
    let currentUser = localStorage.getItem('currentUser');
    return this.token && currentUser && JSON.parse(currentUser).username && JSON.parse(currentUser).token;
  }

  /*
   * Checks if the api is alive, tries to renew the token. caller can then execute his pi actions
   */
  prepareProtectedApiCall() {
    // if config misses directly return
    if (!environment.apiBaseUrl) {
      return new Promise((resolve, reject) => {
        this.router.navigate([ROUTE_DEFAULT_ERROR]).then(() => {
          reject();
        });
      });
    }

    return new Promise((resolve, reject) => {
      this.checkIfApiIsAlive()
        .then(() => {
          this.renewToken().then(() => {
            //everything is okay, caller can do his stuff
            resolve();
          }, (err) => {
            // error from renewToken
            if (!err) {
              // this is some network error too, no logout
              this.router.navigate([ROUTE_DEFAULT_ERROR]).then(() => {
                reject();
              });
            } else if (err === 400) {
              // original token invalid or token not renewable
              this.logout(undefined);
              this.router.navigate([ROUTE_REGISTER]).then(() => {
                reject();
              });
            } else {
              //any other error in renew token
              this.router.navigate([ROUTE_DEFAULT_ERROR]).then(() => {
                reject();
              })
            }
          });
        }, () => {
          // error from checkIfApiIsAlive
          this.router.navigate([ROUTE_API_NOT_AVAILABLE]).then(() => {
            reject();
          });
        })
        .catch(() => {
          // network error
          this.router.navigate([ROUTE_DEFAULT_ERROR]).then(() => {
            reject();
          });
        })
    });
  }

  /*
   * Tries to renew the token.
   * Errors are handled in caller
   */
  renewToken(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!environment.apiBaseUrl) {
        reject();
      }

      let tokenFetchedTimestamp = this.getTokenFetchedTimestamp();
      if (tokenFetchedTimestamp && tokenFetchedTimestamp > 0 && tokenFetchedTimestamp < tokenFetchedTimestamp + renewTimestampIntervalInMilis) {
        resolve();
      }

      let headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.token);
      this.httpClient.get(environment.apiBaseUrl + renewPath, {
        observe: 'response',
        headers
      }).toPromise()
        .then((response: HttpResponse<Token>) => {
          // login successful if there's a jwt token in the response
          let token = response.body && response.body.token;
          if (token) {
            this.token = token;
            let currentUser = JSON.parse(localStorage.getItem('currentUser'));
            localStorage.setItem('currentUser', JSON.stringify({username: currentUser.username, token: token}));
            this.setTokenFetchedTimestamp();
            resolve();
          } else {
            //good response but had no token
            reject(200);
          }
        }, (errorResponse: HttpErrorResponse) => {
          // error response
          reject(errorResponse.status);
        })
    });
  }


  /*
   * Checks if the API lives,
   * Error are handled in caller
   */
  checkIfApiIsAlive(): Promise<any> {
    // if config misses directly return
    if (!environment.apiBaseUrl) {
      return new Promise((resolve, reject) => {
        reject();
      });
    }

    return new Promise((resolve, reject) => {
      this.httpClient.get(environment.apiBaseUrl + heartbeatPath, {
        observe: 'response'
      }).toPromise()
        .then(response => {
          if (response.status === HTTP_STATUSCODE_OK) {
            resolve();
          } else {
            reject();
          }
        })
        .catch(function () {
          // network error
          reject();
        });
    });
  }

  /*
   * Gets the token fetched timestamp in milis from local storage
   */
  getTokenFetchedTimestamp(): number {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || !currentUser.tokenFetchedTimestamp) {
      return 0;
    }

    return currentUser.tokenFetchedTimestamp;
  }

  /*
   * Sets the token fetched timestamp in milis to local storage from current time
   */
  setTokenFetchedTimestamp() {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
      currentUser.tokenFetchedTimestamp = + new Date();
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
  }

}
