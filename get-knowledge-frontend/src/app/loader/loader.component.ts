import { Component, OnInit } from '@angular/core';
import {LoaderService} from "../services/loader.service";
import {animate, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({opacity:0}),
        animate(50, style({opacity:1}))
      ]),
      transition(':leave', [
        animate(100, style({opacity:0}))
      ])
    ])
  ]

})
export class LoaderComponent implements OnInit {

  constructor(public loaderService: LoaderService) { }

  ngOnInit() {
  }

}
