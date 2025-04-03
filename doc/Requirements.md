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
- [Business model](#business-model)
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
    - [Use case 1, UC1](#use-case-1-uc1)
      - [Scenario 1.1](#scenario-11)
      - [Scenario 1.2](#scenario-12)
      - [Scenario 1.x](#scenario-1x)
    - [Use case 2, UC2](#use-case-2-uc2)
    - [Use case x, UCx](#use-case-x-ucx)
- [Glossary](#glossary)
- [System Design](#system-design)
- [Deployment Diagram](#deployment-diagram)

# Informal description

GeoControl is a software system designed for monitoring physical and environmental variables in various contexts: from hydrogeological analyses of mountain areas to the surveillance of historical buildings, and even the control of internal parameters (such as temperature or lighting) in residential or working environments.

# Business Model

- Government/Public Model : il sistema è stato originariamente commissionato e finanziato da dall'Unione delle Comunità Montane del Piemonte per monitorare dei parametri fisici e ambientali. In seguito il sistema stesso è stato successivamente commercializzato ad altri enti pubblici e privati.

# Stakeholders

| Stakeholder name | Description |
| :--------------: | :---------: |
|       Admin      |  Utente che ha accesso a tutte le risorse e gestisce Network e Utenti         |
|      Operator    |  Utente che può gestire Network, Gateway e Sensori e inserire misurazioni           |
|       Viewer     |  Utente che visualizza e consulta i dati del Sistema          |
| Unione delle Comunità Montane del Piemonte | Committente principale del Sistema
| Enti Pubblici e Privati| Università, Cittadine, Protezione Civile o aziende che usufruiscono dei servizi del Sistema |
| Produttori di Componenti | Coloro che si occuppano di produzione e distribuzione dell'Hardware utilizzato dal Sistema |
| Ambiente | Ambienti naturali e artificiali che vengono monitorati dai sensori del Sistema |
# Context Diagram and interfaces

## Context Diagram

\<Define here Context diagram using UML use case diagram>
<p align="center">
    <img src="img/Context_diagram.png" alt="" width="400">
</p>

\<actors are a subset of stakeholders>

## Interfaces

\<describe here each interface in the context diagram>


|   Actor   | Logical Interface | Physical Interface |
| :-------: | :---------------: | :----------------: |
| Admin |  GUI  | PC |
| Operator | GUI | PC |
| Viewer | GUI | PC, Smartphone |
| Abiente |  | Sensori |

# Stories and personas

\<A Persona is a realistic impersonation of an actor. Define here a few personas and describe in plain text how a persona interacts with the system>

\<Persona is-an-instance-of actor>

\<stories will be formalized later as scenarios in use cases>

Persona1 : Uomo, Adulto, 50 anni, Lavora come informatico in una cittadina ad alto rischio sismico
Storia : Il comune in cui lavora ha bisogno di un Sistema per monitorare l'attività sismica della città

Persona2 : Donna, Giovane, 25 anni, Lavora in una riserva naturale come guida
Storia : Ha bisogno di sapere in anticipo le condizioni climatiche, vento e eventuali catastrofi per evitare di mettere in pericolo i visitatori

Persona3 : Uomo, Età media, 34 anni, Gestore hotel in alta quota aperto in periodo invernale
Storia : Ha bisogno di un Sistema per monitorare il rischio di valanghe o temperature estreme al fine di migliorare l'esperienza di chi alloggia nell'hotel

Persona4: Gruppo di Ricerca Universitario
Storia: Hanno bisogno di dati ambientali per testare modelli di Machine Learning per predizioni metereologiche per una ricerca

Persona5: Donna, Adulta, 46 anni, Preside di una Scuola Media
Storia: Nell'attesa di un cambio struttura, la Preside ha bisogno di monitorare alcuni parametri particolari di quella attuale, vecchia e decadente, ad esempio crepe e fessurazioni o vibrazioni anomale.

# Functional and non functional requirements
prova di push Luigi

## Functional Requirements

\<In the form DO SOMETHING, or VERB NOUN, describe high level capabilities of the system>

\<they match to high level use cases>

|  ID   | Description |
| :---: | :---------: |
|  FR1  |             |
|  FR2  |             |
| FRx.. |             |

## Non Functional Requirements

\<Describe constraints on functional requirements>

|   ID    | Type (efficiency, reliability, ..) | Description | Refers to |
| :-----: | :--------------------------------: | :---------: | :-------: |
|  NFR1   |                                    |             |           |
|  NFR2   |                                    |             |           |
|  NFR3   |                                    |             |           |
| NFRx .. |                                    |             |           |

# Use case diagram and use cases

## Use case diagram

\<define here UML Use case diagram UCD summarizing all use cases, and their relationships>

\<next describe here each use case in the UCD>

### Use case 1, UC1

| Actors Involved  |                                                                      |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   | \<Boolean expression, must evaluate to true before the UC can start> |
|  Post condition  |  \<Boolean expression, must evaluate to true after UC is finished>   |
| Nominal Scenario |         \<Textual description of actions executed by the UC>         |
|     Variants     |                      \<other normal executions>                      |
|    Exceptions    |                        \<exceptions, errors >                        |

##### Scenario 1.1

\<describe here scenarios instances of UC1>

\<a scenario is a sequence of steps that corresponds to a particular execution of one use case>

\<a scenario is a more formal description of a story>

\<only relevant scenarios should be described>

|  Scenario 1.1  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | \<Boolean expression, must evaluate to true before the scenario can start> |
| Post condition |  \<Boolean expression, must evaluate to true after scenario is finished>   |
|     Step#      |                                Description                                 |
|       1        |                                                                            |
|       2        |                                                                            |
|      ...       |                                                                            |

##### Scenario 1.2

##### Scenario 1.x

### Use case 2, UC2

..

### Use case x, UCx

..

# Glossary

\<use UML class diagram to define important terms, or concepts in the domain of the application, and their relationships>

\<concepts must be used consistently all over the document, ex in use cases, requirements etc>

# System Design

\<describe here system design>

\<must be consistent with Context diagram>

# Deployment Diagram

\<describe here deployment diagram >
