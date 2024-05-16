import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'tt-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  days =  ["","monday","tuesday","wednesday","thursday","friday","saturday","sunday"]

  constructor() {
  }

  ngOnInit(): void {
  }

}
