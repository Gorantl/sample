
module.exports = function (config) {

    if (config) {
        process.env['daApi'] = config.daApi;
        process.env['signature'] = config.seckey.signature;
        process.env['cryptPass'] = config.seckey.cryptPass;
        process.env['algorithm'] = config.seckey.algorithm;
        process.env['stage'] = config.stage;

    }
    var result = {
        ctxDa: {
            url: process.env['daApi']
        },
        stage : process.env['stage'],
        seckey: {
            signature: process.env['signature'],
            cryptPass: process.env['cryptPass'],
            algorithm: process.env['algorithm']
        }
    };

    return result;
};


