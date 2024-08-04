import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
// import { HammerModule } from '@angular/platform-browser';

declare var Hammer: any;

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [ CommonModule],
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.scss'
})
export class CanvasComponent implements AfterViewInit {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  private context!: CanvasRenderingContext2D;
  private scale = 1.0;
  private scaleFactor = 1.1;

  public x: any;

  public action: string = '';

  ngAfterViewInit(): void {
    this.context = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    this.draw();
    this.canvas.nativeElement.addEventListener('wheel', this.handleWheelEvent.bind(this));

    let self = this;

    const myElement = document.getElementById('canvas');

    var hammertime = new Hammer(myElement);
    hammertime.get('pinch').set({ enable: true });

    // hammertime.on('pinch', function(ev: any) {
    //   console.log(ev);
    //   self.x = ev;
    // });

    hammertime.on('pinchin', function(ev: any) {
      self.x = ev;
      self.action = 'pinchin';
      self.zoomOut();
    });

    hammertime.on('pinchout', function(ev: any) {
      self.x = ev;
      self.action = 'pinchout';
      self.zoomIn();
    });

  }

  private draw(): void {
    this.context.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    this.context.save();
    this.context.scale(this.scale, this.scale);
    this.context.fillRect(50, 50, 100, 100); // Draw a rectangle
    this.context.restore();
  }

  private handleWheelEvent(event: WheelEvent): void {
    event.preventDefault();
    if (event.deltaY < 0) {
      // Zoom in
      this.scale *= this.scaleFactor;
    } else {
      // Zoom out
      this.scale /= this.scaleFactor;
    }
    this.draw();
  }

  zoomIn(): void {
    this.triggerWheelEvent(-100); // Negative value for zoom in
  }

  zoomOut(): void {
    this.triggerWheelEvent(100); // Positive value for zoom out
  }

  private triggerWheelEvent(deltaY: number): void {
    const event = new WheelEvent('wheel', {
      deltaY: deltaY,
      bubbles: true,
      cancelable: true,
      view: window
    });
    this.canvas.nativeElement.dispatchEvent(event);
  }

}
