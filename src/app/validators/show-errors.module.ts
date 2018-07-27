import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ShowErrorsComponent} from "./show-errors.component";

// const routes: Routes = [
//     {
//         "path": "",
//         "component": DefaultComponent,
//         "children": [
//             {
//                 "path": "",
//                 "component": ShowErrorsComponent
//             }
//         ]
//     }
// ];

@NgModule({
    imports: [
        CommonModule
    ], exports: [
        ShowErrorsComponent
    ], declarations: [
        ShowErrorsComponent
    ]
})
export class ShowErrorsModule {
}