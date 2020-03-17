
const QUOTES_URL = "http://localhost:3000/quotes?_embed=likes"

document.addEventListener("DOMContentLoaded", () => {

  const getQuotes = () => {
    fetch(QUOTES_URL)
      .then(res => res.json())
      .then(quotes => {
        quotes.map(quote => addQuote(quote))
      })
  }


  const form_submit = document.querySelector(".btn-primary")
  console.log(form_submit)
  form_submit.addEventListener("click", () => {
    event.preventDefault()
    console.log("pressed!")
    createQuote()
  })


  const createQuote = () => {
    const quote_input = document.querySelector("#new-quote")
    const author_input = document.querySelector("#author")

    fetch("http://localhost:3000/quotes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        "quote": quote_input.value,
        "author": author_input.value
      })
    })
      .then(res => res.json())
      .then(quote => {
        console.log("Created quote!")
        console.log(quote)
        addQuote(quote)
      })
      .catch(console.log("Failed to create quote!"))
  }


  const addQuote = (quote) => {
    const quote_list = document.querySelector("#quote-list")
    const quote_item = document.createElement("li")
    const quote_block = document.createElement("blockquote")
    const quote_title = document.createElement("p")
    const quote_author = document.createElement("footer")
    const like_btn = document.createElement("button")
    const delete_btn = document.createElement("button")

    quote_item.className = "quote-card"
    quote_block.className = "blockquote"
    quote_title.className = "mb-0"
    quote_author.className = "blockquote-footer"
    like_btn.className = "btn-success"
    delete_btn.className = "btn-danger"

    quote_title.innerText = quote.quote
    quote_author.innerText = quote.author
    like_btn.innerText = `Likes: ${quote.likes.length}`
    delete_btn.innerText = "Delete"

    var count = 0
    like_btn.addEventListener("click", () => {
      count++
      fetch("http://localhost:3000/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quoteId: quote.id,
          createdAt: Date.now()
        })
      })

      like_btn.innerText = `Likes: ${quote.likes.length+count}`
    })

    delete_btn.addEventListener("click", () => {
      quote_item.remove()
      fetch(`http://localhost:3000/quotes/${quote.id}`, { method: "DELETE" })
    })

    quote_list.append(quote_item)
    quote_item.append(quote_block)
    quote_block.append(quote_title)
    quote_block.append(quote_author)
    quote_block.append(like_btn)
    quote_block.append(delete_btn)
  }

  getQuotes()

})

