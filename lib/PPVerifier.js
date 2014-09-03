var http = require('http');
//var StructType = require('reified');
var NodeRSA = require('node-rsa')
var fs = require('fs')

function ppverifier(pub_key_path) {
    // 解密用的公鑰
    this.pub_key = fs.readFileSync(pub_key_path);
    this.RSA = new NodeRSA(this.pub_key);
}

ppverifier.prototype.verifyLogin = function (data, cb) {
    if (Buffer.isBuffer(data)) {
        // TODO 二進制協議是舊格式的數據，等以後再考慮是否支持，第一版本先寫好json格式的
        // 二進制格式的數據
        // var token = StructType.CharType(16).typeDef('token');
        // var binaryLoginData = new StructType('binaryLoginData', {len: 'Uint32', command: 'Uint32', token_key: token})
        // var loginData = new binaryLoginData(data)
        // console.log(loginData.reify())
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
            // res.setEncoding('hex');
            res.on('data', function (chunk) {
                var result = JSON.parse("{" + chunk + "}")
                cb(null, result)
            });
        });

        // post the data
        req.write(data);
        req.on('error', function (e) {
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
        // Node-RSA Takes Buffer object or base64 encoded string.
        var decryptResult = JSON.parse(this.RSA.decrypt(data.sign,'utf8'));
        // data.sign_decrypted = decryptResult
        if (decryptResult.order_id != data.order_id || decryptResult.billno != data.billno ||
            decryptResult.account != data.account || decryptResult.amount != data.amount ||
            decryptResult.status != data.status || decryptResult.app_id != data.app_id)
            cb(null, false)
        else
            cb(null, true)
    } catch (e) {
        cb(e, false)
    }
};

module.exports = ppverifier;