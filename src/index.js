document.addEventListener("DOMContentLoaded", () => {
  
  const QUOTES_W_LIKES_URL = "http://localhost:3000/quotes?_embed=likes"
  const LIKES_URL = "http://localhost:3000/likes"
  const QUOTES_URL = "http://localhost:3000/quotes" 
  const form = document.querySelector("#new-quote-form")
  const quoteField = document.querySelector("#new-quote").value
  const authorField = document.querySelector("#author").value



  // GET ALL THE QUOTES AND LIKES
  fetch(QUOTES_W_LIKES_URL)
  .then(resp => resp.json())
  .then(quotesData =>  showQuotes(quotesData))

  function showQuotes(quotes){
    quotes.forEach(quote => showQuote(quote))
  }

  // SHOW EACH QUOTE BUILD IN ITS LIKE, EDIT, AND DELETE FUNCTIONALITY
  function showQuote(quote){
    const list = document.querySelector("#quote-list")
    const li = document.createElement("li")
    li.className = "blockquote"
      const blockquote = document.createElement("blockquote")
      blockquote.className = "blockquote"
        const p = document.createElement("p")
        p.className = "mb-0"
        p.innerText = quote.quote
        const footer = document.createElement("footer")
        footer.className = "blockquote-footer"
        footer.innerText = quote.author
        const br = document.createElement("br")
        const likeBtn = document.createElement("button")
        likeBtn.innerText = "Likes:"
          const span = document.createElement("span")
          span.innerText = quote.likes.length
          // LIKE FUNCITONALITY 
          likeBtn.addEventListener("click", () => {
            fetch(LIKES_URL, {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              }, 
              body: JSON.stringify({
                quoteId: quote.id, 
                // createdAt: "SOMENUMBERS"
              })
            }) 
            .then (resp => resp.json())
            .then (newLike => {
              // quote.likes.push(newLike)
              // span.innerText = quote.likes.length
              fetch("http://localhost:3000/likes?quoteId=" + quote.id)
              .then(resp => resp.json())
              .then(likes => span.innerText = likes.length)
            })
          })
        likeBtn.append(span)
        const dltBtn = document.createElement("button")
        dltBtn.innerText = "Delete"
        // DELETE FUNCTIONALITY
        dltBtn.addEventListener("click", ()=>{
          fetch(QUOTES_URL + "/"  + quote.id, {
            method: "DELETE"
          })
          .then(resp => resp.json())
          .then(dltedQuote => li.remove())
        })
        const editBtn = document.createElement("button")
        editBtn.innerText = "Edit"
        const editDiv = document.createElement("div")
        const editFormHTML = 
        `<form id="edit-quote-${quote.id}-form">` +
          '<div class="form-group">' +
            '<label for="new-quote">Edit Quote</label>' +
            `<input name="quote" type="text" class="form-control" id="edit-quote-${quote.id}" placeholder="Learn. Love. Code.">` +
          '</div>' +
          '<div class="form-group">' +
            '<label for="Author">Author</label>' +
            `<input name="author" type="text" class="form-control" id="edit-author-${quote.id}" placeholder="Flatiron School">` +
          '</div>' +
          '<button type="submit" class="btn btn-primary">Update</button>' +
          '<br><br>' +
        '</form>' 
        editDiv.innerHTML = editFormHTML
        editDiv.style.display = "none"
        // EDIT FUNCTIONALITY
        editBtn.addEventListener("click", ()=>{
          editDiv.style.display = "block"
          const editForm = document.querySelector(`#edit-quote-${quote.id}-form`)
          const editQuoteField = document.querySelector(`#edit-quote-${quote.id}`)
          editQuoteField.value = quote.quote
          const editAuthorField = document.querySelector(`#edit-author-${quote.id}`)
          editAuthorField.value = quote.author
          editForm.addEventListener("submit", ()=> {
            event.preventDefault()
            fetch(QUOTES_URL + "/" + quote.id, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              }, 
              body: JSON.stringify({
                quote: editQuoteField.value,
                author: editAuthorField.value
              })
            })
            .then (resp => resp.json())
            .then (updatedQuote => {
              quote = updatedQuote
              p.innerText = quote.quote
              footer.innerText = quote.author
              form.reset()
              editDiv.style.display = "none"
            })
          })

        })
      blockquote.append(p, footer, br, editDiv, likeBtn, dltBtn, editBtn)
    li.append(blockquote)
    list.append(li)
  }

  // CREATE A NEW QUOTE
  form.addEventListener("submit", () => {
    event.preventDefault()
    
    fetch(QUOTES_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        quote: quoteField,
        author: authorField,
        likes: []
      })
    })
    .then(resp => resp.json())
    .then(newQuote => {
      showQuote(newQuote)
      form.reset()
    })
  })

})

// ADD A SORT FEATURE TO SORT BY AUTHOR ALPHABETICALLY  