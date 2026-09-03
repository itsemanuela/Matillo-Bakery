# Matillo Bakery: La Tradizione del Forno Incontra l'Innovazione Full-Stack

## 1. Introduzione e Motivazione del Progetto

Il percorso di sviluppo di una moderna applicazione web trova la sua massima espressione quando la competenza tecnica incontra un'autentica esperienza sul campo. **Matillo Bakery** nasce come progetto capstone ma affonda le sue radici in un vissuto professionale concreto: sette anni di lavoro all'interno di una vera panetteria artigianale.

L'obiettivo finale che guida la piattaforma non è un semplice esercizio accademico, bensì la realizzazione di un concreto dono digitale per questo storico forno (attivo dal 1943), pensato per traghettare l'eccellenza della tradizione artigianale nel panorama digitale contemporaneo. La sfida progettuale è consistita nel replicare online la medesima cura e calore umano percepiti varcando la soglia del negozio fisico.

Per fare ciò, la piattaforma è stata concepita per soddisfare tanto il cliente occasionale quanto l'utente registrato, offrendo un catalogo vasto, percorsi d'acquisto lineari, strumenti di assistenza immediata e un gestionale amministrativo intuitivo che permette ai titolari di aggiornare l'offerta senza barriere tecniche.

---

## 2. Architettura del sistema

L'architettura segue il pattern client-server con API REST: il frontend **React** comunica con il backend **Spring Boot** tramite chiamate HTTP, mentre la persistenza dei dati è affidata a un database **PostgreSQL**.

Le entità di dominio (`Prodotto`, `Ordine`, `DettaglioOrdine`, `User`) sono organizzate nel package `entities`, mentre lo scambio dati con il client avviene tramite Data Transfer Object (DTO), separati nei package `dto` e `ResponseDTO`.

Il frontend è strutturato in due macro-aree distinte: la cartella `Components`, dedicata al sito pubblico rivolto al cliente, e la cartella `ComponentGestionale`, dedicata al pannello amministrativo. Questa separazione riflette anche una possibile evoluzione futura del progetto verso due repository indipendenti che condividono lo stesso backend.

### 2.1 Sicurezza e autenticazione

L'autenticazione è gestita tramite **token JWT**: al login, l'utente riceve un token che identifica la sessione e il proprio ruolo (`CLIENTE` o `ADMIN`).

La configurazione di sicurezza (`SecurityConfig`) definisce le rotte pubbliche e quelle protette; ad esempio, l'endpoint di consultazione dello stato ordine è stato reso volutamente pubblico per consentirne l'uso anche agli ospiti non registrati.

È inoltre implementato e funzionante il **recupero password**: l'utente che dimentica le credenziali riceve un'email contenente un link con token univoco, che lo indirizza a una pagina dedicata per l'impostazione di una nuova password. L'invio delle email è gestito tramite il servizio esterno **Mailgun**, seguendo le regole della sandbox limitata.

---

## 3. Funzionalità del sito pubblico

### 3.1 Home page ed Hero

La homepage si apre con una sezione Hero a piena larghezza, con titolo _"Dove il calore del forno diventa emozione"_ ed eyebrow _"Dal 1943, con le mani"_. Lo sfondo utilizza un gradiente scuro che sfuma verso un arancio vivo (ispirato al calore del forno acceso), con l'immagine di un forno con pane sugli scaffali in primo piano. Il colore oro è mantenuto come accento su elementi selezionati (cifra "1943", testo, bottone, sigillo, effetto pulviscolo che ricorda i granelli di farina). Il bottone secondario della Hero conduce alla sezione `/laboratori`.

### 3.2 Shop (catalogo prodotti)

La sezione Shop presenta il catalogo completo dei prodotti — attualmente oltre 40 referenze reali, ciascuna con relativa fotografia caricata su **Cloudinary**. Ogni prodotto è consultabile tramite una pagina di Dettaglio Prodotto dedicata, che ne mostra descrizione, prezzo e disponibilità.

### 3.3 Checkout

