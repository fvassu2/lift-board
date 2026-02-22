import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForkliftAnimationComponent } from './forklift-animation.component';

describe('ForkliftAnimationComponent', () => {
  let component: ForkliftAnimationComponent;
  let fixture: ComponentFixture<ForkliftAnimationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForkliftAnimationComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ForkliftAnimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default state as idle', () => {
    expect(component.state).toBe('idle');
  });

  it('should have default battery level as 100', () => {
    expect(component.batteryLevel).toBe(100);
  });

  it('should have default load weight as 0', () => {
    expect(component.loadWeight).toBe(0);
  });

  it('should have default fork height as 0', () => {
    expect(component.forkHeight).toBe(0);
  });

  describe('getBatteryColor', () => {
    it('should return green for battery level > 50', () => {
      component.batteryLevel = 75;
      expect(component.getBatteryColor()).toBe('#4ade80');
    });

    it('should return yellow for battery level between 20 and 50', () => {
      component.batteryLevel = 35;
      expect(component.getBatteryColor()).toBe('#fbbf24');
    });

    it('should return red for battery level < 20', () => {
      component.batteryLevel = 15;
      expect(component.getBatteryColor()).toBe('#ef4444');
    });
  });

  describe('getForkYPosition', () => {
    it('should return 120 when fork height is 0', () => {
      component.forkHeight = 0;
      expect(component.getForkYPosition()).toBe(120);
    });

    it('should return 40 when fork height is 100', () => {
      component.forkHeight = 100;
      expect(component.getForkYPosition()).toBe(40);
    });

    it('should return 80 when fork height is 50', () => {
      component.forkHeight = 50;
      expect(component.getForkYPosition()).toBe(80);
    });
  });

  describe('hasLoad', () => {
    it('should return false when load weight is 0', () => {
      component.loadWeight = 0;
      expect(component.hasLoad()).toBe(false);
    });

    it('should return true when load weight is greater than 0', () => {
      component.loadWeight = 100;
      expect(component.hasLoad()).toBe(true);
    });
  });
});
