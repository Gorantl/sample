/**
 * Created by Dheeraj on 31/03/16.
 */


module.exports = {
    "config": {
        //"daApi": "http://daapi.willu.com",
        "daApi": "https://daapi.cortexbox.com",
        "seckey": {
            "signature": "aiowqmczvei*er2wuz",
            "cryptPass": "d6F3Efeqafljuwsmjxm",
            "algorithm": "aes-256-ctr"
        }
    },
    operation: 'createToken',
    payload: {
        username: '+919600172158',
        verificationCode: '409286',
        grant_type: 'password',
        pageId: undefined
    }

};