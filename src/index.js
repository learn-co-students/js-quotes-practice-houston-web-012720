const ul = document.querySelector('#quote-list')
const form = document.querySelector('#new-quote-form')

// // {/* <li class='quote-card'>
//   <blockquote class="blockquote">
//     <p class="mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
//     <footer class="blockquote-footer">Someone famous</footer>
//     <br>
//     <button class='btn-success'>Likes: <span>0</span></button>
//     <button class='btn-danger'>Delete</button>
//   </blockquote>
// // </li> */}

fetch('http://localhost:3000/quotes?_embed=likes')

.then(res => res.json())
.then(quotes => {
    quotes.forEach(quote => makeQuote(quote))
})

function makeQuote(quote){

    const li = document.createElement('li')
    li.className = 'quote-card'

    const bq = document.createElement('blockquote')
    bq.className = 'blockquote'

    const p = document.createElement('p')
    p.className = 'mb-0'
    p.innerText = quote.quote 

    const footer = document.createElement('footer')
    footer.className = 'blockquote-footer'
    footer.innerText = quote.author

    const br = document.createElement('br')

    const likeBtn = document.createElement('button')
    likeBtn.className = 'btn-sucess'
    likeBtn.innerHTML = `likes: <span>${quote.likes.length}</span>`

    likeBtn.addEventListener('click', () =>{
        fetch('http://localhost:3000/likes', {
            method: 'POST',
            headers: {'Contend-Type': 'application/json'},
            body: JSON.stringify({
                quoteId: quote.id 
            })
        })
        .then(res => res.json())
        .then(newLike => {
            quote.likes.push(newLike)
            likeBtn.innerHTML = `likes: <span>${quote.likes.length}</span>`

        })
    })

    const delBtn = document.createElement('button')
    delBtn.className = 'btn-danger'
    delBtn.innerText = 'Delete'
    delBtn.addEventListener('click', () => {
        fetch('http://localhost:3000/quotes/' +quote.id, {
        method: 'DELETE'
        })
        .then(res => res.json())
        .then(noQuote => {
            li.remove()
        })
    })
     
    bq.append(p, footer, br, likeBtn, delBtn)
    li.append(bq)
    ul.append(li)

}

form.addEventListener('submit', () => {
    event.preventDefault()
    fetch('http://localhost:3000/quotes', {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({
            quote: event.target[0].value,
            author: event.target[1].value 
        })
    })
    .then(res => res.json())
    .then(newQuote => {
        newQuote.likes = []
        makeQuote(newQuote)
    })
})
