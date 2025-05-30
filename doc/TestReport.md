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

  Nota: nel caso in cui l'immagine non dovesse essere visibile si apra direttamente il file `dependency-graph.svg` nella cartella root del progetto.

# Integration approach

    <Write here the integration sequence you adopted, in general terms (top down, bottom up, mixed) and as sequence

    (ex: step1: unit A, step 2: unit A+B, step 3: unit A+B+C, etc)>

    <Some steps may correspond to unit testing (ex step1 in ex above)>

    <One step will correspond to API testing, or testing unit route.js>
  
  L'approccio di integrazione è stato principalmente bottom-up (in modo incrementale):

  - Step1: unit testing della Repository e funzioni di utilità (utils, errorService, mapperService, verifyService)

  - Step2: integration della Repository con il relativo Controller e Services

  - Step3: integration delle Route con i Middleware

  - Step4: end-to-end testing delle API
  
  I test unit delle repo mockano i metodi "base" di TypeORM. I test integration dei controller mockano le repo e alcuni servizi. I test di integration delle routes mockano i services e i controller. I test end-to-end (API) usano invece il DB in-memory.

# Tests

<in the table below list the test cases defined For each test report the object tested, the test level (API, integration, unit) and the technique used to define the test case (BB/ eq partitioning, BB/ boundary, WB/ statement coverage, etc)> <split the table if needed>

  Nota: Dato che i test cases sono più di 300, per una lettura migliore e di più alto livello, si è preferito riportare solo le test suites:

