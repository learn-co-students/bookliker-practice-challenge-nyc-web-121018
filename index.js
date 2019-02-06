
document.addEventListener("DOMContentLoaded", function() {
let showBook = document.querySelector("#show-panel")
let allBooks = []
let allUsers = []
const bookList = document.querySelector("#list-panel")
const bookLink= document.querySelector(".book-item")
const likeButton = document.querySelector("#liked")
const me = {
id: 1,
username: "pouros"
}

fetch ("http://localhost:3000/users")
  .then(r => r.json())
  .then(data => {
    allUsers = data
    let users = allUsers.map(user =>{
      return `
      <li data-id="${user.id}">${user.username}</li>`
    })

})//end of fetch

fetch ("http://localhost:3000/books")
  .then(r => r.json())
  .then(data => {
    allBooks = data
    let books = allBooks.map(book =>{
      return `
      <li data-id="${book.id}" class="book-item">${book.title}</li>`
    })
    bookList.innerHTML = books.join('')
})//end of fetch

bookList.addEventListener('click', (e)=>{
  e.preventDefault()
  //console.log(e.target.dataset.id)
  let foundBook = allBooks.find(book => {
    return parseInt(e.target.dataset.id) === book.id
  })//end of found book
  //console.log(foundBook)
  //append the book details to showBook
//let userNames =
  //let userNames = foundBook.users

  function userNames(foundBook) {return foundBook.users.map(user => {
    return `<li id=${user.id}>${user.username}</li>`
  }).join('')}

//console.log(userNames);

    showBook.innerHTML= `
    <div>
      <p>${foundBook.title}</p>
      <img src="${foundBook.img_url}">
      <p>${foundBook.description}</p>
      <ul>${userNames(foundBook)} </ul>
      <button id=${foundBook.id} class="liked">Read</button>
  </div>
    `

})//end of booklist add event istener
showBook.addEventListener('click', (e)=>{
  //console.log(e.target.id);
  let foundBook = allBooks.find(book => {
    return parseInt(e.target.id) === book.id
  })//end of found book

 //console.log(foundBook);
  if(e.target.className === "liked"){
  //console.log(e.target)
  //console.log(foundBook.users)
  }
  let currentUsers = foundBook.users
  //console.log(currentUsers)

  foundBook.users.push(me)
  // console.log(currentUsers)
  //
  // console.log(foundBook.users);

  function userNames(foundBook) {return foundBook.users.map(user => {
    return `<li id=${user.id}>${user.username}</li>`
  }).join('')}

//console.log(userNames);

    showBook.innerHTML= `
    <div>
      <p>${foundBook.title}</p>
      <img src="${foundBook.img_url}">
      <p>${foundBook.description}</p>
      <ul>${userNames(foundBook)} </ul>
      <button id=${foundBook.id} class="liked">Read</button>
  </div>
    `
    fetch(`http://localhost:3000/books/${foundBook.id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
            },
            body: JSON.stringify({
              "users":foundBook.users
})
})
  })//end of showbook event listener









});//end of DOMContentLoaded
