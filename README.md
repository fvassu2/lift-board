# Lift Board - Mission Manager Dashboard

Dashboard per la gestione delle missioni di trasferimento in magazzino per operatori di carrelli elevatori.

## Funzionalità Principali

### 1. Mappa di Magazzino
- Visualizzazione 2D della mappa di magazzino con zone (A-E)
- Indicatori visivi per celle occupate con saldi
- Contatore di bins per cella

### 2. Gestione Saldi (Bins)
- Lista completa dei saldi con informazioni dettagliate:
  - Codice articolo e descrizione
  - Codice a barre e tag RFID
  - Posizione (magazzino, cella, zona)
  - Quantità e unità di misura
- **Filtri avanzati**: per magazzino, articolo, zona, e ricerca testuale
- **Multi-selezione** per creazione batch di missioni

### 3. Creazione Missioni di Trasferimento
- Due tipologie:
  - **IN ENTRATA**: dal piazzale a celle di magazzino
  - **IN USCITA**: da celle di magazzino a linee di produzione
- Form completo con:
  - Selezione origine e destinazione
  - Priorità
  - Assegnazione (utente specifico o pubblica)
  - Note opzionali

### 4. Gestione Missioni
- Visualizzazione missioni esistenti con:
  - Stati: Creata, Assegnata, In Corso, Completata, Annullata
  - Informazioni complete (bins, quantità, origine/destinazione)
  - Azioni per cambio stato
- **Filtri missioni**: per stato, tipo, assegnazione
- Missioni pubbliche e assegnate a utenti specifici

## Tech Stack

- **React 19** con TypeScript
- **Vite** per build e dev server
- **Zustand** per state management
- **date-fns** per gestione date con localizzazione italiana
- **CSS Modules** per styling

## Setup e Installazione

### Prerequisiti
- Node.js 18+ 
- npm o yarn

### Installazione

```bash
# Clona il repository
git clone https://github.com/fvassu2/lift-board.git
cd lift-board

# Installa le dipendenze
npm install

# Avvia il server di sviluppo
npm run dev

# Apri il browser su http://localhost:5173
```

### Build per Produzione

```bash
# Compila il progetto
npm run build

# Anteprima build di produzione
npm run preview
```

### Linting

```bash
# Esegui ESLint
npm run lint
```

## Struttura del Progetto

```
lift-board/
├── src/
│   ├── components/         # Componenti React
│   │   ├── Dashboard.tsx       # Layout principale
│   │   ├── WarehouseMap.tsx    # Mappa magazzino
│   │   ├── BinList.tsx         # Lista saldi
│   │   ├── BinFilters.tsx      # Filtri saldi
│   │   ├── MissionList.tsx     # Lista missioni
│   │   ├── MissionFilters.tsx  # Filtri missioni
│   │   └── CreateMissionModal.tsx  # Form creazione missione
│   ├── types/              # TypeScript types e interfaces
│   ├── store/              # Zustand store per state management
│   ├── services/           # Mock data e servizi
│   ├── utils/              # Utility functions (filtri, etc.)
│   ├── App.tsx             # Componente root
│   └── main.tsx            # Entry point
├── public/                 # Asset statici
└── dist/                   # Build output
```

## Mock Data

L'applicazione include dati di esempio per:
- 6 bins con articoli (Pere, Mele, Arance, Limoni, Banane)
- 1 magazzino con 5 zone (A-E) e 240 celle
- 3 missioni di esempio in vari stati

## Responsive Design

- Design ottimizzato per tablet e desktop
- Layout adattivo con breakpoint a 768px e 1024px
- Interfaccia touch-friendly per dispositivi mobili

## Browser Supportati

- Chrome/Edge (versioni recenti)
- Firefox (versioni recenti)
- Safari 14+

## Licenza

Questo progetto è proprietario.

## Autore

fvassu2
