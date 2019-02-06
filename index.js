let allBooks = []
const listPanel = document.querySelector("#list-panel")
const showPanel = document.querySelector("#show-panel")
const myUser = {"id":1, "username":"pouros"}

function apiGet(){
  fetch("http://localhost:3000/books")
  .then(function(r){
    return r.json()
  })
  .then(function(r){
    allBooks = r
    showAllBooks()
  })
}

function likeBookToggle(id, users){
  fetch(`http://localhost:3000/books/${id}`,{
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      users: users
    })
  }).then(function(r){
    return r.json()
  })
}// end of likeBookToggle

function showAllBooks() {
  for (let book of allBooks){
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
  for (let user of book.users){
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
  `
}





document.addEventListener("DOMContentLoaded", function() {
  apiGet()


listPanel.addEventListener('click',function(e){
  if (e.target.className === "book-list-item"){
    id = e.target.dataset.id
    getBook(id)
  }


})//end of listPanel listener

showPanel.addEventListener('click',function(e){
  if(e.target.id === 'read-book-button'){
    console.log("you pressed the read book button");
    id = e.target.dataset.bookid
    users = getBook(id).users
    book = getBook(id)

    if(users.some(user => user.username === myUser.username)){

    let filteredUsers = users.filter(user => user.username != myUser.username);
    likeBookToggle(id, filteredUsers)
    showBook(book)
} else{


    users.push(myUser)
    likeBookToggle(id, users)
    showBook(book)
}


  }
})


});
