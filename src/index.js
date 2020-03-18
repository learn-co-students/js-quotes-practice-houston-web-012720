const ul = document.querySelector("#quote-list") 
const select = document.querySelector("#filter-select")
const like_select = document.querySelector("#filter-like-select")
let authors 
let current_quotes 

const display = () => { 
    quotes = current_quotes
    let filter_quotes 
    select.innerHTML = ""

    authors = quotes.map(quote => quote.author)
    authors = authors.filter((author,index) => authors.indexOf(author) === index)

    const button = document.querySelector("#filter-btn")

    authors.unshift("")
    authors.forEach(author => {
        let option = document.createElement("option")
        option.innerText = author
        select.append(option)
    });

    button.addEventListener("click", () => {
        quotes = quotes.sort((a,b) => 
            a.likes.length > b.likes.length ? -1 
            :a.likes.length < b.likes.length ? 1
            : 0
        )
        ul.innerHTML = ""
        if(select.value != ""){
            filter_quotes = quotes.filter(quote => quote.author === select.value)
        }else{
            filter_quotes = quotes
        }
        if(like_select.value != "0"){
            filter_quotes = filter_quotes.slice(0,parseInt(like_select.value))
        }
        filter_quotes.forEach(quote => {
            add_more_quote(quote)
        });
    })
}

const add_more_quote = (quote) => {
    let edit_status = false
    let li = document.createElement("li")
    li.className = "quote-card"

    let blockquote = document.createElement("blockquote")
    blockquote.className = "blockquote"

    let p = document.createElement("p")
    p.className = "mb-0"
    p.innerText = quote.quote

    let footer = document.createElement("footer")
    footer.className = "blockquote-footer"
    footer.innerText = quote.author 

    let br = document.createElement("br")

    let like_btn = document.createElement("button")
    like_btn.className = "btn-success"
    like_btn.innerText = "Likes: "

    let span = document.createElement("span")
    span.innerText = quote.likes.length

    like_btn.append(span)
    
    like_btn.addEventListener("click",() => {
        let day = new Date()
        fetch("http://localhost:3000/likes",{
            method: "POST",
            headers: {
                "Content-Type":  "application/json"
            },
            body: JSON.stringify({
                quoteId: quote.id,
                createAt: day.getTime()
            })
        })
        .then(res => res.json())
        .then(new_like => {
            quote.likes.push(new_like)
            span.textContent = quote.likes.length
            dislike_span.textContent = quote.likes.length
        })
    })

    let dislike_btn = document.createElement("button")
    dislike_btn.className = "btn-success"
    dislike_btn.innerText = "Dislikes: "

    let dislike_span = document.createElement("span")
    dislike_span.innerText = quote.likes.length

    dislike_btn.append(dislike_span)

    dislike_btn.addEventListener("click" , () => {
        fetch(`http://localhost:3000/likes/${quote.likes[0].id}`,{
            method: "DELETE"
        })
        .then(res => res.json())
        .then(like_obj => {
            quote.likes.shift()
            span.textContent = quote.likes.length
            dislike_span.textContent = quote.likes.length
        })
    })

    let delete_btn = document.createElement("button")
    delete_btn.className = "btn-danger"
    delete_btn.innerText = "Delete"

    delete_btn.addEventListener("click", () => {
        fetch(`http://localhost:3000/quotes/${quote.id}`,{
            method: "DELETE"
        })
        .then(res => res.json())
        .then(quote => {
            li.remove()
            run_fetch()
        })
    })

    let edit_btn = document.createElement("button")
    edit_btn.className = "btn-success"
    edit_btn.innerText = "Edit"

    edit_btn.addEventListener("click", () => {
        edit_status = !edit_status
        edit_status ? edit_form.style.display = "block" : edit_form.style.display = "none"
    })

    let edit_form = document.createElement("form")
    edit_form.style.display = "none"
    
    let quote_div = document.createElement("div")
    quote_div.className = "from-group"

    let quote_label = document.createElement("quote_label")
    quote_label.innerText = "Quote"

    let quote_input = document.createElement("input")
    quote_input.name = "quote"
    quote_input.type = "text"
    quote_input.className = "form-control"
    quote_input.value = p.innerText

    quote_div.append(quote_label,quote_input)

    let author_div = document.createElement("div")
    author_div.className = "form-group"

    let author_label = document.createElement("label")
    author_label.innerText = "Author"

    let author_input = document.createElement("input")
    author_input.name = "author"
    author_input.type = "text"
    author_input.className = "form-control"
    author_input.value = footer.innerText

    author_div.append(author_label,author_input)

    let edit_quote_btn = document.createElement("button")
    edit_quote_btn.type = "submit"
    edit_quote_btn.className = "btn btn-primary"
    edit_quote_btn.innerText = "Edit Quote"

    edit_form.append(quote_div,author_div,edit_quote_btn)
    edit_form.addEventListener("submit",()=>{
        event.preventDefault()
        fetch(`http://localhost:3000/quotes/${quote.id}`,{
            method: "PATCH",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                quote: event.target[0].value,
                author: event.target[1].value
            })
        })
        .then(res => res.json())
        .then(update_qoute => {
            p.textContent = update_qoute.quote
            footer.textContent = update_qoute.author
            edit_form.style.display = "none"
            edit_status = !edit_status
            run_fetch()
        })
    })

    blockquote.append(p,footer,br,like_btn,dislike_btn,delete_btn,edit_btn,edit_form)
    li.append(blockquote)
    ul.append(li)
}

const form = document.querySelector("#new-quote-form")
form.addEventListener("submit",()=> {
    event.preventDefault()
    fetch("http://localhost:3000/quotes",{
        method: "POST",
        headers: {
            "Content-Type":  "application/json"
        },
        body: JSON.stringify({
            quote: form[0].value,
            author: form[1].value
        })
    })
    .then(res => res.json())
    .then(new_quote => {
        form.reset()
        run_fetch()
    })
})

const run_fetch = () => {
    fetch("http://localhost:3000/quotes?_embed=likes")
    .then(res => res.json())
    .then(quotes => {
        current_quotes = quotes
        display()
    })
}

run_fetch()