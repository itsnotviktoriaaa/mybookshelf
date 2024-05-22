# Developer Guide

## For Login and Registration Component (common info). IMPORTANT

The application includes registration and login forms, which function correctly when entering login data. During registration (you receive a password and are registered in the system), all functions work successfully. However, the application was decided to be built in connection with Google Books to allow users to receive book recommendations based on their own tastes and preferences, which Google calculates when you use your Google account. Accordingly, information about books (recommended, read, favorites) will be pulled from the user's own Google Books account. Therefore, a solution for logging in or registering via the user's Google account (orange button) has been implemented. If the user has used their account and it is not newly created, recommended books will be shown immediately. If the account was recently created, it may take some time for Google to generate recommended books based on your tastes and preferences (you can simply visit Google Books and search for books of interest to expedite the process). Additionally, in the Google Books account itself, you can add favorite books and recently read books, and our application will be synchronized with the Google Books account. Therefore, if you delete a favorite book in our application, it will automatically be deleted from your Google Books account.

- To access books, an access token specifically from Google OAuth is required (Firebase Authentication via Google will provide a different token, so authentication is based on Google OAuth itself using Angular OAuth OIDC).
- Setting Google Cloud Console for Google OAuth and getting keys for OAuth configuration
- Silent refresh has been implemented for automatic token refreshing when it expires by 75% of its time. For example, if the access token is valid for 1 hour, a new access token will be requested behind the scenes after 45 minutes. This is achieved using silent-refresh.html, configuration settings in angular.json, adding certain keys to the OAuth configuration, and configuring the Google Cloud Console account itself to allow redirection to silent-refresh.

For example, you can use this for sign in to the app (because when app is testing stage only definite users can sign in):
login: victoriaangular10@gmail.com
password: Angular17

Google Cloud Console in based on other account, you can not think about this

Under the hood, when a user logs into our application, Firebase Authentication also kicks in. This is because we need our application to provide the functionality of saving personal books, so each user must have their own Firebase Store and Firebase Storage to store book information. Accordingly, when logging into the application, the Gmail associated with the user's Google account is retrieved under the hood. This Gmail serves as the unique identifier for the user, which acts as the password (it remains the same, thus serving as the password).

After logging in, our Firebase checks if this email exists in the system and if it is registered with a password. If yes, the user is logged into Firebase under the hood. If such a user does not exist, registration occurs, and a Firebase account is created.

## Registration Component

The Registration component is responsible for creating a new user account. It includes the following fields:

- Name
- Email
- Password
- Confirm Password

The user must enter all the required information and click the "Register" button. Validation checks the correctness of the entered email, password, and password match. Additionally, validation ensures the password is not the same as the email. After successful registration, a confirmation code is sent to the user's email (currently, for testing purposes, the code is sent to test-mybookshelf@mail.ru with the password MyBookShelf10). If the user already exists in the system and wants to navigate to the login page, there is a button below to switch to the login page.

**Main Features:**

- Field validation
- Sending confirmation code (the code is generated on the frontend part of the application)
- Validating the confirmation code
- Displaying results (correct or incorrect data input, i.e., error handling)
- User are saved in database on based Firebase/Firebase Authentication

## Login Component

The Login component is responsible for user authentication. It includes the following fields:

- Email
- Password

The user must enter all the required information and click the "Login" button. If the user is not registered, they can navigate to the Registration page.

**Main Features:**

- Email field validation
- Displaying results (correct or incorrect data input)

## Home Page

The Home page, like all others, contains the Bar component (left menu), which allows navigation between pages, as well as the Header component (top header).

The main block displays a catalog of books from Google (specifically recommended books for the CURRENT USER BASED ON THEIR TASTES), as well as recently read books if they have been added to the user's Google Books account.

A block with author quotes and a slider has been added.

Clicking the "Show All" button redirects the user to the Show All Component page.

## Header Component

