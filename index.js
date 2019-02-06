
let oneBook

document.addEventListener("DOMContentLoaded", function(event) {

// list-panel
  const bookList = document.querySelector("#list-panel")
  let allBooks = []

// Get a list of books & render them http://localhost:3000/books

  fetch ("http://localhost:3000/books")
      .then(r => r.json())
      .then(books => {
      allBooks = books
        // console.log(book.title)
      let bookHTML = books.map(function(book) {
          return `
          <li class="booktitle" data-id="${book.id}">${book.title}</li>`
      })
      bookList.innerHTML =
      bookHTML.join('')
  })

  //
// Load specific book info in book container
// Be able to click on a book, you should see the book's thumbnail and description and a list of users who have liked the book.
const bookContainer = document.querySelector("#show-panel")

bookList.addEventListener('click', (e) => {
    if (e.target.className === 'booktitle') {
      // resizeText(1)
      let foundBook = allBooks.find( (book)=>{
        return book.id == e.target.dataset.id
      })
      // console.log(foundBook.title)

      fetch('http://localhost:3000/books/' + `${foundBook.id}`)
        .then ( response => response.json())
        .then ( foundBook =>{
          oneBook = foundBook
          bookContainer.innerHTML =
            `
            <h1 class="ui-header" data-id=${foundBook.id}> ${foundBook.title}</h1>
              <img data-id=${foundBook.id} src="${foundBook.img_url}">
              <p> ${foundBook.description}</p>
              <p class="likes"> ${foundBook.likes} Likes </p>
              <p> Liked by:</p>
              <ul>${getUsers(foundBook)} </u>
              <!-- <button data-id=${foundBook.id} class="ui button read-book">Edit Book</button> -->
              <button data-id=${foundBook.id} class="ui button like-book">Like Book</button>
            `
          })

    } //end conditional
  }) // end EventListener



// PATCH
bookContainer.addEventListener("click", (e)=> {
  if (e.target.className === 'ui button like-book'){
    let likes = bookContainer.querySelector(".likes")
    console.log(likes.innerText)
    let currentLikes = parseInt(likes.innerText)
    console.log(currentLikes)
     let newLikes = currentLikes + 1
     let updatedLikes = likes.innerText = newLikes + " likes"
     console.log(updatedLikes)

    // console.log(e.target)
    fetch('http://localhost:3000/books/' + `${e.target.dataset.id}`,{
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
         "Accept": "application/json"
      },
        body: JSON.stringify({
          likes: newLikes
        })

    })
  }
}) //end patch


function getUsers(foundBook){
  return foundBook.users.map( user => {
    // return user.username
    return `<li data-id="${user.id}">${user.username} </li> `

  }).join("")
  }




// // CREATE A NEW BOOK
// const newBook = document.querySelector("#show-panel")
// bookList.addEventListener('submit', (e) => {
//   e.preventDefault()
//
//       // console.log(e.target.title)
//   const newUser = e.target.user.value
//   // const newTitle = bookList.querySelector = (".newtitle").value
//   // const newAuthor = bookList.querySelector = (".newauthor").value
//   // const newImg = bookList.querySelector = (".newimg").value
//   // const desc = bookList.querySelector = (".newdesc").value
//   // console.log(newUser)
// })

}) // DOM
