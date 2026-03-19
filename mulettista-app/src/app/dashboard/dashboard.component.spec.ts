import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with counter at 0', () => {
    expect(component.completed()).toBe(0);
  });

  it('should start with green light active', () => {
    expect(component.activeLight()).toBe('green');
  });

  it('should not be completed initially', () => {
    expect(component.isCompleted()).toBeFalse();
  });

  it('counterLabel should reflect completed/total', () => {
    expect(component.counterLabel()).toBe('0/10');
  });

  it('confirm() should increment counter', () => {
    component.confirm();
    expect(component.completed()).toBe(1);
    expect(component.counterLabel()).toBe('1/10');
  });

  it('confirm() should set light yellow then green', fakeAsync(() => {
    component.confirm();
    expect(component.activeLight()).toBe('yellow');
    tick(component.LIGHT_TRANSITION_DELAY_MS);
    expect(component.activeLight()).toBe('green');
  }));

  it('confirm() at total should set red light and completed state', fakeAsync(() => {
    for (let i = 0; i < 10; i++) {
      component.confirm();
      tick(component.LIGHT_TRANSITION_DELAY_MS);
    }
    expect(component.isCompleted()).toBeTrue();
    expect(component.activeLight()).toBe('red');
    expect(component.noteText()).toBe('Completato! ✓');
  }));

  it('confirm() should not exceed total', fakeAsync(() => {
    for (let i = 0; i < 12; i++) {
      component.confirm();
      tick(component.LIGHT_TRANSITION_DELAY_MS);
    }
    expect(component.completed()).toBe(10);
  }));

  it('should render CELLA 1A and LINEA 01 route labels', () => {
    const labels = fixture.nativeElement.querySelectorAll('.route-label');
    expect(labels[0].textContent).toContain('CELLA 1A');
    expect(labels[1].textContent).toContain('LINEA 01');
  });

  it('should render all three BIN items', () => {
    const bins = fixture.nativeElement.querySelectorAll('.bin-item');
    expect(bins.length).toBe(3);
    expect(bins[0].textContent).toContain('BINS 300');
    expect(bins[1].textContent).toContain('BINS 352');
    expect(bins[2].textContent).toContain('BINS 353');
  });

  it('should render CONFIRM button', () => {
    const btn = fixture.nativeElement.querySelector('.confirm-btn');
    expect(btn).not.toBeNull();
    expect(btn.textContent).toContain('CONFIRM');
  });
});

