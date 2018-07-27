import { Component, OnInit, Inject } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { GlobalService} from '../../services/global.service';
import { AlertService } from "../../services/alert.service";
import {Router} from '@angular/router';
import {ROUTE_DASHBOARD} from '../../framework/constants';
import { CustomValidators } from "../../validators/custom-validator";
import { Md5 } from 'ts-md5/dist/md5';
import { CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {
  globalService: GlobalService;
  router: Router;
  registerForm: FormGroup;
  registerModel: any;
  items: any[] = [];

  public data: any = []

  constructor(
    private formBuilder: FormBuilder, 
    globalService: GlobalService,
    router: Router,
    private _alertService: AlertService,
    private md5: Md5,
    private cookieService: CookieService,
    ) 
    {
    this.globalService = globalService;
    this.router = router;
  }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.registerForm = this.formBuilder.group({
      username: ['',[Validators.required]],
      email: ['', [Validators.required]],
      password: ['',[Validators.required]],
      phone: ['',[Validators.required, Validators.maxLength(15), CustomValidators.number]],
    });
  }

  doRegister() {
    let items = this.registerForm.value;
    this.registerModel = this.prepareSaveUser();
    let params: any = {};
    let result: any = {};
    params.url = 'http://103.89.2.25/customer';
    params.post = JSON.parse(JSON.stringify(this.registerModel));
    this.globalService.create(params)
      .then((response) => {
        result = response.json();
        if (response.status == 'failed') {
          this._alertService.error(response.message, true);
        } else {
          this.cookieService.set('dataRegistration', JSON.stringify(result.data));
          this.router.navigate([ROUTE_DASHBOARD]);
          this._alertService.success(response.message, true);

        }
      })
      .catch(err => {
        console.log(err);
      });

  }

  setCookie(data): any{

  }

  prepareSaveUser(): any {
    const registerModel = this.registerForm.value;
    const md5 = new Md5();
    let password = registerModel.password;
    let passwordHash = Md5.hashStr(password);
    // console.log(passwordHash);
    const save: any = {
      name: registerModel.username as string,
      email: registerModel.email as string,
      password: passwordHash,
      phone: registerModel.phone as string,
    };
    return save;
  }

}
