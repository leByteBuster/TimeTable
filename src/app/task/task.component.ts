import { ChangeDetectorRef, Component, ElementRef, NgZone, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent {

  taskId: string = ""; 

  dragging = false 
  resizing = false 

  // initialize empty function 
  removeResizeListener: () => void = () => {};
  removeStopResizeListener: () => void = () => {};
  removeDraggingListener: () => void = () => {};
  removeStopDraggingListener: () => void = () => {};

  height = 100; 
  minHeight = 30;

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

  constructor(private ngZone: NgZone, private renderer: Renderer2,  private cdr: ChangeDetectorRef) { 
  }

  onStartResizeUpper(event: MouseEvent){
    this.resizing = true;
    this.mousePosition.y = event.clientY;

    // Listen to mousemove event outside ng zone
    this.ngZone.runOutsideAngular(() => {
      this.removeResizeListener = this.renderer.listen(document, 'mousemove', this.resizeUpper);
    })

    // Listen to mousemove event outside ng zone
    this.ngZone.runOutsideAngular(() => {
      this.removeStopResizeListener = this.renderer.listen(document, 'mouseup', this.stopResizing);
    })
  }

  resizeUpper = (event: MouseEvent) => {
    if (!this.resizing) return;
    
    let dist = this.mousePosition.y - event.clientY;
    this.mousePosition.y = event.clientY;
    
    if(this.height + dist >= this.minHeight){
      this.height = this.height + dist; 
      this.position.y = this.position.y - dist; 
    }

    // manually mark as changed within the angular zone so change detection  
    // this only triggers change detection for this element and its children 
    this.ngZone.run(() => {
       this.cdr.markForCheck();
    });
  }

  onStartResizeLower(event: MouseEvent){
    this.resizing = true;
    this.mousePosition.y = event.clientY;
  
    // Listen to mousemove event outside ng zone
    this.ngZone.runOutsideAngular(() => {
      this.removeResizeListener = this.renderer.listen(document, 'mousemove', this.resizeLower);
    })

    // Listen to mousemove event outside ng zone
    this.ngZone.runOutsideAngular(() => {
      this.removeStopResizeListener = this.renderer.listen(document, 'mouseup', this.stopResizing);
    })
  }

  resizeLower = (event: MouseEvent) => {
    if (!this.resizing) return;

    let dist = event.clientY - this.mousePosition.y; 
    this.mousePosition.y = event.clientY;

    if(this.height + dist >= this.minHeight){
      this.height = this.height + dist; 
    }

    // manually mark as changed within the angular zone so change detection  
    // this only triggers change detection for this element and its children 
    this.ngZone.run(() => {
       this.cdr.markForCheck();
    });
  }

  stopResizing = () => {
    this.resizing = false;

    this.removeResizeListener();
    this.removeResizeListener = () => {};
    this.removeStopResizeListener();
    this.removeStopResizeListener = () => {};

    // mark for check - just to avoid unexpected behaviour 
    this.ngZone.run(() => {
       this.cdr.markForCheck();
    });
  }


  onStartDragging(event: MouseEvent) {

    this.dragging = true;

    this.mousePosition.x = event.clientX;
    this.mousePosition.y = event.clientY;

    this.offset.x = this.mousePosition.x - this.position.x
    this.offset.y = this.mousePosition.y - this.position.y

    // Listen to mousemove event outside ng zone
    this.ngZone.runOutsideAngular(() => {
      this.removeDraggingListener = this.renderer.listen(document, 'mousemove', this.onDragging);
    })

    // Listen to mousemove event outside ng zone
    this.ngZone.runOutsideAngular(() => {
      this.removeStopDraggingListener = this.renderer.listen(document, 'mouseup', this.stopDragging);
    })
  }

  onDragging = (event: MouseEvent) => {
    if (!this.dragging) return;
    this.position.x = event.clientX - this.offset.x;
    this.position.y = event.clientY - this.offset.y;

    // manually mark as changed within the angular zone so change detection  
    // this only triggers change detection for this element and its children 
    this.ngZone.run(() => {
       this.cdr.markForCheck();
    });
  };

  stopDragging = () => {
    this.dragging = false;

    this.removeDraggingListener();
    this.removeDraggingListener = () => {};
    this.removeStopDraggingListener();
    this.removeStopDraggingListener = () => {};
   
    // mark for check - otherwise cursor is not updated and still 'grabbing'
    this.ngZone.run(() => {
       this.cdr.markForCheck();
    });
  };

}
