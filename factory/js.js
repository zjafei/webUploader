/**
 * User: Eric Ma
 * Date: 14-8-20
 * Time: 上午8:32
 */
/**
 * @author Eric MA
 * @description 不同上传类型的工厂函数
 * @param {WebUploaderGlobalSet} webUploaderGlobalSet  全局设置对象
 * @param {File} file  FLASH输出的File对象
 * @param {String} fileDomType  选择输出的fileDom对象
 */
define(function (require, exports, module) {
    require('modules/lib/webUploader/0.1.4r/webuploader.css');
    var W = require('WebUploader'),
        B = require('modules/lib/webUploader/factory/Base/js');
    module.exports = function (c) {
        var css = '';
        if (typeof c.css === 'string') {
            css = c.css;
        }
        var r = {uploader: null};
        require.async([css], function () {
            if (W.Uploader.support()) {
                var b = new B();
                b.changeSettings(c);
                r.uploader = W.create(b.settings);
                b.events(r.uploader);
            } else {
                throw new Error('WebUploader does not support the browser you are using.');
            }
        });
        return r;
    };
});