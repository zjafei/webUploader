/**
 * User: Eric Ma
 * Date: 14-8-28
 * Time: 上午10:15
 */
define(function (require, exports, module) {
    function Base() {
        var myThis = this;
        /**
         * @description 全局控制
         */
        this.fileCount = 0;
        this.filesSize = 0;// 添加的文件总大小
        this.percent = 0;// 上传百分比
        this.state = 'pedding';// pedding, ready, uploading, confirm, done.
        this.percentages = {};// 每个文件的进度信息，key为file id
        this.sizeUnit = 1024 * 1024;//文件大小的单位

        this.upload = {};
        this.file = {
            cur: {
                base: myThis,
                error: function (file) {
                    myThis.percentages[file.id][1] = 1;
                },
                invalid: function (file) {
                    myThis.percentages[file.id][1] = 1;
                },
                queued: function (file) {
                    myThis.percentages[file.id][1] = 0;
                }
            }
        };
        this.error = {};
        /**
         * @description 默认配置
         */
        this.settings = {
            //swf: STATIC_PATH+'modules/webUploader/0.1.5r/Uploader.swf',
            swf: 'http://127.0.0.1/static/modules/lib/webUploader/0.1.5r/Uploader.swf',
            disableGlobalDnd: true,
            //paste: document.body,
            prepareNextFile: true,
            chunked: false,
            fileVal: 'Filedata',
            thumb: {
                allowMagnify: false,
                crop: false,
                width: 100 * myThis.retina,
                height: 100 * myThis.retina
            },
            pick: {
                innerHTML: '点击添加文件'
            },
            compress: {
                width: 1600,
                height: 1600,
                allowMagnify: false,
                crop: false,
                preserveHeaders: true,
                noCompressIfLarger: false
            },
            auto: false,
            fileNumLimit: 1,
            duplicate: false,
            formData: {
                watermark: '1'
            }
        };
    }

    Base.prototype = {
        retina: window.devicePixelRatio || 1,
        /**
         * @description 是否支持filter
         */
        supportFilter: (function () {
        })(),
        /**
         * @description 是否支持动画
         */
        supportTransition: (function () {
            var s = document.createElement('p').style,
                r = 'transition' in s ||
                    'WebkitTransition' in s ||
                    'MozTransition' in s ||
                    'msTransition' in s ||
                    'OTransition' in s;
            s = null;
            return r;
        })(),
        /**
         * @description webUploader 对象的各种状态
         */
        events: function (webUploader) {
            var myThis = this;
            this.webUploader = webUploader;

            //阻止此事件可以拒绝某些类型的文件拖入进来。目前只有 chrome 提供这样的 API，且只能通过 mime-type 验证。
            webUploader.on('dndAccept', function (items) {
                if (typeof myThis.upload.dndAccept === 'function') {
                    myThis.upload.dndAccept(items);
                }
                if (typeof myThis.file.dndAccept === 'function') {
                    myThis.file.dndAccept(items);
                }
            });


            //当文件被加入队列之前触发
            webUploader.on('beforeFileQueued', function (file) {

                if (typeof myThis.upload.beforeFileQueued === 'function') {
                    myThis.upload.beforeFileQueued(file);
                }
                if (typeof myThis.file.beforeFileQueued === 'function') {
                    myThis.file.beforeFileQueued(file);
                }
            });

            //当文件被加入队列以后触发
            webUploader.on('fileQueued', function (file) {
                file.name = myThis.guid(file.name + '|');
                myThis.fileCount = this.getStats().queueNum;
                myThis.filesSize += file.size;
                myThis.percentages[file.id] = [file.size, 0];
                myThis.updateTotalProgress();
                myThis.state = 'ready';

                if (typeof myThis.upload.fileQueued === 'function') {
                    myThis.upload.fileQueued(file);
                }
                if (typeof myThis.file.fileQueued === 'function') {
                    myThis.file.fileQueued(file);
                }

                // 文件发生状态改变
                file.on('statuschange', function (cur, prev) {
                    if (typeof myThis.file.cur[cur] === 'function') {
                        myThis.file.cur[cur](this);
                    }
                    if (typeof myThis.file.prev[prev] === 'function') {
                        myThis.file.prev[prev](this);
                    }
                });
            });

            //当一批文件添加进队列以后触发
            webUploader.on('filesQueued', function (files) {
                if (typeof myThis.upload.filesQueued === 'function') {
                    myThis.upload.filesQueued(files);
                }
                if (typeof myThis.file.filesQueued === 'function') {
                    myThis.file.filesQueued(files);
                }
                myThis.showError();
            });

            //当文件被移除队列后触发
            webUploader.on('fileDequeued', function (file) {
                myThis.fileCount = this.getStats().queueNum;
                myThis.filesSize -= file.size;
                delete myThis.percentages[file.id];
                myThis.updateTotalProgress();

                if (myThis.fileCount === 0) {
                    myThis.state = 'pedding';
                }

                if (typeof myThis.upload.fileDequeued === 'function') {
                    myThis.upload.fileDequeued(file);
                }
                if (typeof myThis.file.fileDequeued === 'function') {
                    myThis.file.fileDequeued(file);
                }
            });

            //当 uploader 被重置的时候触发
            webUploader.on('reset', function () {
                if (typeof myThis.upload.reset === 'function') {
                    myThis.upload.reset();
                }
                if (typeof myThis.file.reset === 'function') {
                    myThis.file.reset();
                }
            });

            //当开始上传流程时触发
            webUploader.on('startUpload', function () {
                myThis.state = 'uploading';
                if (typeof myThis.upload.startUpload === 'function') {
                    myThis.upload.startUpload();
                }
                if (typeof myThis.file.startUpload === 'function') {
                    myThis.file.startUpload();
                }
            });

            //当开始上传流程暂停时触发
            webUploader.on('stopUpload', function () {
                myThis.state = 'paused';
                if (typeof myThis.upload.stopUpload === 'function') {
                    myThis.upload.stopUpload();
                }
                if (typeof myThis.file.stopUpload === 'function') {
                    myThis.file.stopUpload();
                }
            });

            //当所有文件上传结束时触发
            webUploader.on('uploadFinished', function () {
                myThis.state = 'confirm';
                myThis.filesSize = 0;
                myThis.percent = 0;
                myThis.percentages = {};
                this.reset();
                if (typeof myThis.upload.uploadFinished === 'function') {
                    myThis.upload.uploadFinished();
                }
                if (typeof myThis.file.uploadFinished === 'function') {
                    myThis.file.uploadFinished();
                }
            });

            //某个文件开始上传前触发 一个文件只会触发一次
            webUploader.on('uploadStart', function (file) {
                if (typeof myThis.upload.uploadStart === 'function') {
                    myThis.upload.uploadStart(file);
                }
                if (typeof myThis.file.uploadStart === 'function') {
                    myThis.file.uploadStart(file);
                }
            });

            //当某个文件的分块在发送前触发
            webUploader.on('uploadBeforeSend', function (object, data, headers) {
                if (typeof myThis.upload.uploadBeforeSend === 'function') {
                    myThis.upload.uploadBeforeSend(object, data, headers);
                }
                if (typeof myThis.file.uploadBeforeSend === 'function') {
                    myThis.file.uploadBeforeSend(object, data, headers);
                }
            });

            //当某个文件上传到服务端响应后
            webUploader.on('uploadAccept', function (file, ret) {
                if (typeof myThis.upload.uploadAccept === 'function') {
                    myThis.upload.uploadAccept(file, ret);
                }
                if (typeof myThis.file.uploadAccept === 'function') {
                    myThis.file.uploadAccept(file, ret);
                }
            });

            //上传过程中触发 携带上传进度
            webUploader.on('uploadProgress', function (file, percentage) {
                myThis.percentages[file.id][1] = percentage;
                myThis.updateTotalProgress();
                if (typeof myThis.upload.uploadProgress === 'function') {
                    myThis.upload.uploadProgress(file, percentage);
                }
                if (typeof myThis.file.uploadProgress === 'function') {
                    myThis.file.uploadProgress(file, percentage);
                }
            });

            //当文件上传出错时触发
            webUploader.on('uploadError', function (file, reason) {
                if (typeof myThis.upload.uploadError === 'function') {
                    myThis.upload.uploadError(file, reason);
                }
                if (typeof myThis.file.uploadError === 'function') {
                    myThis.file.uploadError(file, reason);
                }
            });

            //当文件上传成功时触发
            webUploader.on('uploadSuccess', function (file, response) {
                if (typeof myThis.upload.uploadSuccess === 'function') {
                    myThis.upload.uploadSuccess(file, response);
                }
                if (typeof myThis.file.uploadSuccess === 'function') {
                    myThis.file.uploadSuccess(file, response);
                }
            });

            //不管成功或者失败 文件上传完成时触发
            webUploader.on('uploadComplete', function (file) {
                if (typeof myThis.upload.uploadComplete === 'function') {
                    myThis.upload.uploadComplete(file);
                }
                if (typeof myThis.file.uploadComplete === 'function') {
                    myThis.file.uploadComplete(file);
                }
            });

            //当validate不通过时
            webUploader.on('error', function (type) {
                var errorTxt = myThis.errorText(type);
                if (errorTxt !== '') {
                    myThis.error[type] = errorTxt;
                }
                if (typeof myThis.upload.error === 'function') {
                    myThis.upload.error(type);
                }
                if (typeof myThis.file.error === 'function') {
                    myThis.file.error(type);
                }
            });
        },
        /**
         * @description 修改默认配置
         */
        changeSettings: function (c) {
            if (typeof c.options.server === 'string' && c.options.server != '') {
                $.extend(true, this.upload, c.upload);
                $.extend(true, this.file, c.file);

                this.upload.base = this;
                this.file.base = this;


                if (typeof c.skin === 'string' && c.skin !== '') {
                    this.upload.dom.content.addClass(c.skin);
                }

                //继承外部配置
                $.extend(true, this.settings, c.options);

                //error的回调函数
                if (typeof c.error === 'object') {
                    this.error = c.error;
                }

                //如果文件列表是1那么就禁止多选
                this.settings.pick.multiple = !(this.settings.fileNumLimit === 1);

                //设置缩略图的大小
                this.setThumbSize(c.options.thumb, this.settings.thumb, this.retina);

                //设置裁剪图片的大小
                if (typeof  c.options.compress !== 'undefined' && typeof c.options.compress.compressSize === 'number' && c.options.compress.compressSize > 1) {
                    this.settings.compress.compressSize = parseInt(c.options.compress.compressSize) * this.sizeUnit;
                } else {
                    this.settings.compress.compressSize = this.sizeUnit;
                }

                //设置单个文件上传大小 单位为M
                if (typeof c.options.fileSingleSizeLimit === 'number' && c.options.fileSingleSizeLimit >= 1) {
                    this.settings.fileSingleSizeLimit = parseInt(c.options.fileSingleSizeLimit) * this.sizeUnit;
                } else {
                    this.settings.fileSingleSizeLimit = 2 * this.sizeUnit;
                }

                //如果没有正确设定总上传大小 或者总上传大小比单个文件上传还小
                if (typeof c.options.fileSizeLimit !== 'number' || c.options.fileSizeLimit < c.options.fileSingleSizeLimit) {
                    this.settings.fileSizeLimit = this.settings.fileSingleSizeLimit * this.settings.fileNumLimit;
                } else {
                    this.settings.fileSizeLimit = parseInt(c.options.fileSizeLimit) * this.sizeUnit;
                }

                if (!this.domFromSelector(this.upload.dom.pickId)) {
                    this.upload.create();
                }

            } else {
                throw new Error('server url');
            }
        },
        /**
         * @description 设置缩略图的大小
         */
        setThumbSize: function (o, s, r) {
            for (var i in o) {
                if (typeof o[i] === 'number' && o[i] > 0) {
                    s[i] = parseInt(o[i]) * r;
                }
            }
        },
        /**
         * @description 格式化错误信息
         */
        errorText: function (code) {
            var text = code;
            switch (code) {
                case 'Q_EXCEED_NUM_LIMIT':
                    text = '最多上传' + this.settings.fileNumLimit + '个文件';
                    break;
                case 'Q_EXCEED_SIZE_LIMIT':
                    text = '文件总大小超过' + (this.settings.fileSizeLimit / 1024 / 1024) + 'M';
                    break;
                case 'F_EXCEED_SIZE':
                    text = '有文件大小超过' + (this.settings.fileSingleSizeLimit / 1024 / 1024) + 'M';
                    break;
                case 'Q_TYPE_DENIED':
                    text = '错误的文件类型';
                    //text = '';
                    break;
                case'F_DUPLICATE':
                    //text = '文件已存在';
                    text = '';
                    break;
                case 'exceed_size':
                    text = '文件大小超过' + (this.settings.fileSingleSizeLimit / 1024 / 1024) + 'M';
                    break;
                case 'interrupt':
                    //text = '上传暂停';
                    text = '';
                    break;
                case 'error ':
                    //text = '上传失败，请重试';
                    text = '';
                    break;
                default :
            }
            return text;
        },
        /**
         * @description 计算上传总进度
         */
        updateTotalProgress: function () {
            var loaded = 0;
            $.each(this.percentages, function (k, v) {
                loaded += v[0] * v[1];
            });
            this.percent = Math.round((this.filesSize ? loaded / this.filesSize : 0) * 100);
        },
        /**
         * @description 构造函数的继承
         */
        inherits: function (a, b, c) {
            a.__super__ = b.prototype;
            $.extend(true, a.prototype, b.prototype);
            if (typeof c === 'object') {
                $.extend(true, a.prototype, c);
            }
        },
        /**
         * @description 元素的隐藏 直接用 display:none会使Flash出错
         */
        domHide: function (d) {
            d.addClass('webuploader-element-invisible');
            return d;
        },
        /**
         * @description 元素的显示
         */
        domShow: function (d) {
            d.removeClass('webuploader-element-invisible');
            return d;
        },
        domFromSelector: function (d) {
            return (d.selector !== '' && d.length > 0);
        },
        // 显示错误
        showError: function () {
            var s = '';
            for (var i in  this.error) {
                s += this.error[i] + ' '
            }
            if (s !== '') {
                alert(s);
            }
            this.error = {};
        },
        /**
         * 生成唯一的ID
         * @method guid
         * @grammar Base.guid() => String
         * @grammar Base.guid( prefx ) => String
         */
        guid: (function () {
            var counter = 0;

            return function (prefix) {
                var guid = (+new Date()).toString(32),
                    i = 0;

                for (; i < 5; i++) {
                    guid += Math.floor(Math.random() * 65535).toString(32);
                }

                return (prefix || 'wu_') + guid + (counter++).toString(32);
            };
        })(),
        /**
         * 格式化文件大小, 输出成带单位的字符串
         */
        formatSize: function (size, pointLength, units) {
            var unit;
            units = units || ['B', 'K', 'M', 'G', 'TB'];
            while ((unit = units.shift()) && size > 1024) {
                size = size / 1024;
            }
            return (unit === 'B' ? size : size.toFixed(pointLength || 2)) + unit;
        }
    };
    module.exports = Base;
});