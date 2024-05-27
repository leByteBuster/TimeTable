import { Coordinate } from './tablePosition'; 
import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output, QueryList, ViewChildren } from '@angular/core';

@Component({
  selector: 'tt-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})

export class TableComponent implements OnInit {

  firstColumnWidth = Infinity
  columnWidth = 0
  days =  ["","monday","tuesday","wednesday","thursday","friday","saturday","sunday"]

  @ViewChildren('tableCells') tableCells!: QueryList<ElementRef>;

  @Output() firstColumnWidthEmitter = new EventEmitter<number>();
  @Output() columnWidthEmitter = new EventEmitter<number>();
  @Output() tablePositionEmitter = new EventEmitter<Coordinate>();

  // TODO: position should not change on scroll because its page position
  @HostListener('window:scroll', ['$event']) onScroll() { // for window scroll events
    this.updateCellWidth();
    this.updateAbsolutePosition()
  }

  @HostListener('window:resize', ['$event']) onResize() {
    this.updateCellWidth();
    this.updateAbsolutePosition()
  }


  constructor(private el: ElementRef) {
  }

  ngOnInit(): void {
  }

   ngAfterViewInit() {
    this.updateCellWidth(); 
    this.updateAbsolutePosition();
  }

  updateCellWidth(){
    this.tableCells.forEach(cell => {
      let tmpWidth = cell.nativeElement.offsetWidth;
      this.columnWidth = tmpWidth  > this.columnWidth ? tmpWidth : this.columnWidth;
      this.firstColumnWidth = tmpWidth < this.firstColumnWidth ? tmpWidth : this.firstColumnWidth;
    });
    console.log("Column Width: ", this.columnWidth);
    console.log("First Column Width: ", this.firstColumnWidth);
    this.firstColumnWidthEmitter.emit(this.firstColumnWidth);
    this.columnWidthEmitter.emit(this.columnWidth);
  }

  updateAbsolutePosition() {
    let topleft: Coordinate = {
      x: window.pageXOffset + this.el.nativeElement.getBoundingClientRect().left, 
      y: window.pageYOffset + this.el.nativeElement.getBoundingClientRect().top
    }
    console.log("Absoulte Table Position: ", topleft.x, topleft.y);
    this.tablePositionEmitter.emit(topleft)
  }

}



