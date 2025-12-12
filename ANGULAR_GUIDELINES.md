# Linee Guida per lo Sviluppo Angular

Questo documento definisce gli standard e le best practices per lo sviluppo Angular nel progetto lift-board. Tutte le linee guida qui descritte sono vincolanti per tutto il codice del progetto.

## 1. Architettura dei Componenti

### Componenti Standalone
**Tutti i componenti devono essere standalone** - non utilizzare NgModules per i componenti.

### Separazione dei File
Ogni componente deve avere file separati per:
- TypeScript (`.ts`)
- HTML (`.html`)
- SCSS (`.scss`)

### Struttura delle Cartelle
```
src/app/components/my-component/
├── my-component.component.ts
├── my-component.component.html
└── my-component.component.scss
```

## 2. Template dei Componenti Standalone

Esempio di componente standalone corretto:

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    // Altri moduli necessari
  ],
  templateUrl: './my-component.component.html',
  styleUrls: ['./my-component.component.scss']
})
export class MyComponentComponent {
  // Logica del componente
}
```

**Punti chiave:**
- `standalone: true` è obbligatorio
- Usare sempre `templateUrl` invece di `template` inline
- Usare sempre `styleUrls` invece di `styles` inline
- Import espliciti di tutti i moduli necessari nell'array `imports`

## 3. Librerie Standard da Utilizzare

### Angular Material

Usare Angular Material per tutti i componenti UI. Ogni componente standalone deve importare esplicitamente i moduli Material necessari.

#### Moduli Comunemente Utilizzati

```typescript
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
```

### Flex Layout (fxFlex)

Utilizzare `@angular/flex-layout` per il layout responsive.

#### Import nel Componente

```typescript
import { FlexLayoutModule } from '@angular/flex-layout';

@Component({
  // ...
  imports: [
    CommonModule,
    FlexLayoutModule,
    // ...
  ]
})
```

#### Esempi di Utilizzo

```html
<!-- Layout con fxLayout -->
<div fxLayout="row" fxLayoutAlign="center center">
  <div fxFlex="50">Colonna 1</div>
  <div fxFlex="50">Colonna 2</div>
</div>

<!-- Layout responsive -->
<div fxLayout="row" fxLayout.xs="column">
  <div fxFlex="33">Box 1</div>
  <div fxFlex="33">Box 2</div>
  <div fxFlex="33">Box 3</div>
</div>

<!-- Spaziatura con fxLayoutGap -->
<div fxLayout="row" fxLayoutGap="16px">
  <button mat-raised-button>Button 1</button>
  <button mat-raised-button>Button 2</button>
</div>
```

## 4. Best Practices

### File TypeScript (.ts)

- ✅ Usare sempre `templateUrl` invece di `template` inline
- ✅ Usare sempre `styleUrls` invece di `styles` inline
- ✅ Implementare interfacce per i dati
- ✅ Usare TypeScript strict mode
- ✅ Definire tipi espliciti per proprietà e parametri
- ✅ Evitare `any`, preferire tipi specifici o `unknown`

#### Esempio di Interfaccia

```typescript
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
}

@Component({
  // ...
})
export class UserListComponent {
  users: User[] = [];
  
  addUser(user: User): void {
    this.users.push(user);
  }
}
```

### File HTML (.html)

- ✅ Mantenere i template puliti e leggibili
- ✅ Usare direttive strutturali Angular (`*ngIf`, `*ngFor`, `*ngSwitch`)
- ✅ Preferire fxFlex per il layout invece di CSS custom
- ✅ Usare pipe per formattazione (date, currency, etc.)
- ✅ Evitare logica complessa nei template

#### Esempio di Template

```html
<div fxLayout="column" fxLayoutGap="16px">
  <mat-card *ngFor="let user of users">
    <mat-card-header>
      <mat-card-title>{{ user.name }}</mat-card-title>
    </mat-card-header>
    <mat-card-content>
      <p>Email: {{ user.email }}</p>
      <p *ngIf="user.role === 'admin'">Administrator</p>
    </mat-card-content>
  </mat-card>