Contains a search field for finding books based on specific criteria that the user can choose

- All,
- Title,
- Author,
- Category,
- Text

Language switcher in the application (English and Russian).

User icon and name with a dropdown list, currently allowing the user to only use the Logout button to exit the application.

## Bar Component

Allows navigation between pages:

- Home
- Search
- Favorites
- My Books
- Upload
- Application information pages

## Show All Component

Contains a pagination input if there are more than 40 books. When clicked (for example, 1, 2, 3), the user can switch between pages.

## Search Component

To enable search functionality, VPN must be turned on!

The Search Component page interacts with the Header Component. If a user clicks the magnifying glass icon and is not on the Search Component page, they will be redirected to it. However, if they are on the Favorite Component page, they will remain there. This is because search functionality differs between the Search Component and Favorite Component pages due to their different logics.

- Clicking the magnifying glass icon redirects the user to the Search Component page, where a random request with q=search+term is made. Here, parameters like all, intitle, intext, etc., are not used, meaning the request only goes to q=search+term. If the user has "All" selected and searches for "angular", the request will go to q=angular.
- Clicking on "Title" triggers a request with q=search+term+=intitle. For example, if the user enters "angular" in the field, the request will go to q=angular+=intitle.
- Clicking on "Author" triggers a request with q=search+term+=inauthor. For instance, if the user enters "Harry" in the field, the request will go to q=Harry+=inauthor.
- Clicking on "Text" triggers a request with q=search+term+=intext. For example, if the user enters "Harry" in the field, the request will go to q=Harry+=intext. This means books where the word "Harry" appears in the description will be searched.

Note that below in the modal window, the word "Browse" is displayed. This indicates that no category is selected, as category search occurs only when the user chooses a category from the provided list.

- Clicking on "Category" automatically redirects the user to the Search Component page if they are not already there, and the first category alphabetically is inserted (Browse is not initially inserted).
  For instance, if the user clicked on the magnifying glass without being on the Search Component, selected a category without typing anything, they would be redirected to the Search Component page, and the search would go to q=search+term+=category=adventure (as it is the first category in the list of categories).

If the user selects a category from the list, such as "Computers," and clicks the magnifying glass, the search goes to q=search+term+=category=computers. If they typed a query in the input, such as "angular," the request would go to q=angular+=computers.

If the user clicks on "Title," "All," "Text," or "Author," while having a category selected, the category is automatically reset, and "Browse" is substituted.

If the user initially had a Category and changes the category itself to "Browse," the Category remains (as the search continues simply on search+term).

- IMPORTANT! Sometimes the backend may return not only categories like "bibles" but also similar ones, for example, "religious." This is normal!

## Favorite Component

Here, favorite books are displayed, which can be saved through the Search Component page.

Key Features:

- Removing a favorite book
- Transitioning to a favorite book for additional information
- Searching via the input in the header also occurs here.
- Selection for category, title, and similar is disabled; the value is fixed at all since the backend does not provide the option to choose a type.
- Thus, a user can enter "Performing Arts," and if any book contains this phrase in its text, title, categories, or author, the backend will return those books.

The backend sometimes behaves strangely, returning books not marked as favorites, especially noticeable when VPN is on or off!

## SearchLiveComponent | Header Component

In the header component, specifically in the input, live search, or elastic search, is embedded. It is built using the same API that our Search Component page queries but operates in real-time if more than 4 letters are typed and 500 milliseconds have passed without user input. Then, a block with suggested results appears below.

For instance, if the user types "angular" and "All" is selected, the search goes to q=angular, and book titles are inserted.

