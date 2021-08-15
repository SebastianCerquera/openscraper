
const openscraper = require('../extension/openscraper.js');

class CsvExtractor extends openscraper.PostExtractor {
    
    constructor(filename, fs){
        super()

        this.fs = fs
        this.filename = filename
        this.headers = ["title", "price", "initDate", "currentDate", "link"] 

        this.fs.appendFile(filename, this.headers.join("|") + "\n", function (e) {
            if (e) throw e;
        });
    }

    extract(message){
        var payload = `${message.title}|${message.price}|${message.initDate}|${message.currentDate}|${message.link}\n`
        this.fs.appendFile(this.filename, payload, function (e) {
            if (e) {
                console.log(e);
                throw e;
            }
        });
    }
    
}

(function(exports){
   exports.CsvExtractor = CsvExtractor
})(typeof exports === 'undefined'? this['utils']={}: exports);
