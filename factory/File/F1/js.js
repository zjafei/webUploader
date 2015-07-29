/**
 * User: Eric Ma
 * Date: 14-9-11
 * Time: 下午5:22
 */
define(function (require, exports, module) {
    require('modules/lib/webUploader/factory/File/F1/css.css');

    function F1(o) {
        this.list = {};
        if (typeof o === 'object') {
            $.extend(true, this, o);
        }
        this.changeSettings(o);
    }

    F1.prototype = {
        dom: {
            content: $('<li class="wu_file_content"></li>'),
            title: $('<span class="wu_file_title"></span>'),
            info: $('<span class="wu_file_info"></span>'),
            del: $('<span class="wu_file_del"></span>'),
            progress: $('<span class="wu_file_progress"></span>'),
            progressContent: $('<span class="wu_file_progress_content"></span>')
        },
        changeSettings: function (o) {
            if (typeof o === 'object') {
                $.extend(true, this, o);
            }
        },
        cloneDom: function (id) {
            this.list[id] = {};
            for (var i in this.dom) {
                this.list[id][i] = this.dom[i].clone();
            }
        },
        domStructure: function (file) {
            this.list[file.id].content.append(this.list[file.id].del);
            this.list[file.id].content.append(this.list[file.id].title.html(file.name));
            this.list[file.id].content.append(this.list[file.id].info.html(this.base.formatSize(file.size, 2, ['B', 'K', 'M', 'G', 'T'])));
            this.list[file.id].progress.append(this.list[file.id].progressContent);
            this.list[file.id].content.append(this.list[file.id].progress);
        },
        create: function (file) {
            var myThis = this;
            this.cloneDom(file.id);
            this.domStructure(file);


            this.list[file.id].del.click(function () {
                myThis.list[file.id].content.remove();
            });
            this.base.upload.dom.fileList.append(this.list[file.id].content);
        },
        fileQueued: function (file) {
            this.create(file);
        },
        uploadProgress: function (file, percentage) {
            this.list[file.id].progressContent.css('width', percentage * 100 + '%');
        },
        cur: {
            progress: function (file) {
                if (this.base.file.list[file.id]) {
                    this.base.file.list[file.id].progress.show();
                    this.base.file.list[file.id].title.hide();
                    this.base.file.list[file.id].info.hide();
                    this.base.file.list[file.id].del.hide();
                }
            },
            complete: function (file) {
                if (this.base.file.list[file.id]) {
                    this.base.file.list[file.id].status = 'complete';
                    this.base.file.list[file.id].progress.hide();
                    this.base.file.list[file.id].title.show();
                    this.base.file.list[file.id].info.show();
                }
                this.base.file.list[file.id].del.show();
            }
        },
        prev: {}
    };
    module.exports = F1;
});