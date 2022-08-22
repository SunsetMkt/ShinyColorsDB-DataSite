import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { subscribeOn, switchMap } from 'rxjs/operators';

import { ShinycolorsApiService } from 'src/app/service/shinycolors-api/shinycolors-api.service';
import { StorageService } from 'src/app/service/storage/storage.service';
import { Card } from '../../interfaces/card';
import { Idol } from '../../interfaces/idol';

@Component({
  selector: 'app-i-info',
  templateUrl: './i-info.component.html',
  styleUrls: ['./i-info.component.css'],
  host: {
    class: 'col-lg-10 col-md-8 col-sm-12 h-100',
  },
})
export class IInfoComponent implements OnInit {
  idolInfo!: Idol;
  idolId!: number;
  togglePS = true;

  pSSR: Card[] = [];
  pSR: Card[] = [];
  pR: Card[] = [];
  sSSR: Card[] = [];
  sSR: Card[] = [];
  sR: Card[] = [];
  sN: Card[] = [];

  constructor(
    private scApiService: ShinycolorsApiService,
    private route: ActivatedRoute,
    private storageService: StorageService
  ) {}

  private classifyType(card: Card): void {
    switch (card.cardType) {
      case 'P_SSR':
        this.pSSR.push(card);
        break;
      case 'P_SR':
        this.pSR.push(card);
        break;
      case 'P_R':
        this.pR.push(card);
        break;
      case 'S_SSR':
        this.sSSR.push(card);
        break;
      case 'S_SR':
        this.sSR.push(card);
        break;
      case 'S_R':
        this.sR.push(card);
        break;
      case 'S_N':
        this.sN.push(card);
        break;
      default:
        console.error(card);
    }
  }

  private resetCards(): void {
    this.pSSR = [];
    this.pSR = [];
    this.pR = [];
    this.sSSR = [];
    this.sSR = [];
    this.sR = [];
    this.sN = [];
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.idolId = Number(params['idolid']);

      this.scApiService.getIdolInfo(this.idolId).subscribe((data) => {
        this.resetCards();

        this.storageService.setIds(this.idolId, data.unitId);

        this.idolInfo = data;
        this.idolInfo.cardLists.forEach((card) => {
          this.classifyType(card);
        });
      });
    });
  }
}