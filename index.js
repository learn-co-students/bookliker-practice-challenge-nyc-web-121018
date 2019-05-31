let allBooks = []      // holds all books after our fetch
let allUsers = []      // holds all users after our fetch
let booksUrl = `http://localhost:3000/books`
let usersUrl = `http://localhost:3000/users`
let foundbook          // will hold the instance of a found object
let loggedInUser      // allows us to update as if we were this person - set during the Users fetch

document.addEventListener("DOMContentLoaded", function() {
  // list and showBook will allow us to access these HTML ids
  const list = document.getElementById('list')
  const showBook = document.getElementById('show-panel')

  // getBooks calls our books fetch and updates the DOM
  getBooks(booksUrl)

  // getUsers updates our allUsers array and sets the loggedInUser
  getUsers(usersUrl)

  // listens for click on books and then renders individual (foundbook) data to the DOM
  list.addEventListener('click', e => {
    foundbook = findBook(e.target.dataset.id)
    showBook.innerHTML = renderBookdata([foundbook])
  })

  // listens for like/unlike clicks
  showBook.addEventListener('click', e => {
    // only records listens on the button
    if (e.target.type === 'button') {
      //foundbook is the book that is currently showing on the DOM
      foundbook = findBook(e.target.dataset.id)

      // if loggedInUser user clicks this button now, they will be added as a
      // liked user to the found book and the PATCH request will be made
      if (e.target.innerText === 'Like this book!') {
        foundbook["users"].push(loggedInUser)
        showBook.innerHTML = renderBookdata([foundbook])
        changeUserLike(e.target.dataset.id, foundbook)   // changeUserLike is the all encompassing patch that allows user to like/unlike
      } else {
        // if the logged in user unlikes the book, then we update the DOM and pass in that PATCH request
        e.target.innerText === 'Unlike this book!'
        let newUsers = foundbook["users"].filter( user => {
          return user.id !== loggedInUser.id
        })
        foundbook["users"] = newUsers
        showBook.innerHTML = renderBookdata([foundbook])
        changeUserLike(e.target.dataset.id, foundbook)
      }
    }
  })


}); // end DOMContentLoaded


// ------------------ Fetch functions  -----------------------------
function getBooks(path) {   //fetches all books and renders to DOM
  fetch(path)
    .then(resp => resp.json())
    .then(data => {
      allBooks = data
      list.innerHTML = createHTML(allBooks)
    })
}

function getUsers(path) {   //fetches all users and sets loggedInUser
  fetch(path)
    .then(resp => resp.json())
    .then(users => {
      allUsers = users
      loggedInUser = users[0]
    })
}

function changeUserLike(id, book) {   // all purpose fetch to allow for liking or unliking a book
  let bookUsers = book["users"]             // by loggedInUser
                                            // the book that is received to this function already has had the users properly edited
  fetch(booksUrl + `/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      users: bookUsers
    })
  })
}

// ------------------ End fetch functions  -----------------------------

// ------------------ Create HTML functions  ---------------------------


function createHTML(books) {     // creates HTML for the getBooks fetch
  return books.map(book => {
    return `<li data-id="${book.id} "style="padding: 5px;"> ${book.title} </li>`
  }).join("")
}

function createBookLikesHTML(book) {     // creates HTML for the renderBookdata liked users list
  return book["users"].map( user => {
    return `<li data-id="${user.id} "style="padding: 2px;"> ${user.username} </li>`
  }).join("")
}

function renderBookdata(book) {       // renders all foundbook data to the DOM

  function likeAnswer(users) {        // determins if the loggedInUser already likes the book
    let found = users.find( user => {
      return user.username === loggedInUser.username
    })
    return (found ? "Unlike this book!" : "Like this book!")
  }

  return book.map(info => {         // returns all HTML that is painted to the DOM
    return `<h2> ${info.title} </h2>
            <img src=${info.img_url} alt="${info.title} book cover" height="auto" width="auto">
            <p> ${info.description} </p>
            <h4>Likes: ${info.users.length} </h4>
            <h4>Liked by: </h4>
            <ul> ${createBookLikesHTML(info)} </ul>
            <button data-id=${info.id} type="button">${likeAnswer(info.users)}</button>`
  }).join("")
}

// ------------------ End create HTML functions  ------------------------

// ------------------ Helper functions  ---------------------------------

// finds one book based on the books id
function findBook(id) {return allBooks.find( book => {return parseInt(id) === book.id})}
