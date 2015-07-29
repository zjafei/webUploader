/**
 * User: Eric Ma
 * Date: 14-9-11
 * Time: 下午4:56
 */
define(function (require, exports, module) {
    require('modules/lib/webUploader/factory/Upload/U2/css.css');
    var U1 = require('modules/lib/webUploader/factory/Upload/U1/js');
    $('link[href*="modules/lib/webUploader/factory/Upload/U1/css.css"]').remove();

    function U2(o) {
        this.dom = {
            content: $('body'),
            pickId: $('<div class="wu_file_pick_id"></div>'),
            pickMore: $('<div class="wu_file_pick_more"></div>'),
            fileListMask: $('<div class="wu_file_list_mask"></div>'),
            fileList: $('<ul class="wu_file_list"></ul>'),
            fileStatusBar: $('<div class="wu_file_status_bar"></div>'),
            uploadBtn: $('<div class="wu_file_upload_btn">开始上传</div>')
        };
        this.changeSettings(o);
    }

    U2.__super__ = U1.prototype;
    $.extend(true, U2.prototype, U1.prototype, {
        domStructure: function () {
            this.dom.fileListMask.append(this.dom.fileList);
            this.dom.content.append(this.base.domHide(this.dom.fileListMask));
            this.dom.fileStatusBar.append(this.base.domHide(this.dom.uploadBtn));
            this.dom.fileStatusBar.append(this.base.domHide(this.dom.pickMore));
            this.dom.fileStatusBar.append(this.dom.pickId);
            this.dom.content.append(this.dom.fileStatusBar);
        },
        addButton: function () {
            if (this.dom.pickMore.html() === '') {
                this.base.webUploader.addButton({
                    id: this.dom.pickMore,
                    innerHTML: '选择文件'
                });
            }
        },
        fileQueued: function (file) {
            if (this.base.fileCount === 1) {
                this.addButton();
                this.base.domHide(this.dom.pickId);
                this.base.domShow(this.dom.pickMore);
                this.base.domShow(this.dom.fileListMask);
                this.base.domShow(this.dom.uploadBtn);
            }
        },
        fileDequeued: function (file) {
            if (this.base.fileCount === 0) {
                this.base.domShow(this.dom.pickId);
                this.base.domHide(this.dom.pickMore);
                this.base.domHide(this.dom.fileListMask);
                this.base.domHide(this.dom.uploadBtn);
            }
        },
        startUpload: function () {
            this.base.domHide(this.dom.uploadBtn);
            this.base.domHide(this.dom.pickMore);
        }
    });
    module.exports = U2;
});