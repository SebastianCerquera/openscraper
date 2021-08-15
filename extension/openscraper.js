/*

Content listing:

Pagination and Scrolling

*/

class PageListing {
    
    constructor(extractor){
        this.throtling = 2000
        this.entries = []
        this.extractor = extractor
    }
 
    elementsToLinks(elements){
        throw "Unsupported operation"
    }

    traverse(){
        var extractor = this.extractor
        var hasLinks = this.hasLinks.bind(this)
        var tearDown = this.tearDown.bind(this)
        var nextLinks = this.nextLinks.bind(this)
        this.loop = setInterval(function(){
            if( hasLinks() ){
                nextLinks().forEach(function(link){
                    extractor.extract.call(extractor, link)
                })
            }else{
                tearDown()
            }    
        }, this.throtling)
    }
    
    scrollToLast(elements){
        throw "Unsupported operation"
    }
    
    hasLinks(){
        throw "Unsupported operation"
    }
    
    nextLinks(){
        throw "Unsupported operation"
    }
    
    findElements(){
        throw "Unsupported operation"
    }

    tearDown(){
        clearInterval(this.loop)
    }
    
}

class InfiniteListing extends PageListing{
    
    constructor(extractor, timeout){
        super(extractor)
        
        this.timeout = timeout
        this.completed = false
        this.counter = 0
    }
    
    hasLinks(){ 
        var size = this.entries.length

        setTimeout(function(){
            if(size == this.entries.length)
                this.completed = true
        }.bind(this), this.timeout)
        
        return !this.completed
    }

    scrollToLast(elements){
        if(elements == null || elements.length == 0)
            return
        
        var vierportWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
        var viewportHeight = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)

        var last = elements[elements.length - 1]
        var bounds = last.getBoundingClientRect()

        window.scrollTo(bounds.left, bounds.top)
    }
}

class PaginationListing extends PageListing{
    
    hasLinks(){
        return false
    }    
}

/*

  Content extraction

  Distributed processing

*/

class PostExtractor {
    
    extract(element){
        throw "Unsupported operation"
    }
    
}

(function(exports){
   exports.PageListing = PageListing
   exports.InfiniteListing = InfiniteListing
   exports.PostExtractor = PostExtractor
    
})(typeof exports === 'undefined'? this['openscraper']={}: exports);