</div>
```

### File SCSS (.scss)

- ✅ Usare SCSS, non CSS puro
- ✅ Evitare stili globali quando possibile
- ✅ Usare variabili SCSS per colori e dimensioni ripetute
- ✅ Sfruttare il tema di Angular Material
- ✅ Utilizzare nesting SCSS in modo appropriato

#### Esempio di Stili

```scss
// Variabili
$card-padding: 16px;
$primary-spacing: 8px;

:host {
  display: block;
  padding: $card-padding;
}

.user-list {
  mat-card {
    margin-bottom: $primary-spacing;
    
    mat-card-title {
      font-size: 1.2em;
      font-weight: 500;
    }
  }
}
```

### Imports nei Componenti Standalone

Ogni componente standalone deve importare esplicitamente ciò che usa:

```typescript
imports: [
  CommonModule,           // Per *ngIf, *ngFor, pipes comuni
  ReactiveFormsModule,    // Per form reattivi
  FormsModule,            // Per template-driven forms
  MatButtonModule,        // Componenti Material specifici
  MatCardModule,
  MatIconModule,
  FlexLayoutModule,       // Per fxFlex e direttive layout
]
```

#### Quando Importare CommonModule

`CommonModule` è necessario quando si utilizzano:
- Direttive strutturali: `*ngIf`, `*ngFor`, `*ngSwitch`
- Pipe comuni: `date`, `currency`, `json`, `uppercase`, etc.
- Direttive comuni: `ngClass`, `ngStyle`, `ngModel` (con FormsModule)

## 5. Struttura del Progetto

```
src/
├── app/
│   ├── components/          # Componenti riutilizzabili
│   │   └── component-name/
│   │       ├── component-name.component.ts
│   │       ├── component-name.component.html
│   │       └── component-name.component.scss
│   ├── pages/              # Pagine/Views principali
│   │   └── page-name/
│   │       ├── page-name.component.ts
│   │       ├── page-name.component.html
│   │       └── page-name.component.scss
│   ├── services/           # Servizi condivisi
│   │   └── service-name.service.ts
│   ├── models/             # Interfacce e tipi TypeScript
│   │   └── model-name.interface.ts
│   ├── guards/             # Route guards
│   │   └── auth.guard.ts
│   ├── interceptors/       # HTTP interceptors
│   │   └── auth.interceptor.ts
│   ├── app.component.ts    # Root component (standalone)
│   ├── app.component.html
│   ├── app.component.scss
│   ├── app.config.ts       # Application configuration
│   └── app.routes.ts       # Routing configuration
├── assets/                 # Risorse statiche
│   ├── images/
│   └── icons/
├── environments/           # Configurazioni ambiente
│   ├── environment.ts
│   └── environment.prod.ts
└── styles.scss            # Stili globali e tema Material
```

### Convenzioni di Naming

- **Componenti**: `kebab-case.component.ts` (es. `user-list.component.ts`)
- **Servizi**: `kebab-case.service.ts` (es. `auth.service.ts`)
- **Interfacce**: `kebab-case.interface.ts` o `PascalCase` nel nome (es. `user.interface.ts`, `export interface User`)
- **Guard**: `kebab-case.guard.ts` (es. `auth.guard.ts`)
- **Pipe**: `kebab-case.pipe.ts` (es. `format-date.pipe.ts`)

## 6. Configurazione Routing

Per applicazioni standalone, utilizzare `provideRouter` in `app.config.ts` o `main.ts`.

### File app.routes.ts

```typescript
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { UserListComponent } from './pages/user-list/user-list.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'users', component: UserListComponent },
  { path: '**', redirectTo: '' }
];
```

### File main.ts

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    // Altri providers globali
  ]
}).catch(err => console.error(err));
```

### Lazy Loading

Per il lazy loading di moduli standalone:

```typescript
export const routes: Routes = [
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin.component')
      .then(m => m.AdminComponent)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.routes')
      .then(m => m.DASHBOARD_ROUTES)
  }
];
```

## 7. Servizi e Dependency Injection

