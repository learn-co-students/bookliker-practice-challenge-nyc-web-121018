let allBooks = []
const listPanel = document.querySelector("#list-panel")
const showPanel = document.querySelector("#show-panel")
const myUser = {
  "id": 1,
  "username": "pouros"
}
const createButton = document.querySelector("#create-button")

function apiGet() {
  fetch("http://localhost:3000/books")
    .then(function(r) {
      return r.json()
    })
    .then(function(r) {
      allBooks = r
      showAllBooks()
    })
}

function apiCreate(name, image, description) {
  fetch(`http://localhost:3000/books`,{
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      title: name,
      img_url: image,
      description: description,
      users: []
    })
  }).then(function(r){
    return r.json
  })
}

function apiDelete(id) {
  fetch(`http://localhost:3000/books/${id}`, {
    method: "DELETE",
  })
}

function likeBookToggle(id, users) {
  fetch(`http://localhost:3000/books/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      users: users
    })
  }).then(function(r) {
    return r.json()
  })
} // end of likeBookToggle

function showAllBooks() {
  for (let book of allBooks) {
    listPanel.innerHTML +=
      `<li data-id="${book.id}" class="book-list-item" id="book-list-${book.id}">${book.title}</li>`
  }
}

function getBook(id) {
  let book = allBooks.find(function(element) {
    return element.id == id
  })

  showBook(book)
  return book
}

function showBook(book) {
  let usersHTML = ''
  for (let user of book.users) {
    usersHTML += `<li data-id="${user.id}">${user.username}</li>`
  }


  showPanel.innerHTML =
    `
  <h4>${book.title}</h4>
  <img src="${book.img_url}" alt="">
  <p>${book.description}</p>
  <ul id="users">
    ${usersHTML}
  </ul>
  <button id="read-book-button" data-bookId="${book.id}" data-userId="${myUser.id}"> Read Book </button>
  <button id="delete-book-button" data-bookId="${book.id}"> Delete Book </button>
  `
}

function showCreateForm() {
  showPanel.innerHTML =
  `<form id="createForm">
  	<input id="form-name" placeholder="name">
  	<input id="form-image" placeholder="image">
  	<input id="form-description" placeholder="description">
    <button> Submit </button>
  </form>`
}

function temporayIdGenerator() {
  let ids = allBooks.map(book => book.id)
  return ids.sort((a,b) => a + b)[0] + 1
}



document.addEventListener("DOMContentLoaded", function() {
  apiGet()


  listPanel.addEventListener('click', function(e) {
    if (e.target.className === "book-list-item") {
      id = e.target.dataset.id
      getBook(id)
    }
    if (e.target.id === "create-button") {
      showCreateForm()
    }


  }) //end of listPanel listener

  showPanel.addEventListener('click', function(e) {
    if (e.target.id === 'read-book-button') {
      // console.log("you pressed the read book button");
      id = e.target.dataset.bookid
      users = getBook(id).users
      book = getBook(id)

      if (users.some(user => user.username === myUser.username)) {

        let filteredUsers = users.filter(user => user.username != myUser.username);
        likeBookToggle(id, filteredUsers)
        book.users = filteredUsers
        showBook(book)

      } else {


        users.push(myUser)
        likeBookToggle(id, users)
        showBook(book)
      }


    }
    if (e.target.id === 'delete-book-button') {
        id = e.target.dataset.bookid

      apiDelete(id)
      showPanel.innerHTML = ``
      document.querySelector(`#book-list-${id}`).remove()
    }
  }) //end of showpanel listener

  showPanel.addEventListener('submit',function(e){
    let name = document.querySelector('#form-name').value
    let image = document.querySelector('#form-image').value
    let description = document.querySelector('#form-description').value
    let id = temporayIdGenerator()
    e.preventDefault()
    apiCreate(name, image, description)
    showPanel.innerHTML =
    `
  <h4>${name}</h4>
  <img src="${image}" alt="">
  <p>${description}</p>
  <ul id="users">

  </ul>
  <button id="read-book-button" data-bookId="${id}" data-userId="${id}"> Read Book </button>
  <button id="delete-book-button" data-bookId="${id}"> Delete Book </button>
  `
  })


});
