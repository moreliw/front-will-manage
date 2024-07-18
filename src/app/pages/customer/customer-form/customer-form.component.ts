import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss'],
})
export class CustomerFormComponent implements OnInit {
  formValue: FormGroup;
  isEdit: boolean;
  title: string = 'Cliente';

  constructor(
    public fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.formValue = fb.group({
      description: [null, null],
      beginWork: [null, null],
      endWork: [null, null],
      latitude: [null, null],
      longitude: [null, null],
    });
  }

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
