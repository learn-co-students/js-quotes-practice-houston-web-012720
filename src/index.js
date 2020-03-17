const QUOTES_URL = "http://localhost:3000/quotes?_embed=likes"
const QUOTES_BASE_URL = "http://localhost:3000/quotes"
const LIKE_ME_URL = "http://localhost:3000/likes"

document.addEventListener("DOMContentLoaded", () => {

    let quoteList = document.querySelector("#quote-list")
    let quoteForm = document.querySelector("form")

    fetch(QUOTES_URL)
    .then(res => res.json())
    .then(quotesInfo => quotesInfo.forEach(quote => addQuoteCard(quote)))

    function addQuoteCard(quote){
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

        let likeBtn = document.createElement("button")
        likeBtn.className = "btn-success"
        if(quote.likes){
            likeBtn.innerHTML = `Likes: <span>${quote.likes.length}</span>`
        }
        else {
            likeBtn.innerHTML = "Likes: <span>0</span>"
        }
        
        likeBtn.addEventListener("click", () => {
            fetch(LIKE_ME_URL, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    quoteId: parseInt(quote.id)
                })
            })
            // .then(res => res.json)
            // .then(likeBtn.innerHTML = `Likes: <span>${quote.likes.length +=1}</span>`)
            .then(fetch(QUOTES_BASE_URL+'/'+quote.id+"?_embed=likes")
                .then(res => res.json())
                .then(quoteRes => likeBtn.innerHTML = `Likes: <span>${quoteRes.likes.length}</span>`)

            )

        })

        let deleteBtn = document.createElement("button")
        deleteBtn.className = "btn-danger"
        deleteBtn.innerHTML = "Delete"
        deleteBtn.addEventListener("click", () => {
            fetch(QUOTES_BASE_URL + "/" + quote.id, {
                method: "DELETE"
            })
            .then(li.remove())
        })

        blockquote.append(p, footer, br, likeBtn, deleteBtn)
        li.append(blockquote)
        quoteList.append(li)
    }

    quoteForm.addEventListener("submit", () => {

        event.preventDefault()
        fetch(QUOTES_BASE_URL, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                quote: quoteForm[0].value,
                author: quoteForm[1].value
            })
        })
        .then(res => res.json())
        .then(quoteInfo => addQuoteCard(quoteInfo))
        .then(quoteForm.reset())

    })

})


// {/* <li class='quote-card'>
//   <blockquote class="blockquote">
//     <p class="mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
//     <footer class="blockquote-footer">Someone famous</footer>
//     <br>
//     <button class='btn-success'>Likes: <span>0</span></button>
//     <button class='btn-danger'>Delete</button>
//   </blockquote>
// </li> */}