document.addEventListener("DOMContentLoaded", function() {
  const bookListContainer = document.querySelector("#list-panel")
  const bookDetailContainer = document.querySelector("#show-panel")
  let allBooks = []
  const me = {
    id: 1,
    username: "pouros"
  }

  fetch("http://localhost:3000/books")
    .then(r => r.json())
    .then(bookData => {
      allBooks = bookData
      //console.log(allBooks)
      bookHTML = bookData.map(book =>{
        return `
        <li data-id=${book.id}>${book.title}</li>
        `
      })//end of map
      bookListContainer.innerHTML += bookHTML.join('')
    })//end then

  bookListContainer.addEventListener('click', (e)=>{
    //console.log(e.target);
    let chosenBookId = parseInt(e.target.dataset.id)
    //console.log(chosenBookId);
    let chosenBook = allBooks.find(book =>{
      return chosenBookId === book.id
    })
    //console.log(chosenBook);
    console.log(chosenBook.users);
    let usernames = chosenBook.users.map(user =>{
      return `<li data-id={user.id} id="username">${user.username}</li>`
    }).join("")

    //console.log(usernames);

    fetch(`http://localhost:3000/books/${chosenBookId}`)
    .then(r => r.json())
    .then(chosenBook => {
      //console.log(chosenBook.users[username]);
      let chosenBookHTML=`
          <div>
          <h2>${chosenBook.title}</h2>
          <img src=${chosenBook.img_url}>
          <p>${chosenBook.description}</p>
          <h4>${usernames}<h4>
          <button id=${chosenBook.id} class="liked">Read</button>
          </div>`
          bookDetailContainer.innerHTML=chosenBookHTML
    })//end then
  })//end of addEventListener

  bookDetailContainer.addEventListener('click', (e)=>{
    if(e.target.className === "liked"){
        //console.log(e.target);
        let chosenBookId = parseInt(e.target.id)
        //console.log(chosenBookId);

        let chosenBook = allBooks.find(book =>{
          return chosenBookId === book.id
        })
        //console.log(chosenBook.users)
        //console.log(chosenBook);
        chosenBook.users.push(me)
        //console.log(chosenBook.users);

        let usernames = chosenBook.users.map(user =>{
          return `<li data-id={user.id} id="username">${user.username}</li>`
        }).join("")
        console.log(usernames);
        let chosenBookHTML=`
            <div>
            <h2>${chosenBook.title}</h2>
            <img src=${chosenBook.img_url}>
            <p>${chosenBook.description}</p>
            <h4>${usernames}<h4>
            <button id=${chosenBook.id} class="liked">Read</button>
            </div>`
            bookDetailContainer.innerHTML= chosenBookHTML

        fetch(`http://localhost:3000/books/${chosenBookId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            users: chosenBook.users
          })

        })//end fetch
        //.then(r => console.log(chosenBook.users))

    }//end ifstatement

  })//end addEventListener

});//end of DOMContentLoaded
