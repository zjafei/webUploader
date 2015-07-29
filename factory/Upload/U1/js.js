/**
 * User: Eric Ma
 * Date: 14-9-11
 * Time: 下午4:56
 */
define(function (require, exports, module) {
    require('modules/lib/webUploader/factory/Upload/U1/css.css');
    function U1(o) {
        this.dom =  {
            content: $('body'),
            pickId: $('<div class="wu_file_pick_id"></div>'),
            fileListMask: $('<div class="wu_file_list_mask"></div>'),
            fileList: $('<ul class="wu_file_list"></ul>'),
            uploadBtn: $('<div class="wu_file_upload_btn">上传</div>')
        };
        this.changeSettings(o);
    }

    U1.prototype = {
        changeSettings: function (o) {
            if (typeof o === 'object') {
                $.extend(true, this, o);
            }
        },
        domStructure: function () {
            this.dom.fileListMask.append(this.dom.fileList);
            this.dom.content.append(this.dom.pickId);
            this.dom.content.append(this.base.domHide(this.dom.fileListMask));
            this.dom.content.append(this.base.domHide(this.dom.uploadBtn));
        },
        create: function () {
            var myThis = this;
            this.domStructure();
            this.base.settings.pick.id = this.dom.pickId;
            if (!this.base.settings.auto) {
                this.dom.uploadBtn.on('click', function () {
                    if (myThis.base.state === 'ready') {
                        myThis.base.webUploader.upload();
                    }
                });
            }
        },
        fileQueued: function (file) {
            if (this.base.fileCount === 1) {
                this.base.domHide(this.dom.pickId);
                this.base.domShow(this.dom.fileListMask);
                this.base.domShow(this.dom.uploadBtn);
            }
        },
        fileDequeued: function (file) {
            if (this.base.fileCount === 0) {
                this.base.domShow(this.dom.pickId);
                this.base.domHide(this.dom.fileListMask);
                this.base.domHide(this.dom.uploadBtn);
            }
        },
        startUpload: function () {
            this.base.domHide(this.dom.uploadBtn);
        },
        uploadFinished: function () {
            this.base.domShow(this.dom.pickId);
        }
    };
    module.exports = U1;
});