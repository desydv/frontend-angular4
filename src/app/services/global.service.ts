import { Injectable } from "@angular/core";

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/map';

import { Headers, Http, RequestOptions } from "@angular/http";
import { Observable } from "rxjs";
import { of } from "rxjs/observable/of";

@Injectable()
export class GlobalService {

  private headers = new Headers({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
  });

  private apiUrl: string = 'http://103.89.2.25';  // URL to web api

  url: string;
  body: any;
  opts: any;
  options: any;
  id:any;

  constructor(
    private http: Http,
  ) { }

  private _getHeaders(): Headers {
    let header = new Headers({
      'Content-Type': 'application/json'
    });

    return header;
  }

  create(params: any): Promise<any> {
    this.opts = {
      headers: this.headers
    };
    if (params.post) {
      this.body = params.post;
    }
    if (params.url) {
      this.url = params.url;
    }

    let options = new RequestOptions({
      headers: this._getHeaders()
    });
    return this.http.post(this.url, JSON.stringify(this.body), options)
      .toPromise()
      .then(response => response)
      .catch(this.handleError);

  }

  update(params: any): Promise<any> {
    this.opts = {
      headers: this.headers
    };
    if (params.put) {
      this.body = params.put;
    }
    if (params.url) {
      this.url = params.url;
    }
    let options = new RequestOptions({
      headers: this._getHeaders()
    });
    return this.http.put(this.url, JSON.stringify(this.body), options)
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

}