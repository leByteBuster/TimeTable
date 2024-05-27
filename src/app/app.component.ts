import { ViewContainerRef, Component, ComponentRef } from '@angular/core';
import {TaskComponent} from './task/task.component';
import { Coordinate } from './table/tablePosition'; 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'TimeTable';

  taskCount = 0
  taskList: ComponentRef<TaskComponent>[]  = [] 

  columnWidth = 0  
  firstColumnWidth = 0 
  tablePos: Coordinate = {x: 0, y: 0} // table position  
  columnHeight = 30  // TODO: set as input (maybe get as output from children)


  horizontalLines: number[] = [];
  xHorizontalStart =  0;
  xHorizontalEnd =  0;

  verticalLines: number[] = [];
  yVerticalStart =  0;
  yVerticalEnd =  0;

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
 
    // pass snapping object 
    
    // TODO next: set snapping object as input in component
    // create snapping object here 

    this.taskList.push(component);
  }

  setFirstColumnWidth(width: number){
    this.firstColumnWidth = width;
    console.log("output successful", width)
    this.calculateSnapGrid();
  }

  setColumnWidth(width: number){
    this.columnWidth = width;
    console.log("output successful", width)
    this.calculateSnapGrid();
  }

  onChangeTablePosition(pos: Coordinate) {
    this.tablePos = pos; 
    this.calculateSnapGrid();
  }

  calculateSnapGrid(){
    Array(this.magneticRows).fill(0).map((_, i) => 
      this.horizontalLines.push((this.tablePos.y + this.columnHeight) + this.columnHeight*i)
    );
    Array(this.magneticRows).fill(0).map((_, i) => 
      this.verticalLines.push((this.tablePos.x + this.firstColumnWidth) + this.columnWidth*i)
    );

    // total position y: position of table + position of horizontal line
    // total position x: position of tale + position of vertical line
    // check total position of task against total x & y position
  }
}

