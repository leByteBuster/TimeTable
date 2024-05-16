import { Component, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {

  taskId: string = ""; 

  dragging = false 

  position = {
    x: 0,
    y: 0
  }

  mousePosition = {
    x: 0,
    y: 0
  }

  offset = { 
    x: 0,
    y: 0
  }

  constructor() { 
  }

  ngOnInit(): void {
  }

  onMouseDown(event: MouseEvent) {

    this.dragging = true;

    this.mousePosition.x = event.clientX;
    this.mousePosition.y = event.clientY;


    console.log("Mouse Position X", this.mousePosition.x)
    console.log("Mouse Position Y", this.mousePosition.y)

    const element = event.target as HTMLElement;
    const rect = element.getBoundingClientRect();

    this.position.x = rect.left
    this.position.y = rect.top

    console.log("Element Position X", this.position.x)
    console.log("Element Position Y", this.position.y)
    console.log("Element width", rect.width)
    console.log("Element height", rect.height)

    this.offset.x = this.mousePosition.x - this.position.x
    this.offset.y = this.mousePosition.y - this.position.y

    console.log("Offset X", this.offset.x)
    console.log("Offset Y", this.offset.y)


    // Listen to mousemove and mouseup events on document
    document.addEventListener('mousemove', this.mouseMove);
    document.addEventListener('mouseup', this.stopDragging);
  }

  mouseMove = (event: MouseEvent) => {
    if (!this.dragging) return;
    this.position.x = event.clientX - this.offset.x;
    this.position.y = event.clientY - this.offset.y;
  };

  stopDragging = () => {
    this.dragging = false;
    document.removeEventListener('mousemove', this.mouseMove);
    document.removeEventListener('mouseup', this.stopDragging);
  };

}
