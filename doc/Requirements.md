# Requirements Document - GeoControl

Date:

Version: V1 - description of Geocontrol as described in the swagger

| Version number | Change |
| :------------: | :----: |
|                |        |

## Contents

- [Requirements Document - GeoControl](#requirements-document---geocontrol)
  * [Contents](#contents)
  * [Informal Description](#informal-description)
  * [Business Model](#business-model)
  * [Stakeholders](#stakeholders)
  * [Context Diagram and Interfaces](#context-diagram-and-interfaces)
    + [Context Diagram](#context-diagram)
    + [Interfaces](#interfaces)
  * [Stories and Personas](#stories-and-personas)
  * [Functional and Non-Functional Requirements](#functional-and-non-functional-requirements)
    + [Functional Requirements](#functional-requirements)
    + [Non-Functional Requirements](#non-functional-requirements)
  * [Use Case Diagram and Use Cases](#use-case-diagram-and-use-cases)
    + [Use Case Diagram](#use-case-diagram)
    + [Use Cases](#use-cases)
      - [Use Case 0: Template for Use Cases](#use-case-0--template-for-use-cases)
        * [Scenario 0.1](#scenario-01)
      - [Use case 1, Login (UC1)](#use-case-1--login--uc1-)
        * [Scenario 1.1](#scenario-11)
        * [Scenario 1.2](#scenario-12)
        * [Scenario 1.3](#scenario-13)
        * [Scenario 1.4](#scenario-14)
        * [Scenario 1.5](#scenario-15)
      - [Use case 2, Registrazione (UC2)](#use-case-2--registrazione--uc2-)
        * [Scenario 2.1](#scenario-21)
        * [Scenario 2.2](#scenario-22)
        * [Scenario 2.3](#scenario-23)
      - [Use case 3, Cancellazione Account](#use-case-3--cancellazione-account)
        * [Scenario 3.1](#scenario-31)
        * [Scenario 3.2](#scenario-32)
      - [Use case 4, Gestione Networks](#use-case-4--gestione-networks)
        * [Scenario 4.1: Recupero di tutte le Reti](#scenario-41--recupero-di-tutte-le-reti)
        * [Scenario 4.2: Recupero di una Rete specifica](#scenario-42--recupero-di-una-rete-specifica)
        * [Scenario 4.3: Creazione di una Nuova Rete](#scenario-43--creazione-di-una-nuova-rete)
        * [Scenario 4.4: Aggiornamento della Rete](#scenario-44--aggiornamento-della-rete)
        * [Scenario 4.5: Cancellazione della Rete](#scenario-45--cancellazione-della-rete)
        * [Scenario 4.6: Errore di Autorizzazione (401 Unauthorized)](#scenario-46--errore-di-autorizzazione--401-unauthorized-)
        * [Scenario 4.7: Errore di Permessi Insufficienti (403 Forbidden)](#scenario-47--errore-di-permessi-insufficienti--403-forbidden-)
        * [Scenario 4.8: Errore Interno del Server (500 Internal Server Error)](#scenario-48--errore-interno-del-server--500-internal-server-error-)
        * [Scenario 4.9: Rete Non Trovata (404 Not Found)](#scenario-49--rete-non-trovata--404-not-found-)
        * [Scenario 4.10: Conflitto (409 Conflict)](#scenario-410--conflitto--409-conflict-)
  * [Glossary](#glossary)
    + [Glossary Diagram](#glossary-diagram)
  * [System Design](#system-design)
  * [Deployment Diagram](#deployment-diagram)

<small><i><a href='http://ecotrust-canada.github.io/markdown-toc/'>Table of contents generated with markdown-toc</a> TODO: TOGLIERE STA ROBA POI</i></small>


## Informal Description

GeoControl è un software progettato per monitorare le variabili fisiche e ambientali in vari contesti: da analisi idrologiche di aree montane al sorvegliamento di edifici storici, e anche il controllo di parametri interni (quali temperatura o illuminazione) in aree residenziali o di lavoro.

## Business Model

__Sistema Software su Licenza__:
la compagnia che sviluppa GeoControl vende il software offrendo licenza annuale o come one-time-purchase. Vi sono diversi Tier di licenza tra cui quelli più avanzati che includono supporto tecnico e manutenzione della parte hardware del sistema (sensori e gateway).

## Stakeholders

| Stakeholder name | Description |
| :--------------- | :---------- |
|       Admin      |  Utente che ha accesso a tutte le risorse, inclusa la gestione di Networks e Utenti |
|      Operator    |  Utente che può gestire Network, Gateway, Sensori e inserire misurazioni |
|       Viewer     |  Utente che può solo consultare i dati |
| Unione delle Comunità Montane del Piemonte | Committente principale del Sistema |
| Enti Pubblici e Privati | Università, cittadine, Protezione Civile o aziende che vogliono usufruire dei servizi del Sistema |
| Produttori di Componenti | Coloro che si occupano di produzione e distribuzione dell'Hardware utilizzato nel Sistema |

# Context Diagram and Interfaces

## Context Diagram

__NOTE su DIAGRAMMA__:<br>
- In più punti dello Swagger viene suggerito come Gateways e Sensori siano entrambi entità esterne a GeoControl System. Non è specificato da nessuna parte se queste componenti siano poi effettivamente vendute dalla stessa azienda insieme al sistema. Si assume che GeoControl possa funzionare con qualsiasi Gateway e Sensore compatibile (anche di terze parti) per cui si possono considerare entità esterne al sistema.

### Context Diagram - Draw.io

[Context Diagram - Draw.io](./res/Context_Diagram.png)

### Context Diagram - PlantUML

``` plantuml

@startuml
skinparam linetype polyline
skinparam linetype ortho

rectangle System {
    (GeoControl System) as UC
}

rectangle "<< actor >>\n\n Gateways\n[physical]" as Sensori
rectangle "<< actor >>\n\n Sensori\n[physical]" as Gateways

Actor Admin
Actor Operator
Actor Viewer

Admin -l-> UC
Operator -l-> UC
Viewer -l-> UC

Sensori -r-> UC
Gateways -r-> UC


Admin -[hidden]- Operator
Admin -[hidden]l- Viewer
Gateways -[hidden]d- Sensori
@enduml

```


## Interfaces

\<describe here each interface in the context diagram>


|   Actor   | Logical Interface | Physical Interface |
| :-------- | :---------------: | :----------------: |
| Admin     | GUI               | PC                 |
| Operator  | GUI               | PC                 |
| Viewer    | GUI               | PC, Smartphone     |

## Stories and Personas

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

## Functional and Non-Functional Requirements

### Functional Requirements

\<In the form DO SOMETHING, or VERB NOUN, describe high level capabilities of the system>

\<they match to high level use cases>

|  ID   | Description |
| :---- | :---------- |
| __FR1__   | __Gestione Utente__ |
| FR1.1 | Autenticazione Utente |
| FR1.2 | Creazione Account|
| FR1.3 | Ottenimento Elenco Utenti |
| FR1.4 | Ottenimento Utente Specifico |
| FR1.5 | Eliminazione Account |
| __FR2__   | __Gestione Networks__ |
| FR2.1 | Creazione Network |
| FR2.2 | Ottenimento Elenco Networks |
| FR2.3 | Ottenimento Network Specifico |
| FR2.4 | Modifica Dati Network |
| FR2.5 | Eliminazione Network |
| __FR3__   | __Gestione Gateways__ |
| FR3.1 | Creazione Gateway |
| FR3.2 | Ottenimento Elenco Gateway per Network Specifico |
| FR3.3 | Ottenimento Gateway Specifico | 
| FR3.4 | Modifica Dati Gateway |
| FR3.5 | Eliminazione Gateway |
| __FR4__   | __Gestione Sensori__ |
| FR4.1 | Creazione Sensore |
| FR4.2 | Ottenimento Elenco Sensori per Gateway Specifico |
| FR4.3 | Ottenimento Sensore Specifico |
| FR4.4 | Modifica Dati Sensore |
| FR4.5 | Eliminazione Sensore|
| __FR5__   | __Calcolo Statistiche su Misurazioni__ |
| FR5.1 | Calcolo Media su Misurazioni in Range Temporale |
| FR5.2 | Calcolo Varianza su Misurazioni in Range Temporale |
| __FR6__   | __Gestione Misurazioni__ |
| FR6.1 | Creazione Misurazione |
| FR6.2 | Ottenimento Elenco Misurazioni di Network Specifico |
| FR6.3 | Ottenimento Elenco Misurazioni di Sensore Specifico |
| FR6.4 | Ottenimento Elenco Statistiche di Network Specifico |
| FR6.5 | Ottenimento Elenco Statistiche di Sensore Specifico |
| FR6.6 | Ottenimento Elenco Outliers di Network Specifico |
| FR6.7 | Ottenimento Elenco Outliers di Sensore Specifico |
| __FR7__   | __Gestione Timestamp__ |
| FR7.1 | Conversione Timestamp a Tempo Locale |


### Non-Functional Requirements

\<Describe constraints on functional requirements>

|  ID  | Type        | Description | Refers to |
| :--: | :---------- | :---------- | :-------: |
| NFR1 | Domain      | Il formato dei Timestamp deve essere il formato ISO 8601 (UTC) | FR6 |
| NFR2 | Reliability | Non devono essere perse più di 6 misurazioni per sensore ogni anno | FR6 |
| NFR3 | Reliability | Il timestamp deve corrispondere all'esatto momento della misurazione | FR6 |
| NFR4 | Reliability | Il flusso di misurazioni non deve essere interrotto | FR6 |
| NFR5 | Domain      | La misurazioni deve avvenire ogni 10 minuti | FR6 |



## Use Case Diagram and Use Cases

### Use Case Diagram

\<define here UML Use case diagram UCD summarizing all use cases, and their relationships>

\<next describe here each use case in the UCD>

### Use Cases


\##############################################

#### Use Case 0 (UC0): Template for Use Cases

| UC0              | Use Case 0: Template for Use Cases |
| :--------------- | :--------------------------------- |
| Actors Involved  |  |
| Pre-condition    |  |
| Post-condition   |  |
| Nominal Scenario |  |
| Variants         |  |
| Exceptions       |  |


##### Scenario 0.1

| UC0 - S0.1     | Scenario 0.1: Template for Use Cases (Successful) |
| :------------- | :------------------------------------------------ |
| Pre-condition  |  |
| Post-condition |  |
| __Step#__      | <div align="center"> __Description__ </div> |
| 1              |  |
| 2              |  |
| ...            |  |


\<describe here scenarios instances of UC0>

\<a scenario is a sequence of steps that corresponds to a particular execution of one use case>

\<a scenario is a more formal description of a story>

\<only relevant scenarios should be described>

\###############################################

#### Use case 1 (UC1): Autenticazione al Sistema

| UC1              | Use Case 1: Autenticazione al Sistema | 
| :--------------- | :--------------------------------- |
| Actors Involved  | Admin \| Operator \| Viewer |
| Pre-condition    | Utente non è autenticato |
| Post-condition   | Utente ha ottenuto un Token per le richieste successive |
| Nominal Scenario | Scenario 1.1 |
| Variants         | // |
| Exceptions       | Scenari: 1.2, 1.3, 1.4, 1.5 |

##### Scenario 1.1

| UC1 - S1.1     | Scenario 1.1: Autenticazione al Sistema (Successful) |
| :------------- | :------------------------------------------------ |
| Pre-condition  | Utente esiste nel sistema |
| Post-condition | Utente ha ottenuto un Token per le richieste successive |
| __Step#__      | <div align="center"> __Description__ </div> |
| 1              | _System_: richiede credenziali (Username e Password) |
| 2              | _Utente_: fornisce credenziali (Username e Password) |
| 3              | _System_: legge credenziali (Username e Password) |
| 4              | _System_: cerca Username; Username trovato |
| 5			  	 | _System_: verifica Password; Password corretta |
| 6              | _System_: autorizza Utente e restituisce Token |

##### Scenario 1.2

| UC1 - S1.2     | Scenario 1.2: Autenticazione al Sistema (Utente non Esiste) |
| :------------- | :------------------------------------------------ |
| Pre-condition  | Utente non esiste nel sistema |
| Post-condition | Utente non è autenticato; mostrato messaggio di errore |
| __Step#__      | <div align="center"> __Description__ </div> |
| 1              |  _System_: richiede credenziali (Username e Password) |
| 2              |  _Utente_: fornisce credenziali (Username e Password) |
| 3              |  _System_: legge credenziali (Username e Password) |
| 4              |  _System_: cerca Username; Username non trovato |
| 5              |  _System_: mostra messaggio di errore. Utente non trovato |

##### Scenario 1.3

| UC1 - S1.3     | Scenario 1.3: Autenticazione al Sistema (Password Errata) |
| :------------- | :------------------------------------------------ |
| Pre-condition  | Utente esiste nel sistema |
| Post-condition | Utente non è autenticato; mostrato messaggio di errore |
| __Step#__      | <div align="center"> __Description__ </div> |
| 1              | _System_: richiede credenziali (Username e Password) |
| 2              | _Utente_: fornisce credenziali (Username e Password) |
| 3              | _System_: legge credenziali (Username e Password) |
| 4              | _System_: cerca Username; Username trovato |
| 5              | _System_: verifica Password; Password errata |
| 6              | _System_: mostra messaggio di errore. Password errata |



#### Use case 2, Registrazione (UC2)

| Actors Involved  |   Admin                            |
| :--------------: | :------------------------------------------------------------------- |
|   Pre-Condition  | L'Utente non ha un account  |
|  Post-Condition  |  L'Utente si è registrato   |
| Nominal Scenario |         Scenario 2.1         |
|     Variants     |                     Nessuna                    |
|    Exceptions    |    Scenario 2.2, 2.3, 2.4, 2.5, 2.6          |

##### Scenario 2.1
|  Scenario 2.1  |  Registrazione completata         |
| :------------- | :------------------------------------------------------------------------- |
|  Pre-Condition | L'Utente non è registrato |
| Post-Condition |  L'Utente si è registrato  |
|     Step#      |                                Description                                 |
|       1        |  L'Utente chiede di creare un account                             |
|       2        |  Il Sistema controlla che l'Utente sia autorizzato e che abbia i diritti sufficienti|
|       3        |  Il Sistema richiede username, nome, cognome, ruolo e password       |
|      4         |  L'Utente fornisce username, nome, cognome, ruolo e password           |
|      5         | Il Sistema legge username, nome, cognome, ruolo e password |
|      6         | Il Sistema controlla che tutti i parametri siano riempiti. Tutti i parametri sono riempiti|
|      7         | Il Sistema controlla che l'username non sia ancora associato ad un account. L'username non è ancora stato usato|
|      8         | Il Sistema crea un nuovo Utente con le informazioni fornite e restituisce un messaggio codice 200 |

##### Scenario 2.2
|  Scenario 2.2  |  Utente già esistente         |
| :------------- | :------------------------------------------------------------------------- |
|  Pre-Condition | L'Utente non è registrato |
| Post-Condition |  Registrazione fallita  |
|     Step#      |                                Description                                 |
|       1        |  L'Utente chiede di creare un account                             |
|       2        |  Il Sistema controlla che l'Utente sia autorizzato e che abbia i diritti sufficienti|
|       3        |  Il Sistema richiede username, nome, cognome, ruolo e password       |
|      4         |  L'Utente fornisce username, nome, cognome, ruolo e password           |
|      5         | Il Sistema legge username, nome, cognome, ruolo e password |
|      6         | Il Sistema controlla che tutti i parametri siano riempiti. Almeno uno è vuoto. Il Sistema restituisce un messaggio di errore con codice 400|

##### Scenario 2.3
|  Scenario 2.3  |  Campi vuoti         |
| :------------- | :------------------------------------------------------------------------- |
|  Pre-Condition | L'Utente non è registrato |
| Post-Condition |  Registrazione fallita  |
|     Step#      |                                Description                                 |
|       1        |  L'Utente chiede di creare un account                             |
|      2         | Il Sistema tenta di controllare che l'Utente sia autorizzato o abbia i diritti sufficienti, ma si verifica un errore.|
|      3         | Il sistema restituisce un codice 500 e un messaggio di errore indicando un errore interno al server |

#### Use case 3, Cancellazione Account

| Actors Involved  |   Admin    |
| :--------------: | :------------------------------------------------------------------- |
|   Pre-Condition  | L'Utente ha un account  |
|  Post-Condition  |  L'account viene eliminato  |
| Nominal Scenario |         Scenario 3.1         |
|     Variants     |                     Nessuna                    |
|    Exceptions    |                        Scenario 3.2                        |

##### Scenario 3.1
|  Scenario 3.1  |  Cancellazione effettuata         |
| :------------- | :------------------------------------------------------------------------- |
|  Pre-Condition  | L'Utente ha un account |
| Post-Condition |  L'account viene eliminato  |
|     Step#      |                                Description                                 |
|       1        |  Utente : chiede di eliminare Utente U                             |
|       2        |  Sistema : richiede username dell'Utente U      |
|      3         |  Utente : fornisce l'username dell'Utente U        |
|      4         | Sistema  : legge l'username |
|      5         | Sistema : cerca le informazioni relative all'Utente U. U viene trovato|
|      6         | Sistema : elimina l'account dell'Utente U|

##### Scenario 3.2
|  Scenario 3.2  |  Utente inesistente         |
| :------------- | :------------------------------------------------------------------------- |
|  Pre-Condition  | L'Utente ha un account |
| Post-Condition |  Viene mostrato un errore  |
|     Step#      |                                Description                                 |
|       1        |  Utente : chiede di eliminare Utente U                             |
|       2        |  Sistema : richiede username dell'Utente U      |
|      3         |  Utente : fornisce l'username dell'Utente U        |
|      4         | Sistema  : legge l'username |
|      5         | Sistema : cerca le informazioni relative all'Utente U. U non viene trovato|
|      6         | Sistema : mostra un messaggio di errore in cui dice che l'Utente U non esiste|



#### Use case 4, Gestione Networks

| Actors Involved  |   Admin, Operator, Viewer    |
| :--------------: | :------------------------------------------------------------------- |
|   Pre-Condition  |  L'utente è autenticato e ha i permessi per visualizzare, creare, aggiornare o cancellare le reti. |
|  Post-Condition  |  La rete è stata gestita correttamente  |
| Nominal Scenario |        Scenario 4.1: Recupero di tutte le reti (GET /networks), Scenario 4.2: Creazione di una nuova rete (POST /networks), Scenario 4.3: Aggiornamento della rete (PATCH /networks), Scenario 4.4: Cancellazione della rete (DELETE /networks)      |
|     Variants     |               Nessuna                    |
|    Exceptions    |      Scenario 4.6: Errore di autorizzazione (401), Scenario 4.7: Errore di permessi insufficienti (403), Scenario 4.8: Errore interno del server (500), Scenario 4.9: Rete non trovata (404), Scenario 4.10: Conflitto (409)                  |

##### Scenario 4.1: Recupero di tutte le Reti 

| Pre-Condition   | L'utente è autenticato correttamente e ha i permessi per visualizzare le reti |
| :-------------------: | :-------------------------------------------------------------------------- |
| Post-Condition    | Il sistema restituisce l'elenco di tutte le reti registrate |
| Step#             | Description |
| 1                 | L'utente invia una richiesta GET a `/networks` con il token di autenticazione valido |
| 2                 | Il sistema verifica la validità del token di autenticazione |
| 3                 | Il sistema recupera tutte le reti |
| 4                 | Il sistema restituisce una lista di tutte le reti con il codice 200 e i dati in formato JSON |

##### Scenario 4.2: Recupero di una Rete specifica 

| Pre-Condition   | L'utente è autenticato correttamente e ha i permessi per visualizzare le reti |
| :-------------------: | :-------------------------------------------------------------------------- |
| Post-Condition    | Il sistema restituisce la rete specifica |
| Step#             | Description |
| 1                 | L'utente invia una richiesta GET a `/networks/{networkCode}` con il token di autenticazione valido |
| 2                 | Il sistema verifica la validità del codice di rete e del token di autenticazione |
| 3                 | Il sistema recupera la rete richiesta |
| 4                 | Il sistema restituisce una la rete con il codice 200 e i dati in formato JSON |

##### Scenario 4.3: Creazione di una Nuova Rete 

| Pre-Condition    | L'utente (Admin e Operator) è autenticato e ha i permessi per creare una rete |
| :-------------------: | :------------------------------------------------------- |
| Post-Condition    | Una nuova rete è stata creata nel sistema|
| Step#             | Description |
| 1                 | L'utente invia una richiesta POST a `/networks` con i dati della rete |
| 2                 | Il sistema verifica che i dati siano completi e validi |
| 3                 | Il sistema crea una nuova rete |
| 4                 | Il sistema restituisce una risposta con codice 201, indicando che la rete è stata creata correttamente. |


##### Scenario 4.4: Aggiornamento della Rete 

| Pre-Condition    | L'utente (Admin e Operator) è autenticato e ha i permessi per aggiornare la rete |
| :-------------------: | :---------------------------------------------------------- |
| Post-Condition    | La rete è stata aggiornata correttamente nel sistema |
| Step#            | Description |
| 1                 | L'utente invia una richiesta PATCH a `/networks/{networkCode}` con i dati da aggiornare |
| 2                 | Il sistema verifica la validità dei dati di aggiornamento |
| 3                | Il sistema aggiorna i dati della rete |
| 4                 | Il sistema restituisce una risposta con codice 204, indicando che l'aggiornamento è stato effettuato correttamente |

##### Scenario 4.5: Cancellazione della Rete

| Pre-Condition    | L'utente (Admin e Operator) è autenticato e ha i permessi per cancellare la rete |
| :-------------------: | :-------------------------------------------------------- |
| Post-Condition    | La rete è stata cancellata correttamente dal sistema. |
| Step#             | Description |
| 1                 | L'utente invia una richiesta DELETE a `/networks/{networkCode}`. |
| 2                 | Il sistema verifica la validità del codice di rete e l'autenticazione |
| 3                 | Il sistema cancella la rete |
| 4                 | Il sistema restituisce una risposta con codice 204, indicando che la rete è stata cancellata correttamente |

##### Scenario 4.6: Errore di Autorizzazione (401 Unauthorized)

| Pre-Condition    | L'utente invia una richiesta senza token o con un token non valido |
| :-------------------: | :--------------------------------------------------------------- |
| Post-Condition    | Il sistema restituisce un errore di autorizzazione (401) |
| Step#            | Description |
| 1                 | L'utente invia una richiesta senza un token valido |
| 2                 | Il sistema verifica il token e rileva che non è valido |
| 3                 | Il sistema restituisce un errore con codice 401 |


##### Scenario 4.7: Errore di Permessi Insufficienti (403 Forbidden)

| Pre-Condition    | L'utente non ha i permessi per accedere alla rete richiesta |
| :-------------------: | :------------------------------------------------------- |
| Post-Condition    | Il sistema restituisce un errore di permessi insufficienti (403) |
| Step#             | Description |
| 1                 | L'utente invia una richiesta con il proprio token valido |
| 2                 | Il sistema verifica il token e le autorizzazioni dell'utente |
| 3                 | Il sistema restituisce un errore con codice 403 |


##### Scenario 4.8: Errore Interno del Server (500 Internal Server Error)

| Pre-Condition    | Durante l'elaborazione della richiesta qualcosa non funziona nel server |
| :-------------------: | :-------------------------------------------------------------- |
| Post-Condition    | Il sistema restituisce un errore interno (500) |
| Step#             | Description |
| 1                 | L'utente invia una richiesta valida |
| 2                 | Il sistema cerca di elaborare la richiesta, ma si verifica un errore interno |
| 3                 | Il sistema restituisce un errore con codice 500 |


##### Scenario 4.9: Rete Non Trovata (404 Not Found)

| Pre-Condition    | L'utente invia una richiesta con un codice di rete che non esiste |
| :-------------------: | :------------------------------------------------------------ |
| Post-Condition    | Il sistema restituisce un errore con codice 404, indicando che la rete non è stata trovata |
| Step#             | Description |
| 1               | L'utente invia una richiesta con un codice di rete non valido |
| 2                 | Il sistema verifica che la rete non esista |
| 3                 | Il sistema restituisce un errore con codice 404 |

##### Scenario 4.10: Conflitto (409 Conflict)

| Pre-Condition    | L'utente cerca di creare o aggiornare una rete con un codice già esistente |
| :-------------------: | :------------------------------------------------------------------- |
| Post-Condition    | Il sistema restituisce un errore di conflitto (409) |
| Step#             | Description |
| 1                 | L'utente invia una richiesta con un codice di rete già esistente |
| 2                 | Il sistema rileva il conflitto di codice |
| 3                 | Il sistema restituisce un errore con codice 409 |


..

## Glossary

\<use UML class diagram to define important terms, or concepts in the domain of the application, and their relationships>

\<concepts must be used consistently all over the document, ex in use cases, requirements etc>

## Glossary Terms

- __Utente__: è un attore del sistema, può essere un Admin, un Operator o un Viewer.<br> È identificato da uno `username` (a volte detto `userName`) e dettagliato con `password` e `type`.
	- `username`: identificativo unicovo di un `Utente`. [Lunghezza Minima: 1]
	- `password`: utilizzata in combinazione con lo `username` per autenticare un `Utente` nel sistema (ricevendo un `Token`). [Lunghezza Minima: 5]
	- `type`: è il tipo di `Utente`, definisce il ruolo dell'Utente e il livello di accesso alle funzionalità. Può essere:
		- `admin`: identifica un `Utente` di tipo `Admin`.
		- `operator`: identifica un `Utente` di tipo `Operator`.
		- `viewer`: identifica un `Utente` di tipo `Viewer`.

	- __Account__: è un Alias di `Utente`. È in pratica la rappresentazione in forma di dato di un Utente del sistema. Si definisce questo Alias per non confondersi tra il concetto di Utente come dato o classe del sistema (Utente, User) e il concetto di Utente come Attore, ovvero una persona fisica del mondo reale che interagisce con il sistema.

- __Admin__: è un Utente con accesso completo alle risorse e alle funzionalità. Può gestire completamente i tutti Network (e quindi tutti i Gateway e Sensori) e tutti gli Utenti (Account). 

- __Operator__: è un Utente con accesso a tutte le funzionalità di gestione dei Network (e quindi di tutti i Gateway e Sensori) ma senza accesso alla gestione degli Utenti (Account).

- __Viewer__: è un utente con accesso limitato al sistema. Può solo visualizzare i dati del sistema (tutti) ma non può modificarli. Non ha accesso alla visualizzazione e gestione degli Utenti (Account).

- __Network__: raggruppamento Logico di `Gateway` (e corrispettivi `Sensori` associati). Non corrisponde a un device fisico ma è una entità software per organizzare e gestire gruppi di device. (Esempio: un singolo Network monitora un singolo comune o singolo edificio).<br> È identificato da un `code` (a volte detto `networkCode`) e dettagliato con `name` e `description`.
	- `code`: identificativo univoco di un `Network`. [Alfanumerico, Lunghezza Minima: 1]
	- `name`: nome del `Network`. [Nessun Formato Specificato]
	- `description`: descrizione del `Network`. [Nessun Formato Specificato]

- __Gateway__: device fisico dotato di una interfaccia di rete e connesso al GeoControl System tramite essa; è collegato a uno o più `Sensori` tramite una interfaccia seriale dalla quale riceve le informazioni delle `Misurazioni`. È in grado di eseguire la conversione digitale dei dati ottenuti dai `Sensori` e trasmetterli sulla rete.<br> È identificato da un `macAddess` (a volte detto `gatewayMac`) e dettagliato con `name` e `description`.
	- `macAddress`: identificativo univoco di un `Gateway`. [Indirizzo MAC (standard Ethernet)]
	- `name`: nome del `Gateway`. [Nessun Formato Specificato]
	- `description`: descrizione del `Gateway`. [Nessun Formato Specificato] 

- __Sensore__: device fisico che esegue le effettive misurazioni delle "quantità fisiche" (le misurazioni vengono eseguite ogni 10 minuti). Non dispone di una interfaccia di rete. È associato a un solo `Gateway` al quale è collegato mediante una connessione seriale. Oltre ai dati della misurazione, il `Sensore` invia anche il timestamp della misurazione nel Formato ISO 8601 nella timezone locale.<br> È identificato da un `macAddress` (a volte detto `sensorMac`) e dettagliato con `name`, `description`, `variable` (a volte detto `value`) e `unit`.
	- `macAddress`: identificativo univoco di un `Sensore`. [Indirizzo MAC (standard Ethernet)]
	- `name`: nome del `Sensore`. [Nessun Formato Specificato]
	- `description`: descrizione del `Sensore`. [Nessun Formato Specificato]
	- `variable`: misura del "dato fisico" misurato dal `Sensore`. [Nessun Formato Specificato]
	- `unit`: unità di misura del valore `variable`. [Nessun Formato Specificato] 

- __Misurazione__: è eseguita da un `Sensore`, collezionate dal `Gateway` corrispondente, inviata sul `Network` corrispondente e memorizzata dal GeoControl System.<br> Include `timestamp` (a volte detto `createdAt`), `value`, `isOutlier`.
	- `timestamp`: momento in cui è stata eseguita la misurazione. È convertito dal sistema nella timezone UTC. [Formato ISO 8601]
	- `value`: valore associato alla misurazione (ovvero valore della misura `variable` del `Sensore`). [Numero Reale]
	- `isOutlier`: indica se il valore di `value` è fuori dalle threshold `upperThreshold` e `lowerThreshold`. A differenza degli altri attributi, non è un dato persistente. [Booleano]

- __Statistiche di Misurazioni__: (o semplicemente __Statistiche__) è un insieme di valori calcolati rispetto a un insieme di `Misurazioni` identificate da un range temporale.<br> Include `startDate`, `endDate`, `mean`, `variance`, `upperThreshold` e `lowerThreshold`.
	- `startDate`: timestamp di inizio del range temporale. [Formato ISO 8601]
	- `endDate`: timestamp di fine del range temporale. [Formato ISO 8601]
	- `mean`: Media delle misurazioni eseguite nel range temporale. Indicato con $\mu$. [Numero Reale]
	- `variance`: Varianza delle misurazioni eseguite nel range temporale. Indicato con $\sigma$. [Numero Reale]
	- `upperThreshold`: threshold superiore utilizzato per l'Outlier Detection. Calcolato tramite Media e varianza. [Numero Reale]
		- `upperThreshold` $= \mu+2\sigma$.
	- `lowerThreshold`: threshold inferiore utilizzato per l'Outlier Detection. Calcolato tramite Media e varianza. [Numero Reale]
		- `lowerThreshold` $= \mu-2\sigma$.

- __Misurazione Outlier__: (o semplicemente __Outlier__) è una `Misurazione` il cui valore `value` è più alto della `upperThreshold` o più basso della `lowerThreshold`. L'insieme delle `Misurazioni` Outlier è un sottoinsieme delle `Misurazioni`.

- __Formato ISO 8601__: è uno standard internazionale per la rappresentazione di date e orari. Ha lo scopo di evitare ambiguità e confusione tra le varie rappresentazioni di date e orari.
	- __Timezone UTC__: è la Timezone del Coordinated Universal Time (UTC), ovvero il fuso orario standard universale di riferimento. UTC non cambia con l'ora legale, quindi rimane costante durante tutto l'anno.

## Glossary Diagram

__NOTE su DIAGRAMMA__:<br>
Si assume che questo Diagramma del Glossario non debba essere un vero e proprio UML Class Diagram. In pratica questo diagramma rappresenta concetti e relazioni piuttosto che classi. Si specifica questo in quanto sono state fatte delle scelte appartentemente ambigue.
- Ovviamente non avrebbe senso rappresentare sia le classi dei Ruoli (Admin, Operator, Viewer) che avere l'attributo di tipo enum `type` in Utente (anzi non avrebbe proprio senso rappresentare Utente in primo luogo, in quanto Viewer è sufficiente). Lo si è fatto in modo da poter rappresentare esplicitamente le relazioni tra i singoli ruoli e le singole funzionalità.
- Si è scelto di non rappresentare il concetto di "oggetto Misurazione e Statistiche" (ovvero quello che negli Schemas dello Swagger è definito come `Measurements`), in quanto non è qualcosa di tangile dal punto di vista concettuale ma è semplicemente un modo per raggruppare un singolo output.
- La relazione tra `Operator` e `Misurazione` potrebbe essere omessa in quanto vi è un collegamento implicito tramite `Network`. In ogni caso su questo vi è ambiguità in quanto non è chiaro se le misurazioni siano inserite ogni 10 minuti al momento che il Sensore le produce o se un Operator debba inserirle manualmente. 

### Glossary Diagram - Draw.io

![Glossary Diagram - Draw.io](./res/Glossary_Diagram.png)

### Glossary Diagram - PlantUML

``` plantuml

@startuml
skinparam linetype polyline
skinparam linetype ortho

abstract class Utente {
  - username
  - password
  - type : enum {admin, operator, viewer}
}

class Admin {}
class Operator {}
class Viewer {}

class Network {
  - code
  - name
  - description
}

class Gateway {
  - macAddress
  - name
  - description
}

class Sensore {
  - macAddress
  - name
  - description
  - variable
  - unit
}

class Misurazione {
  - timestamp
  - value
  - isOutlier
}

class Statistiche {
  - startDate
  - endDate
  - mean
  - variance
  - upperThreshold
  - lowerThreshold
}

Utente <|-- Viewer
Viewer <|-l- Operator
Operator <|-l- Admin

Operator -- Network : manages >
Viewer -- Network : views >
Viewer -- Misurazione : views >
Viewer -- Statistiche : views >
Operator -- Misurazione : inserts > 

Network *-r- "*" Gateway
Gateway *-r- "*" Sensore
Sensore "1" --> "0..*" Misurazione : produces >

Statistiche "*" -- "*" Misurazione : is computed from >
Statistiche "*" -- "1" Sensore : is related >
@enduml

```


# System Design

__NOTE su DIAGRAMMA__:<br>
- Vale anche qui la nota del Context Diagram.
- Si assume che il "token-based authentication mechanism" non sia qualcosa di esterno, ma sia compreso nel sistema. Inoltre, viene considerato come un "modulo" o "componente" a se stante.

## System Diagram - Draw.io

![System Diagram - Draw.io](./res/System_Diagram.png)

## System Diagram - PlantUML

``` plantuml

@startuml
skinparam linetype polyline
skinparam linetype ortho


class "GeoControl System" as GS {
  F1 - Gestione Utente()
  F2 - Gestione Networks()
  F3 - Gestione Gateways()
  F4 - Gestione Sensori()
  F5 - Calcolo Statistiche su Misurazioni()
  F6 - Gestione Misurazioni()
  F7 - Gestione Timestamp()
}

class Network {}

class AuthenticationUnit {
  F1.1 - Autenticazione Utente()
}

Network "*" -u-o GS
AuthenticationUnit "1" -u-o GS

@enduml

```


# Deployment Diagram

__NOTE su DIAGRAMMA__:<br>
- Il diagramma PlantUML viene generato in modo atroce, non lo si consideri più di tanto.
- Le due componenti "\<\<executionEnvironment>>" del Nodo ClientApp sono da intendersi in alternativa. 

## Deployment Diagram - Draw.io

![Deployment Diagram - Draw.io](./res/Deployment_Diagram.png)

## Deployment Diagram - PlantUML

``` plantuml

@startuml
skinparam linetype polyline
skinparam linetype ortho


node "Server" <<device>> as Server {
    artifact "GeoControl System" <<artifact>> as GCS

    database "GeoControl Database" as DB
}

node Gateway <<device>> {
    component "Network Interface"
}

node Sensore <<device>>

node ClientApp <<device>> {
    component Browser <<executionEnvironment>> as Browser {
        artifact "Front-end WebApp" <<artifact>> as FE
    }

    component "Android/iOS" <<executionEnvironment>> as Mobile {
        artifact "Mobile App" <<artifact>>
    }

}

GCS -d- DB

Server "1" -l- "*" Gateway: Internet Protocol (IP)
Gateway "1" -d- "*" Sensore: Serial Connection
Server "1" -r- "0..*" ClientApp: HTTPS

Browser -u[hidden]- Mobile
@enduml

```