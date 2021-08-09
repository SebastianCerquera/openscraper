
var rabbitClients = {};
var rabbitClientBuilder = function(nameQuot, callback){
    if(rabbitClients[nameQuot] != undefined) return rabbitClients[nameQuot];

    const client = new StompJs.Client( {
        brokerURL: 'ws://localhost:15674/ws',
        connectHeaders: {
            login: 'admin',
            passcode: 'admin'
        },
        debug: function ( str ) {},
        reconnectDelay: 1000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
    } );
    
    client.onConnect = function ( frame ) {
        if(callback != null) callback();
    };
    
    client.onStompError = function ( frame ) {
        console.log( "Ha ocurrido un error al intentar conectarse a la cola" );
    };
    
    client.activate( );

    rabbitClients[nameQuot] = client;

    return client;
}

class StompExtractor extends PostExtractor{

    constructor(queueName){
        super()
        this.queueName = queueName
    }
    
    extract(element){
        var client = rabbitClientBuilder(this.queueName)
        
        client.publish( {
            destination: '/queue/' + this.queueName,
            body: element,
            skipContentLengthHeader: true,
        });
        
        console.log("Message to queue: " + element)
    }
    
}
