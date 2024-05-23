# API Documentation

## Base URL
`https://www.googleapis.com`

## getReadingNow
- **Endpoint:** `https://www.googleapis.com/books/v1/mylibrary/bookshelves/3/volumes`
  - **Method:** `GET`
    - **Request:**
      ```json
      {
        "params": "{
          'maxResults': 40,
          'startIndex': startIndex
        }",
        "headers": {
          Authorization: `Bearer accessToken`,
          'Content-Type': 'application/json'"
        }
      }


## getFavorites
- **Endpoint:** `https://www.googleapis.com/books/v1/mylibrary/bookshelves/0/volumes`
  - **Method:** `GET`
    - **Request:**
      ```json
      {
        "headers": {
          Authorization: `Bearer accessToken`,
          'Content-Type': 'application/json'"
        }
      }

## getRecommended
- **Endpoint:** `https://www.googleapis.com/books/v1/mylibrary/bookshelves/8/volumes`
  - **Method:** `GET`
    - **Request:**
      ```json
       {
        "params": "{
          'maxResults': 40,
          'startIndex': startIndex
        }",
        "headers": {
          Authorization: `Bearer accessToken`,
          'Content-Type': 'application/json'"
        }
      }

## getDetailBook
- **Endpoint:** `https://www.googleapis.com/books/v1/mylibrary/bookshelves/idOfBook`
  - **Method:** `GET`
    - **Request:**
      ```json
       {
        "headers": {
          Authorization: `Bearer accessToken`,
          'Content-Type': 'application/json'"
        }
      }

## getAuthorDetail (only with VPN)
- **Endpoint:** `https://www.googleapis.com/books/v1/volumes?q=inauthor:authorTitle&maxResults=3`
  - **Method:** `GET`

## getSearchBooksDefault (only with VPN)
- **Endpoint:** `https://www.googleapis.com/books/v1/volumes?q=angular:intitle&maxResults=40&startIndex=0`
  - **Method:** `GET`

## getSearchBooksLive (only with VPN)
- **Endpoint:** `https://www.googleapis.com/books/v1/volumes?q=+intitle:Harry%20Potter`
  - **Method:** `GET`


## setFavoriteBook
- **Endpoint:** `https://www.googleapis.com/books/v1/mylibrary/bookshelves/0/addVolume?volumeId=${id}`
  - **Method:** `POST`
    - **Request:**
      ```json
      {
        "headers": {
          Authorization: `Bearer accessToken`,
          'Content-Type': 'application/json'"
        }
      }

## removeFavoriteBook
- **Endpoint:** `https://www.googleapis.com/books/v1/mylibrary/bookshelves/0/removeVolume?volumeId=${id}`
  - **Method:** `POST`
    - **Request:**
      ```json
      {
        "headers": {
          Authorization: `Bearer accessToken`,
          'Content-Type': 'application/json'"
        }
      }
