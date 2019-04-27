import Parser from 'rss-parser'

// const CORS_PROXY = "https://cors-anywhere.herokuapp.com/"
// const CORS_PROXY = "https://crossorigin.me/"
const CORS_PROXY = "https://cors.io/?"
let items = []
let seenTitles = []
const bannedTitlePrefices = [
  'User:',
  'Talk:',
  'User talk:',
  'Draft:',
  'Template:',
  'Wikipedia:',
  'Wikipedia talk:'
]
const parser = new Parser({
  customFields: {
    item: [
      ['dc:creator', 'creator'],
    ]
  }
})

String.prototype.startsWithAnyOf = function(array){
  for(let item of array){
    if (this.startsWith(item)) {
      return true
    }
  }
  return false
}


let updateItems = function(){
  parser.parseURL(CORS_PROXY + "https://en.wikipedia.org/w/index.php?title=Special:RecentChanges&feed=rss", function(err, feed){
    if(typeof feed != 'undefined'){
      feed.items.forEach(function(item){
        const titleTime = item.title + item.pubDate
        if(!seenTitles.includes(titleTime)){
          if (!item.title.startsWithAnyOf(bannedTitlePrefices)) {
            items.push(item)
            seenTitles.push(titleTime)
          }
          else {
            console.log("Didn't add " + item.title)
          }
        }
      })
    } else {
      draw('Too many requests')
    }
  })
}

let draw = function(innerHTML){
  let element = document.createElement('div')
  element.className = "wiki-link"
  element.innerHTML = innerHTML
  element.style.position = "fixed"
  document.body.appendChild(element)
  element.style.left = Math.random() * (window.innerWidth - element.offsetWidth) + "px"
  element.style.top = Math.random() * (window.innerHeight - element.offsetHeight - 100) + "px"
  window.setTimeout(function(){
    element.remove()
  }, 10000)
}

let rssInterval = window.setInterval(function(){
  updateItems()
}, 30000)

let windowInterval = window.setInterval(function(){
  if(items.length > 0){
    let item = items.pop()
    let link = item.link
    draw(`<a href="${item.link}" target="_blank">${item.title}</a>`)
    console.log(items.length + " items in queue; seen " + seenTitles.length + " items.")
  }
}, 2000)

updateItems()
