
const utils = require('../../nodejs/utils.js')

describe('Scraper driver', () => {

    describe('CSV extractor', () => {
        var csvExtractor = null
        var outputFilename = "/tmp/test.csv"
        
        beforeEach(() => {
            var fs = {appendFile: function(){}}
            cy.stub(fs, 'appendFile').as("appendFileMock")
            csvExtractor = new utils.CsvExtractor(outputFilename, fs)
        })
        
        it('It writes the headers to the file', () => {
            expect(csvExtractor != null)
            cy.get("@appendFileMock").should("have.been.called")
        })

        it('It writes to the file everytime extract is called', () => {
            var message = {
                title: "a",
                price: "b",
                initDate: "c",
                currentDate: "d",
                link: "e"
            }

            // when: It is called to extract a message.
            csvExtractor.extract(message)
 
            cy.get("@appendFileMock").should("have.been.calledWith").then(($arg) => {
                expect($arg.args[0][0] == outputFilename)
                expect($arg.args[0][1] == "title|price|initDate|currentDate|link\n")

                expect($arg.args[1][0] == outputFilename)
                expect($arg.args[1][1] == `${message.title}|${message.price}|${message.initDate}|${message.currentDate}|${message.link}\n`)
            })
            
        })
    })
    
})
