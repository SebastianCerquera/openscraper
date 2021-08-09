
// TODO: https://www.facebook.com/marketplace/bogota/propertyforsale/


// https://www.facebook.com/groups/1asolucionesinmobiliarias
class FacebookListing extends InfiniteListing{
    
    constructor(extractor){
        super(extractor, 15*60*1000)
    }
     
    nextLink(){
        // Scrolls down below to get new posts
        if(this.entries.length > 0)
            $('html, body').animate({
                scrollTop: $(this.entries[this.entries.length - 1]).offset().top
            });

        // Updates the posts list
        this.feed = $("[data-pagelet='GroupFeed']")
        this.posts = this.feed.find(".du4w35lb.k4urcfbm.l9j0dhe7.sjgh65i0")
        this.links = this.posts.find("a").filter(function(i, e){
            if (e.href == null)
                return false

            return e.href.match("/commerce/listing/")
        })

        var i
        for(i = this.entries.length; i < this.links.length; i++)
            this.entries.push(this.links[i])

        // Checks if there are no more entries
        this.counter++
        if(this.counter >= this.entries.length)
            this.completed = true

        return this.entries[this.counter - 1].href
    }
    
}

class FacebookExtractor extends StompExtractor{

    constructor(queueName){
        super(queueName)
    }

    extract(element){
        var rigthPanel = $(".am9z0op8.j83agx80.o387gat7.datstx6m.l9j0dhe7.k4urcfbm.jr1d8bo4.dwxd3oue")
        var titledPanel = rigthPanel.find(".dati1w0a.qt6c0cv9.hv4rvrfc.discj3wi").find("span")
        
        super.extract(JSON.stringify({
            'title': titledPanel[0].innerText,
            'price': titledPanel[1].innerText,
            'initDate': titledPanel[4].innerText,
            'currentDate': new Date(),
            'link': window.location.href
        }))
    }
}


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

