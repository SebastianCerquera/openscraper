// -*- coding: utf-8 -*-
const amqp = require('amqplib/callback_api');
const CDP = require('chrome-remote-interface');
const fs = require('fs');

const openscraper = require('../extension/openscraper.js');

class CsvExtractor extends openscraper.PostExtractor {
    
    constructor(filename){
        super()
        
        this.filename = filename
        this.headers = ["title", "price", "initDate", "currentDate", "link"] 

        fs.appendFile(filename, this.headers.join("|") + "\n", function (e) {
            if (e) throw e;
        });
    }

    extract(message){
        var payload = `${message.title}|${message.price}|${message.initDate}|${message.currentDate}|${message.link}\n`
        fs.appendFile(this.filename, payload, function (e) {
            if (e) {
                console.log(e);
                throw e;
            }
        });
    }
    
}

class Driver {
    
    constructor(extractor, queueEndpoint, urlsQueue, contentQueue, filename){
        this.extractor = extractor
        this.queueEndpoint = queueEndpoint
        this.urlsQueue = urlsQueue
        this.contentQueue = contentQueue
        this.filename = filename

        this.proccessed = new Set()
        this.proccessing = []
        this.initializeDriver()
    }

    initializeQueue(endpoint, queueName, callback){
        amqp.connect(endpoint, function (connError, connection) {
            connection.createChannel(function (channError, channel) {
                channel.assertQueue(queueName, {
                    durable: true
                });
                channel.prefetch(1);
                channel.consume(queueName, function (message) {
                    callback(message.content.toString())
                    channel.ack(message);
                }, {
                    noAck: false
                });
            });
        });
    }

    initializeDriver(){
        var driver = this

        this.initializeQueue(this.queueEndpoint, this.urlsQueue, this.extractContent.bind(this))
        
        this.initializeQueue(this.queueEndpoint, this.contentQueue, this.saveContent.bind(this))

        setInterval(function(){
            var next = this.proccessing.pop()
            if(next){
                this.openNewTab(next);
            }
        }.bind(this), 100)
    }

    async openNewTab(url){
        var tab = await CDP.New();
        var client = await CDP({ tab });
        var { Page } = client;
        await Page.enable();
        await Page.navigate({ url });
        await Page.loadEventFired();
        await new Promise(resolve => setTimeout(resolve, 3000));
        await CDP.Close({ id: tab.id })
    }

    extractContent(message){
        //TODO Handle null case
        var url = message.split("?")[0]
        
        if(!this.proccessed.has(url)){
            this.proccessing.push(url)
            this.proccessed.add(url)
        }
    }

    saveContent(message){
        this.extractor.extract(JSON.parse(message))
    }

    handleTermination(message){
        if (message == "FINISH")
            process.exit(0)
    }

}

var rabbitEndpoint = "amqp://admin:admin@localhost"
var resultsFilename = "/tmp/refactor-results.csv"
var driver = new Driver(
    new CsvExtractor(
        resultsFilename
    ),
    rabbitEndpoint,
    "facebookLinks",
    "facebookPosts",
    resultsFilename
)
