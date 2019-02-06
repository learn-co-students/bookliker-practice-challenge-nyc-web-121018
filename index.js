let allBooks = []
let allUsers = []
let bookUrl = `http://localhost:3000/books`

document.addEventListener("DOMContentLoaded", function() {

  const bookList = document.getElementById('list')
  const bookInfo = document.getElementById('show-panel')

  fetch(bookUrl)  //fetches all data from the book URL
    .then(response => response.json())
    .then(data => {
      allBooks = data
      let books = allBooks.map(book => {
        return `<li data-id="${book.id}">${book.title}</li>`
      }).join("")
      bookList.innerHTML = books
    })

  bookList.addEventListener('click', e => {
    let foundBook = allBooks.find(book => {
      return parseInt(e.target.dataset.id) === book.id
    })
    bookInfo.innerHTML =    //information that renders to the DOM because we are ACTUALLY CHANGING THE INNERHTML!!!
      `<h2>${foundBook.title}</h2>
        <img src="${foundBook.img_url}">
        <p>${foundBook.description}</p>
        <ul id="users-list">${foundBook.users.map (user => {
          return `<li id=${user.id}>${user.username}</li>`
        }).join("")}</ul>
        <button id="${foundBook.id}"type="button">Like Book</button>`
  })

  bookInfo.addEventListener('click', e => {
    let loggedInUser = {"id":1, "username":"pouros"}
    let foundBook = allBooks.find(book => {
        return parseInt(e.target.id) === book.id
    })
    foundBook.users.push(loggedInUser)
    bookInfo.innerHTML =    //information that renders to the DOM because we are ACTUALLY CHANGING THE INNERHTML!!!
      `<h2>${foundBook.title}</h2>
        <img src="${foundBook.img_url}">
        <p>${foundBook.description}</p>
        <ul id="users-list">${foundBook.users.map (user => {
          return `<li id=${user.id}>${user.username}</li>`
        }).join("")}</ul>
        <button id="${foundBook.id}"type="button">Like Book</button>`

      fetch(`http://localhost:3000/books/${e.target.id}`,{
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          users: foundBook.users
        })
      })


  })


}); //end of DOMContentLoaded
