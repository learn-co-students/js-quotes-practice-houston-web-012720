document.addEventListener('DOMContentLoaded', function() {

    fetch('http://localhost:3000/quotes?_embed=likes')
        .then(function(res) {
            return res.json()
        }).then(function(quotes) {
            showquotes(quotes)
        })

    function showquotes(quotes) {
        quotes.forEach(function(quote) {
            createquote(quote)
        })
    }

    function createquote(quote) {
        let ul = document.getElementById("quote-list")
        let li = document.createElement('li')
        li.className = "blockquote"
        let blockquote = document.createElement('blockquote')
        blockquote.className = "blockquote"
        let p = document.createElement('p')
        p.className = "mb-0"
        p.innerText = quote.quote
        let footer = document.createElement('footer')
        footer.className = "blockquote-footer"
        footer.innerText = quote.author
        let br = document.createElement('br')
        let btnedit = document.createElement('button')
        btnedit.className = 'btn-success'
        btnedit.innerText = "Edit"
        let clicked = false
        btnedit.addEventListener('click', function() {
            if (!clicked) {
                let form = document.createElement('form')
                let input1 = document.createElement('input')
                input1.value = quote.quote
                let input2 = document.createElement('input')
                input2.value = quote.author
                let submit = document.createElement('button')
                submit.innerText = "submit changes"
                form.addEventListener('submit', function(event) {
                    event.preventDefault()
                    let editedQ = event.target[0].value
                    let editedA = event.target[1].value
                    fetch(`http://localhost:3000/quotes/${quote.id}`, {
                        method: 'PATCH',
                        headers: { "Content-Type": "application/json", Accept: "application/json" },
                        body: JSON.stringify({
                            quote: editedQ,
                            author: editedA
                        })
                    }).then(function(res) {
                        return res.json()
                    }).then(function(editedQ) {
                        p.innerText = editedQ.quote
                        footer.innerText = editedQ.author
                        form.style = "display:none"
                        clicked = false
                    })

                })
                clicked = true

                form.append(input1, input2, submit)
                diveditform = document.createElement('div')
                diveditform.append(form)
                li.append(diveditform)
            }
        })
        let btnsu = document.createElement('button')
        btnsu.className = 'btn-success'
        btnsu.innerText = "Likes:"
        let span = document.createElement('span')

        let like = 0
        fetch(`http://localhost:3000/likes?quoteId=${quote.id}`)
            .then(function(res) {
                return res.json()
            }).then(function(newquoteli) {
                like = newquoteli.length
                span.innerText = like
                btnsu.append(span)

                btnsu.addEventListener('click', function() {
                    fetch('http://localhost:3000/likes', {
                        method: "POST",
                        headers: { "Content-Type": "application/json", Accept: "application/json" },
                        body: JSON.stringify({
                            quoteId: quote.id
                        })
                    }).then(function(res) {
                        return res.json()
                    }).then(function(object) {
                        span.innerText = (like += 1)
                    })
                })
                let btndan = document.createElement('button')
                btndan.className = 'btn-danger'
                btndan.innerText = "Delete"
                btndan.addEventListener('click', function() {
                    fetch(`http://localhost:3000/quotes/${quote.id}`, { method: 'DELETE' })
                        .then(function() {
                            li.remove()
                        })
                })
                blockquote.append(p, footer, br, btnsu, btndan, btnedit)
                li.append(blockquote)
                ul.append(li)
            })


        let sort = document.getElementById('sort')
        let sorted = false
        sort.addEventListener('click', function() {
            sorted = !sorted
            if (sorted) {
                ul
                debugger
            } else {

            }

        })
    }




    //form
    let form = document.getElementById("new-quote-form")
    form.addEventListener('submit', function(event) {
        event.preventDefault()
        let newq = event.target[0].value
        let author = event.target[1].value
        fetch('http://localhost:3000/quotes', {
            method: 'POST',
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({
                quote: newq,
                author: author
            })
        }).then(function(res) {
            return res.json()
        }).then(function(newqoute) {
            createquote(newqoute)
        })
    })







})