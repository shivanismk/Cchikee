import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  imports: [RouterOutlet],
})
export class AdminDashboardComponent implements OnInit {
  isSidebarCollapsed = false;

  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
    if (isPlatformBrowser(this.platformId)) {
      const sidebar = document.querySelector('.sidebar');
      if (sidebar) {
        if (this.isSidebarCollapsed) {
          sidebar.classList.add('show');
        } else {
          sidebar.classList.remove('show');
        }
      }
    }
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('isAdminLoggedIn');
    }
    this.router.navigate(['/login']);
  }
}