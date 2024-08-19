import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponsibleService } from 'src/app/service/responsible.service';

@Component({
  selector: 'app-responsible-form',
  templateUrl: './responsible-form.component.html',
  styleUrls: ['./responsible-form.component.scss'],
})
export class ResponsibleFormComponent implements OnInit {
  formValue: FormGroup;
  loading: false;
  constructor(
    private customersService: ResponsibleService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  goBack() {
    const currentUrl = this.route.snapshot.url;
    if (currentUrl[currentUrl.length - 1].path === 'new') {
      this.router.navigate(['../'], { relativeTo: this.route });
    } else {
      this.router.navigate(['../../'], { relativeTo: this.route });
    }
  }
}
