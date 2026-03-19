import { Component, computed, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

export type LightColor = 'red' | 'yellow' | 'green';

export interface BinItem {
  label: string;
}

export interface DeliveryTask {
  productCode: string;
  productName: string;
  supplier: string;
  origin: string;
  destination: string;
  total: number;
  pallets: number;
  bins: BinItem[];
  note: string;
  device: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  readonly LIGHT_TRANSITION_DELAY_MS = 800;

  readonly task: DeliveryTask = {
    productCode: '123456',
    productName: 'PESCA NETTARINA P. GIALLA',
    supplier: 'Forn. MARIO ROSSI',
    origin: 'CELLA 1A',
    destination: 'LINEA 01',
    total: 10,
    pallets: 3,
    bins: [{ label: 'BINS 300' }, { label: 'BINS 352' }, { label: 'BINS 353' }],
    note: 'Nota: IMPILATE A 4',
    device: 'Muletto 1',
  };

  completed = signal(0);
  activeLight = signal<LightColor>('green');

  isCompleted = computed(() => this.completed() >= this.task.total);

  counterLabel = computed(
    () => `${this.completed()}/${this.task.total}`
  );

  noteText = computed(() =>
    this.isCompleted() ? 'Completato! ✓' : this.task.note
  );

  private lightTimer: ReturnType<typeof setTimeout> | null = null;

  confirm(): void {
    if (this.isCompleted()) return;

    this.completed.update(v => v + 1);

    if (this.lightTimer) {
      clearTimeout(this.lightTimer);
      this.lightTimer = null;
    }

    if (this.isCompleted()) {
      this.activeLight.set('red');
    } else {
      this.activeLight.set('yellow');
      this.lightTimer = setTimeout(
        () => this.activeLight.set('green'),
        this.LIGHT_TRANSITION_DELAY_MS
      );
    }
  }
}
