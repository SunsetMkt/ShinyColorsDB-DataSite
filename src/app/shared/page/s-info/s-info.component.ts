import { Component, OnChanges, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

import { environment } from 'src/environments/environment';

import { ShinyColorsApiService } from 'src/app/service/shinycolors-api/shinycolors-api.service';
import { UtilitiesService } from 'src/app/service/utilities/utilities.service';

import { SCard } from '../../interfaces/scard';
import { CardSupportSkill } from '../../interfaces/cardsupportskill';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-s-info',
  templateUrl: './s-info.component.html',
  styleUrls: ['./s-info.component.css'],
  host: {
    class: 'col-lg-10 col-md-8 col-sm-12 overflow-auto h-100',
  },
})
export class SInfoComponent implements OnInit {
  sCardUuid!: string;
  sCardInfo!: SCard;
  assetUrl: string;

  highlight!: number;

  boundedSkillList: Map<string, CardSupportSkill>[] = [];

  supportSkillBound = {
    "S_SSR": [60, 65, 70, 75, 80],
    "S_SR": [50, 55, 60, 65, 70],
    "S_R": [40, 45, 50, 55, 60],
    "S_N": [5, 10],
  }

  thisBound!: number[];

  constructor(
    private utilsService: UtilitiesService,
    private scApiService: ShinyColorsApiService,
    private route: ActivatedRoute,
    private router: Router,
    private meta: Meta,
    private title: Title
  ) { this.assetUrl = environment.assetUrl; }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.sCardUuid = params['uuid'];

      this.scApiService.getSCardInfo(this.sCardUuid)
        .pipe(catchError(err => {
          this.router.navigate(['/notfound']);
          return of(null);
        }))
        .subscribe((data) => {
          if (!data) { return; }
          this.sCardInfo = data;
          this.title.setTitle(this.sCardInfo.cardName);
          this.utilsService.generateCardMeta(this.sCardInfo).forEach(e => {
            this.meta.updateTag(e);
          });
          this.utilsService.emitActiveIds([this.sCardInfo.idol.idolId, this.sCardInfo.idol.unitId]);
          this.utilsService.emitMobileTitle(this.sCardInfo.cardName, true);
        });
    });
  }

  translateGetMethod(): string {
    return this.utilsService.translateGetMethod(this.sCardInfo.getMethod);
  }

  translateIdeaNote(): string {
    return this.utilsService.translateIdeaNote(this.sCardInfo.ideaMark);
  }

  convertHirameki(): string {
    return this.utilsService.convertHirameki(this.sCardInfo.idol.hirameki);
  }

  translateProficiency(p: string): string {
    return this.utilsService.translateProficiency(p);
  }

  updateState($event: number): void {
    this.highlight = $event
  }

  isSrCard(): boolean {
    return this.utilsService.isSrCard(this.sCardInfo.cardType);
  }
}
