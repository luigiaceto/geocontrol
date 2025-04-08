# Requirements Document - GeoControl

Date:

Version: V1 - description of Geocontrol as described in the swagger

| Version number | Change |
| :------------: | :----: |
|                |        |

# Contents

- [Requirements Document - GeoControl](#requirements-document---geocontrol)
- [Contents](#contents)
- [Informal description](#informal-description)
- [Business Model](#business-model)
- [Stakeholders](#stakeholders)
- [Context Diagram and interfaces](#context-diagram-and-interfaces)
  - [Context Diagram](#context-diagram)
  - [Interfaces](#interfaces)
- [Stories and personas](#stories-and-personas)
- [Functional and non functional requirements](#functional-and-non-functional-requirements)
  - [Functional Requirements](#functional-requirements)
  - [Non Functional Requirements](#non-functional-requirements)
- [Use case diagram and use cases](#use-case-diagram-and-use-cases)
  - [Use case diagram](#use-case-diagram)
    - [Use case 1, Login (UC1)](#use-case-1-login-uc1)
        - [Scenario 1.1](#scenario-11)
        - [Scenario 1.2](#scenario-12)
        - [Scenario 1.3](#scenario-13)
        - [Scenario 1.4](#scenario-14)
        - [Scenario 1.5](#scenario-15)
    - [Use case 2, Registrazione (UC2)](#use-case-2-registrazione-uc2)
    - [Scenario 2.1](#scenario-21)
    - [Scenario 2.2](#scenario-22)
    - [Scenario 2.3](#scenario-23)
    - [Use case 3, Cancellazione Account](#use-case-3-cancellazione-account)
    - [Scenario 3.1](#scenario-31)
    - [Scenario 3.2](#scenario-32)
    - [Use case 4, Gestione Networks](#use-case-4-gestione-networks)
    - [Scenario 4.1: Recupero di tutte le Reti](#scenario-41-recupero-di-tutte-le-reti)
    - [Scenario 4.2: Recupero di una Rete specifica](#scenario-42-recupero-di-una-rete-specifica)
    - [Scenario 4.3: Creazione di una Nuova Rete](#scenario-43-creazione-di-una-nuova-rete)
    - [Scenario 4.4: Aggiornamento della Rete](#scenario-44-aggiornamento-della-rete)
    - [Scenario 4.5: Cancellazione della Rete](#scenario-45-cancellazione-della-rete)
    - [Scenario 4.6: Errore di Autorizzazione (401 Unauthorized)](#scenario-46-errore-di-autorizzazione-401-unauthorized)
    - [Scenario 4.7: Errore di Permessi Insufficienti (403 Forbidden)](#scenario-47-errore-di-permessi-insufficienti-403-forbidden)
    - [Scenario 4.8: Errore Interno del Server (500 Internal Server Error)](#scenario-48-errore-interno-del-server-500-internal-server-error)
    - [Scenario 4.9: Rete Non Trovata (404 Not Found)](#scenario-49-rete-non-trovata-404-not-found)
    - [Scenario 4.10: Conflitto (409 Conflict)](#scenario-410-conflitto-409-conflict)
- [Glossary](#glossary)
- [System Design](#system-design)
- [Deployment Diagram](#deployment-diagram)

# Informal description

GeoControl è un software progettato per monitorare le variabili fisiche e ambientali in vari contesti: da analisi idrologiche di aree montane al sorvegliamento di edifici storici, e anche il controllo di parametri interni (quali temperatura o illuminazione) in aree residenziali o di lavoro.

# Business Model

- __Private-as-a-Service__:
  una compagnia privata sviluppa e gestisce il sistema offrendo il servizio ad amministrazioni pubbliche su base contrattuale.

- __Sistema Software su licenza__:
  la compagnia che sviluppa GeoControl vende il software offrendo licenza annuale o come one-time-purchase. Vi sono diversi Tier di licenza tra cui quelli più avanzati potrebbero includere supporto tecnico e manutenzione della parte hardware del systema (sensori e gateway).

- __Modello Open Core__:
  si offre una versione open source del software e vengono venduti moduli premium con funzionalità più avanzate e servizi di personalizzazione e integrazione. È utile per creare parallelamente una community di sviluppatori che contribuisce al miglioramento del prodotto.

- __partnership__:
  collaborare con produttori di sensori integrando al meglio il loro hardware con GeoControl e con società di consulenza ambientale/ingegneristica. Stabilire anche accordi di guadagno con partner che portano nuovi clienti.

# Stakeholders

| Stakeholder name | Description |
| :--------------- | :---------- |
|       Admin      |  Utente che ha accesso a tutte le risorse, inclusa la gestione di Networks e Utenti |
|      Operator    |  Utente che può gestire Network, Gateway, Sensori e inserire misurazioni |
|       Viewer     |  Utente che può solo consultare i dati |
| Unione delle Comunità Montane del Piemonte | Committente principale del Sistema |
| Enti Pubblici e Privati | Università, cittadine, Protezione Civile o aziende che vogliono usufruire dei servizi del Sistema |
| Produttori di Componenti | Coloro che si occupano di produzione e distribuzione dell'Hardware utilizzato nel Sistema |

# Context Diagram and interfaces

## Context Diagram

\<Define here Context diagram using UML use case diagram>
<p align="center">
    <img src="res/Context_diagram.png" alt="" width="400">
</p>

\<actors are a subset of stakeholders>

## Interfaces

\<describe here each interface in the context diagram>


|   Actor   | Logical Interface | Physical Interface |
| :-------- | :---------------: | :----------------: |
| Admin     | GUI               | PC                 |
| Operator  | GUI               | PC                 |
| Viewer    | GUI               | PC, Smartphone     |

# Stories and personas

\<A Persona is a realistic impersonation of an actor. Define here a few personas and describe in plain text how a persona interacts with the system>

\<Persona is-an-instance-of actor>

\<stories will be formalized later as scenarios in use cases>

- Persona1 : Uomo, Adulto, 50 anni, Lavora come informatico nel comune di una cittadina ad alto rischio sismico
  Storia : Ha bisogno di un Sistema per monitorare l'attività sismica della città

- Persona2 : Donna, Giovane, 25 anni, lavora in una riserva naturale come guida
  Storia : Ha bisogno di sapere in anticipo le condizioni climatiche per evitare di mettere in pericolo i visitatori durante le passeggiate

- Persona3 : Uomo, Età media, 34 anni, gestore hotel in alta quota aperto in periodo invernale
  Storia : Ha bisogno di un sistema per monitorare il rischio di valanghe o temperature estreme al fine di migliorare l'esperienza di chi alloggia nell'hotel

- Persona4: Gruppo di ricerca universitario
  Storia: Hanno bisogno di dati ambientali per testare modelli di machine learning per predizioni metereologiche per una ricerca

- Persona5: Donna, Adulta, 46 anni, preside di una scuola media
  Storia: Nell'attesa di un cambio struttura, la preside ha bisogno di monitorare alcuni parametri particolari di quella attuale, vecchia e decadente, ad esempio crepe e fessurazioni o vibrazioni anomale.

# Functional and non functional requirements

## Functional Requirements

\<In the form DO SOMETHING, or VERB NOUN, describe high level capabilities of the system>

\<they match to high level use cases>

|  ID   | Description |
| :---: | :---------: |
|  FR1  | Gestione Utente |
|  FR1.1 | Login Utente |
|  FR1.2 | Creazione Account|
|  FR1.3 | Ottenimento Elenco Utenti |
|  FR1.4 | Ottenimento Utente Specifico |
|  FR1.5 | Eliminazione Account |
|  FR2  | Gestione Networks |
|  FR2.1  | Creazione Network |
|  FR2.2  | Ottenimento Elenco Networks |
|  FR2.3  | Ottenimento Network Specifico |
|  FR2.4  | Modifica Dati Network |
|  FR2.5  | Eliminazione Network |
|  FR3  | Gestione Gateways |
|  FR3.1 | Creazione Gateway |
|  FR3.2 | Ottenimento Elenco Gateway per Network Specifico |
|  FR3.3 | Ottenimento Gateway Specifico | 
|  FR3.4 | Modifica Dati Gateway |
|  FR3.5 | Eliminazione Gateway |
|  FR4  | Gestione Sensori |
|  FR4.1 | Creazione Sensore |
|  FR4.2 | Ottenimento Elenco Sensori per Gateway Specifico |
|  FR4.3 | Ottenimento Sensore Specifico |
|  FR4.4 | Modifica Dati Sensore |
|  FR4.5 | Eliminazione Sensore|
|  FR5   | Calcolo Statistiche su Misurazioni |
|  FR5.1  | Calcolo Media su Misurazioni in Range Temporale |
|  FR5.2  | Calcolo Varianza su Misurazioni in Range Temporale |
|  FR6  | Gestione Misurazioni |
|  FR6.1  | Creazione Misurazione |
|  FR6.2  | Ottenimento Elenco Misurazioni di Network Specifico |
|  FR6.3  | Ottenimento Elenco Misurazioni di Sensore Specifico |
|  FR6.4  | Ottenimento Elenco Statistiche di Network Specifico |
|  FR6.5  | Ottenimento Elenco Statistiche di Sensore Specifico |
|  FR6.6  | Ottenimento Elenco Outliers di Network Specifico |
|  FR6.7  | Ottenimento Elenco Outliers di Sensore Specifico |

## Non Functional Requirements

\<Describe constraints on functional requirements>

|   ID    | Type (efficiency, reliability, ..) | Description | Refers to |
| :-----: | :--------------------------------: | :---------: | :-------: |
|  NFR1   |  Domain                            | Il sistema deve convertire, memorizzare e restituire i timestamp nel formato ISO 8601 (UTC) | FR 6 |
|  NFR2   |  Reliability                       | Non devono essere perse più di 6 misurazioni per sensore ogni anno | FR 6 |
|  NFR3   |  Reliability                       | Il timestamp deve corrispondere all'esatto momento della misurazione | FR 6 |
|  NFR4   |  Reliability                       | Il flusso di misurazioni non deve essere interrotto | FR 6 |
|  NFR5   |  Domain                            | La misurazioni deve avvenire ogni 10 minuti | FR 6 |



# Use case diagram and use cases

## Use case diagram

\<define here UML Use case diagram UCD summarizing all use cases, and their relationships>

\<next describe here each use case in the UCD>

### Use case 1, Login (UC1)

| Actors Involved  |   Admin, Operator, Viewer                                                                 |
| :--------------: | :------------------------------------------------------------------- |
|   Precondition   | L'Utente non ha ancora effettuato il login  |
|  Post condition  |  L'Utente ottiene un token di accesso per sessioni future   |
| Nominal Scenario |         Scenario 1.1         |
|     Variants     |                     Nessuna                    |
|    Exceptions    |      Scenario 1.2, 1.3, 1.4, 1.5                      |

##### Scenario 1.1

\<describe here scenarios instances of UC1>

\<a scenario is a sequence of steps that corresponds to a particular execution of one use case>

\<a scenario is a more formal description of a story>

\<only relevant scenarios should be described>

|  Scenario 1.1  |  Login con successo                                                                        |
| :------------- | :------------------------------------------------------------------------- |
|  Precondition  | L'Utente è registrato |
| Post condition |  L'Utente effettua il login  |
|     Step#      |                                Description                                 |
|       1        |  Il sistema richiede username e password per il login                                                                          |
|       2        |  L'utente fornisce username e password                                                                          |
|      3       |  Il sistema legge username e password fornite dall'utente                                                                          |
|4 | Il sistema verifica le credenziali |
| 5 | Il sistema restituisce un codice 200 e un token di accesso in formato JSON. Consente quindi l'accesso all'utente|

##### Scenario 1.2

|  Scenario 1.2  | Login con dati non validi                                                          |
| :------------- | :------------------------------------------------------------------------- |
|  Precondition  | L'Utente è registrato |
| Post condition |  L'Utente non effettua il login  |
|     Step#      |                                Description                                 |
|       1        |  Il sistema richiede username e password per il login                                                                          |
|       2        |  L'Utente fornisce username e password                                                                          |
|      3       |  Il sistema legge username e password fornite dall'Utente                                                                          |
|4 | Il sistema verifica che i dati siano corretti |
| 5 | Il sistema restituisce un codice 400 e un messaggio di errore, l'Utente non è autorizzato all'accesso|
##### Scenario 1.3

|  Scenario 1.3  |  Login con credenziali errate                                                                       |
| :------------- | :------------------------------------------------------------------------- |
|  Precondition  | L'Utente è registrato |
| Post condition |  L'Utente non effettua il login  |
|     Step#      |                                Description                                 |
|       1        |  Il sistema richiede username e password per il login                                                                          |
|       2        |  L'Utente fornisce username e password                                                                          |
|      3       |  Il sistema legge username e password fornite dall'Utente                                                                          |
|4 | Il sistema verifica che le credenziali siano corrette |
|5 | Il sistema restituisce un codice 401 e un messaggio di errore. L'Utente non è autorizzato all'accesso|


##### Scenario 1.4

|  Scenario 1.4  |  Login con utente non trovato                                                                 |
| :------------- | :------------------------------------------------------------------------- |
|  Precondition  | L'Utente è registrato |
| Post condition |  L'Utente non effettua il login  |
|     Step#      |                                Description                                 |
|       1        |  Il sistema richiede username e password per il login                                                                          |
|       2        |  L'Utente fornisce username e password                                                                          |
|      3       |  Il sistema legge username e password fornite dall'Utente                                                                          |
|4 | Il sistema verifica che l'username non esiste |
|5 | Il sistema  restituisce un codice 404 e un messaggio di errore indicando che l'utente non è stato trovato |

##### Scenario 1.5

|  Scenario 1.5  |  Login con errore interno                                                         |
| :------------- | :------------------------------------------------------------------------- |
|  Precondition  | L'Utente è registrato |
| Post condition |  L'Utente non effettua il login  |
|     Step#      |                                Description                                 |
|       1        |  Il sistema richiede username e password per il login                                                                          |
|       2        |  L'Utente fornisce username e password                                                                          |
|      3       |  Il sistema tenta di verificare le credenziali, ma si verifica un errore interno                                                      |
| 4 | Il sistema restituisce un codice 500 e un messaggio di errore indicando un errore interno al server |

### Use case 2, Registrazione (UC2)

| Actors Involved  |   Admin                            |
| :--------------: | :------------------------------------------------------------------- |
|   Precondition   | L'Utente non ha un account  |
|  Post condition  |  L'Utente si è registrato   |
| Nominal Scenario |         Scenario 2.1         |
|     Variants     |                     Nessuna                    |
|    Exceptions    |                        Scenario 2.2, 2.3                        |

### Scenario 2.1
|  Scenario 2.1  |  Registrazione completata         |
| :------------- | :------------------------------------------------------------------------- |
|  Precondition  | L'Utente non è registrato |
| Post condition |  L'Utente si è registrato  |
|     Step#      |                                Description                                 |
|       1        |  Utente : chiede di registrarsi                             |
|       2        |  Sistema : richiede username, nome, cognome, ruolo e password       |
|      3         |  Utente : fornisce username, nome, cognome, ruolo e password           |
|      4         | Sistema  : legge username, nome, cognome, ruolo e password |
|      5         | Sistema : controlla che l'username non sia ancora associato ad un account. L'username non è ancora stato usato|
|      6         | Sistema : crea un nuovo Utente con le informazioni fornite|

### Scenario 2.2
|  Scenario 2.2  |  Utente già esistente         |
| :------------- | :------------------------------------------------------------------------- |
|  Precondition  | L'Utente non è registrato |
| Post condition |  Registrazione fallita  |
|     Step#      |                                Description                                 |
|       1        |  Utente : chiede di registrarsi                             |
|       2        |  Sistema : richiede username, nome, cognome, ruolo e password       |
|      3         |  Utente : fornisce username, nome, cognome, ruolo e password           |
|      4         | Sistema  : legge username, nome, cognome, ruolo e password |
|      5         | Sistema : controlla che l'username non sia ancora associato ad un account. L'username esiste già. Viene fornito un messaggio di errore|

### Scenario 2.3
|  Scenario 2.3  |  Campi vuoti         |
| :------------- | :------------------------------------------------------------------------- |
|  Precondition  | L'Utente non è registrato |
| Post condition |  Registrazione fallita  |
|     Step#      |                                Description                                 |
|       1        |  Utente : chiede di registrarsi                             |
|       2        |  Sistema : richiede username, nome, cognome, ruolo e password       |
|      3         |  Utente : fornisce username, nome, cognome, ruolo e password           |
|      4         | Sistema  : legge username, nome, cognome, ruolo e password |
|      5         | Sistema : controlla che tutti i parametri siano riempiti. Almeno uno è vuoto. Viene fornito un messaggio di errore|

### Use case 3, Cancellazione Account

| Actors Involved  |   Admin    |
| :--------------: | :------------------------------------------------------------------- |
|   Precondition   | L'Utente ha un account  |
|  Post condition  |  L'account viene eliminato  |
| Nominal Scenario |         Scenario 3.1         |
|     Variants     |                     Nessuna                    |
|    Exceptions    |                        Scenario 3.2                        |

### Scenario 3.1
|  Scenario 3.1  |  Cancellazione effettuata         |
| :------------- | :------------------------------------------------------------------------- |
|  Precondition  | L'Utente ha un account |
| Post condition |  L'account viene eliminato  |
|     Step#      |                                Description                                 |
|       1        |  Utente : chiede di eliminare Utente U                             |
|       2        |  Sistema : richiede username dell'Utente U      |
|      3         |  Utente : fornisce l'username dell'Utente U        |
|      4         | Sistema  : legge l'username |
|      5         | Sistema : cerca le informazioni relative all'Utente U. U viene trovato|
|      6         | Sistema : elimina l'account dell'Utente U|

### Scenario 3.2
|  Scenario 3.2  |  Utente inesistente         |
| :------------- | :------------------------------------------------------------------------- |
|  Precondition  | L'Utente ha un account |
| Post condition |  Viene mostrato un errore  |
|     Step#      |                                Description                                 |
|       1        |  Utente : chiede di eliminare Utente U                             |
|       2        |  Sistema : richiede username dell'Utente U      |
|      3         |  Utente : fornisce l'username dell'Utente U        |
|      4         | Sistema  : legge l'username |
|      5         | Sistema : cerca le informazioni relative all'Utente U. U non viene trovato|
|      6         | Sistema : mostra un messaggio di errore in cui dice che l'Utente U non esiste|



### Use case 4, Gestione Networks

| Actors Involved  |   Admin, Operator, Viewer    |
| :--------------: | :------------------------------------------------------------------- |
|   Precondition   |  L'utente è autenticato e ha i permessi per visualizzare, creare, aggiornare o cancellare le reti. |
|  Post condition  |  La rete è stata gestita correttamente  |
| Nominal Scenario |        Scenario 4.1: Recupero di tutte le reti (GET /networks), Scenario 4.2: Creazione di una nuova rete (POST /networks), Scenario 4.3: Aggiornamento della rete (PATCH /networks), Scenario 4.4: Cancellazione della rete (DELETE /networks)      |
|     Variants     |               Nessuna                    |
|    Exceptions    |      Scenario 4.6: Errore di autorizzazione (401), Scenario 4.7: Errore di permessi insufficienti (403), Scenario 4.8: Errore interno del server (500), Scenario 4.9: Rete non trovata (404), Scenario 4.10: Conflitto (409)                  |

### Scenario 4.1: Recupero di tutte le Reti 

| Precondition    | L'utente è autenticato correttamente e ha i permessi per visualizzare le reti |
| :-------------------: | :-------------------------------------------------------------------------- |
| Post condition    | Il sistema restituisce l'elenco di tutte le reti registrate |
| Step#             | Description |
| 1                 | L'utente invia una richiesta GET a `/networks` con il token di autenticazione valido |
| 2                 | Il sistema verifica la validità del token di autenticazione |
| 3                 | Il sistema recupera tutte le reti |
| 4                 | Il sistema restituisce una lista di tutte le reti con il codice 200 e i dati in formato JSON |

### Scenario 4.2: Recupero di una Rete specifica 

| Precondition    | L'utente è autenticato correttamente e ha i permessi per visualizzare le reti |
| :-------------------: | :-------------------------------------------------------------------------- |
| Post condition    | Il sistema restituisce la rete specifica |
| Step#             | Description |
| 1                 | L'utente invia una richiesta GET a `/networks/{networkCode}` con il token di autenticazione valido |
| 2                 | Il sistema verifica la validità del codice di rete e del token di autenticazione |
| 3                 | Il sistema recupera la rete richiesta |
| 4                 | Il sistema restituisce una la rete con il codice 200 e i dati in formato JSON |

### Scenario 4.3: Creazione di una Nuova Rete 

| Precondition     | L'utente (Admin e Operator) è autenticato e ha i permessi per creare una rete |
| :-------------------: | :------------------------------------------------------- |
| Post condition    | Una nuova rete è stata creata nel sistema|
| Step#             | Description |
| 1                 | L'utente invia una richiesta POST a `/networks` con i dati della rete |
| 2                 | Il sistema verifica che i dati siano completi e validi |
| 3                 | Il sistema crea una nuova rete |
| 4                 | Il sistema restituisce una risposta con codice 201, indicando che la rete è stata creata correttamente. |


### Scenario 4.4: Aggiornamento della Rete 

| Precondition     | L'utente (Admin e Operator) è autenticato e ha i permessi per aggiornare la rete |
| :-------------------: | :---------------------------------------------------------- |
| Post condition    | La rete è stata aggiornata correttamente nel sistema |
| Step#            | Description |
| 1                 | L'utente invia una richiesta PATCH a `/networks/{networkCode}` con i dati da aggiornare |
| 2                 | Il sistema verifica la validità dei dati di aggiornamento |
| 3                | Il sistema aggiorna i dati della rete |
| 4                 | Il sistema restituisce una risposta con codice 204, indicando che l'aggiornamento è stato effettuato correttamente |

### Scenario 4.5: Cancellazione della Rete

| Precondition     | L'utente (Admin e Operator) è autenticato e ha i permessi per cancellare la rete |
| :-------------------: | :-------------------------------------------------------- |
| Post condition    | La rete è stata cancellata correttamente dal sistema. |
| Step#             | Description |
| 1                 | L'utente invia una richiesta DELETE a `/networks/{networkCode}`. |
| 2                 | Il sistema verifica la validità del codice di rete e l'autenticazione |
| 3                 | Il sistema cancella la rete |
| 4                 | Il sistema restituisce una risposta con codice 204, indicando che la rete è stata cancellata correttamente |

### Scenario 4.6: Errore di Autorizzazione (401 Unauthorized)

| Precondition     | L'utente invia una richiesta senza token o con un token non valido |
| :-------------------: | :--------------------------------------------------------------- |
| Post condition    | Il sistema restituisce un errore di autorizzazione (401) |
| Step#            | Description |
| 1                 | L'utente invia una richiesta senza un token valido |
| 2                 | Il sistema verifica il token e rileva che non è valido |
| 3                 | Il sistema restituisce un errore con codice 401 |


### Scenario 4.7: Errore di Permessi Insufficienti (403 Forbidden)

| Precondition     | L'utente non ha i permessi per accedere alla rete richiesta |
| :-------------------: | :------------------------------------------------------- |
| Post condition    | Il sistema restituisce un errore di permessi insufficienti (403) |
| Step#             | Description |
| 1                 | L'utente invia una richiesta con il proprio token valido |
| 2                 | Il sistema verifica il token e le autorizzazioni dell'utente |
| 3                 | Il sistema restituisce un errore con codice 403 |


### Scenario 4.8: Errore Interno del Server (500 Internal Server Error)

| Precondition     | Durante l'elaborazione della richiesta qualcosa non funziona nel server |
| :-------------------: | :-------------------------------------------------------------- |
| Post condition    | Il sistema restituisce un errore interno (500) |
| Step#             | Description |
| 1                 | L'utente invia una richiesta valida |
| 2                 | Il sistema cerca di elaborare la richiesta, ma si verifica un errore interno |
| 3                 | Il sistema restituisce un errore con codice 500 |


### Scenario 4.9: Rete Non Trovata (404 Not Found)

| Precondition     | L'utente invia una richiesta con un codice di rete che non esiste |
| :-------------------: | :------------------------------------------------------------ |
| Post condition    | Il sistema restituisce un errore con codice 404, indicando che la rete non è stata trovata |
| Step#             | Description |
| 1               | L'utente invia una richiesta con un codice di rete non valido |
| 2                 | Il sistema verifica che la rete non esista |
| 3                 | Il sistema restituisce un errore con codice 404 |

### Scenario 4.10: Conflitto (409 Conflict)

| Precondition     | L'utente cerca di creare o aggiornare una rete con un codice già esistente |
| :-------------------: | :------------------------------------------------------------------- |
| Post condition    | Il sistema restituisce un errore di conflitto (409) |
| Step#             | Description |
| 1                 | L'utente invia una richiesta con un codice di rete già esistente |
| 2                 | Il sistema rileva il conflitto di codice |
| 3                 | Il sistema restituisce un errore con codice 409 |


..

# Glossary

\<use UML class diagram to define important terms, or concepts in the domain of the application, and their relationships>

\<concepts must be used consistently all over the document, ex in use cases, requirements etc>

- `Network`: gruppo logico di gateway (e sensori associati), identificati da un codice alfanumerico univoco (scelto in creazione). Può rappresentare, ad esempio, una rete di monitorazione per un'intero palazzo. Non corrisponde a un device fisico ma è un oggetto software per organizzare e gestire gruppi diversi di device.

- `Gateway`: un device fisico identificato dal suo indirizzo MAC, fornito di intefaccia di rete e connesso tramite essa al sistema GeoControl.

- `Sensore`: device fisico che misura la quantità fisica (temperatura, inclinazione, etc) ogni 10 minuti. Non è fornito di interfaccia di rete ma è identificato unicamente dal suo indirizzo MAC. Comunica esclusivamente con il suo gateway corrispondente tramite connessione seriale, mandando la misurazione.

- `Misurazione`: è costituita dal valore misurato e dal timestamp della misurazione.

- `Statistiche di misurazioni`: _media_ ($\sigma$) e _varianza_ ($\mu$) di un insieme di misurazioni eseguite in un certo range temporale. Tramite questi due valori vengono poi calcolate:
	- _upper threashold_ = $\mu+2\sigma$
	- _lower threshold_ = $\mu-2\sigma$.


- `Misurazione Outlier`: ogni misurazione con valore più alto della `upperThreshold` o più basso della `lowerThreshold` considerando un insieme di misurazioni su un range temporale.

``` plantuml

class Network {
  - codice
  - nome
  - descrizione
}

class Gateway {
 - MAC
 - nome
 - descrizione
}

class Sensore {
 - MAC
 - nome
 - descrizione
 - variabile
 - unità di misura
}

class Statistica {
  - data inizio
  - data fine
  - media
  - varianza
  - upperThreshold
  - lowerThreshold
}

class Misurazione {
 - timestamp
 - valore
 - isOutlier
}

Network *-- "*" Gateway
Gateway *-- "*" Sensore
Sensore "1" -- "*" Misurazioni : associateA <
Misurazione "*" -- "1" Misurazioni : in >

```

# System Design

\<describe here system design>

\<must be consistent with Context diagram>

# Deployment Diagram

\<describe here deployment diagram >

