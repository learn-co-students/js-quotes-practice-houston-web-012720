document.addEventListener("DOMContentLoaded", () => {
  const quoteList = document.querySelector("ul#quote-list")
  const form = document.querySelector("form#new-quote-form")
  const newQuote = document.querySelector("input#new-quote")
  const newAuthor = document.querySelector("input#author")
  const quoteDiv = document.querySelector("div#quote-div")
  const filter = document.createElement("button")
  let filterActive = false

  filter.className = "btn btn-info"
  filter.innerText = "Filter is OFF"
  filter.addEventListener("click", () => changeFilter())
  quoteDiv.prepend(filter)
  displayQuotes()
  form.addEventListener("submit", (e) =>{
    e.preventDefault()
    let params = {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        quote: newQuote.value,
        author: newAuthor.value
      })
    }
    fetch("http://localhost:3000/quotes", params)
      .then(resp => resp.json())
      .then(quote => displayQuote(quote))
  })


  function changeFilter(){
    if(filterActive){
      filterActive = false
      filter.innerText = "Filter is OFF"
    }
    else{
      filterActive = true
      filter.innerText = "Filter is ON"
    }
    displayQuotes()
  }

  function displayQuotes (){
    quoteList.innerHTML = ""
    fetch("http://localhost:3000/quotes?_embed=likes")
      .then(resp => resp.json())
      .then(unsortedQuotes => sortQuotes(unsortedQuotes))
      .then(sortedQuotes => sortedQuotes.forEach(quote => displayQuote(quote)))
  }

  function sortQuotes(quotes){
    if (filterActive){
      return quotes.sort((a, b) => a.author > b.author ? 1 : -1)
    }
    else{
      return quotes.sort((a,b) => a.id - b.id)
    }
  }

  function displayQuote(quote){
    let li = document.createElement("li")
    li.className = "quote-card"
    const bq = document.createElement("blockquote")
    bq.className = "blockquote"
    let p = document.createElement("p")
    p.className = "mb-0"
    p.innerText = quote.quote
    let f = document.createElement("footer")
    f.className = "blockquote-footer"
    f.innerText = quote.author
    const br = document.createElement("br")
    const btnLike = document.createElement("button")
    btnLike.className = 'btn btn-success'
    btnLike.innerText = "Likes:"
    const span = document.createElement("span")
    if (!!quote.likes){
      span.innerText = quote.likes.length
    }
    else{
      span.innerText = 0
    }
    btnLike.append(span)
    btnLike.addEventListener("click", () => {
      let params = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          quoteId: parseInt(quote.id),
          createdAt: Date.now()
        })
      }
      fetch("http://localhost:3000/likes", params)
        .then(span.innerText++)
    })
    const btnDel = document.createElement("button")
    btnDel.className = 'btn btn-danger'
    btnDel.innerText = "Delete"
    btnDel.addEventListener("click", () =>{
      fetch(`http://localhost:3000/quotes/${quote.id}`,{method: "DELETE"}).then(li.remove())
    })
    const btnEdit = document.createElement("button")
    btnEdit.className = 'btn btn-warning'
    btnEdit.innerText = "Edit"
    btnEdit.addEventListener("click", () => {
      bq.style.display = "none"
      let oldQuote = p.innerText
      let oldAuthor = f.innerText
      let editForm = document.createElement("form")
      let editedQuote = document.createElement("input")
      let editedAuthor = document.createElement("input")
      let editedSubmit = document.createElement("input")
      editedQuote.value = oldQuote
      editedQuote.className = "form-control"
      editedAuthor.className = "blockquote-footer"
      editedAuthor.value = oldAuthor
      editedSubmit.className = 'btn btn-warning'
      editedSubmit.type = "submit"
      editedSubmit.innerText = "submit"
      editForm.addEventListener("submit", (e) => {
        e.preventDefault()
        params ={
          method: "PATCH",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({
              quote: editedQuote.value,
              author: editedAuthor.value
          })
        }
        fetch(`http://localhost:3000/quotes/${quote.id}`, params)
          .then(resp => resp.json())
          .then(quote => {
            p.innerText = quote.quote
            f.innerText = quote.author
            editForm.remove()
            bq.style = ""
          })
      })
      editForm.append(editedQuote, editedAuthor, editedSubmit)
      li.append(editForm)

    })
    bq.append(p, f, br, btnLike, btnDel, btnEdit)
    li.append(bq)
    quoteList.append(li)
  }
})