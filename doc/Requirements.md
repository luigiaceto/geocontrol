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
      - [Use Case 0 (UC0): Template for Use Cases](#use-case-0--uc0---template-for-use-cases)
        * [Scenario 0.1](#scenario-01)
      - [Use case 1 (UC1): Autenticazione al Sistema](#use-case-1--uc1---autenticazione-al-sistema)
        * [Scenario 1.1](#scenario-11)
        * [Scenario 1.2](#scenario-12)
        * [Scenario 1.3](#scenario-13)
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

- __Private-as-a-Service__:
  una compagnia privata sviluppa e gestisce il sistema offrendo il servizio ad amministrazioni pubbliche su base contrattuale.

- __Sistema Software su licenza__:
  la compagnia che sviluppa GeoControl vende il software offrendo licenza annuale o come one-time-purchase. Vi sono diversi Tier di licenza tra cui quelli più avanzati potrebbero includere supporto tecnico e manutenzione della parte hardware del systema (sensori e gateway).

- __Modello Open Core__:
  si offre una versione open source del software e vengono venduti moduli premium con funzionalità più avanzate e servizi di personalizzazione e integrazione. È utile per creare parallelamente una community di sviluppatori che contribuisce al miglioramento del prodotto.

- __partnership__:
  collaborare con produttori di sensori integrando al meglio il loro hardware con GeoControl e con società di consulenza ambientale/ingegneristica. Stabilire anche accordi di guadagno con partner che portano nuovi clienti.

## Stakeholders

| Stakeholder name | Description |
| :--------------- | :---------- |
|       Admin      |  Utente che ha accesso a tutte le risorse, inclusa la gestione di Networks e Utenti |
|      Operator    |  Utente che può gestire Network, Gateway, Sensori e inserire misurazioni |
|       Viewer     |  Utente che può solo consultare i dati |
| Unione delle Comunità Montane del Piemonte | Committente principale del Sistema |
| Enti Pubblici e Privati | Università, cittadine, Protezione Civile o aziende che vogliono usufruire dei servizi del Sistema |
| Produttori di Componenti | Coloro che si occupano di produzione e distribuzione dell'Hardware utilizzato nel Sistema |

## Context Diagram and Interfaces

### Context Diagram

\<Define here Context diagram using UML use case diagram>
<p align="center">
    <img src="res/Context_diagram.png" alt="" width="400">
</p>

\<actors are a subset of stakeholders>

### Interfaces

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
| FR1   | Gestione Utente |
| FR1.1 | Autenticazione Utente |
| FR1.2 | Creazione Account|
| FR1.3 | Ottenimento Elenco Utenti |
| FR1.4 | Ottenimento Utente Specifico |
| FR1.5 | Eliminazione Account |
| FR2   | Gestione Networks |
| FR2.1 | Creazione Network |
| FR2.2 | Ottenimento Elenco Networks |
| FR2.3 | Ottenimento Network Specifico |
| FR2.4 | Modifica Dati Network |
| FR2.5 | Eliminazione Network |
| FR3   | Gestione Gateways |
| FR3.1 | Creazione Gateway |
| FR3.2 | Ottenimento Elenco Gateway per Network Specifico |
| FR3.3 | Ottenimento Gateway Specifico | 
| FR3.4 | Modifica Dati Gateway |
| FR3.5 | Eliminazione Gateway |
| FR4   | Gestione Sensori |
| FR4.1 | Creazione Sensore |
| FR4.2 | Ottenimento Elenco Sensori per Gateway Specifico |
| FR4.3 | Ottenimento Sensore Specifico |
| FR4.4 | Modifica Dati Sensore |
| FR4.5 | Eliminazione Sensore|
| FR5   | Calcolo Statistiche su Misurazioni |
| FR5.1 | Calcolo Media su Misurazioni in Range Temporale |
| FR5.2 | Calcolo Varianza su Misurazioni in Range Temporale |
| FR6   | Gestione Misurazioni |
| FR6.1 | Creazione Misurazione |
| FR6.2 | Ottenimento Elenco Misurazioni di Network Specifico |
| FR6.3 | Ottenimento Elenco Misurazioni di Sensore Specifico |
| FR6.4 | Ottenimento Elenco Statistiche di Network Specifico |
| FR6.5 | Ottenimento Elenco Statistiche di Sensore Specifico |
| FR6.6 | Ottenimento Elenco Outliers di Network Specifico |
| FR6.7 | Ottenimento Elenco Outliers di Sensore Specifico |

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
| Exceptions       | Scenari: 1.2, 1.3 |

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
| 1              | _System_: richiede credenziali (Username e Password) |
| 2              | _Utente_: fornisce credenziali (Username e Password) |
| 3              | _System_: legge credenziali (Username e Password) |
| 4              | _System_: cerca Username; Username non trovato |
| 5              | _System_: mostra messaggio di errore. Utente non trovato |

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
|    Exceptions    |                        Scenario 2.2, 2.3                        |

##### Scenario 2.1
|  Scenario 2.1  |  Registrazione completata         |
| :------------- | :------------------------------------------------------------------------- |
|  Pre-Condition | L'Utente non è registrato |
| Post-Condition |  L'Utente si è registrato  |
|     Step#      |                                Description                                 |
|       1        |  Utente : chiede di registrarsi                             |
|       2        |  Sistema : richiede username, nome, cognome, ruolo e password       |
|      3         |  Utente : fornisce username, nome, cognome, ruolo e password           |
|      4         | Sistema  : legge username, nome, cognome, ruolo e password |
|      5         | Sistema : controlla che l'username non sia ancora associato ad un account. L'username non è ancora stato usato|
|      6         | Sistema : crea un nuovo Utente con le informazioni fornite|

##### Scenario 2.2
|  Scenario 2.2  |  Utente già esistente         |
| :------------- | :------------------------------------------------------------------------- |
|  Pre-Condition | L'Utente non è registrato |
| Post-Condition |  Registrazione fallita  |
|     Step#      |                                Description                                 |
|       1        |  Utente : chiede di registrarsi                             |
|       2        |  Sistema : richiede username, nome, cognome, ruolo e password       |
|      3         |  Utente : fornisce username, nome, cognome, ruolo e password           |
|      4         | Sistema  : legge username, nome, cognome, ruolo e password |
|      5         | Sistema : controlla che l'username non sia ancora associato ad un account. L'username esiste già. Viene fornito un messaggio di errore|

##### Scenario 2.3
|  Scenario 2.3  |  Campi vuoti         |
| :------------- | :------------------------------------------------------------------------- |
|  Pre-Condition | L'Utente non è registrato |
| Post-Condition |  Registrazione fallita  |
|     Step#      |                                Description                                 |
|       1        |  Utente : chiede di registrarsi                             |
|       2        |  Sistema : richiede username, nome, cognome, ruolo e password       |
|      3         |  Utente : fornisce username, nome, cognome, ruolo e password           |
|      4         | Sistema  : legge username, nome, cognome, ruolo e password |
|      5         | Sistema : controlla che tutti i parametri siano riempiti. Almeno uno è vuoto. Viene fornito un messaggio di errore|

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

- __Network__: gruppo logico di gateway (e sensori associati), identificati da un codice alfanumerico univoco (scelto in creazione). Può rappresentare, ad esempio, una rete di monitorazione per un'intero palazzo. Non corrisponde a un device fisico ma è un oggetto software per organizzare e gestire gruppi diversi di device.

- __Gateway__: un device fisico identificato dal suo indirizzo MAC, fornito di intefaccia di rete e connesso tramite essa al sistema GeoControl. Inoltre è connesso ad uno o più sensori attraverso interfacce seriali, tramite cui riceve le misurazioni e i rispettivi timestamp. Si occupa infine della conversione digitale dei dati e di trasmetterli al Network.

- __Sensore__: device fisico che misura la quantità fisica (temperatura, inclinazione, etc) ogni 10 minuti. Non è fornito di interfaccia di rete ma è identificato unicamente dal suo indirizzo MAC. Comunica esclusivamente con il suo gateway corrispondente tramite connessione seriale, mandando la misurazione e il rispettivo timestamp

- __Misurazione__: è costituita dal valore misurato e dal timestamp della misurazione, cioè l'esatto momento della misurazione (il sensore manda la data al gateway in formato ISO 8601 con la timezone locale).

- __Statistiche di Misurazioni__: _media_ ($\sigma$) e _varianza_ ($\mu$) di un insieme di misurazioni eseguite in un certo range temporale. Tramite questi due valori vengono poi calcolate:
	- _upper threashold_ = $\mu+2\sigma$
	- _lower threshold_ = $\mu-2\sigma$.

  Queste due servono infine per identificare potenziali valori anomali, al di fuori dalle threshold.

- __Misurazione Outlier__: (o semplicemente __Outlier__) è una misurazione con valore più alto della `upperThreshold` o più basso della `lowerThreshold` viene considerato un valore anomalo e viene evidenziato come Misurazione Outlier.

- __Formato ISO 8601__: è uno standard internazionale per la rappresentazione di date e orari, serve per evitare ambiguità nei formati di data e ora usati in diverse parti del mondo.

### Glossary Diagram

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

## System Design

\<describe here system design>

\<must be consistent with Context diagram>

## Deployment Diagram

\<describe here deployment diagram >

