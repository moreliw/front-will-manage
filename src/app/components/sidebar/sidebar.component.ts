import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/pages/auth/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  constructor(private router: Router, private auth: AuthService) {}

  ngOnInit(): void {}

  toggle() {
    document.querySelector('#sidebar').classList.toggle('expand');
  }

  goToCustomers() {
    this.router.navigate(['/customers']);
  }

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/login').then(() => {
      window.location.reload();
    });
  }
}
