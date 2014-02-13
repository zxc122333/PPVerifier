(function () {
    var ppverifier;
    var http = require('http');
//    var StructType = require('reified')
    var ursa = require('ursa')
    var fs = require('fs')

    ppverifier = (function () {
        function ppverifier(pub_key_path) {
            // 解密用的公鑰
            this.pub_key = fs.readFileSync(pub_key_path)
        }


        ppverifier.prototype.verifyLogin = function (data, cb) {
            if (Buffer.isBuffer(data)) {
                // TODO 二進制協議是舊格式的數據，等以後再考慮是否支持，第一版本先寫好json格式的
                // 二進制格式的數據
//                var token = StructType.CharType(16).typeDef('token');
//                var binaryLoginData = new StructType('binaryLoginData', {len: 'Uint32', command: 'Uint32', token_key: token})
//                var loginData = new binaryLoginData(data)
//                console.log(loginData.reify())
            } else if (typeof data == "string") {
                // json格式的數據
                var options = {
                    hostname: 'passport_i.25pp.com',
                    port: 8080,
                    path: '/index?tunnel-command=2852126756',
                    method: 'POST',
                    headers: {'Content-Length': 32}
                };
                var req = http.request(options, function (res) {
//                    res.setEncoding('hex');
                    res.on('data', function (chunk) {
                        console.log('Response: ' + chunk);
                        var result = JSON.parse("{" + chunk + "}")
                        cb(null, result)
                    });
                });

                // post the data
                req.write(data);
                req.on('error', function (e) {
                    console.log('problem with request: ' + e.message);
                    cb(e, null)
                });
                req.end();
            } else {
                cb(new Error('wrong token format'))
            }
        }


        ppverifier.prototype.verifyBill = function (data, cb) {
            // data是經過querystring.parse後的結果
            try {
                // 先base64 decode
                var decodeResult = (new Buffer(data.sign, 'base64'))
                console.log('decodeResult: ', decodeResult)
                // 再進行RSA解密
                var key = ursa.createPublicKey(this.pub_key);
                console.log(key.publicDecrypt(decodeResult).toString('utf8'))
                var decryptResult = JSON.parse(key.publicDecrypt(decodeResult).toString('utf8'));
//                data.sign_decrypted = decryptResult
                if (decryptResult.order_id != data.order_id || decryptResult.billno != data.billno ||
                    decryptResult.account != data.account || decryptResult.amount != data.amount ||
                    decryptResult.status != data.status || decryptResult.app_id != data.app_id)
                    cb(null, true)
                else
                    cb(null, false)
            } catch (e) {
                cb(e, false)
            }
        };
        return ppverifier;

    })();

    module.exports = ppverifier;

}).call(this);