- If the user types "Александр" and "Author" is selected, the search goes to q=Александр+=inauthor, and author names are inserted. Importantly, values are not repeated, as a New Set is used to keep only unique values. So, "Alexander Pushkin" will not appear twice; it might be listed as: Alexander Pushkin, Pushkin Alexander, Alexander Sergeyevich Pushkin, but not as Alexander Pushkin, Alexander Sergeyevich Pushkin, Alexander Pushkin.
- If the user types "angular" and "Text" is selected, the search goes to q=angular+=intext. However, book titles are inserted here, as displaying book descriptions is not feasible for the results.
- If the user types "angular" and "Category" is selected with the "Computers" category chosen in the modal window below, live search will not be displayed!

Thus, live search works for types:

- Text
- All
- Title
- Author

## Pagination Input Component

It is used only on the Search Component page and is displayed if more than 40 books are returned from the search.

Main functionality:

- Input validation. That is, entering non-digits is prohibited, also, 0 cannot be entered into the input, and a value greater than the available number of pages cannot be entered.
- Below the input, the number of pages is displayed.
- To the left of the input, there are two buttons, one of which decreases by 10 pages, and the other decreases by 1 page; to the right of the input, there are two buttons, the first increases by 1 page, and the second increases by 10 pages.
- Validation is applied to the buttons; if there are fewer than 10 pages, the button for +10 will be disabled, and so on.

## Book Component

It looks different on different pages:

On the Home Component page:

- Image
- Title
- Author, year
- rating or number of pages
- Clicking on the entire book takes you to the Detail Component.

On the Favorite Component page:

In addition to the above:

- Date and time the book was added to favorites
- The Read button helps to navigate to the Detail Component
- The Ebook button redirects to the book page on Google Books.

On the MyBook Component page:

- The Read button redirects to the PdfView Component page.
- Edit button
- Delete button
- Date when user loaded this book

## DetailBook Component

The page provides the following information:

- Book image
- Book title
- Author
- Rating, if available
- Features
- Read button to navigate to a separate Google Book page
- Description of the book
- Two other books by the same author! (works only with VPN)

## UploadComponent

The page includes:

- Validation of all input fields.
- The button is disabled until all fields are filled.
- Validation of the input when uploading a PDF file; if it's not a PDF file, an error is displayed.
- Validation of the input when uploading a PNG/JPG/JPEG file; if it's not one of these formats, an error is displayed.
- When the Upload button is clicked, the user is redirected to the MyBook Component page if everything is uploaded successfully. If not, a notification appears.

It's important to note that initially, the file and image are uploaded to Firebase Storage to obtain links to the image and file. Then, other information (Author, Title, Date) is saved in Firebase Store, where links to our files are stored in the webReaderLink and thumbnail fields.

If a user clicks the edit button on the MyBookComponent page, they are redirected to the Upload page, where the data is pre-filled, and the user can edit it.

Above the input for the PDF file, an icon indicating PDF format appears along with a text message stating that if the user wants to change the PDF, they should upload a new one. When a new file is uploaded, this block disappears. If the user doesn't upload a new book, the old book remains.

The same process occurs for the image.

If a user wants to change the image, initially, a request is made to delete the current image from Firebase Storage. Then, the new image is uploaded, and only after this, the link to this image for the book is updated in Firebase Store.

## MyBookComponent:

- Edit button
- Delete button
- If the user deletes the book, the image and file are simultaneously deleted from Firebase Storage, and the book itself is deleted from Firebase Store.

Clicking the edit button redirects the user to the Upload Component page.

## PdfViewer Component

Main functionality:

- Display of the uploaded PDF file of the book (using the ngx-extended-pdf-viewer library for Angular).
- Display of the uploaded image of the book.
- Display of the book's title and its author.
- Download button for the PDF file.
- Button to open the "drawing tool" on the file, allowing users to download the PDF with drawings made on it.
- Full-Screen button to display the PDF file in full-screen mode on the computer.
- Odd View button to change the number of displayed pages.
- Button to select the scroll direction (horizontal or vertical).
- Button to adjust zoom level (+/-) or percentage for displaying the PDF in zoomed-in or zoomed-out states, and similar functionalities.
