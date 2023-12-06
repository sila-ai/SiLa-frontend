import { Component, OnInit } from '@angular/core';
import { User } from './models/user';
import { NavigationEnd, Router } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';
import { environment } from '../environments/environment';
import { filter } from 'rxjs/operators';
declare var gtag: Function;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'SiLa-app';

  user: User;

  cookieMessage =
    'This website uses cookies to ensure you get the best experience on our website.';
  cookieDismiss = 'Got it!';
  cookieLinkText = 'Learn more';

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    const navEndevents = router.events.pipe(
      filter((event) => event instanceof NavigationEnd)
    );
    navEndevents.subscribe((event: NavigationEnd) => {
      gtag('config', 'UA-190651310-1', {
        page_path: event.urlAfterRedirects,
      });
    });
    this.addGAScript();
    /** Add Google Analytics Script Dynamically */
  }

  ngOnInit() {
    const cc = window as any;
    cc.cookieconsent.initialise({
      palette: {
        popup: {
          background: '#164969',
        },
        button: {
          background: '#ffe000',
          text: '#000',
        },
      },
      theme: 'classic',
      content: {
        message: this.cookieMessage,
        dismiss: this.cookieDismiss,
        link: this.cookieLinkText,
        href: environment.Frontend,
      },
    });
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
  /** Add Google Analytics Script Dynamically */

  addGAScript() {
    let gtagScript: HTMLScriptElement = document.createElement('script');
    gtagScript.async = true;
    gtagScript.src =
      'https://www.googletagmanager.com/gtag/js?id=' +
      environment.GA_TRACKING_ID;
    document.head.prepend(gtagScript);
    /** Disable automatic page view hit to fix duplicate page view count  **/
    gtag('config', environment.GA_TRACKING_ID, { send_page_view: true });
  }
  onActivate(event) {
    window.scroll(0, 0);
  }
}
