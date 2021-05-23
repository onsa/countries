# Countries

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.0.1 and lets users pick a region (only Europe and Asia are supported) from a drop-down list and then a country (of that region) from another drop-down.
A load button fetches data about the selected country and displays basic information in a slide-up element at the bottom - this can be dismissed with a close button. Alternatively, users can load a country from the map.


## Installation
Run `ng build` from the application root directory and serve up the resulting contents of the `dist` directory with a simple http server.


## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

The application is fully tested and linters have been used for both the business logic (TypeScript) and the styling (scss).
One external library ([sort-import](https://www.npmjs.com/package/sort-import)) is used to **sort import statements** and thus improve code consistency and facilitate code reviews.
Another library ([cerialize](https://www.npmjs.com/package/cerialize)) **instantiates model classes from API responses**. Having complex class instances (as opposed to plain objects) in the application flow, avoiding passing on unnecessary properties and accessing static or instance methods are highly advantageous for developers. Class instances are especially helpful during debugging as Google Chrome reports developer-defined class names in console messages.
**State management** is achieved by means of [ngxs](https://www.ngxs.io/) which works on redux principles.
Other features of the application include a flexible and user-friendly **dropdown** component and **extension methods** to common JavaScript types (e.g. string, Array or HTMLElement).
