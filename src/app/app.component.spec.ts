import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should have default forklift state as idle', () => {
    expect(component.forkliftState).toBe('idle');
  });

  it('should change state when setState is called', () => {
    component.setState('moving');
    expect(component.forkliftState).toBe('moving');
  });

  it('should correctly identify active state', () => {
    component.setState('lifting');
    expect(component.isStateActive('lifting')).toBe(true);
    expect(component.isStateActive('idle')).toBe(false);
  });
});
