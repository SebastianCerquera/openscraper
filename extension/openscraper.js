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

    traverse(){
        setInterval(function(){
            if( this.hasLinks() ){
                this.extractor.extract(this.nextLink())
            }else{
                //TODO It is still missing to notify that there is no more content
            }    
        }.bind(this), this.throtling)
    }
    
    hasLinks(){
        throw "Unsupported operation"
    }
    
    nextLink(){
        throw "Unsupported operation"
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
        }, this.timeout)
        
        return !this.completed
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
