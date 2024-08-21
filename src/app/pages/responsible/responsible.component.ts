import { Component, OnInit } from '@angular/core';
import { ResponsibleService } from '../../service/responsible.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Responsible } from '../../models/responsible';
@Component({
  selector: 'app-responsible',
  templateUrl: './responsible.component.html',
  styleUrls: ['./responsible.component.scss'],
})
export class ResponsibleComponent implements OnInit {
  responsibleList: Responsible[] = [];
  loading = false;
  constructor(
    private responsibleService: ResponsibleService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadResponsible();
  }

  addResponsible() {
    this.router.navigate(['/responsible/new']);
  }

  openEditResponsible(id: string) {
    this.router.navigate(['./edit/' + id], { relativeTo: this.route });
  }

  loadResponsible() {
    this.loading = true;
    this.responsibleService.getResponsibles().subscribe((result) => {
      this.responsibleList = result;
      this.loading = false;
    });
  }
}
