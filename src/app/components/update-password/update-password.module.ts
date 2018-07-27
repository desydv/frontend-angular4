import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from '../../app.component';
import { HttpModule } from "@angular/http";
import { UpdatePasswordComponent } from "./update-password.component";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { HttpAuthInterceptor } from '../../framework/http-auth.interceptor';
import { HttpResponseInterceptor } from '../../framework/http-response.interceptor';
import {ShowErrorsModule} from "../../validators/show-errors.module";

const routes: Routes = [
    {
        path: "",
        component: AppComponent,
        children: [
            {
                path: "",
                component: UpdatePasswordComponent
            }
        ]
    },
];

@NgModule({
    imports: [
        CommonModule, RouterModule.forChild(routes),
        // NgbModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        HttpClientModule,
        ShowErrorsModule
    ], declarations: [
        UpdatePasswordComponent
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpAuthInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpResponseInterceptor,
            multi: true
        },
    ]
})
export class UpdatePasswordModule {
}