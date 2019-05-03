import { Component, Inject, OnInit } from '@angular/core';
import {MAT_SNACK_BAR_DATA} from '@angular/material';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
})
export class AlertComponent implements OnInit {
  public icon: 'info' | 'check_circle' | 'warning' | 'error';
  public message: string;

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {
    this.icon = data.icon;
    this.message = data.message;
  }

  ngOnInit() { }

}
