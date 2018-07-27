import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { GlobalService } from '../../services/global.service';
import {Router} from '@angular/router';
import {ROUTE_DASHBOARD} from '../../framework/constants';
import { CustomValidators } from "../../validators/custom-validator";
import { AlertService } from "../../services/alert.service";
import { CookieService } from 'ngx-cookie-service';
import { Md5 } from 'ts-md5/dist/md5';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
})
export class UpdatePasswordComponent implements OnInit {

  globalService: GlobalService;
  router: Router;
  changePassForm: FormGroup;
  cookieValue: any;
  updateData: any;
  passModel: any;
  id: any;

  constructor(
    private formBuilder: FormBuilder, 
    globalService: GlobalService, 
    router: Router,
    private _alertService: AlertService,
    private cookieService: CookieService,
    private md5: Md5) 
    {
    this.globalService = globalService;
    this.router = router;

    }

  ngOnInit() {
    this.cookieValue = this.cookieService.get('dataRegistration');
    let parseValue = JSON.parse(this.cookieValue);
    // console.log('hahah = ', JSON.parse(this.cookieValue));
    this.id = parseValue.id;
    this.updateForm();
  }

  updateForm() {
    this.changePassForm = this.formBuilder.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  doChangePassword() {
    let items = this.changePassForm.value;
    this.passModel = this.prepareSaveUpdatePassword();
    let params: any = {};
    params.url = 'http://103.89.2.25/change-password/44';
    params.put = JSON.parse(JSON.stringify(this.passModel));
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

  prepareSaveUpdatePassword(): any {
    const formModel = this.changePassForm.value;
    const md5 = new Md5();
    let oldPassword = formModel.oldPassword;
    let newPassword = formModel.newPassword;
    let oldPasswordHash = Md5.hashStr(oldPassword);
    let newPasswordHash = Md5.hashStr(newPassword);
    const save: any = {
      "old-password": oldPasswordHash,
      "new-password": newPasswordHash,
    };
    return save;
  }
}
