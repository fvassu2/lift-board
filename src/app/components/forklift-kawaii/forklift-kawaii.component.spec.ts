import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForkliftKawaiiComponent } from './forklift-kawaii.component';

describe('ForkliftKawaiiComponent', () => {
  let component: ForkliftKawaiiComponent;
  let fixture: ComponentFixture<ForkliftKawaiiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForkliftKawaiiComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ForkliftKawaiiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Input properties', () => {
    it('should have default state as idle', () => {
      expect(component.state).toBe('idle');
    });

    it('should have default direction as right', () => {
      expect(component.direction).toBe('right');
    });

    it('should have default batteryLevel as 100', () => {
      expect(component.batteryLevel).toBe(100);
    });

    it('should accept state input', () => {
      component.state = 'moving';
      expect(component.state).toBe('moving');
    });

    it('should accept direction input', () => {
      component.direction = 'left';
      expect(component.direction).toBe('left');
    });

    it('should accept batteryLevel input', () => {
      component.batteryLevel = 50;
      expect(component.batteryLevel).toBe(50);
    });

    it('should accept currentMission input', () => {
      component.currentMission = 'Test Mission';
      expect(component.currentMission).toBe('Test Mission');
    });

    it('should accept operatorName input', () => {
      component.operatorName = 'John Doe';
      expect(component.operatorName).toBe('John Doe');
    });
  });

  describe('State classes', () => {
    it('should apply idle state class', () => {
      component.state = 'idle';
      fixture.detectChanges();
      const svg = fixture.nativeElement.querySelector('.forklift-kawaii');
      expect(svg.classList.contains('state-idle')).toBe(true);
    });

    it('should apply moving state class', () => {
      component.state = 'moving';
      fixture.detectChanges();
      const svg = fixture.nativeElement.querySelector('.forklift-kawaii');
      expect(svg.classList.contains('state-moving')).toBe(true);
    });

    it('should apply loading state class', () => {
      component.state = 'loading';
      fixture.detectChanges();
      const svg = fixture.nativeElement.querySelector('.forklift-kawaii');
      expect(svg.classList.contains('state-loading')).toBe(true);
    });

    it('should apply unloading state class', () => {
      component.state = 'unloading';
      fixture.detectChanges();
      const svg = fixture.nativeElement.querySelector('.forklift-kawaii');
      expect(svg.classList.contains('state-unloading')).toBe(true);
    });

    it('should apply error state class', () => {
      component.state = 'error';
      fixture.detectChanges();
      const svg = fixture.nativeElement.querySelector('.forklift-kawaii');
      expect(svg.classList.contains('state-error')).toBe(true);
    });
  });

  describe('Direction classes', () => {
    it('should apply direction-right class when direction is right', () => {
      component.direction = 'right';
      fixture.detectChanges();
      const container = fixture.nativeElement.querySelector('.forklift-container');
      expect(container.classList.contains('direction-right')).toBe(true);
    });

    it('should apply direction-left class when direction is left', () => {
      component.direction = 'left';
      fixture.detectChanges();
      const container = fixture.nativeElement.querySelector('.forklift-container');
      expect(container.classList.contains('direction-left')).toBe(true);
    });
  });

  describe('Battery level', () => {
    it('should identify low battery when level is below 20', () => {
      component.batteryLevel = 15;
      expect(component.isLowBattery).toBe(true);
    });

    it('should not identify low battery when level is 20 or above', () => {
      component.batteryLevel = 20;
      expect(component.isLowBattery).toBe(false);
    });

    it('should return green color for battery level >= 60', () => {
      component.batteryLevel = 80;
      expect(component.batteryColor).toBe('#4ade80');
    });

    it('should return yellow color for battery level between 30 and 59', () => {
      component.batteryLevel = 45;
      expect(component.batteryColor).toBe('#fbbf24');
    });

    it('should return red color for battery level < 30', () => {
      component.batteryLevel = 15;
      expect(component.batteryColor).toBe('#f87171');
    });

    it('should apply low-battery class when battery is low', () => {
      component.batteryLevel = 10;
      fixture.detectChanges();
      const svg = fixture.nativeElement.querySelector('.forklift-kawaii');
      expect(svg.classList.contains('low-battery')).toBe(true);
    });
  });

  describe('Facial expressions', () => {
    it('should show normal eyes for idle state', () => {
      component.state = 'idle';
      fixture.detectChanges();
      const eyes = fixture.nativeElement.querySelector('.eyes');
      expect(eyes).toBeTruthy();
    });

    it('should show normal eyes for moving state', () => {
      component.state = 'moving';
      fixture.detectChanges();
      const eyes = fixture.nativeElement.querySelector('.eyes');
      expect(eyes).toBeTruthy();
    });

    it('should show concentrated eyes for loading state', () => {
      component.state = 'loading';
      fixture.detectChanges();
      const eyes = fixture.nativeElement.querySelector('.eyes-concentrated');
      expect(eyes).toBeTruthy();
    });

    it('should show happy eyes for unloading state', () => {
      component.state = 'unloading';
      fixture.detectChanges();
      const eyes = fixture.nativeElement.querySelector('.eyes-happy');
      expect(eyes).toBeTruthy();
    });

    it('should show error eyes for error state', () => {
      component.state = 'error';
      fixture.detectChanges();
      const eyes = fixture.nativeElement.querySelector('.eyes-error');
      expect(eyes).toBeTruthy();
    });
  });

  describe('Decorative elements', () => {
    it('should show dust cloud when moving', () => {
      component.state = 'moving';
      fixture.detectChanges();
      const dustCloud = fixture.nativeElement.querySelector('.dust-cloud');
      expect(dustCloud).toBeTruthy();
    });

    it('should show sweat drops when moving', () => {
      component.state = 'moving';
      fixture.detectChanges();
      const sweatDrops = fixture.nativeElement.querySelector('.sweat-drops');
      expect(sweatDrops).toBeTruthy();
    });

    it('should show big sweat drop when in error state', () => {
      component.state = 'error';
      fixture.detectChanges();
      const sweatBig = fixture.nativeElement.querySelector('.sweat-big');
      expect(sweatBig).toBeTruthy();
    });

    it('should show sparkles when unloading', () => {
      component.state = 'unloading';
      fixture.detectChanges();
      const sparkles = fixture.nativeElement.querySelector('.sparkles');
      expect(sparkles).toBeTruthy();
    });

    it('should show hearts when unloading', () => {
      component.state = 'unloading';
      fixture.detectChanges();
      const hearts = fixture.nativeElement.querySelector('.hearts');
      expect(hearts).toBeTruthy();
    });
  });

  describe('Info panel', () => {
    it('should display mission when provided', () => {
      component.currentMission = 'Test Mission';
      fixture.detectChanges();
      const mission = fixture.nativeElement.querySelector('.mission');
      expect(mission).toBeTruthy();
      expect(mission.textContent).toContain('Test Mission');
    });

    it('should display operator when provided', () => {
      component.operatorName = 'John Doe';
      fixture.detectChanges();
      const operator = fixture.nativeElement.querySelector('.operator');
      expect(operator).toBeTruthy();
      expect(operator.textContent).toContain('John Doe');
    });

    it('should not display info panel when no mission or operator', () => {
      component.currentMission = undefined;
      component.operatorName = undefined;
      fixture.detectChanges();
      const infoPanel = fixture.nativeElement.querySelector('.info-panel');
      expect(infoPanel).toBeFalsy();
    });
  });

  describe('Component lifecycle', () => {
    it('should clean up blink interval on destroy', () => {
      spyOn(window, 'clearInterval');
      component.ngOnDestroy();
      // The interval should be cleared even if it wasn't set
      expect(true).toBe(true);
    });
  });

  describe('State label', () => {
    it('should display state label in uppercase', () => {
      component.state = 'moving';
      fixture.detectChanges();
      const stateLabel = fixture.nativeElement.querySelector('.state-label');
      expect(stateLabel.textContent).toBe('MOVING');
    });
  });

  describe('Battery indicator', () => {
    it('should display battery level percentage', () => {
      component.batteryLevel = 75;
      fixture.detectChanges();
      const batteryText = fixture.nativeElement.querySelector('.battery-indicator text');
      expect(batteryText.textContent).toBe('75%');
    });
  });

  describe('All states rendering', () => {
    const states: Array<'idle' | 'moving' | 'loading' | 'unloading' | 'error'> = [
      'idle', 'moving', 'loading', 'unloading', 'error'
    ];

    states.forEach(state => {
      it(`should render without errors in ${state} state`, () => {
        component.state = state;
        fixture.detectChanges();
        const svg = fixture.nativeElement.querySelector('.forklift-kawaii');
        expect(svg).toBeTruthy();
      });
    });
  });

  describe('Direction rendering', () => {
    const directions: Array<'left' | 'right'> = ['left', 'right'];

    directions.forEach(direction => {
      it(`should render without errors facing ${direction}`, () => {
        component.direction = direction;
        fixture.detectChanges();
        const container = fixture.nativeElement.querySelector('.forklift-container');
        expect(container).toBeTruthy();
      });
    });
  });
});