| Test suite name                                           | Object(s) tested                                | Test level | Technique used              |
|----------------------------------------------------------|-------------------------------------------------|------------|-----------------------------|
| findOrThrowNotFound | findOrThrowNotFound in utils.ts | Unit | WB |
| throwCOnflictIfFound | throwCOnflictIfFound in utils.ts | Unit | WB |
| parseISODateParamToUTC | parseISODateParamToUTC in utils.ts | Unit | WB |
| parseStringArrayParam | parseStringArrayParam in utils.ts | Unit | WB |
| authService | authService methods | Unit | WB |
| createAppError | createAppError in errorService.ts | Unit | WB |
| mapperService | mapperService standard methods | Unit | WB |
| mapToMeasurementsDTO | mapToMeasurementDTO in mapperService.ts | Unit | WB |
| mapToStatisticDTOForNetwork | mapToStatisticDTOForNetwork in mapperService.ts | Unit | WB |
| mapTOMeasurementsDTOOutliers | mapToMeasurementsDTOOutliers in mapperService.ts | Unit | WB |
| verifyService | verifyService methods | Unit | WB |
| verifyChainToGateway | verifyChainToGateway in verifyService.ts | Unit | WB |
| verifyChainToSensor | verifyChainToSensor in verifyService.ts | Unit | WB |
| create gateway | createGateway in gatewayRepository.ts | Unit | WB |
| get gateway by mac | getGatewayByMac in gatewayRepository.ts | Unit | WB |
| get gateways by networkId | getGatewaysByNetworkId in gatewayRepository.ts | Unit | WB |
| update gateway | updateGateway in gatewayRepository.ts | Unit | WB |
| delete gateway | deleteGateway in gatewayRepository.ts | Unit | WB |
| getMeasurementsBySensorId | getMeasurementsBySensorId in measurementRepository.ts | Unit | WB |
| storeMeasurement | storeMeasurement in measurementRepository.ts | Unit | WB |
| create Network | createNetwork in networkRepository.ts | Unit | WB |
| get network by code | getNetworkByCode in networkRepository.ts | Unit | WB |
| get all networks | getAllNetworks in networkRepository.ts | Unit | WB |
| update network | updateNetwork in networkRepository.ts | Unit | WB |
| delete network | deleteNetwork in networkRepository.ts | Unit | WB |
| create sensor | createSensor in sensorRepository.ts | Unit | WB |
| get sensor by mac | getSensorByMac in sensorRepository.ts | Unit | WB |
| update sensor | updateSensor in sensorRepository.ts | Unit | WB |
| delete sensor | deleteSensor in sensorRepository.ts | Unit | WB |
| create user | createUser in userRepository.ts | Unit | WB |
| find user by username | findUserByUsername in userRepository.ts | Unit | WB |
| create user | createUser in userRepository.ts | Unit | WB |
| get all users | getAllUsers in userRepository.ts | Unit | WB |
| authenticateUser | authenticateUser middlewere | Unit | WB |
| authController | authController methods | Unit | WB |
| createGateway | createGateway in gatewayController.ts | Unit | WB |
| updateGateway | updateGateway in gatewayController.ts | Unit | WB |
| deleteGateway | deleteGateway in gatewayController.ts | Unit | WB |
| storeMeasurement | storeMeasurement in measurementController.ts | Unit | WB |
| getNetwork | getNetwork in networkController.ts | Unit | WB |
| getAllNetworks | getAllNetworks in networkController.ts | Unit | WB |
| createNetwork | createNetwork in networkController.ts | Unit | WB |
| updateNetwork | updateNetwork in networkController.ts | Unit | WB |
| deleteNetwork | deleteNetwork in networkController.ts | Unit | WB |
| createSensor | createSensor in sensorController.ts | Unit | WB |
| updateSensor | updateSensor in sensorController.ts | Unit | WB |
| deleteSensor | deleteSensor in sensorController.ts | Unit | WB |
| createUser | createUser in userController.ts | Unit | WB |
| deleteUser | deleteUser in userController.ts | Unit | WB |
| getAllGateways: integration with NetworkRepository and GatewayRepository | gatewayController methods | Integration | WB |
| getGateway: integration with verifyChainToGateway and mapperService | gatewayController methods | Integration | WB |
| getGateway: throw NotFoundError when gateway not in network | gatewayController methods | Integration | WB |
| getMeasurementsOfSensor: integration with verifyChainToSensor and mapperService | measurementController methods | Integration | WB |
| getStatsOfSensor: integration with verifyChainToSensor and mapperService | measurementController methods | Integration | WB |
| getOutliersMeasurementsOfSensor: integration with verifyChainToSensor and mapperService | measurementController methods | Integration | WB |
| getNetwork: integration with NetworkRepository and mapNetworkDAOToDTO | networkController methods | Integration | WB |
| getSensorByMac: integration with verifyChainToSensor and mapperService | sensorController methods | Integration | WB |
| getSensorByMac: throw NotFoundError when gateway not in network | sensorController methods | Integration | WB |
| getSensorsByGateway: integration with verifyChainToGateway | sensorController methods | Integration | WB |
| getUser: mapperService integration | userController methods | Integration | WB |
| getAllUsers: mapperService integration | userController methods | Integration | WB |
| AuthenticationRoutes integration | authController methods | Integration | WB |
| GatewayRoutes integration | gatewayController methods | Integration | WB |
| MeasurementRoutes integration | measurementController methods | Integration | WB |
| NetworkRoutes integration | networkController methods | Integration | WB | 
| SensorRoutes integration | sensorController methods | Integration | WB |
| UserRoutes integration | userController methods | Integration | WB |
| AuthenticationRoutes integration | authController methods | Integration | WB |
| GET /networks/:networkCode/gateways (e2e) | gateway route | API | BB |
| GET /networks/:networkCode/gateways/:gatewayMac (e2e) | gateway route | API | BB |
| POST /networks/:networkCode/gateways (e2e) | gateway route | API | BB |
| PATCH /networks/:networkCode/gateways/:gatewayMac (e2e) | gateway route | API | BB |
| DELETE /networks/:networkCode/gateways/:gatewayMac (e2e) | gateway route | API | BB |
| GET /networks/:networkCode/measurements | measurement route | API | BB |
| GET /networks/:networkCode/stats | measurement route | API | BB |
| GET /networks/:networkCode/outliers | measurement route | API | BB |
| POST /networks/:networkCode/gateways/:gatewayMac/sensors/:sensorMac/measurements | measurement route | API | BB |
| GET /networks/:networkCode/gateways/:gatewayMac/sensors/:sensorMac/measurements | measurement route | API | BB |
| GET /networks/:networkCode/gateways/:gatewayMac/sensors/:sensorMac/stats | measurement route | API | BB |
| GET /networks/:networkCode/gateways/:gatewayMac/sensors/:sensorMac/outliers | measurement route | API | BB |
| GET /networks | network route | API | BB |
| GET /networks/:networkCode | network route | API | BB |
| POST /networks | network route | API | BB |
| PATCH /networks/:networkCode | network route | API | BB |
| DELETE /networks/:networkCode | network route | API | BB |
| GET /networks/:networkCode/gateways/:gatewayMac/sensors | sensor route | API  | BB       |
| GET /networks/:networkCode/gateways/:gatewayMac/sensors/\:sensorMac| sensor route | API  | BB       |
| POST /networks/:networkCode/gateways/:gatewayMac/sensors | sensor route | API  | BB  |
| PATCH /networks/:networkCode/gateways/:gatewayMac/sensors/:sensorMac  | sensor route | API  | BB  |
| DELETE /networks/:networkCode/gateways/:gatewayMac/sensors/:sensorMac | sensor route | API  | BB       |
| GET /users    | user route   | API  | BB       |
| GET /users/:username | user route   | API  | BB       |
| POST /users   | user route   | API  | BB       
| DELETE /users/:username  | user route   | API  | BB       |




