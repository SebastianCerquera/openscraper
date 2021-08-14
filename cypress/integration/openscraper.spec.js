const openscraper = require('../../extension/openscraper')

describe('Pagination listings: ', () => {

    var infiniteListing = null
    
    beforeEach(() => {
        infiniteListing = new openscraper.InfiniteListing(null, 1000)
    })
    
    it('scrolls down up to the end of the page', () => {
        expect(infiniteListing != null)
    })
})
