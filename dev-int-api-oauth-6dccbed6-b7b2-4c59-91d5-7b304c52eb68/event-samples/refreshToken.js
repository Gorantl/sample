/**
 * Created by Dheeraj on 22/08/16.
 */

module.exports = {
    "config": {
        "daApi": "http://localhost:9000",
        "seckey": {
            "signature": "aiowqmczvei*er2wuz",
            "cryptPass": "d6F3Efeqafljuwsmjxm",
            "algorithm": "aes-256-ctr"
        }
    },
    "operation": "refreshToken",
    "payload": {
        "refresh_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiMTg5N2MxYTgyNjAxZDBlYmVhMjgxODg1MjMwODgwYTU1YzY1OTk0MmViYjA0YWE4ZWZmZjEyOTA2MWMwN2M3MTQzIiwiaWF0IjoxNDcxODUzMzk2LCJleHAiOjE0NzM2NTMzOTZ9.O2sxBpsGRNUOeg-WMBHHBum-q6w9I1JcOG8V4_RosCk",
        "grant_type": "refresh_token"
    }

};

