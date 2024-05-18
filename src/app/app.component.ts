import { ViewContainerRef, Component, ComponentRef } from '@angular/core';
import {TaskComponent} from './task/task.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'TimeTable';
  taskCount = 0
  taskList: ComponentRef<TaskComponent>[]  = [] 

  constructor(private viewContainerRef: ViewContainerRef){
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
    // element.style.top = `${top}px`;
    // element.style.left = `${left}px`;

    this.taskList.push(component);
  }

}


