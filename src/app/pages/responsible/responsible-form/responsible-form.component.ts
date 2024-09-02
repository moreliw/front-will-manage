import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  loading = false;
  isEdit: boolean;
  title: string = 'Dentista';
  id: string;

  constructor(
    private responsibleService: ResponsibleService,
    private router: Router,
    private route: ActivatedRoute,
    public fb: FormBuilder
  ) {
    this.isEdit = this.route.snapshot.paramMap.has('id');

    if (this.isEdit) {
      this.id = this.route.snapshot.paramMap.get('id');
    }

    this.formValue = fb.group({
      name: [null, Validators.required],
      email: [null, null],
      phone: [null, null],
    });
  }

  ngOnInit(): void {
    this.getData();
  }

  private getData() {
    this.id = this.route.snapshot.paramMap.get('id');

    if (this.id !== undefined && this.id != null) {
      this.loading = true;
      this.responsibleService
        .getResponsibleById(this.id)
        .subscribe((responsible) => {
          this.formValue.patchValue({
            ...responsible,
          });
          this.loading = false;
        });
    }
  }

  addResponsible() {
    this.responsibleService.addResponsible(this.formValue.value).subscribe(
      () => {
        this.goBack();
      },
      () => {}
    );
  }

  updateResponsible() {
    this.responsibleService
      .updateResponsible(this.id, this.formValue.value)
      .subscribe(
        () => {
          this.goBack();
        },
        () => {}
      );
  }

  goBack() {
    const currentUrl = this.route.snapshot.url;
    if (currentUrl[currentUrl.length - 1].path === 'new') {
      this.router.navigate(['../'], { relativeTo: this.route });
    } else {
      this.router.navigate(['../../'], { relativeTo: this.route });
    }
  }
}
