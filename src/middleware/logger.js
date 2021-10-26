const logger = ( req, res, next ) => {
    // this code executes BEFORE response is sent
    const receivedDate = new Date();
    console.log( 'request has been received at ' + receivedDate.toTimeString() );
    console.log("URL : " + req.path);
    // transfer control to the next middleware
    next();

    // this code executes AFTER response is sent
    const responseDate = new Date();
    console.log( 'response being sent at ' + responseDate.toTimeString() );

    console.log( 'milleseconds taken for processing this request = ', responseDate.getTime() - receivedDate.getTime() );
};

module.exports = logger;