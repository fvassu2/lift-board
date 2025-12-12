# Lift Board - Operator Dashboard

Dashboard dedicata agli operatori di muletto per la gestione delle missioni di movimentazione merci.

## Funzionalità

### 🎯 Visualizzazione Missione Corrente
- Intestazione con ID, tipo (IN/OUT) e priorità
- Dettagli articolo con foto
- Percorso FROM → TO con icone distintive
- Progress bar per bins movimentati
- Indicatore stato corrente (Preleva/Consegna)

### 🚜 Animazione Muletto
- Canvas animata con rappresentazione grafica del muletto
- Stati: idle, moving to pickup, picking up, moving to delivery, delivering, complete
- Animazioni fluide sincronizzate con lo stato della missione

### 📋 Pannello Missioni
- Drawer a scomparsa con due tab:
  - **Le Mie Missioni**: missioni assegnate all'operatore
  - **Pubbliche**: missioni disponibili da prendere in carico
- Ordinamento per priorità e stato
- Selezione rapida della missione

### 📡 RFID Monitor
- Indicatore stato connessione (Connesso/Instabile/Disconnesso)
- Stream messaggi in tempo reale
- Log eventi con timestamp
- Auto-scroll ai nuovi messaggi
- Supporto per simulazione tag scan

### 🛠️ Toolbar di Backup
- Scan manuale barcode
- Conferma prelievo manuale
- Conferma consegna manuale
- Segnalazione problemi

## Stack Tecnologico

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Animation**: HTML5 Canvas + CSS3
- **Icons**: Lucide React
- **Canvas Library**: Konva.js

## Setup e Installazione

```bash
# Installa dipendenze
npm install

# Avvia dev server
npm run dev

# Build per produzione
npm run build

# Preview build
npm run preview
```

## Struttura Progetto

```
src/
├── components/
│   ├── dashboard/      # Header e Dashboard principale
│   ├── mission/        # Componenti gestione missioni
│   ├── rfid/          # RFID Monitor e messaggi
│   ├── animation/     # Canvas animazione muletto
│   └── toolbar/       # Action Toolbar
├── contexts/          # React Context (Mission, RFID)
├── types/            # TypeScript type definitions
├── utils/            # Mock data e utility
└── hooks/            # Custom React hooks
```

## Responsive Design

- **Target primario**: Tablet landscape (10-12 pollici)
- Touch-friendly: pulsanti minimo 44x44px
- Ottimizzato per dispositivi montati su muletto
- Font size adeguato per lettura in movimento

## Mock Data

L'applicazione utilizza dati di esempio per la demo. In produzione, questi dati verranno sostituiti con chiamate API reali:
- Operatore: Marco Rossi (OP001)
- Missioni pre-caricate con articoli, ubicazioni e stati
- RFID simulato con auto-connessione

## Prossimi Sviluppi

- [ ] Integrazione WebSocket real-time per RFID
- [ ] API REST per gestione missioni
- [ ] Offline mode con caching
- [ ] Audio/haptic feedback
- [ ] Statistiche operatore
- [ ] Multi-lingua (IT/EN)

## License

MIT
