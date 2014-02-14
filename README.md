##ppverifier是什麼?
接入25pp(pp助手)使用的服務端的驗證模塊，接入方服務服務端向25pp服務端請求驗證的模塊，包括登錄驗證和充值驗證

##功能
###登錄驗證

```javascript verifyLogin
var PPVerifier = require('ppverifier')
var verifier = new PPVerifier(*ppPublicKeyFilePath*) //ppPublicKeyFilePath是25pp提供的公鑰的文件
verifier.verifyLogin(msg.token, function (err, res) {
    if (!!err) {
        logger.error('ppVerifier error: ', err)
    } else {
        if (res.status == 0) {
            // 驗證成功
        } else {
            // 驗證不成功 參考pp提供的文檔
        }
    }
})
```
如果驗證成功返回格式如下
```json
{
    "status": 0, 
    "username": "星际联盟123", 
    "userid": 22176975
}  
```
###充值驗證 verifyBill
order參數是pp服務器Post過來的數據轉換成的Object，格式如下
```json
{ order_id: '2014021400000000',
  billno: 'billno123456789',
  account: 'youraccount',
  amount: '30.00',
  status: '0',
  app_id: '8888',
  uuid: '',
  zone: '0',
  roleid: '0',
  sign: 'puOnKnJiD/eDlhT9PyOtxC5oZ8urWdVijxKXSrq4qkSSAvz51PQ0gkXBAQv/Jgd67NPIWcqDMr3vDL7PUQM8uOywbLtKdIOtp71khkdIADWhD8+N5P47HlSoGNi1GbHOL6WyVr7VjR1L4cUeiUMpURI62jjG4koKO2kOXiM8DxSK5vFDh9ybHgz1BEgIHnxdvgNTQw5YQZqFAZL8hgnaHIDQwGCtLMcJmE1qq7HDo8KeOU3/A6D1fkxPC6unt/7rF4hqVbi0H9gkGLlRBDQn9ZBjnmwSnc3ZbqlpPIFpOCfQOhTHlWwXJVVJWJ4rVJyh5Y/ERLWjnVAkYC/lgLjhIA==' }
```
如果您使用express做http服務器可以直接使用express的bodyPaser得到以上格式的數據
```javascript
verifier.verifyBill(order, function (err, result) {
    // result==true表示驗證成功
    // result==false表示驗證失敗
})
```

##注意問題
###pp助手的公鑰文件格式
公鑰文件內容必須

* 以`-----BEGIN PUBLIC KEY-----` 開始
* 以`-----END PUBLIC KEY-----` 結尾  
* 這是ppverifier使用的ursa模塊規定的

##关于作者
