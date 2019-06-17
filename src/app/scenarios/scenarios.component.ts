import { animate, keyframes, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Scenario } from '../api/scenario';
import { ScenariosService } from '../service/scenarios.service';

@Component({
  selector: 'app-scenarios',
  templateUrl: './scenarios.component.html',
  styleUrls: ['./scenarios.component.css'],
  animations: [
    trigger('gridAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ transform: 'translateY(25px)', opacity: 0 }),
          stagger(100, [
            animate('.2s .2s cubic-bezier(0.0, 0.0, 0.2, 1)', keyframes([
              style({ transform: 'translateY(0px)', opacity: 1 }),
            ])),
          ])], { optional: true }),
        query(':leave', [
          stagger(100, [
            animate('.2s cubic-bezier(0.4, 0.0, 1, 1)', keyframes([
              style({ transform: 'translateY(25px)', opacity: 0 }),
            ])),
          ])], { optional: true }),
      ]),
    ]),
    trigger('noDataAnimation', [
      transition('void => *', [
        animate('.2s .2s cubic-bezier(0.0, 0.0, 0.2, 1)', keyframes([
          style({ height: 0, opacity: 0 }),
          style({ height: '*', opacity: 1 }),
        ])),
      ]),
    ]),
    trigger('spinnerAnimation', [
      transition('void => *', [
        animate('.2s cubic-bezier(0.0, 0.0, 0.2, 1)', keyframes([
          style({ transform: 'translate(-50%) scale(0)' }),
          style({ transform: 'translate(-50%) scale(1)' }),
        ])),
      ]),
      transition('* => void', [
        animate('.2s cubic-bezier(0.4, 0.0, 1, 1)', keyframes([
          style({ transform: 'translate(-50%) scale(0)' }),
        ])),
      ]),
    ]),
  ],
})
export class ScenariosComponent implements OnInit {
  scenarios$: Observable<Scenario[]>;
  breakpoint = 1;
  constructor(private scenariosService: ScenariosService) { }

  ngOnInit() {
    this.scenarios$ = this.scenariosService.getScenarios();
    //this.breakpoint = (window.innerWidth <= 400) ? 1 : 6;
    this.breakpoint = this.calcResp(window.innerWidth)
  }

  onResize(event) {
    //this.breakpoint = (event.target.innerWidth <= 400) ? 1 : 6;
    this.breakpoint = this.calcResp(event.target.innerWidth)
  }

  calcResp(width){

    width = width - 60;
    var anz = width / 300;

    return Math.round(anz);
  }



}
