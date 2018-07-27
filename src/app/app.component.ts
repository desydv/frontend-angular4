import {Component} from '@angular/core';
import {RegisterComponent} from './components/register/register.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['app.component.scss'],
  entryComponents: [RegisterComponent],
})
export class AppComponent {

}
