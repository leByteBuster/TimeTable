import { ViewContainerRef, Component, ComponentRef } from '@angular/core';
import {TaskComponent} from './task/task.component';
import { Coordinate } from './table/tablePosition'; 
import { SnappingGrid } from './task/snapping-grid'; 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'TimeTable';

  taskCount = 0
  taskList: ComponentRef<TaskComponent>[]  = [] 

  // all in px: 
  columnWidth = 0  
  firstColumnWidth = 0 
  columnHeight = 30  // TODO: set as input (maybe get as output from children)
  tablePos: Coordinate = {x: 0, y: 0} // table position  

  snappingGrid: SnappingGrid = {
    horizontalLines: [],
    xHorizontalStart: 0,
    xHorizontalEnd: 0,
    verticalLines: [],
    yVerticalStart: 0,
    yVerticalEnd: 0,
  }

  magneticRows = 48
  magneticColumns = 7

  constructor(private viewContainerRef: ViewContainerRef){
  }

  // TODO NEXT: implement the passing of changes of table cell size
  // -[x] get width of cells  
  // -[] calculate where to snap using width of cells (has to be recalculated on every scolling - moving)
  // ngOnChanges gets called if something in parent changes (if input is changed)
  // called before ngOnInit (if component has input fields) 
  ngOnChanges(){
  }

  createTask(): void {
    const component = this.viewContainerRef.createComponent(TaskComponent);

    // set id
    component.instance.taskId = `task-${this.taskCount}`;
    this.taskCount++;

    // Calculate the position based on the viewport size and scroll position
    const scrollLeft = window.scrollX || window.pageXOffset;
    const scrollTop = window.scrollY || window.pageYOffset;

    const left = (window.innerWidth * 0.30) + scrollLeft;
    const top = (window.innerHeight * 0.30) + scrollTop;

    // Set the position
    component.instance.position.x = left
    component.instance.position.y = top

    // Set width of task to column width
    component.instance.width = this.columnWidth; 
 
    // pass snapping object 
    component.instance.snapGrip = this.snappingGrid;
    
    // TODO next: set snapping object as input in component
    // create snapping object here 

    this.taskList.push(component);
  }

  setFirstColumnWidth(width: number){
    this.firstColumnWidth = width;
    this.calculateSnapGrid();
  }

  setColumnWidth(width: number){
    this.columnWidth = width;
    console.log("set column width");
    this.taskList.forEach(task => { task.instance.width = this.columnWidth });
    this.calculateSnapGrid();
  }

  onChangeTablePosition(pos: Coordinate) {
    this.tablePos = pos;
    console.log("Table Position x: ", this.tablePos.x);
    console.log("Table Position y: ", this.tablePos.y);
    this.calculateSnapGrid();
  }



  calculateSnapGrid(){

    this.snappingGrid.horizontalLines = []
    this.snappingGrid.verticalLines = []

    Array(this.magneticRows).fill(0).map((_, i) => 
      this.snappingGrid.horizontalLines.push((this.tablePos.y + this.columnHeight) + this.columnHeight*i)
    );
    this.snappingGrid.xHorizontalStart = this.tablePos.x + this.firstColumnWidth;
    this.snappingGrid.xHorizontalStart = this.tablePos.x + this.firstColumnWidth + this.magneticColumns * this.columnWidth;

    Array(this.magneticColumns).fill(0).map((_, i) => 
      this.snappingGrid.verticalLines.push(1 + (this.tablePos.x + this.firstColumnWidth) + (this.columnWidth)*i) // + i%4)
    );
    this.snappingGrid.yVerticalStart = this.tablePos.y + this.columnHeight; 
    this.snappingGrid.yVerticalEnd = this.tablePos.y + this.magneticRows * this.columnHeight;

    // total position y: position of table + position of horizontal line
    // total position x: position of tale + position of vertical line
    // check total position of task against total x & y position
  }
}


