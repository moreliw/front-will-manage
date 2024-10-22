import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Partner } from 'src/app/models/partner';
import { PartnerService } from '../../service/partner.service';
import { BalanceComponent } from 'src/app/components/balance/balance.component';
import { MatDialog } from '@angular/material/dialog';
import { UtilService } from 'src/app/service/util.service';
@Component({
  selector: 'app-partner',
  templateUrl: './partner.component.html',
  styleUrls: ['./partner.component.scss'],
})
export class PartnerComponent implements OnInit {
  partnerList: Partner[] = [];
  loading = false;
  constructor(
    private router: Router,
    private partnerService: PartnerService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    public util: UtilService
  ) {}

  ngOnInit(): void {
    this.loadPartner();
  }

  loadPartner() {
    this.loading = true;
    this.partnerService.getPartners().subscribe((result) => {
      this.partnerList = result;
      this.loading = false;
    });
  }

  addPartner() {
    this.router.navigate(['/partner/new']);
  }

  openEditPartner(id: string) {
    this.router.navigate(['./edit/' + id], { relativeTo: this.route });
  }

  openBalance(id: string, balance: number) {
    const data = {
      id: id,
      balance: balance,
      partner: true,
    };
    const dialogRef = this.dialog.open(BalanceComponent, {
      width: '500px',
      data: data,
    });

    dialogRef.afterClosed().subscribe(() => {
      this.loadPartner();
    });
  }

  toMoney(value: number): string {
    if (value === null || value === undefined) {
      return '';
    }
    return (
      'R$ ' +
      value.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  }
}
