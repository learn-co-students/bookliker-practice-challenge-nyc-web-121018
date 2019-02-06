let allBooks = []
let allUsers = []
let booksUrl = `http://localhost:3000/books`
let usersUrl = `http://localhost:3000/users`
let foundbook
let loggedInUser

document.addEventListener("DOMContentLoaded", function() {
  const list = document.getElementById('list')
  const showBook = document.getElementById('show-panel')

  getBooks(booksUrl)
  getUsers(usersUrl)

  list.addEventListener('click', e => {
    foundbook = findBook(e.target.dataset.id)
    showBook.innerHTML = renderBookdata([foundbook])
  })

  showBook.addEventListener('click', e => {
    if (e.target.type === 'button') {
      foundbook = findBook(e.target.dataset.id)

      if (e.target.innerText === 'Like this book!') {
        foundbook["users"].push(loggedInUser)
        showBook.innerHTML = renderBookdata([foundbook])
        changeUserLike(e.target.dataset.id, loggedInUser, foundbook)
      } else {
        e.target.innerText === 'Unlike this book!'
        let newUsers = foundbook["users"].filter( user => {
          return user.id !== loggedInUser.id
        })
        foundbook["users"] = newUsers
        showBook.innerHTML = renderBookdata([foundbook])
        changeUserLike(e.target.dataset.id, loggedInUser, foundbook)
      }
    }
  })


}); // end DOMContentLoaded


// ------------------ Fetch functions  -----------------------------
function getBooks(path) {
  fetch(path)
    .then(resp => resp.json())
    .then(data => {
      allBooks = data
      list.innerHTML = createHTML(allBooks)
    })
}

function getUsers(path) {
  fetch(path)
    .then(resp => resp.json())
    .then(users => {
      allUsers = users
      loggedInUser = users[0]
    })
}

function changeUserLike(id, user, book) {
  let bookUsers = book["users"]

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

function createHTML(books) {
  return books.map(book => {
    return `<li data-id="${book.id} "style="padding: 5px;"> ${book.title} </li>`
  }).join("")
}

function createBookLikesHTML(book) {
  return book["users"].map( user => {
    return `<li data-id="${user.id} "style="padding: 2px;"> ${user.username} </li>`
  }).join("")
}

function renderBookdata(book) {

  function likeAnswer(users) {
    let found = users.find( user => {
      return user.username === loggedInUser.username
    })
    return (found ? "Unlike this book!" : "Like this book!")
  }

  return book.map(info => {
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

function findBook(id) {return allBooks.find( book => {return parseInt(id) === book.id})}
