/**
 * User: Eric Ma
 * Date: 14-9-11
 * Time: 下午5:22
 */
define(function (require, exports, module) {
    require('modules/lib/webUploader/factory/File/F2/css.css');
    var F1 = require('modules/lib/webUploader/factory/File/F1/js');
    $('link[href*="modules/lib/webUploader/factory/File/F1/css.css"]').remove();
    function F2(o) {
        this.list = {};
        this.changeSettings(o);
    }

    F2.__super__ = F1.prototype;
    $.extend(true, F2.prototype, F1.prototype, {
        dom: {
            content: $('<li class="wu_file_content"></li>'),
            wrap: $('<span class="wu_file_wrap"></span>'),
            panel: $('<span class="wu_file_panel"></span>'),
            del: $('<span class="wu_file_del"></span>'),
            size: $('<span class="wu_file_size"></span>'),
//            left: $('<span class="wu_file_left"></span>'),
//            right: $('<span class="wu_file_right"></span>'),
            info: $('<span class="wu_file_info"></span>'),
            progress: $('<span class="wu_file_progress"></span>'),
            progressContent: $('<span class="wu_file_progress_content"></span>')
        },
        domStructure: function (file) {
            this.list[file.id].panel.append(this.list[file.id].del);
            this.list[file.id].panel.append(this.list[file.id].size.html(this.base.formatSize(file.size, 2, ['B', 'K', 'M', 'G', 'T'])));
//            this.list[file.id].panel.append(this.list[file.id].left);
//            this.list[file.id].panel.append(this.list[file.id].right);
            this.list[file.id].content.attr('title', file.name).append(this.list[file.id].panel);
            this.list[file.id].content.append(this.list[file.id].wrap);
            this.list[file.id].content.append(this.list[file.id].info);
            this.list[file.id].progress.append(this.list[file.id].progressContent);
            this.list[file.id].content.append(this.list[file.id].progress);
        },
        create: function (file) {
            var myThis = this;

            this.cloneDom(file.id);
            this.domStructure(file);

            this.list[file.id].content.on('mouseenter', function () {
                myThis.list[file.id].panel.stop().animate({height: 30}, 150);
            });

            this.list[file.id].content.on('mouseleave', function () {
                myThis.list[file.id].panel.stop().animate({height: 0}, 150);
            });

            this.list[file.id].del.on('click', function () {
                if (myThis.list[file.id].status === 'complete') {
                    myThis.base.fileCount -= 1;
                    if (myThis.base.fileCount === 0) {
                        myThis.base.upload.fileDequeued();
                    }
                }
                myThis.base.webUploader.removeFile(file);
                myThis.list[file.id].content.remove();
                delete myThis.list[file.id];
            });

//            this.list[file.id].left.on('click', function () {
//                file.rotation += 90;
//                myThis.rotation(file);
//            });
//            this.list[file.id].right.on('click', function () {
//                file.rotation -= 90;
//                myThis.rotation(file);
//            });

            if (file.getStatus() !== 'invalid') {
                this.base.webUploader.makeThumb(file, function (error, src) {
                    myThis.list[file.id].wrap.html($('<img src="' + src + '" alt="' + file.name + '"/>'));
                });
                //file.rotation = 0;
            }
            this.base.upload.dom.fileList.append(myThis.list[file.id].content);
        },
        fileQueued: function (file) {
            this.create(file);
        },
//        rotation: function (file) {
//            var myThis = this;
//            if (myThis.base.supportTransition) {
//                var deg = 'rotate(' + file.rotation + 'deg)';
//                myThis.list[file.id].wrap.css({
//                    '-webkit-transform': deg,
//                    '-mos-transform': deg,
//                    '-o-transform': deg,
//                    'transform': deg
//                });
//            } else {
//                myThis.list[file.id].wrap.css('filter', 'progid:DXImageTransform.Microsoft.BasicImage(rotation=' + (~~((file.rotation / 90) % 4 + 4) % 4) + ')');
//            }
//        },
        cur: {
            progress: function (file) {
                this.base.file.list[file.id].progress.show();
                this.base.file.list[file.id].panel.hide();
            },
            complete: function (file) {
                this.base.file.list[file.id].status = 'complete';
                this.base.file.list[file.id].info.show();
                this.base.file.list[file.id].progress.hide();
            }
        }
    });
    module.exports = F2;
})
;