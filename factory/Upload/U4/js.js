/**
 * User: Eric Ma
 * Date: 14-9-11
 * Time: 下午4:56
 */
define(function (require, exports, module) {
    require('modules/lib/webUploader/factory/Upload/U4/css.css');
    var U3 = require('modules/lib/webUploader/factory/Upload/U3/js');
    $('link[href*="modules/lib/webUploader/factory/Upload/U3/css.css"]').remove();
    function U4(o) {
        this.dom = {
            content: $('body'),
            dnd: $('<div class="wu_file_dnd"></div>'),
            pickId: $('<div class="wu_file_pick_id"></div>'),
            pickMore: $('<div class="wu_file_pick_more"></div>'),
            fileListMask: $('<div class="wu_file_list_mask"></div>'),
            fileList: $('<ul class="wu_file_list"></ul>'),
            introduction: $('<span class="wu_introduction"></span>'),
            info: $('<span class="wu_info"></span>'),
            progress: $('<span class="wu_file_progress"></span>'),
            progressTxt: $('<span class="wu_file_progress_txt"></span>'),
            progressContent: $('<span class="wu_file_progress_content"></span>'),
            fileStatusBar: $('<div class="wu_file_status_bar"></div>'),
            uploadBtn: $('<div class="wu_file_upload_btn">开始上传</div>')
        };
        this.changeSettings(o);
    }

    U4.__super__ = U3.prototype;
    $.extend(true, U4.prototype, U3.prototype, {
        domStructure: function () {
            this.dom.progress.append(this.dom.progressContent);
            this.dom.progress.append(this.dom.progressTxt);
            this.dom.fileStatusBar.append(this.dom.info.html('ok'));
            this.dom.fileStatusBar.append(this.dom.progress);
            this.dom.fileStatusBar.append(this.dom.uploadBtn);
            this.dom.fileStatusBar.append(this.dom.pickMore);
            this.dom.dnd.append(this.dom.pickId);
            this.dom.dnd.append(this.dom.introduction);
            this.dom.content.append(this.dom.dnd);
            this.dom.fileListMask.append(this.dom.fileList);
            this.dom.content.append(this.base.domHide(this.dom.fileListMask));
            this.dom.content.append(this.base.domHide(this.dom.fileStatusBar));
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
            this.dom.info.html('选中' + this.base.fileCount + '个文件，共' + this.base.formatSize(this.base.filesSize, 2, ['B', 'K', 'M', 'G', 'T']) + '。');
        },
        fileDequeued: function (file) {
            if (this.base.fileCount === 0) {
                this.base.domShow(this.dom.dnd);
                this.base.domHide(this.dom.fileListMask);
                this.base.domHide(this.dom.fileStatusBar);
            }
            this.dom.info.html('选中' + this.base.fileCount + '个文件，共' + this.base.formatSize(this.base.filesSize, 2, ['B', 'K', 'M', 'G', 'T']) + '。');
        },
        startUpload: function () {
            this.dom.progress.show();
            this.base.domHide(this.dom.uploadBtn);
            this.base.domHide(this.dom.pickMore);
            this.base.domHide(this.dom.info);
        },
        uploadProgress: function (file, percentage) {
            this.dom.progressTxt.text(this.base.percent + '%');
            this.dom.progressContent.css({'width': this.base.percent + '%'});
        }
    });
    module.exports = U4;
});