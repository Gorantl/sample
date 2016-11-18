/**
 * Created by Dheeraj on 22/08/16.
 */




module.exports = {
    "config": {
        //"daApi": "http://daapi.willu.com",
        "daApi": "http://localhost:9000",
        "seckey": {
            "signature": "aiowqmczvei*er2wuz",
            "cryptPass": "d6F3Efeqafljuwsmjxm",
            "algorithm": "aes-256-ctr"
        }
    },
    "operation": "createEmailToken",
    "payload": {
        "email":"aar@selt.com"
    }

};