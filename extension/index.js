
console.log("Facebook scraper loaded")

$(document).ready(function () {
    if (window.location.pathname.match(/\/groups\/.+/)) {
          rabbitClientBuilder("facebookLinks", function(){
              var scroll = new FacebookListing(new StompExtractor("facebookLinks"))
              scroll.traverse()
          })
    }
    else if (window.location.pathname.match(/\/commerce\/listing\/.+/)) {
          rabbitClientBuilder("facebookPosts", function(){
              var post = new FacebookExtractor("facebookPosts")
              post.extract(null)
          })
    }
});