### Creare un Servizio

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // Servizio disponibile globalmente
})
export class UserService {
  private apiUrl = '/api/users';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }
}
```

### Utilizzare un Servizio in un Componente

```typescript
@Component({
  // ...
})
export class UserListComponent implements OnInit {
  users: User[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe(
      users => this.users = users
    );
  }
}
```

## 8. Gestione Form

### Form Reattivi (Raccomandato)

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent {
  userForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      console.log(this.userForm.value);
    }
  }
}
```

### Template Form

```html
<form [formGroup]="userForm" (ngSubmit)="onSubmit()" fxLayout="column" fxLayoutGap="16px">
  <mat-form-field>
    <mat-label>Nome</mat-label>
    <input matInput formControlName="name" required>
    <mat-error *ngIf="userForm.get('name')?.hasError('required')">
      Il nome è obbligatorio
    </mat-error>
  </mat-form-field>

  <mat-form-field>
    <mat-label>Email</mat-label>
    <input matInput type="email" formControlName="email" required>
    <mat-error *ngIf="userForm.get('email')?.hasError('email')">
      Email non valida
    </mat-error>
  </mat-form-field>

  <button mat-raised-button color="primary" type="submit" [disabled]="!userForm.valid">
    Salva
  </button>
</form>
```

## 9. Checklist Pre-Commit

Prima di ogni commit, verificare:

- [ ] **Tutti i componenti sono standalone** (`standalone: true`)
- [ ] **Nessun template o style inline** (usare `templateUrl` e `styleUrls`)
- [ ] **File .ts, .html, .scss separati** per ogni componente
- [ ] **Import di CommonModule** dove necessario (se si usano `*ngIf`, `*ngFor`, pipe comuni)
- [ ] **Import espliciti di tutti i moduli Material usati** nel template
- [ ] **Import di FlexLayoutModule** se si usa fxFlex nel template
- [ ] **Nessun errore TypeScript** (`ng build` o `tsc --noEmit` passa senza errori)
- [ ] **Codice formattato correttamente** (usare Prettier o formatter configurato)
- [ ] **Interfacce definite per i dati** (no `any` quando possibile)
- [ ] **Nomi dei file seguono le convenzioni** (kebab-case)
- [ ] **Servizi iniettati correttamente** con `providedIn: 'root'` o nei providers

## 10. Testing

### Unit Test per Componenti Standalone

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyComponentComponent } from './my-component.component';

describe('MyComponentComponent', () => {
  let component: MyComponentComponent;
  let fixture: ComponentFixture<MyComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyComponentComponent] // Import del componente standalone
    }).compileComponents();

    fixture = TestBed.createComponent(MyComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

### Unit Test per Servizi

```typescript
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
```

## 11. Performance e Ottimizzazione

### OnPush Change Detection

Per componenti con molti dati o aggiornamenti frequenti:

```typescript
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-my-component',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  // ...
})
export class MyComponentComponent {
  // ...
}
```

### TrackBy per *ngFor

```typescript
trackByUserId(index: number, user: User): number {
  return user.id;
}
```

```html
<div *ngFor="let user of users; trackBy: trackByUserId">
  {{ user.name }}
</div>
```

## 12. Gestione Errori e Loading States

### Pattern Comune per Chiamate HTTP

```typescript
import { Component } from '@angular/core';

@Component({
  // ...
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  loading = false;
  error: string | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.error = null;

    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Errore nel caricamento degli utenti';
        this.loading = false;
        console.error(err);
      }
    });
  }
}
```

### Template con Loading e Error States

```html
<div fxLayout="column">
  <mat-spinner *ngIf="loading"></mat-spinner>
  
  <mat-error *ngIf="error">
    {{ error }}
  </mat-error>

  <div *ngIf="!loading && !error">
    <mat-card *ngFor="let user of users">
      <!-- contenuto card -->
    </mat-card>
  </div>
</div>
```

## Riferimenti Utili

- [Angular Documentation](https://angular.io/docs)
- [Angular Material Components](https://material.angular.io/components/categories)
- [Angular Flex Layout](https://github.com/angular/flex-layout/wiki)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [RxJS Documentation](https://rxjs.dev/)

---

**Nota Finale**: Queste linee guida sono vincolanti per tutto il codice del progetto lift-board. Ogni nuovo componente, servizio o modifica deve seguire questi standard per garantire coerenza, manutenibilità e qualità del codice.
