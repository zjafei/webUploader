/**
 * User: Eric Ma
 * Date: 14-8-21
 * Time: 上午11:28
 */
define(function (require, exports, module) {
    require('modules/lib/webuploader/0.1.4r/css.css');
    var W = require('WebUploader');
//    var Create = function () {
//        this.support = WebUploader.Uploader.support();
//    };
//    Create.prototype = {
//        createUploader: function (o) {//创建实例化对象
//                return WebUploader.create(o);
//        }
//    };
//    module.exports = Create;
    if (W.Uploader.support()) {
        module.exports = function (o) {
            return W.create(o);
        };
    } else {
        throw new Error('WebUploader does not support the browser you are using.');
    }
})
;