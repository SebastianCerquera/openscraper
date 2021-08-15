
var facebook = require('facebook')
var rabbit = require('rabbit')

console.log("Facebook scraper loaded")

$(document).ready(function () {
    if (window.location.pathname.match(/\/groups\/.+/)) {
          rabbit.rabbitClientBuilder("facebookLinks", function(){
              var scroll = new facebook.FacebookListing(new StompExtractor("facebookLinks"))
              scroll.traverse()
          })
    }
    else if (window.location.pathname.match(/\/commerce\/listing\/.+/)) {
          rabbit.rabbitClientBuilder("facebookPosts", function(){
              var post = new facebook.FacebookExtractor("facebookPosts")
              post.extract(null)
          })
    }
});


