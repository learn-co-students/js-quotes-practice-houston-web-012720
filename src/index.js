const newQuoteForm = document.getElementById('new-quote-form')
const quotesUl = document.getElementById('quote-list')

document.addEventListener('DOMContentLoaded', () => {
  fetch('http://localhost:3000/quotes?_embed=likes')
  .then(r => r.json())
  // .then(quotes => {for (const quote of quotes) showQuote(quote)})
  .then(quotes => quotes.forEach(quote => showQuote(quote)))

  addFormFunction()
})

let showQuote = (quote) => {              
  const li = document.createElement('li')
  li.className = 'quote-card'
  
  const blockquote = document.createElement('blockquote')
  blockquote.className = 'blockquote'
  const p = document.createElement('p')
  p.className = "mb-0"
  p.innerText = quote.quote
  const footer = document.createElement('footer')
  footer.className = "blockquote-footer"
  footer.innerText = quote.author
  const br = document.createElement('br')
  const likeBtn = document.createElement('button')
  likeBtn.className = 'btn-success'
  likeBtn.innerHTML = `Likes: <span>${quote.likes.length}</span>`

  likeBtn.addEventListener('click', () => likeQuote(quote, likeBtn))
  const dltBtn = document.createElement('button')
  dltBtn.className = 'btn-danger'
  dltBtn.innerText = "Delete"
  dltBtn.addEventListener('click', () => dltQuote(quote, li))

  const editBtn = document.createElement('button')
  editBtn.innerText = "Edit Quote"
  editBtn.className = 'btn-success'
  editBtn.style = "background-color: grey; border-color: white;"
  editBtn.dataset.isOpen = ""
  editBtn.addEventListener('click', () => editQuote(quote, li, editBtn))

  blockquote.append(p, footer, br, likeBtn, dltBtn, br.cloneNode(), editBtn)
  li.append(blockquote)
  quotesUl.append(li)
}

let likeQuote = (quote, likeBtn) => {
  fetch('http://localhost:3000/likes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      quoteId: quote.id,
      createdAt: Date.now()
    })
  })
  .then(r => r.json())
  .then(newLike => { // not newQuote?
    quote.likes.push(newLike)
    // quote = newQuote //still a promise? Why isn't quote updating?
    
    // const likes = parseInt(likeBtn.innerText.split('Likes: ').filter(Boolean)[0]) //no span
    likeBtn.innerHTML = `Likes: <span>${quote.likes.length}</span>`
  })
}

let dltQuote = (quote, li) => {
  fetch('http://localhost:3000/quotes/' + quote.id, {
    method: 'DELETE'
  })
  .then(r => r.json())
  .then(() => li.remove())                          
}

let editQuote = (quote, li, editBtn) => {
  // editBtn.dataset.isOpen = !editBtn.dataset.isOpen 
  editBtn.dataset.isOpen = editBtn.dataset.isOpen ? '' : 'true'

  if (editBtn.dataset.isOpen) {
    editBtn.innerText = "Close Editor"
    const editForm = document.createElement('form')
    editForm.id = "edit-form"
    const quoteField = document.createElement('input')
    quoteField.type = "text"
    quoteField.placeholder = quote.quote
    const authorField = document.createElement('input')
    authorField.type = "text"
    authorField.placeholder = quote.author
    const submitBtn = document.createElement('input')
    submitBtn.type = "submit"
    editForm.append(quoteField, authorField, submitBtn)
    li.append(editForm)
    editForm.addEventListener('submit', () => {
      event.preventDefault()
      fetch('http://localhost:3000/quotes/' + quote.id, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          quote: editForm[0].value,
          author: editForm[1].value
        })
      })
      .then(r => r.json())
      .then(editedQuote => {
        // quote = editedQuote //this doesn't update placeholders
        quote.quote = editedQuote.quote
        quote.author = editedQuote.author
        li.querySelector('p').innerText = editedQuote.quote
        li.querySelector('footer').innerText = editedQuote.author
        editBtn.dataset.isOpen = ''
        editBtn.innerText = "Edit Quote"
        li.querySelector('#edit-form').remove()
      })
    })
  } else {
    editBtn.innerText = "Edit Quote"
    li.querySelector('#edit-form').remove()
  }
}

let addFormFunction = () => {
  newQuoteForm.addEventListener('submit', () => {
    event.preventDefault()
    const newQuote = document.getElementById('new-quote').value // or newQuoteForm[0].value
    const author = document.getElementById('author').value
    fetch('http://localhost:3000/quotes/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        quote: newQuote,
        author: author
      })
    })
    .then(r => r.json())
    .then(q => {
      q.likes = [] // maybe solves everything? // only solves some things
      showQuote(q)
      newQuoteForm.reset()
    })
  })
}