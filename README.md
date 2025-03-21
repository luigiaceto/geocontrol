# GeoControl API

## Work Effort Reporting

As part of the project, each team is required to report the working time spent on the various project activities throughout the production process. The effort must be recorded weekly in the `doc/timesheet.md` file, expressed in person-hours, and must include only the time effectively dedicated to the GeoControl project (excluding lessons, study, or class workshops not dedicated to GeoControl).

## First Assignment

The goal of the first assignment is to **analyze the system** described in the provided **OpenAPI (Swagger) specification** and, based on this analysis, produce the following documents:

- **Requirements Document**
- **Effort Estimation**

Templates for all documents are available in the following files:

```
doc/RequirementsDocument.md
doc/Estimation.md
```

## Installation and Setup

### Prerequisites

Before starting, ensure you have the following installed on your system:

- **Node.js** (Recommended version: latest LTS)
- **npm** (Node Package Manager, included with Node.js)

### Installing Dependencies

Run the following command to install all required dependencies:

```sh
npm install
```

### Running the Application

#### Starting the API Server

To start the server, run:

```sh
npm start
```

By default, the server runs on

**http://localhost:5000**.

### Windows Execution Policy Issue

If you encounter an execution policy error like:

```
+ CategoryInfo          : SecurityError: (:) [], PSSecurityException
+ FullyQualifiedErrorId : UnauthorizedAccess
```

Run the following command before executing scripts:

```sh
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

## API Documentation

The API follows an **OpenAPI specification**, with the definition stored in:

```
doc/swagger_v1.yaml
```

Once the application is running, the **Swagger UI** is available at:

**http://localhost:5000/api/v1/doc**
