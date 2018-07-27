import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-generic-error',
  templateUrl: './generic-error.component.html',
  styleUrls: ['./generic-error.component.scss']
})
export class GenericErrorComponent implements OnInit {

  translateService: TranslateService;

  errorType: string;
  errorTitleMessage: string;
  errorMessage: string;

  constructor(route: ActivatedRoute, translateService: TranslateService) {
    this.translateService = translateService;
    if (route.snapshot.data[0]) {
      this.errorType = route.snapshot.data[0]['errorType'];
    }
  }

  ngOnInit(): void {
    let titleKey: string;
    let messageKey: string;

    //TODO use enum here as soon as its possible to upgrade to typscript 2.4.x
    if (this.errorType) {
      this.translateService.get(['errorPages.' + this.errorType + '.title', 'errorPages.' + this.errorType + '.message']).subscribe((res: string) => {
        this.errorTitleMessage = res['errorPages.' + this.errorType + '.title'];
        this.errorMessage = res['errorPages.' + this.errorType + '.message']
      });
    } else {
      this.translateService.get(['errorPages.defaultError.title', 'errorPages.defaultError.message']).subscribe((res: string) => {
        this.errorTitleMessage = res['errorPages.defaultError.title'];
        this.errorMessage = res['errorPages.defaultError.message']
      });
    }
  }
}
