import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router, ActivatedRoute} from '@angular/router';
import { Headers, Http, RequestOptions } from "@angular/http";
import { ROUTE_DASHBOARD } from '../../framework/constants';
import { CustomValidators } from "../../validators/custom-validator";
import { AlertService } from "../../services/alert.service";
import { CookieService } from 'ngx-cookie-service';
import { GlobalService } from '../../services/global.service';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
})
export class UpdateProfileComponent implements OnInit {
  globalService: GlobalService;
  router: Router;
  userUpdateForm: FormGroup;
  cookieValue: any;
  updateData: any;
  userModel: any;
  id: any;
  data: any;
  sub: any;

  constructor(
    private formBuilder: FormBuilder, 
    globalService: GlobalService,  
    router: Router, 
    private cookieService: CookieService,
    private _alertService: AlertService,
    private route: ActivatedRoute,
    private http: Http,) 
    {
    this.globalService = globalService;
    this.router = router;
  }

  ngOnInit() {
    this.cookieValue = this.cookieService.get('dataRegistration');
    let parseValue = JSON.parse(this.cookieValue);
    // console.log('hahah = ', JSON.parse(this.cookieValue));
    alert(parseValue.id);
    this.id = parseValue.id;

    this.sub = this.route.params.subscribe(params => {
      this.id = parseValue.id;
      this.http.get("http://103.89.2.25/customer/" + this.id)
        .subscribe((data) => {
          this.data = data.json();
          let result = JSON.parse(this.data);
          alert(result);
        }, (err) => {
          alert("error " + err);
        })

    });
  }

  updateForm(data) {
    this.userUpdateForm = this.formBuilder.group({
      id: [data.id],
      username: [data.name, [Validators.required]],
      password: [data.password],
      email: [data.email, Validators.required],
      phone: [data.phone, Validators.required],
    });
  }

  doUpdateProfile() {
    let items = this.userUpdateForm.value;
    this.userModel = this.prepareSaveUpdateProfile();
    let params: any = {};
    params.url = 'http://103.89.2.25/customer/';
    params.post = JSON.parse(JSON.stringify(this.userModel));
    this.globalService.update(params)
      .then((response) => {
        if (response.status == 'failed') {
          this._alertService.error(response.message, true);
        } else {
          this.router.navigate([ROUTE_DASHBOARD]);
          this._alertService.success(response.message, true);

        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  prepareSaveUpdateProfile(): any {
    const formModel = this.userUpdateForm.value;
    const save: any = {
      // id: formModel.id as string,
      name: formModel.username as string,
      email: formModel.email as string,
      password: formModel.password,
      phone: formModel.phone as string,
    };
    return save;
  }
}
