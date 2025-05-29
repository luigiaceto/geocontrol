# Test Report

<The goal of this document is to explain how the application was tested, detailing how the test cases were defined and what they cover>

# Contents

- [Test Report](#test-report)
- [Contents](#contents)
- [Dependency graph](#dependency-graph)
- [Integration approach](#integration-approach)
- [Tests](#tests)
- [Coverage](#coverage)
  - [Coverage of FR](#coverage-of-fr)
  - [Coverage white box](#coverage-white-box)

# Dependency graph
<img src="dependency-graph.svg" alt="Logo" width="100" height="100">

  Nota: nel caso l'immagine non dovesse essere visibile si apra direttamente il file `dependency-graph.svg` nella cartella root del progetto.

# Integration approach

    <Write here the integration sequence you adopted, in general terms (top down, bottom up, mixed) and as sequence

    (ex: step1: unit A, step 2: unit A+B, step 3: unit A+B+C, etc)>

    <Some steps may  correspond to unit testing (ex step1 in ex above)>

    <One step will  correspond to API testing, or testing unit route.js>
  
  L'approccio di integrazione è stato principalmente bottom-up:

  NETWORK
  step1: unit NetworkRepository
  ***DA COMPLETARE***

  GATEWAY
  step1: unit GatewayRepository
  step2: unit GatewayRepository+gatewayController
  step3: unit GatewayRepository+gatewayController+mapperService
  step4: unit GatewayRepository+gatewayController+mapperService+verifyService
  step5: unit gatewayRoutes+authMiddlewere+validatorMiddlewere
  step6: e2e

# Tests

<in the table below list the test cases defined For each test report the object tested, the test level (API, integration, unit) and the technique used to define the test case (BB/ eq partitioning, BB/ boundary, WB/ statement coverage, etc)> <split the table if needed>

| Test case name | Object(s) tested | Test level | Technique used |
| :------------: | :--------------: | :--------: | :------------: |
|                |                  |            |                |

# Coverage

## Coverage of FR

<Report in the following table the coverage of functional requirements and scenarios(from official requirements) >

| Functional Requirement or scenario | Test(s) |
| :--------------------------------: | :-----: |
|                FRx                 |         |
|                FRy                 |         |
|                ...                 |         |

## Coverage white box

Report here the screenshot of coverage values obtained with jest-- coverage

<img src="./res/coverage.png" alt="Coverage"/>