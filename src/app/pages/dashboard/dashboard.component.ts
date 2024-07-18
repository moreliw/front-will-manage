import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  hamBurger = document.querySelector('.toggle-btn');

  constructor(private router: Router) {}

  ngOnInit(): void {}

  toggle() {
    document.querySelector('#sidebar').classList.toggle('expand');
  }

  goToCustomers() {
    this.router.navigate(['/customers']);
  }
}