Il processo di acquisto è stato progettato per supportare due modalità distinte:

- **Checkout come ospite:** i dati del cliente vengono salvati direttamente all'interno dell'ordine (email, nominativo, ecc.), senza necessità di creare un account.
- **Checkout da utente registrato:** l'ordine viene collegato al profilo utente (`User`) tramite autenticazione JWT, consentendo la consultazione dello storico ordini associato all'account.

### 3.4 Pagamenti (Stripe)

Il pagamento online è integrato tramite **Stripe Checkout Session**: al termine dell'ordine il cliente viene indirizzato al flusso di pagamento sicuro di Stripe. Un webhook dedicato aggiorna automaticamente lo stato dell'ordine a "PAGATO" alla conferma della transazione. È inoltre implementato il ripristino automatico del magazzino nel caso in cui un ordine venga annullato (tramite soft delete, senza cancellazione fisica del record).

**Codice sconto per nuovi clienti:** È previsto un codice sconto riservato ai nuovi clienti: l'applicabilità dello sconto viene verificata controllando che l'email utilizzata non sia già presente nel database. In questo modo il codice risulta valido solo per chi acquista per la prima volta o si registra con un indirizzo email diverso da quello già associato a un account esistente, evitando un uso improprio da parte di clienti già acquisiti.

### 3.5 Tracciamento stato ordine (chatbox)

Il sito integra una chatbox pensata per offrire assistenza rapida al cliente, in particolare per la verifica dello stato di spedizione del proprio ordine. È stato scelto un approccio a regole (decision tree) anziché un assistente conversazionale basato su intelligenza artificiale, per garantire risposte prevedibili e controllate. La funzionalità si appoggia a un endpoint pubblico dedicato (`GET /api/ordini/stato`), che verifica l'ordine tramite combinazione di codice univoco (UUID) ed email del cliente, accessibile sia da utenti registrati sia da ospiti.

### 3.6 Catering

La sezione Catering è stata sviluppata con una direzione di stile distintiva ispirata al mondo della panetteria artigianale: bordo smerlato ricorrente ("scallop"), realizzato tramite una funzione che genera un `radial-gradient` ripetuto, e palette calda coerente con l'identità del brand (tonalità di carbone, crosta, grano, oro, farina). I titoli utilizzano il font _Fraunces_, mentre il testo del corpo utilizza _Work Sans_. La pagina elenca i pacchetti disponibili (Buffet di Feste, Cerimonie, Coffee Break) tramite card cliccabili che conducono alla pagina di dettaglio del singolo pacchetto.

- **Calcolo automatico del preventivo (chicca):** Nella pagina di dettaglio di ciascun pacchetto è presente un modulo di richiesta preventivo con calcolo automatico del totale stimato: ogni pacchetto ha un prezzo per persona e un numero minimo di persone definiti a catalogo, e il totale (prezzo a persona × numero di persone inserito) viene ricalcolato in tempo reale, lato frontend, a ogni modifica del campo numerico, senza necessità di chiamate al server. L'aggiornamento è accompagnato da un'animazione "count-up" del valore e da un effetto di evidenziazione (shimmer) realizzato con la libreria **Framer Motion**. Se il numero di persone inserito è inferiore al minimo previsto dal pacchetto, il sistema mostra un avviso e blocca l'invio della richiesta. Il modulo raccoglie inoltre nome, cognome, email, telefono, data dell'evento ed eventuali note.

### 3.7 Laboratori

La sezione Laboratori presenta le attività formative/esperienziali offerte dal forno, con relativa pagina di dettaglio (`LaboratorioDettaglio`) per ciascun laboratorio proposto. La prenotazione di un laboratorio è consentita esclusivamente agli utenti autenticati.

### 3.8 Accesso e area utente

La sezione `AccessoGenerale` gestisce le funzionalità di login e registrazione, con distinzione di ruolo tra cliente (`CLIENTE`) e amministratore (`ADMIN`) tramite token JWT. È inoltre disponibile la funzione di recupero password tramite Mailgun. Il pannello amministrativo è disponibile nella sezione footer, ma rigorosamente protetto da autenticazione.

