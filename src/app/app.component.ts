import { Component,ChangeDetectorRef } from '@angular/core';
import { Coordinate } from './table/tablePosition'; 
import { SnappingGrid } from './task/snapping-grid'; 

@Component({
  selector: 'tt-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  // TODO NEXT:
  // -[] how to pass initial position to task without data binding ? 
  // -[] fix inaccurate snapping  
  // -[] deal with window resizing behaviour. if window gets to small

  title = 'TimeTable';

  taskCount = 0

  // old task list with real components
  // taskList: ComponentRef<TaskComponent>[]  = [] 
  
  // new task list with only neccessary data 
  taskList: Task[] = []

  // initial Position of task  
  initPosition: Coordinate = {x: 0, y: 0}

  // all in px: 
  columnWidth = 0  
  firstColumnWidth = 0 
  columnHeight = 30  // TODO: set as input (maybe get as output from children)
  tablePos: Coordinate = {x: 0, y: 0} // table position  

  snapGrid: SnappingGrid = {
    horizontalLines: [],
    xHorizontalStart: 0,
    xHorizontalEnd: 0,
    verticalLines: [],
    yVerticalStart: 0,
    yVerticalEnd: 0,
  }

  magneticRows = 48
  magneticColumns = 7

  constructor(){
  }

  createTask(): void {
    // set id
    let task: Task = {taskId: `task-${this.taskCount}`, taskContent: ""};
    this.taskCount++;

    // Calculate the position based on the viewport size and scroll position
    const scrollLeft = window.scrollX || window.pageXOffset;
    const scrollTop = window.scrollY || window.pageYOffset;

    const left = (window.innerWidth * 0.30) + scrollLeft;
    const top = (window.innerHeight * 0.30) + scrollTop;

    this.initPosition = {x: left, y: top}; 

    this.taskList.push(task);

    console.log("TaskList: ", this.taskList)

    // only needed when OnPush strategy is used i think 
    //this.cdr.markForCheck();
    //this.cdr.detectChanges();
  }

  setFirstColumnWidth(width: number){
    this.firstColumnWidth = width;
    this.calculateSnapGrid();
  }

  setColumnWidth(width: number){
    this.columnWidth = width;
    console.log("set column width");
    // this.taskList.forEach(task => { task.instance.width = this.columnWidth }); // not necessary anymore becaus bound to input element
    this.calculateSnapGrid();
  }

  onChangeTablePosition(pos: Coordinate) {
    this.tablePos = pos;
    console.log("Table Position x: ", this.tablePos.x);
    console.log("Table Position y: ", this.tablePos.y);
    this.calculateSnapGrid();
  }



  calculateSnapGrid(){

    this.snapGrid.horizontalLines = []
    this.snapGrid.verticalLines = []

    Array(this.magneticRows).fill(0).map((_, i) => 
      this.snapGrid.horizontalLines.push((this.tablePos.y + this.columnHeight) + this.columnHeight*i)
    );
    this.snapGrid.xHorizontalStart = this.tablePos.x + this.firstColumnWidth;
    this.snapGrid.xHorizontalStart = this.tablePos.x + this.firstColumnWidth + this.magneticColumns * this.columnWidth;

    Array(this.magneticColumns).fill(0).map((_, i) => 
      this.snapGrid.verticalLines.push(1 + (this.tablePos.x + this.firstColumnWidth) + (this.columnWidth)*i) // + i%4)
    );
    this.snapGrid.yVerticalStart = this.tablePos.y + this.columnHeight; 
    this.snapGrid.yVerticalEnd = this.tablePos.y + this.magneticRows * this.columnHeight;

    // total position y: position of table + position of horizontal line
    // total position x: position of tale + position of vertical line
    // check total position of task against total x & y position
  }
}

export type Task = { 
  taskId: string, 
  taskContent: string,
} 
