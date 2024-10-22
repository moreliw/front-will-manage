import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PartnerService } from 'src/app/service/partner.service';
import { Partner } from 'src/app/models/partner';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-partner-form',
  templateUrl: './partner-form.component.html',
  styleUrls: ['./partner-form.component.scss'],
})
export class PartnerFormComponent implements OnInit {
  isEdit: boolean;
  title: string = 'Parceiro';
  formValue: FormGroup;
  id: string;
  partner: Partner;
  loading = false;

  status = [
    { value: 1, description: 'A ver' },
    { value: 2, description: 'Deve' },
  ];

  constructor(
    public fb: FormBuilder,
    private location: Location,
    private partnerService: PartnerService,
    private route: ActivatedRoute
  ) {
    this.isEdit = this.route.snapshot.paramMap.has('id');

    if (this.isEdit) {
      this.id = this.route.snapshot.paramMap.get('id');
    }

    this.formValue = fb.group({
      name: [null, Validators.required],
      email: [null, null],
      phone: [null, null],
      balance: [0],
      quantity: [0],
      status: [null],
      observation: [null],
    });
  }

  ngOnInit(): void {
    this.getData();
  }

  private getData() {
    this.id = this.route.snapshot.paramMap.get('id');

    if (this.id !== undefined && this.id != null) {
      this.loading = true;
      this.partnerService.getPartnerById(this.id).subscribe((partner) => {
        this.formValue.patchValue({
          ...partner,
        });
        this.loading = false;
      });
    }
  }

  addPartner() {
    console.log(this.formValue.value);
    this.partnerService.addPartner(this.formValue.value).subscribe(
      () => {
        this.goBack();
      },
      (error) => {
        console.log('Erro na requisição:', error);
      }
    );
  }

  updatePartner() {
    console.log(this.formValue.value);
    // this.partnerService.updatePartner(this.id, this.formValue.value).subscribe(
    //   () => {
    //     this.goBack();
    //   },
    //   () => {}
    // );
  }

  goBack() {
    this.location.back();
  }
}
