import { Component } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Clinica Online';
  showLoading: boolean = false;

  constructor(private router: Router) {

    router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.showLoading = true;
      } else if (event instanceof NavigationEnd) {
        this.showLoading = false;
      }
    });
  }

}
