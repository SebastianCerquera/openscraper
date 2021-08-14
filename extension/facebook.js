
// TODO: https://www.facebook.com/marketplace/bogota/propertyforsale/

var openscraper = require('./openscraper.js')
var rabbit = require('./rabbit.js')


// https://www.facebook.com/groups/1asolucionesinmobiliarias
class FacebookListing extends openscraper.InfiniteListing{
    
    constructor(extractor){
        super(extractor, 15*60*1000)
    }

    findElements(){
        var feed = $("[data-pagelet='GroupFeed']")
        return feed.find(".du4w35lb.k4urcfbm.l9j0dhe7.sjgh65i0")
    }
    
    elementsToLinks(elements){
        return elements.find("a").filter(function(i, e){
            if (e.href == null)
                return false

            return e.href.match("/commerce/listing/")
        })
    }
     
    nextLink(){
        var elements = this.findElements()
        
        // Updates the posts list
        var links = this.elementsToLinks(elements)
        
        // Scrolls down below to get new posts
        this.scrollToLast(elements)

        var i
        for(i = this.entries.length; i < links.length; i++)
            this.entries.push(links[i])

        // Checks if there are no more entries
        this.counter++
        if(this.counter >= this.entries.length)
            this.completed = true

        return this.entries[this.counter - 1].href
    }
    
}

class FacebookExtractor extends rabbit.StompExtractor{

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

(function(exports){
   exports.FacebookListing = FacebookListing
   exports.FacebookExtractor = FacebookExtractor
    
})(typeof exports === 'undefined'? this['facebook']={}: exports);
