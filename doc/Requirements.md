# Requirements Document - GeoControl

Date:

Version: V1 - description of Geocontrol as described in the swagger

| Version number | Change |
| :------------: | :----: |
|                |        |

## Contents

- [Requirements Document - GeoControl](#requirements-document---geocontrol)
  - [Contents](#contents)
  - [Informal Description](#informal-description)
  - [Business Model](#business-model)
  - [Stakeholders](#stakeholders)
  - [Context Diagram and Interfaces](#context-diagram-and-interfaces)
    - [Context Diagram](#context-diagram)
    - [Interfaces](#interfaces)
  - [Stories and Personas](#stories-and-personas)
  - [Functional and Non-Functional Requirements](#functional-and-non-functional-requirements)
    - [Functional Requirements](#functional-requirements)
      - [Access Rights](#access-rights)
    - [Non-Functional Requirements](#non-functional-requirements)
  - [Use Case Diagram and Use Cases](#use-case-diagram-and-use-cases)
    - [Use Case Diagram](#use-case-diagram)
    - [Use Cases](#use-cases)
      - [Use Case 0 (UC0): Template for Use Cases](#use-case-0-uc0-template-for-use-cases)
        - [Scenario 0.1](#scenario-01)
      - [Use case 1 (UC1): Autenticazione al Sistema](#use-case-1-uc1-autenticazione-al-sistema)
        - [Scenario 1.1](#scenario-11)
        - [Scenario 1.2](#scenario-12)
        - [Scenario 1.3](#scenario-13)
        - [Scenario 1.4](#scenario-14)
        - [Scenario 1.5](#scenario-15)
      - [Use Case 2 (UC2): Creazione Account](#use-case-2-uc2-creazione-account)
        - [Scenario 2.1](#scenario-21)
        - [Scenario 2.2](#scenario-22)
        - [Scenario 2.3](#scenario-23)
        - [Scenario 2.4](#scenario-24)
        - [Scenario 2.5](#scenario-25)
        - [Scenario 2.6](#scenario-26)
      - [Use Case 3 (UC3): Ottenimento Utente](#use-case-3-uc3-ottenimento-utente)
        - [Scenario 3.1](#scenario-31)
        - [Scenario 3.2](#scenario-32)
        - [Scenario 3.3](#scenario-33)
        - [Scenario 3.4](#scenario-34)
        - [Scenario 3.5](#scenario-35)
        - [Scenario 3.6](#scenario-36)
      - [Use Case 4 (UC4): Eliminazione Account](#use-case-4-uc4-eliminazione-account)
        - [Scenario 4.1](#scenario-41)
        - [Scenario 4.2](#scenario-42)
        - [Scenario 4.3](#scenario-43)
        - [Scenario 4.4](#scenario-44)
        - [Scenario 4.5](#scenario-45)
      - [Use case 5, Creazione Network](#use-case-5-creazione-network)
        - [Scenario 5.1](#scenario-51)
        - [Scenario 5.2](#scenario-52)
        - [Scenario 5.3](#scenario-53)
        - [Scenario 5.4](#scenario-54)
        - [Scenario 5.5](#scenario-55)
        - [Scenario 5.6](#scenario-56)
      - [Use Case 6 (UC6): Ottenimento Network](#use-case-6-uc6-ottenimento-network)
        - [Scenario 6.1](#scenario-61)
        - [Scenario 6.2](#scenario-62)
        - [Scenario 6.3](#scenario-63)
        - [Scenario 6.4](#scenario-64)
        - [Scenario 6.5](#scenario-65)
      - [Use Case 7 (UC7): Eliminazione Network](#use-case-7-uc7-eliminazione-network)
        - [Scenario 7.1](#scenario-71)
        - [Scenario 7.2](#scenario-72)
        - [Scenario 7.3](#scenario-73)
        - [Scenario 7.4](#scenario-74)
        - [Scenario 7.5](#scenario-75)
      - [Use Case 8 (UC8): Modifica Network](#use-case-8-uc8-modifica-network)
        - [Scenario 8.1](#scenario-81)
        - [Scenario 8.2](#scenario-82)
        - [Scenario 8.3](#scenario-83)
        - [Scenario 8.4](#scenario-84)
        - [Scenario 8.5](#scenario-85)
        - [Scenario 8.6](#scenario-86)
        - [Scenario 8.7](#scenario-87)
  - [Glossary](#glossary)
    - [Glossary Diagram](#glossary-diagram)
  - [System Design](#system-design)
  - [Deployment Diagram](#deployment-diagram)

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

|  ID   | Description | User Story |
| :---- | :---------- | :--------- |
| __FR1__   | __Gestione Utente__ |
| FR1.1 | Autenticazione Utente | COME Utente<br>VOGLIO autenticarmi al sistema<br>PER accedere a tutte le funzionalità |
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

#### Access Rights

| FR    | Viewer             | Operator           | Admin              |
| :---: | :----------------: | :----------------: | :----------------: |
| FR1.1 | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| FR1.2 | :x:                | :x:                | :white_check_mark: |
| FR1.3 | :x:                | :x:                | :white_check_mark: |
| FR1.4 | :x:                | :x:                | :white_check_mark: |
| FR1.5 | :x:                | :x:                | :white_check_mark: |
| FR2.1 | :x:                | :white_check_mark: | :white_check_mark: |
| FR2.2 | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| FR2.3 | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| FR2.4 | :x:                | :white_check_mark: | :white_check_mark: |
| FR2.5 | :x:                | :white_check_mark: | :white_check_mark: |
| FR3.1 | :x:                | :white_check_mark: | :white_check_mark: |
| FR3.2 | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| FR3.3 | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| FR3.4 | :x:                | :white_check_mark: | :white_check_mark: |
| FR3.5 | :x:                | :white_check_mark: | :white_check_mark: |
| FR4.1 | :x:                | :white_check_mark: | :white_check_mark: |
| FR4.2 | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| FR4.3 | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| FR4.4 | :x:                | :white_check_mark: | :white_check_mark: |
| FR4.5 | :x:                | :white_check_mark: | :white_check_mark: |
| FR5.1 | :x:                | :white_check_mark: | :white_check_mark: |
| FR5.2 | :x:                | :white_check_mark: | :white_check_mark: |
| FR6.1 | :x:                | :white_check_mark: | :white_check_mark: |
| FR6.2 | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| FR6.3 | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| FR6.4 | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| FR6.5 | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| FR6.6 | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| FR6.7 | :white_check_mark: | :white_check_mark: | :white_check_mark: |

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

__NOTA:__ In tutti gli Scenari, l'_Utente_ indicato negli Step, è genericamente uno dei possibili Attori che può eseguire il Caso d'Uso (anche quando solo 1 attore è possibile). Non va confuso con il termine "Utente" che compare in alcune Pre-condition e Post-condition.  

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
| 6              | _System_: autorizza Utente e restituisce Token __(Code 200)__ |

##### Scenario 1.2
| UC1 - S1.2     | Scenario 1.2: Autenticazione al Sistema (Input Invalido) |
| :------------- | :------------------------------------------------ |
| Pre-condition  | // |
| Post-condition | Utente non è autenticato; mostrato messaggio di errore |
| __Step#__      | <div align="center"> __Description__ </div> |
| 1              | _System_: richiede credenziali (Username e Password) |
| 2              | _Utente_: fornisce un Input Invalido |
| 3              | _System_: legge Input fornito |
| 4              | _System_: mostra messaggio di errore. Input Invalido __(Code 400)__ |

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
| 6              | _System_: mostra messaggio di errore. Password errata __(Code 401)__ |

##### Scenario 1.4

| UC1 - S1.4     | Scenario 1.4: Autenticazione al Sistema (Utente non Esiste) |
| :------------- | :------------------------------------------------ |
| Pre-condition  | Utente non esiste nel sistema |
| Post-condition | Utente non è autenticato; mostrato messaggio di errore |
| __Step#__      | <div align="center"> __Description__ </div> |
| 1              | _System_: richiede credenziali (Username e Password) |
| 2              | _Utente_: fornisce credenziali (Username e Password) |
| 3              | _System_: legge credenziali (Username e Password) |
| 4              | _System_: cerca Username; Username non trovato |
| 5              | _System_: mostra messaggio di errore. Utente non trovato __(Code 404)__ |

##### Scenario 1.5

| UC1 - S1.5     | Scenario 1.5: Autenticazione al Sistema (Errore Interno) |
| :------------- | :------------------------------------------------ |
| Pre-condition  | // |
| Post-condition | Utente non è autenticato; mostrato messaggio di errore |
| __Step#__      | <div align="center"> __Description__ </div> |
| 1              | _System_: richiede credenziali (Username e Password) |
| 2              | _Utente_: fornisce credenziali (Username e Password) |
| 3              | _System_: mostra messaggio di errore. Errore Interno al Server __(Code 500)__ |


#### Use Case 2 (UC2): Creazione Account

| UC2              | Use Case 2: Creazione Account |
| :--------------- | :--------------------------------- |
| Actors Involved  | Admin |
| Pre-condition    | Utente (di cui creare Account) non ha un account |
| Post-condition   | Account relativo all'Utente è creato |
| Nominal Scenario | Scenario 2.1 |
| Variants         | // |
| Exceptions       | Scenari: 2.2, 2.3, 2.4, 2.5, 2.6 |

##### Scenario 2.1

| UC2 - S2.1     | Scenario 2.1: Creazione Account (Successful) |
| :------------- | :------------------------------------------------ |
| Pre-condition  | Admin autenticato; Utente (di cui creare Account) non ha un account |
| Post-condition | Account relativo all'Utente è creato |
| __Step#__      | <div align="center"> __Description__ </div> |
| 1              | _Utente_: chiede di creare un account |
| 2              | _System_: richiede username, password, type |
| 3              | _Utente_: fornisce username, password, type |
| 4              | _System_: legge username, password, type |
| 5              | _System_: verifica uso Username; Username non è in uso |
| 6			     | _System_: crea e memorizza nuovo Account __(Code 201)__ |

##### Scenario 2.2

| UC2 - S2.2     | Scenario 2.2: Creazione Account (Input Invalido) |
| :------------- | :------------------------------------------------ |
| Pre-condition  | // |
| Post-condition | Account non creato; mostrato messaggio di errore |
| __Step#__      | <div align="center"> __Description__ </div> |
| 1              | _Utente_: chiede di creare un account |
| 2              | _System_: richiede username, password, type |
| 3              | _Utente_: fornisce Input Invalido |
| 4              | _System_: legge Input fornito |
| 5              | _System_: mostra messaggio di errore. Input Invalido __(Code 400)__ |

##### Scenario 2.3

| UC2 - S2.3     | Scenario 2.3: Creazione Account (Non Autorizzato) |
| :------------- | :------------------------------------------------ |
| Pre-condition  | Admin non è autenticato |
| Post-condition | Account non creato; mostrato messaggio di errore |
| __Step#__      | <div align="center"> __Description__ </div> |
| 1              | _Utente_: chiede di creare un account |
| 2              | _System_: mostra messaggio di errore. Non Autorizzato __(Code 401)__ |

##### Scenario 2.4

| UC2 - S2.4     | Scenario 2.4: Creazione Account (Permessi Insufficienti) |
| :------------- | :------------------------------------------------ |
| Pre-condition  | Utente non ha Permessi sufficienti (inferiori a `Admin`) |
| Post-condition | Account non creato; mostrato messaggio di errore |
| __Step#__      | <div align="center"> __Description__ </div> |
| 1              | _Utente_: chiede di creare un account |
| 2              | _System_: mostra messaggio di errore. Permessi insufficienti __(Code 403)__ |

##### Scenario 2.5

| UC2 - S2.5     | Scenario 2.5: Creazione Account (Username in Uso) |
| :------------- | :------------------------------------------------ |
| Pre-condition  | Admin autenticato; Utente (di cui creare Account) ha già un account |
| Post-condition | Account non creato; mostrato messaggio di errore |
| __Step#__      | <div align="center"> __Description__ </div> |
| 1              | _Utente_: chiede di creare un account |
| 2              | _System_: richiede username, password, type |
| 3              | _Utente_: fornisce username, password, type |
| 4              | _System_: legge username, password, type |
| 5              | _System_: verifica uso Username; Username in uso |
| 6			     | _System_: mostra messaggio di errore. Username in uso __(Code 409)__ |

##### Scenario 2.6

| UC2 - S2.6     | Scenario 2.6: Creazione Account (Errore Interno) |
| :------------- | :------------------------------------------------ |
| Pre-condition  | // |
| Post-condition | Account non creato; mostrato messaggio di errore |
| __Step#__      | <div align="center"> __Description__ </div> |
| 1              | _Utente_: chiede di creare un account |
| 2              | _System_: mostra messaggio di errore. Errore Interno al Server __(Code 500)__ |


#### Use Case 3 (UC3): Ottenimento Utente

| UC3              | Use Case 3: Ottenimento Utente |
| :--------------- | :--------------------------------- |
| Actors Involved  | Admin |
| Pre-condition    | // |
| Post-condition   | Informazioni di almeno un Utente sono state ottenute |
| Nominal Scenario | Scenario 3.1 |
| Variants         | Scenario 3.2 |
| Exceptions       | Scenari: 3.3, 3.4, 3.5, 3.6 |

##### Scenario 3.1

| UC3 - S3.1     | Scenario 3.1: Ottenimento Elenco Utenti (Successful) |
| :------------- | :------------------------------------------------ |
| Pre-condition  | Admin autenticato |
| Post-condition | Elenco di Utenti è stato ottenuto |
| __Step#__      | <div align="center"> __Description__ </div> |
| 1              | _Utente_: chiede di ottenere l'elenco di Utenti |
| 2              | _System_: ottiene l'elenco di Utenti |
| 3              | _System_: restituisce l'elenco di Utenti __(Code 200)__ |

##### Scenario 3.2

| UC3 - S3.2     | Scenario 3.2: Ottenimento Utente Specifico (Successful) |
| :------------- | :------------------------------------------------ |
| Pre-condition  | Admin autenticato; Utente ricercato esiste |
| Post-condition | Informazioni su Utente ricerato sono state ottenute |
| __Step#__      | <div align="center"> __Description__ </div> |
| 1              | _Utente_: chiede di ottenere informazioni su Utente Specifico |
| 2              | _System_: richiede userName dell'Utente ricercato |
| 3              | _Utente_: fornisce userName dell'Utente ricercato |
| 4              | _System_: legge userName fornito |
| 5              | _System_: verifica userName; Utente esiste |
| 6              | _System_: restituisce informazioni su Utente __(Code 200)__ |

##### Scenario 3.3

| UC3 - S3.3     | Scenario 3.3: Ottenimento Utente (Non Autorizzato) |
| :------------- | :------------------------------------------------ |
| Pre-condition  | Admin non è autenticato |
| Post-condition | Informazioni non Ottenute; mostrato messaggio di errore |
| __Step#__      | <div align="center"> __Description__ </div> |
| 1              | _Utente_: chiede di ottenere informazioni Utenti |
| 2              | _System_: mostra messaggio di errore. Non Autorizzato __(Code 401)__ |

##### Scenario 3.4

| UC3 - S3.4     | Scenario 3.4: Ottenimento Utente (Permessi Insufficienti) |
| :------------- | :------------------------------------------------ |
| Pre-condition  | Utente non ha Permessi sufficienti (inferiori a `Admin`) |
| Post-condition | Informazioni non Ottenute; mostrato messaggio di errore |
| __Step#__      | <div align="center"> __Description__ </div> |
| 1              | _Utente_: chiede di ottenere informazioni Utenti |
| 2              | _System_: mostra messaggio di errore. Permessi insufficienti __(Code 403)__ |

##### Scenario 3.5

| UC3 - S3.5     | Scenario 3.5: Ottenimento Utente (Errore Interno) |
| :------------- | :------------------------------------------------ |
| Pre-condition  | // |
| Post-condition | Informazioni non Ottenute; mostrato messaggio di errore |
| __Step#__      | <div align="center"> __Description__ </div> |
| 1              | _Utente_: chiede di ottenere informazioni Utenti |
| 2              | _System_: mostra messaggio di errore. Errore Interno al Server __(Code 500)__ |

##### Scenario 3.6

| UC3 - S3.6     | Scenario 3.6: Ottenimento Utente Specifico (Utente non Trovato) |
| :------------- | :------------------------------------------------ |
| Pre-condition  | Admin autenticato; Utente ricercato non esiste |
| Post-condition | Informazioni non Ottenute; mostrato messaggio di errore |
| __Step#__      | <div align="center"> __Description__ </div> |
| 1              | _Utente_: chiede di ottenere informazioni su Utente Specifico |
| 2              | _System_: richiede userName dell'Utente ricercato |
| 3              | _Utente_: fornisce userName dell'Utente ricercato |
| 4              | _System_: legge userName fornito |
| 5              | _System_: verifica userName; Utente non esiste |
| 6              | _System_: mostra messaggio di errore. Utente non trovato __(Code 404)__ |


#### Use Case 4 (UC4): Eliminazione Account

| UC4              | Use Case 4: Eliminazione Account |
| :--------------- | :--------------------------------- |
| Actors Involved  | Admin |
| Pre-condition    | Account (associato a Utente da eliminare) esiste |
| Post-condition   | Account (associato a Utente da eliminare) è stato eliminato |
| Nominal Scenario | Scenario 4.1 |
| Variants         | // |
| Exceptions       | Scenari: 4.2, 4.3, 4.4, 4.5 |

##### Scenario 4.1

| UC4 - S4.1     | Scenario 4.1: Eliminazione Account (Successful) |
| :------------- | :------------------------------------------------ |
| Pre-condition  | Admin autenticato; Account (associato a Utente da eliminare) esiste |
| Post-condition | Account (associato a Utente da eliminare) è stato eliminato |
| __Step#__      | <div align="center"> __Description__ </div> |
| 1              | _Utente_: chiede di eliminare Account associato a Utente |
| 2              | _System_: richiede userName dell'Utente da eliminare |
| 3              | _Utente_: fornisce userName dell'Utente da eliminare |
| 4              | _System_: legge userName fornito |
| 5              | _System_: verifica userName; Utente esiste |
| 6              | _System_: elimina Account associato a Utente __(Code 204)__ |

##### Scenario 4.2

| UC4 - S4.2     | Scenario 4.2: Eliminazione Account (Non Autorizzato) |
| :------------- | :------------------------------------------------ |
| Pre-condition  | Admin non è autenticato |
| Post-condition | Account non eliminato; mostrato messaggio di errore |
| __Step#__      | <div align="center"> __Description__ </div> |
| 1              | _Utente_: chiede di eliminare Account associato a Utente |
| 2              | _System_: mostra messaggio di errore. Non Autorizzato __(Code 401)__ |

##### Scenario 4.3

| UC4 - S4.3     | Scenario 4.3: Eliminazione Account (Permessi Insufficienti) |
| :------------- | :------------------------------------------------ |
| Pre-condition  | Utente non ha Permessi sufficienti (inferiori a `Admin`) |
| Post-condition | Account non eliminato; mostrato messaggio di errore |
| __Step#__      | <div align="center"> __Description__ </div> |
| 1              | _Utente_: chiede di eliminare Account associato a Utente |
| 2              | _System_: mostra messaggio di errore. Permessi insufficienti __(Code 403)__ |

##### Scenario 4.4

| UC4 - S4.4     | Scenario 4.4: Eliminazione Account (Utente non Trovato) |
| :------------- | :------------------------------------------------ |
| Pre-condition  | Admin autenticato; Account (associato a Utente da eliminare) non esiste |
| Post-condition | Account non eliminato; mostrato messaggio di errore |
| __Step#__      | <div align="center"> __Description__ </div> |
| 1              | _Utente_: chiede di eliminare Account associato a Utente |
| 2              | _System_: richiede userName dell'Utente da eliminare |
| 3              | _Utente_: fornisce userName dell'Utente da eliminare |
| 4              | _System_: legge userName fornito |
| 5              | _System_: verifica userName; Utente non esiste |
| 6              | _System_: mostra messaggio di errore. Utente non trovato __(Code 404)__ |

##### Scenario 4.5

| UC4 - S4.5     | Scenario 4.5: Eliminazione Account (Errore Interno) |
| :------------- | :------------------------------------------------ |
| Pre-condition  | // |
| Post-condition | Account non eliminato; mostrato messaggio di errore |
| __Step#__      | <div align="center"> __Description__ </div> |
| 1              | _Utente_: chiede di eliminare Account associato a Utente |
| 2              | _System_: mostra messaggio di errore. Errore Interno al Server __(Code 500)__ |


#### Use case 5, Creazione Network

| UC5              | Use Case 5: Creazione Network |
| :--------------- | :--------------------------------- |
| Actors Involved  | Admin \| Operator |
| Pre-condition    | Utente autenticato con ruolo adeguato (Admin o Operator)   |
| Post-condition   | Network creata |
| Nominal Scenario | Scenario 5.1 |
| Variants         | // |
| Exceptions       | Scenario 5.2, 5.3, 5.4, 5.5, 5.6|



##### Scenario 5.1

| UC5 - S5.1     | Scenario 5.1: Creazione Network (Successful) |
| :------------- | :------------------------------------------------ |
| Pre-condition  | L'utente è autenticato e ha i permessi per creare una rete |
| Post-condition | Una nuova rete è stata creata nel sistema |
| __Step#__      | <div align="center"> __Description__ </div> |
| 1              | _Utente_: invia richiesta per creare una nuova rete con code, name, description |
| 2              | _System_: legge i dati (code, name, description) |
| 3              | _System_: verifica che il code non sia già in uso |
| 4			     | _System_: crea nuova Network __(Code 201)__ |

##### Scenario 5.2

| UC5 - S5.2     | Scenario 5.2: Creazione Network (Input Invalido) |
| :------------- | :------------------------------------------------ |
| Pre-condition  | // |
| Post-condition | Network non creata; mostrato messaggio di errore |
| __Step#__      | <div align="center"> __Description__ </div> |
| 1              | _Utente_: invia richiesta con dati incompleti o errati |
| 2              | _System_: legge i dati |
| 3              | _System_: mostra messaggio di errore. Input Invalido __(Code 400)__ |

##### Scenario 5.3

| UC5 - S5.3     | Scenario 5.3: Creazione Network (Non Autenticato) |
| :------------- | :------------------------------------------------ |
| Pre-condition  | Utente non è autenticato |
| Post-condition | Network non creata; mostrato messaggio di errore |
| __Step#__      | <div align="center"> __Description__ </div> |
| 1              | _Utente_: invia richiesta di creazione rete |
| 2              | _System_: mostra messaggio di errore. Non Autorizzato __(Code 401)__ |

##### Scenario 5.4

| UC5 - S5.4     | Scenario 5.4: Creazione Network (Permessi Insufficienti) |
| :------------- | :------------------------------------------------ |
| Pre-condition  | Utente autenticato ma con ruolo non autorizzato (es. `Viewer`) |
| Post-condition | Network non creata; mostrato messaggio di errore |
| __Step#__      | <div align="center"> __Description__ </div> |
| 1              | _Utente_: invia richiesta per creare una rete |
| 2              | _System_: mostra messaggio di errore. Permessi insufficienti __(Code 403)__ |

##### Scenario 5.5

| UC5 - S5.5     | Scenario 5.5: Creazione Network (Code in Uso) |
| :------------- | :------------------------------------------------ |
| Pre-condition  | Utente autenticato (Admin o Operator) e network con stesso code esiste già |
| Post-condition | Network non creata; mostrato messaggio di errore |
| __Step#__      | <div align="center"> __Description__ </div> |
| 1              | _Utente_: invia richiesta con un code già esistente |
| 2              | _System_: verifica code e rileva conflitto |
| 3			     | _System_: mostra messaggio di errore. Code in uso __(Code 409)__ |

##### Scenario 5.6

| UC5 - S5.6     | Scenario 5.6: Creazione Network (Errore Interno) |
| :------------- | :------------------------------------------------ |
| Pre-condition  | // |
| Post-condition | Rete non creata; mostrato messaggio di errore |
| __Step#__      | <div align="center"> __Description__ </div> |
| 1              | _Utente_: invia richiesta di creazione Network |
| 2              | _System_: si verifica un errore interno imprevisto |
| 3              | _System_: mostra messaggio di errore. Errore Interno al Server __(Code 500)__ |


#### Use Case 6 (UC6): Ottenimento Network

| UC6              | Use Case 6: Ottenimento Network |
| :--------------- | :--------------------------------- |
| Actors Involved  | Admin \| Operator \| Viewer |
| Pre-condition    | // |
| Post-condition   | Informazioni di almeno una Network sono state ottenute |
| Nominal Scenario | Scenario 6.1 |
| Variants         | Scenario 6.2 |
| Exceptions       | Scenari: 6.3, 6.4, 6.5 |

##### Scenario 6.1

| UC6 - S6.1     | Scenario 6.1: Ottenimento Elenco Network (Successful) |
| :------------- | :------------------------------------------------ |
| Pre-condition  | Utente autenticato |
| Post-condition | Elenco delle Network è stato ottenuto |
| __Step#__      | <div align="center"> __Description__ </div> |
| 1              | _Utente_: chiede di ottenere l'elenco delle Network |
| 2              | _System_: ottiene l'elenco delle Network |
| 3              | _System_: restituisce l'elenco delle Network __(Code 200)__ |

##### Scenario 6.2


| UC6 - S6.2     | Scenario 6.2: Ottenimento Network Specifica (Successful) |
| :------------- | :------------------------------------------------ |
| Pre-condition  | Utente autenticato; Rete ricercata esiste |
| Post-condition | Informazioni sulla Network ricercata sono state ottenute |
| __Step#__      | <div align="center"> __Description__ </div> |
| 1              | _Utente_: chiede di ottenere informazioni su Utente Specifico |
| 2              | _System_: chiede di ottenere una Network specifica |
| 3              | _Utente_: richiede codice identificativo della Rete (networkCode) |
| 4              | _System_: fornisce networkCode |
| 5              | _System_: verifica esistenza della Network; Network trovata |
| 6              | _System_: restituisce informazioni su Network __(Code 200)__ |

##### Scenario 6.3

| UC6 - S6.3     | Scenario 6.3: Ottenimento Network (Non Autorizzato) |
| :------------- | :------------------------------------------------ |
| Pre-condition  | Utente non è autenticato |
| Post-condition | Informazioni non Ottenute; mostrato messaggio di errore |
| __Step#__      | <div align="center"> __Description__ </div> |
| 1              | _Utente_: chiede di ottenere elenco o Network specifica |
| 2              | _System_: mostra messaggio di errore. Non Autorizzato __(Code 401)__ |

##### Scenario 6.4

| UC6 - S6.4    | Scenario 6.4: Ottenimento Network (Errore Interno) |
| :------------- | :------------------------------------------------ |
| Pre-condition  | // |
| Post-condition | Nessuna informazione restituita; mostrato messaggio di errore |
| __Step#__      | <div align="center"> __Description__ </div> |
| 1              | _Utente_: chiede di ottenere chiede di ottenere elenco o Network specifica |
| 2              | _System_: mostra messaggio di errore. Errore Interno al Server __(Code 500)__ |

##### Scenario 6.5

| UC6 - S6.5     | Scenario 6.5: Ottenimento Network Specifica (Network non Trovata) |
| :------------- | :------------------------------------------------ |
| Pre-condition  | Utente autenticato; networkCode non esiste |
| Post-condition | Informazioni non Ottenute; mostrato messaggio di errore |
| __Step#__      | <div align="center"> __Description__ </div> |
| 1              | _Utente_: chiede di ottenere una Network specifica |
| 2              | _System_:  richiede codice identificativo della Rete (networkCode) |
| 3              | _Utente_: fornisce networkCode |
| 4              | _System_: legge networkCode fornito |
| 5              | _System_: verifica networkCode; Network non trovata |
| 6              | _System_: mostra messaggio di errore. Network non trovata __(Code 404)__ |


#### Use Case 7 (UC7): Eliminazione Network

| UC7              | Use Case 7: Eliminazione Network |
| :--------------- | :--------------------------------- |
| Actors Involved  | Admin \| Operator |
| Pre-condition    | Network da eliminare esiste |
| Post-condition   | Network è stata eliminata |
| Nominal Scenario | Scenario 7.1 |
| Variants         | // |
| Exceptions       | Scenari: 7.2, 7.3, 7.4, 7.5 |

##### Scenario 7.1

| UC7 - S7.1     | Scenario 7.1: Eliminazione Network (Successful) |
| :------------- | :------------------------------------------------ |
| Pre-condition  |Utente autenticato con ruolo Admin o Operator; network esiste |
| Post-condition | Network è stata eliminata |
| __Step#__      | <div align="center"> __Description__ </div> |
| 1              | _Utente_: chiede di eliminare una Network |
| 2              | _System_: richiede networkCode della network da eliminare |
| 3              | _Utente_: fornisce networkCode della network da eliminare |
| 4              | _System_: legge networkCode fornito |
| 5              | _System_: verifica esistenza della retee |
| 6              | _System_: elimina la network __(Code 204)__ |

##### Scenario 7.2

| UC7 - S7.2     | Scenario 7.2: Eliminazione Network (Non Autorizzato) |
| :------------- | :------------------------------------------------ |
| Pre-condition  | Utente non è autenticato |
| Post-condition | Network non eliminata; mostrato messaggio di errore |
| __Step#__      | <div align="center"> __Description__ </div> |
| 1              | _Utente_: chiede di eliminare una Network |
| 2              | _System_: mostra messaggio di errore. Non Autorizzato __(Code 401)__ |

##### Scenario 7.3

| UC7 - S7.3     | Scenario 7.3: Eliminazione Network (Permessi Insufficienti) |
| :------------- | :------------------------------------------------ |
| Pre-condition  | Utente autenticato ma con ruolo diverso da Admin o Operator |
| Post-condition | Network non eliminata; mostrato messaggio di errore |
| __Step#__      | <div align="center"> __Description__ </div> |
| 1              | _Utente_: chiede di eliminare una Network |
| 2              | _System_: mostra messaggio di errore. Permessi insufficienti __(Code 403)__ |

##### Scenario 7.4

| UC7 - S7.4     | Scenario 7.4: Eliminazione Network (Network non Trovata) |
| :------------- | :------------------------------------------------ |
| Pre-condition  | Utente autenticato con ruolo adeguato; networkCode non corrisponde ad alcuna network esistente |
| Post-condition | Network non eliminata; mostrato messaggio di errore |
| __Step#__      | <div align="center"> __Description__ </div> |
| 1              | _Utente_: chiede di eliminare una Network |
| 2              | _System_: richiede networkCode della network da eliminare |
| 3              | _Utente_: fornisce networkCode della network da eliminare |
| 4              | _System_: legge network fornito |
| 5              | _System_: verifica networkCode; Network non trovata |
| 6              | _System_: mostra messaggio di errore. Network non trovata __(Code 404)__ |

##### Scenario 7.5

| UC7 - S7.5     | Scenario 7.5: Eliminazione Network (Errore Interno) |
| :------------- | :------------------------------------------------ |
| Pre-condition  | // |
| Post-condition | Network non eliminata; mostrato messaggio di errore |
| __Step#__      | <div align="center"> __Description__ </div> |
| 1              | _Utente_: chiede di eliminare una Network |
| 2              | _System_: mostra messaggio di errore. Errore Interno al Server __(Code 500)__ |



#### Use Case 8 (UC8): Modifica Network

| UC8              | Use Case 8: Modifica Network|
| :--------------- | :--------------------------------- |
| Actors Involved  | Admin \| Operator |
| Pre-condition    | Network da modificare esiste |
| Post-condition   | Network è stata aggiornata |
| Nominal Scenario | Scenario 8.1 |
| Variants         | // |
| Exceptions       | Scenari: 8.2, 8.3, 8.4, 8.5, 8.6, 8.7 |

##### Scenario 8.1

| UC8 - S8.1     | Scenario 8.1: Modifica Network (Successful) |
| :------------- | :------------------------------------------------ |
| Pre-condition  |Utente autenticato con ruolo Admin o Operator; network esiste; dati validi |
| Post-condition | Network è stata aggiornata |
| __Step#__      | <div align="center"> __Description__ </div> |
| 1              | _Utente_: invia richiesta di aggiornamento per una Network specificando networkCode e i dati aggiornati |
| 2              | _System_:legge il networkCode e i dati forniti |
| 3              | _System_:  verifica esistenza della Network |
| 4              | _System_: valida i dati forniti |
| 5              | _System_: aggiorna la network __(Code 204)__ |

##### Scenario 8.2

| UC8 - S8.2     | Scenario 8.2: Modifica Network (Non Autorizzato) |
| :------------- | :------------------------------------------------ |
| Pre-condition  | Utente non è autenticato |
| Post-condition | Network non modificata; mostrato messaggio di errore |
| __Step#__      | <div align="center"> __Description__ </div> |
| 1              | _Utente_: invia richiesta di aggiornamento |
| 2              | _System_: mostra messaggio di errore. Non Autorizzato __(Code 401)__ |

##### Scenario 8.3

| UC8 - S8.3     | Scenario 8.3: Modifica Network (Permessi Insufficienti) |
| :------------- | :------------------------------------------------ |
| Pre-condition  | Utente autenticato ma con ruolo diverso da Admin o Operator |
| Post-condition | Network non modificata; mostrato messaggio di errore |
| __Step#__      | <div align="center"> __Description__ </div> |
| 1              | _Utente_: invia richiesta di aggiornamento |
| 2              | _System_: mostra messaggio di errore. Permessi insufficienti __(Code 403)__ |

##### Scenario 8.4

| UC8 - S8.4     | Scenario 8.4: Modifica Network (Network non Trovata) |
| :------------- | :------------------------------------------------ |
| Pre-condition  | Utente autenticato con ruolo adeguato; networkCode non corrisponde ad alcuna network esistente |
| Post-condition | Network non eliminata; mostrato messaggio di errore |
| __Step#__      | <div align="center"> __Description__ </div> |
| 1              | _Utente_: invia richiesta di aggiornamento con networkCode |
| 2              | _System_: verifica il networkCode; Network non trovata |
| 3              | _System_: mostra messaggio di errore. Network non trovata __(Code 404)__ |

##### Scenario 8.5

| UC8 - S8.5     | Scenario 8.5: Modifica Network (Dati Non Validi) |
| :------------- | :------------------------------------------------ |
| Pre-condition  | Utente autenticato con ruolo adeguato; network esistente |
| Post-condition | Network non modificata; mostrato messaggio di errore |
| __Step#__      | <div align="center"> __Description__ </div> |
| 1              | _Utente_: invia richiesta di aggiornamento con dati non validi |
| 2              | _System_: valida i dati e rileva l’errore |
| 3              | _System_: mostra messaggio di errore. Input non valido __(Code 400)__ |

##### Scenario 8.6

| UC8 - S8.6     | Scenario 8.6: Modifica Network (NetworkCode già in uso) |
| :------------- | :------------------------------------------------ |
| Pre-condition  |Utente autenticato; nuova code fornita è già usata da un’altra network |
| Post-condition | Network non modificata; mostrato messaggio di errore |
| __Step#__      | <div align="center"> __Description__ </div> |
| 1              | _Utente_:  invia richiesta di aggiornamento con un nuovo code già esistente |
| 2              | _System_: verifica unicità del code; rileva conflitto |
| 3              | _System_: mostra messaggio di errore. Codice già in uso __(Code 409)__ |

##### Scenario 8.7

| UC8 - S8.7     | Scenario 8.7: Modifica Network (Errore Interno) |
| :------------- | :------------------------------------------------ |
| Pre-condition  | // |
| Post-condition | Network non modificata; mostrato messaggio di errore |
| __Step#__      | <div align="center"> __Description__ </div> |
| 1              | _Utente_:  invia richiesta di aggiornamento |
| 2              | _System_: mostra messaggio di errore. Errore Interno al Server  __(Code 500)__ |



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

