import { Component, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {

  taskId: string = ""; 

  dragging = false 
  resizing = false 

  height = 100; 
  minHeight = 20;

  // current task position
  position = {
    x: 0,
    y: 0
  }

  // last mouse position (is only updated according the needs of the current event)
  mousePosition = {
    x: 0,
    y: 0
  }

  // offset between pointer and window (is only updated according the needs of the current event)
  offset = { 
    x: 0,
    y: 0
  }

  constructor() { 
  }

  ngOnInit(): void {
  }

  onStartResizeUpper(event: MouseEvent){
    this.resizing = true;
    this.mousePosition.y = event.clientY;

    // Listen to mousemove and mouseup events on document
    document.addEventListener('mousemove', this.resizeUpper);
    document.addEventListener('mouseup', this.stopResizing);
  }

  resizeUpper = (event: MouseEvent) => {
    if (!this.resizing) return;

    let dist = this.mousePosition.y - event.clientY;
    this.mousePosition.y = event.clientY;

    if(this.height + dist >= this.minHeight){
      this.height = this.height + dist; 
      this.position.y = this.position.y - dist; 
    }
  }

  onStartResizeLower(event: MouseEvent){
    this.resizing = true;
    this.mousePosition.y = event.clientY;
  
    // Listen to mousemove and mouseup events on document
    document.addEventListener('mousemove', this.resizeLower);
    document.addEventListener('mouseup', this.stopResizing);
  }

  resizeLower = (event: MouseEvent) => {
    if (!this.resizing) return;

    let dist = event.clientY - this.mousePosition.y; 
    this.mousePosition.y = event.clientY;

    if(this.height + dist >= this.minHeight){
      this.height = this.height + dist; 
    }
  }

  stopResizing = () => {
    this.resizing = false;
    console.log("stopped resizing ")
    document.removeEventListener('mousemove', this.resizeLower);
    document.removeEventListener('mousemove', this.resizeUpper);
    document.removeEventListener('mouseup', this.stopResizing);
  }


  onStartDragging(event: MouseEvent) {

    this.dragging = true;

    this.mousePosition.x = event.clientX;
    this.mousePosition.y = event.clientY;

    this.offset.x = this.mousePosition.x - this.position.x
    this.offset.y = this.mousePosition.y - this.position.y

    // Listen to mousemove and mouseup events on document
    document.addEventListener('mousemove', this.onDragging);
    document.addEventListener('mouseup', this.stopDragging);
  }

  onDragging = (event: MouseEvent) => {
    if (!this.dragging) return;
    this.position.x = event.clientX - this.offset.x;
    this.position.y = event.clientY - this.offset.y;
  };

  stopDragging = () => {
    this.dragging = false;
    document.removeEventListener('mousemove', this.onDragging);
    document.removeEventListener('mouseup', this.stopDragging);
  };

}
