# Frontend

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

# My Book Shelf

My Book Shelf is an Angular application designed to help users manage their book collections. The application allows users to register, log in, search for books, add books to favorites, and more.

## Overview

My Book Shelf is an Angular application that allows users to manage their book collections, search for books, and view detailed information about books, getting recommendation books from Google (it's special for each user), load/edit/delete an own pdf file (book) with description, draw on pdf file and save on the computer, change book orientation.

## Features

- User registration and login (it works, BUT this application provides book recommendation from Google, so user has to sign in/sign up only with help of Gmail (orange button))
- Email verification
- Gmail login or registration
- View book catalog
- View recommendation (books) from Google for each user
- View recently reading books (also books are provided by Google Book)
- Search for books by title, author, or category, text, or all
- View detailed book information
- Save book in favourite books, delete book from favourite books
- Elastic search/ Live search
- Language switching
- Upload an own book
- Read an own book, draw on this file and save it.

### Advanced Features

- Add, delete, edit user's own books
- Read own books online (when user loaded an own pdf file)

### Additional Features

- Deploy the application on hosting (Heroku)
- CI/CD
- Configure eslint, prettier, husky.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/itsnotviktoriaaa/mybookshelf.git
   cd frontend
   ```
2. Install dependencies and serve application  
   npm i / npm install
   ng serve / ng serve --open
