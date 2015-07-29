/**
 * User: Eric Ma
 * Date: 14-9-11
 * Time: 下午4:56
 */
define(function (require, exports, module) {
    require('modules/lib/webUploader/factory/Upload/U3/css.css');
    var U2 = require('modules/lib/webUploader/factory/Upload/U2/js');
    $('link[href*="modules/lib/webUploader/factory/Upload/U2/css.css"]').remove();
    function U3(o) {
        this.dom = {
            content: $('body'),
            dnd: $('<div class="wu_file_dnd"></div>'),
            pickId: $('<div class="wu_file_pick_id"></div>'),
            pickMore: $('<div class="wu_file_pick_more"></div>'),
            fileListMask: $('<div class="wu_file_list_mask"></div>'),
            fileList: $('<ul class="wu_file_list"></ul>'),
            introduction: $('<span class="wu_introduction"></span>'),
            fileStatusBar: $('<div class="wu_file_status_bar"></div>'),
            uploadBtn: $('<div class="wu_file_upload_btn">开始上传</div>')
        };
        this.changeSettings(o);
    }

    U3.__super__ = U2.prototype;
    $.extend(true, U3.prototype, U2.prototype, {
        domStructure: function () {
            this.dom.fileStatusBar.append(this.dom.uploadBtn);
            this.dom.fileStatusBar.append(this.dom.pickMore);
            this.dom.dnd.append(this.dom.pickId);
            this.dom.dnd.append(this.dom.introduction);
            this.dom.content.append(this.dom.dnd);
            this.dom.fileListMask.append(this.dom.fileList);
            this.dom.content.append(this.base.domHide(this.dom.fileListMask));
            this.dom.content.append(this.base.domHide(this.dom.fileStatusBar));
        },
        create: function () {
            this.superCreare = U3.__super__.create;
            this.superCreare();
            this.dom.introduction.html('或将文件拖到这里，单次最多可选' + this.base.settings.fileNumLimit + '个文件');
            this.base.settings.dnd = this.dom.dnd;
        },
        fileQueued: function (file) {
            if (this.base.fileCount === 1) {
                this.addButton();
                this.base.domHide(this.dom.dnd);
                this.base.domShow(this.dom.fileListMask);
                this.base.domShow(this.dom.fileStatusBar);
                this.base.domShow(this.dom.uploadBtn);
                this.base.domShow(this.dom.pickMore);
            }
        },
        fileDequeued: function (file) {
            if (this.base.fileCount === 0) {
                this.base.domShow(this.dom.dnd);
                this.base.domHide(this.dom.fileListMask);
                this.base.domHide(this.dom.fileStatusBar);
            }
        }
    });
    module.exports = U3;
});