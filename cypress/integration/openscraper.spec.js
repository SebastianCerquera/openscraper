const openscraper = require('../../extension/openscraper')

describe('Pagination listings: ', () => {

    var infiniteListing = null
    
    beforeEach(() => {
        cy.visit('http://localhost:9090/app/')
        
        infiniteListing = new openscraper.InfiniteListing(null, 1000)
    })
    
    it('scrolls down up to the end of the page', () => {
        cy.window().then((win) => {
            win.scrollTo(5000, 5000)    
        })
        
        expect(infiniteListing != null)
    })
})