---

## 4. Pannello amministrativo (gestionale)

È stato realizzato un pannello di amministrazione, raggiungibile alla rotta `/admin/prodotti`, dedicato alla gestione del catalogo prodotti. Il pannello consente le operazioni di creazione, modifica e gestione delle referenze presenti nel database. Dal punto di vista architetturale, il gestionale è organizzato in una cartella frontend dedicata (`ComponentGestionale`), separata dai componenti del sito pubblico.

### 4.1 Gestione richieste catering

Il gestionale include una sezione dedicata alle Richieste Catering, che presenta in una tabella tutte le richieste di preventivo ricevute dal sito pubblico: data della richiesta, dati del cliente, pacchetto scelto, data dell'evento, numero di persone e contatti (email e telefono).

Le richieste sono ordinate automaticamente dalla più recente. Per ciascuna richiesta, l'amministratore può aggiornare lo stato tramite un menu a tendina dedicato, scegliendo tra quattro valori:

- **In attesa**
- **Contattato**
- **Confermata**
- **Annullata**

Ciascuno stato è associato a un colore identificativo per una lettura rapida della tabella. L'aggiornamento dello stato avviene in tempo reale tramite chiamata al backend, e l'intera sezione è protetta da autenticazione tramite token.

---

## 5. Dati chiave del progetto

- Oltre 40 prodotti reali censiti a catalogo, ciascuno con fotografia caricata su Cloudinary.
- Autenticazione basata su JWT con due ruoli distinti: `CLIENTE` e `ADMIN`.
- Doppia modalità di checkout: ospite e utente registrato.
- Pagamenti online integrati e funzionanti tramite Stripe, con gestione webhook e ripristino automatico del magazzino sugli annullamenti.
- Endpoint pubblico dedicato alla verifica dello stato ordine, utilizzato dalla chatbox del sito.
- Recupero password via email, con invio gestito tramite Mailgun.
- Preventivo catering calcolato in tempo reale (prezzo a persona × numero persone), con validazione sul minimo di persone previsto dal pacchetto.
- Codice sconto riservato ai nuovi clienti, verificato controllando l'assenza dell'email nel database.
- Prenotazione dei laboratori riservata agli utenti autenticati.
- Pannello gestionale con sezione dedicata al monitoraggio e alla gestione dello stato delle richieste di catering.
- Palette e tipografia uniformate su tutte le sezioni del sito pubblico.

**Stato del Deploy:** Il frontend (FE) è correttamente distribuito e visitabile online tramite la piattaforma **Netlify** (**https://matillo-bakery.netlify.app/**), mentre il backend (BE) è stato temporaneamente mantenuto in ambiente locale per la presentazione del progetto, a causa dei limiti operativi dei piani gratuiti di hosting (come Render).

---

## Conclusioni

Più di ogni altra cosa, questo progetto si svela come una lettera d'amore in codice e pixel, un ponte invisibile e fortissimo capace di custodire e onorare sette anni della mia vita vissuti tra il profumo della farina e il calore di quel forno. È il mio modo di restituire alla storica bottega artigianale — che dal 1946 custodisce i sapori e l'anima di questo territorio — uno strumento di bellezza e futuro, nato dalle mie mani, dai miei sacrifici e dal mio cuore, unendo la mia storia personale a una tradizione senza tempo.

Il cuore di questo progetto, che oggi prende vita e si racconta online, custodisce l'eco di questa dedizione viscerale, suggellando un capitolo fondamentale della mia vita e tracciando la rotta per un domani in cui la passione, lo studio e la determinazione continueranno a fiorire nel mondo digitale. Oggi, questo lavoro rappresenta anche la chiusura solenne e commossa di un percorso di studi intenso e sfidante, l'ultimo tassello di un impegno accademico che spero con tutto il cuore possa spalancarmi le porte di un nuovo futuro professionale.

**Emanuela Carrubba**