# Coverage

## Coverage of FR

<Report in the following table the coverage of functional requirements and scenarios(from official requirements) >

| Functional Requirement or scenario                                     |Test(s)|
| :--------------------------------------------------------------------: |:-----:|
| **FR1**   Authentication                                               |**14** |
| FR1.1 Authenticate user                                                |  14   |
| **FR2**   Manage users                                                 |**41** |
| FR2.1 Retrieve all users                                               |  9    |
| FR2.2 Create a new user                                                |  14   |
| FR2.3 Retrieve a specific user                                         |  10   |
| FR2.4 Delete a specific user                                           |  8    |
| **FR3**   Manage networks                                              |**51** |
| FR3.1 Retrieve all networks                                            |  7    |
| FR3.2 Create a new network                                             |  13   |
| FR3.3 Retrieve a specific network                                      |  9    | 
| FR3.4 Update a network                                                 |  14   |
| FR3.5 Delete a specific network                                        |  8    | 
| **FR4**   Manage gateways                                              |**63** |
| FR4.1 Retrieve all gateways of a network                               |  9    |  
| FR4.2 Create a new gateway for a network                               |  17   |   
| FR4.3 Retrieve a specific gateway                                      |  11   |
| FR4.4 Update a gateway                                                 |  16   |
| FR4.5 Delete a specific gateway                                        |  10   |
| **FR5**   Manage sensors                                               |**55** |
| FR5.1 Retrieve all sensors of a gateway                                |  10   | 
| FR5.2 Create a new sensor for a gateway                                |  15   |
| FR5.3 Retrieve a specific sensor                                       |  8    | 
| FR5.4 Update a sensor                                                  |  13   |
| FR5.5 Delete a specific sensor                                         |  9    |
| **FR6**   Manage measurements                                          |**68** |
| FR6.1 Retrieve measurements for a set of sensors of a specific network |  18   |
| FR6.2 Retrieve statistics for a set of sensors of a specific network   |  8    |
| FR6.3 Retrieve outliers for a set of sensors of a specific network     |  8    |
| FR6.4 Store measurements for a specific sensor                         |  9    |
| FR6.5 Retrieve measurements for a specific sensor                      |  12   |
| FR6.6 Retrieve statistics for a specific sensor                        |  6    |
| FR6.7 Retrieve outliers for a specific sensor                          |  7    |

Il conteggio dei test nella tabella si riferisce esclusivamente ai test che verificano i requisiti funzionali (FR). I test relativi a servizi di supporto come errorService, mapperService e verifyService e a funzioni di uso generico come utils, non sono stati associati a specifici FR, ma contribuiscono comunque alla robustezza complessiva del sistema.
La differenza tra il totale dei test eseguiti e la somma dei test riportati nella tabella è dovuta quindi a questi test di services/utils.

## Coverage white box

Report here the screenshot of coverage values obtained with jest-- coverage

<img src="./res/coverage.png" alt="Coverage"/>