import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  toggle() {
    document.querySelector('#sidebar').classList.toggle('expand');
  }

  goToCustomers() {
    this.router.navigate(['/customers']);
  }
}
