const openscraper = require('../../extension/openscraper')

describe('Page listings', () => {

    describe('Base class', () => {
        it('The traverse should finish right away if there are no links', () => {
            // given
            var extractorStubName = "extractorStubName"
            
            // This tells the component that there are no links
            openscraper.PageListing.prototype.hasLinks = function(){
                return false
            }
            
            var extractor = new openscraper.PostExtractor()
            cy.stub(extractor, 'extract').as(extractorStubName)
            
            // when: 
            var pageListing = new openscraper.PageListing(extractor)
            pageListing.traverse()

            // then:
            cy.get("@" + extractorStubName).should('not.have.been.called')
        })

        
        it('The traverse should find only tow results and then complete', () => {
            // given
            var extractorStubName = "extractorStubName2"

            // This tells the component that there are no links
            var counter = 0
            openscraper.PageListing.prototype.hasLinks = function(){
                counter++
                if(counter < 3)
                    return true
                return false
            }
            
            openscraper.PageListing.prototype.nextLink = function(){
                return {}
            }
            
            var extractor = new openscraper.PostExtractor()
            cy.stub(extractor, 'extract').as(extractorStubName)
            
            // when: 
            var pageListing = new openscraper.PageListing(extractor)
            pageListing.traverse()

            // then:
            cy.get("@" + extractorStubName).should('have.been.calledTwice')
        })
    })
    
    describe('Infinite scroll', () => {
        var infiniteListing = null
        
        beforeEach(() => {
            infiniteListing = new openscraper.InfiniteListing(null, 1000)
        })
        
        it('Builds the listing, the completed state is false by default', () => {
            expect(infiniteListing != null)
            expect(infiniteListing.timeout == 1000)
            expect(infiniteListing.counter == 0)
            expect(!infiniteListing.completed)
        })
        
        it('hasLinks is false after completed', () => {
            expect(infiniteListing.hasLinks())

            infiniteListing.completed = true
            expect(!infiniteListing.hasLinks())
        })        
    })
    
})
