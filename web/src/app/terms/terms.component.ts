import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-terms',
  standalone: false,
  templateUrl: './terms.component.html',
  styleUrl: './terms.component.css'
})
export class TermsComponent {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = 'visible';
      document.body.style.paddingRight = '0px';
    }
  }
}
