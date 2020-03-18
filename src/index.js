document.addEventListener('DOMContentLoaded',()=>{
const ul = document.querySelector('#quote-list')
const form = document.querySelector('#new-quote-form')


    fetch("http://localhost:3000/quotes?_embed=likes")
    .then(resp=> resp.json())
    .then(quotes => showQuotes(quotes))

    const showQuotes = (quotes)=>{
        quotes.forEach(quote=>{
           addQuote(quote)
        })
    }


    const addQuote = (quote) =>{   
        const li = document.createElement('li')
        li.className = 'quote-card'
        const bq = document.createElement('blockquote')
        bq.className = 'blockqote'
        const p = document.createElement('p')
        p.className = 'mb-0'
        p.innerText = quote.quote
        const footer = document.createElement('footer')
        footer.className = 'blockquote-footer'
        footer.innerText = quote.author
        const br = document.createElement('br')
        const button = document.createElement('button')
        button.className = 'btn-success'
        button.innerText = 'Likes:'
        button.addEventListener('click',()=>{
            fetch("http://localhost:3000/likes",{
                method:"POST",
                headers:{
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({
                    quoteId: quote.id
                })
            })
            .then(resp=> resp.json())
            .then(newLike=>{
                quote.likes.push(newLike)
                span.innerText = `${quote.likes.length}`
            })
        })
        const span = document.createElement('span')
        span.innerText = ` ${quote.likes.length}`
        const deleteBtn = document.createElement('button')
        deleteBtn.className = 'btn-danger'
        deleteBtn.innerText = 'Delete'

        deleteBtn.addEventListener('click',()=>{
            fetch("http://localhost:3000/quotes/"+quote.id,{
                method: "DELETE"
            })
            .then(resp => resp.json())
            .then(li.remove())
        })

        li.append(bq)
        button.append(span)
        bq.append(p,footer,br,button,deleteBtn)
        ul.append(li)

    }


    form.addEventListener('submit',()=>{
        event.preventDefault()
        const newQuote = document.querySelector('#new-quote').value
        const newAuthor = document.querySelector('#author').value
        fetch("http://localhost:3000/quotes",{
            method: "POST",
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                quote: newQuote,
                author: newAuthor

            })
        })
        .then(resp => resp.json())
        .then(quote =>{
            quote.likes = []
            addQuote(quote)
            form.reset()
         
        })
 
    })





});