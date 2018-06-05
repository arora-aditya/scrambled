var express = require('express');
var router = express.Router();
var my_lzma = require("lzma");

/* GET api routes listing. */
router.get('/', function(req, res, next) {

    var compress_me = req.query.compressString;
    var compression_mode = 9;

    /// First, let's compress it.
    my_lzma.compress(compress_me, compression_mode, function (result) {
        ///NOTE: LZMA-JS returns a regular JavaScript array. You can turn it into a buffer like so.
        console.log("Compressed: ", new Buffer(result));
        /// Now, let's try to decompress it to make sure it works both ways.
        my_lzma.decompress(result, function (result) {
            console.log("Decompressed: " + result);
        }, function (percent) {
            /// Decompressing progress code goes here.
            console.log("Decompressing: " + (percent * 100) + "%");
        });
    }, function (percent) {
        /// Compressing progress code goes here.
        console.log("Compressing: " + (percent * 100) + "%");
    }, function (result) {
        res.send(result);
    });
});

module.exports = router;
