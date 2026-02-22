import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forklift-kawaii',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './forklift-kawaii.component.html',
  styleUrls: ['./forklift-kawaii.component.scss']
})
export class ForkliftKawaiiComponent implements OnInit, OnDestroy {
  @Input() state: 'idle' | 'moving' | 'loading' | 'unloading' | 'error' = 'idle';
  @Input() direction: 'left' | 'right' = 'right';
  @Input() batteryLevel: number = 100;
  @Input() currentMission?: string;
  @Input() operatorName?: string;

  isBlinking = false;
  private blinkInterval?: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    // Random blink animation for idle and moving states
    if (this.state === 'idle' || this.state === 'moving') {
      this.startBlinkAnimation();
    }
  }

  ngOnDestroy(): void {
    if (this.blinkInterval) {
      clearInterval(this.blinkInterval);
    }
  }

  private startBlinkAnimation(): void {
    // Blink every 3-5 seconds randomly
    const scheduleNextBlink = () => {
      const delay = 3000 + Math.random() * 2000;
      setTimeout(() => {
        this.isBlinking = true;
        setTimeout(() => {
          this.isBlinking = false;
          scheduleNextBlink();
        }, 200);
      }, delay);
    };
    scheduleNextBlink();
  }

  get isLowBattery(): boolean {
    return this.batteryLevel < 20;
  }

  get batteryColor(): string {
    if (this.batteryLevel >= 60) return '#4ade80'; // Green
    if (this.batteryLevel >= 30) return '#fbbf24'; // Yellow
    return '#f87171'; // Red
  }
}
