/**!
 * KEditor - Kademi content editor
 * @copyright: Kademi (http://kademi.co)
 * @author: Kademi (http://kademi.co)
 * @version: 1.1.6
 * @dependencies: $, $.fn.draggable, $.fn.droppable, $.fn.sortable, Bootstrap (optional), FontAwesome (optional)
 */

(function ($) {
    var KEditor = $.keditor;
    var flog = KEditor.log;

    CKEDITOR.disableAutoInline = true;

    CKEDITOR.on('dialogDefinition', function (ev) {
        var dialogName = ev.data.name;
        var dialogDefinition = ev.data.definition;
        if (dialogName === 'table') {
            var addCssClass = dialogDefinition.getContents('advanced').get('advCSSClasses');
            addCssClass['default'] = 'table table_no-resize';
        }
        if (dialogName === 'link') {
            var addCssClass = dialogDefinition.getContents('advanced').get('advCSSClasses');
            addCssClass['default'] = 'link';
        }
    });

    CKEDITOR.on( 'instanceReady', function( evt ) {
        evt.editor.on( 'afterCommandExec', function( event ){
            if( event.data.name == 'enter' ) {
                var s = evt.editor.getSelection()
                if((s.getStartElement().getParent().$.localName=='ul' || s.getStartElement().getParent().$.localName=='ol') && s.getStartElement().$.localName=='li'){
                    s.getStartElement().addClass('list__item');
                }
            }
            if( event.data.name == 'bulletedlist' || event.data.name == 'numberedlist' ) {
                var s = evt.editor.getSelection();
                s.getStartElement().getParent().addClass('list');
                s.getStartElement().addClass('list__item');
            }
        }, null, null, 100);
    });

    // Text component
    // ---------------------------------------------------------------------
    KEditor.components['text'] = {

        options: {
            toolbar: [
                { name: 'document', groups: [ 'mode', 'document', 'doctools' ], items: [ 'Source'] },
                { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ], items: [ 'Bold', 'Italic', 'Underline', 'Strike'] },
                { name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ], items: [ 'NumberedList', 'BulletedList', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock',] },
                { name: 'links', items: [ 'Link', 'Unlink'] },
                { name: 'insert', items: [ 'Table'] },
                '/',
                { name: 'styles', items: [ 'Styles', 'Format', 'FontSize' ] },
                { name: 'colors', items: [ 'TextColor', 'BGColor' ] },
                { name: 'tools', items: [ 'Maximize', 'ShowBlocks' ] },
            ],

            toolbarGroups:[
                { name: 'document', groups: [ 'mode', 'document', 'doctools' ] },
                { name: 'editing', groups: [ 'find', 'selection', 'spellchecker' ] },
                { name: 'forms' },
                '/',
                { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
                { name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ] },
                { name: 'links' },
                { name: 'insert' },
                '/',
                { name: 'styles' },
                { name: 'colors' },
                { name: 'tools' },
            ],
            title: false,
            allowedContent: true, // DISABLES Advanced Content Filter. This is so templates with classes: allowed through
            bodyId: 'editor',
            templates_replaceContent: false,
            enterMode: 'P',
            forceEnterMode: true,
            format_tags: 'p;h1;h2;h3;h4;h5;h6',
            format_p :  {name:'Параграф', element : 'p', attributes : { 'class' : '' } },
            format_h1 : {name:'Заголовок1', element : 'h1', attributes : { 'class' : 'heading heading--1' } },
            format_h2 : {name:'Заголовок2', element : 'h2', attributes : { 'class' : 'heading heading--2' } },
            format_h3 : {name:'Заголовок3', element : 'h3', attributes : { 'class' : 'heading heading--3' } },
            format_h4 : {name:'Заголовок4', element : 'h4', attributes : { 'class' : 'heading heading--4' } },
            format_h5 : {name:'Заголовок5', element : 'h5', attributes : { 'class' : 'heading heading--5' } },
            format_h6 : {name:'Заголовок6', element : 'h6', attributes : { 'class' : 'heading heading--6' } },
            removePlugins: 'magicline',
            removeButtons: 'UploadImageButton,ImageUploadButton,UploadImage,Save,NewPage,Preview,Print,Templates,PasteText,PasteFromWord,Find,Replace,SelectAll,Scayt,Form,HiddenField,ImageButton,Button,Select,Textarea,TextField,Radio,Checkbox,Outdent,Indent,Blockquote,CreateDiv,Language,HorizontalRule,Smiley,SpecialChar,PageBreak,Iframe,Styles,BGColor,Maximize,About,ShowBlocks,BidiLtr,BidiRtl,Flash,Image,Subscript,Superscript,Anchor',
            minimumChangeMilliseconds: 100
        },

        init: function (contentArea, container, component, keditor) {
            flog('init "text" component', component);

            var self = this;
            var options = keditor.options;

            var componentContent = component.children('.keditor-component-content');
            componentContent.prop('contenteditable', true);

            componentContent.on('input', function (e) {
                if (typeof options.onComponentChanged === 'function') {
                    options.onComponentChanged.call(contentArea, e, component);
                }

                if (typeof options.onContainerChanged === 'function') {
                    options.onContainerChanged.call(contentArea, e, container);
                }

                if (typeof options.onContentChanged === 'function') {
                    options.onContentChanged.call(contentArea, e);
                }
            });

            var editor = componentContent.ckeditor(self.options).editor;
            editor.on('instanceReady', function () {
                flog('CKEditor is ready', component);

                if (typeof options.onComponentReady === 'function') {
                    options.onComponentReady.call(contentArea, component, editor);
                }
            });
            editor.on('dialogDefinition', function (ev) {
                var dialogName = ev.data.name;
                var dialogDefinition = ev.data.definition;

                console.log(dialogName);
                if (dialogName === 'table') {
                    var addCssClass = dialogDefinition.getContents('advanced').get('advCSSClasses');
                    addCssClass['default'] = 'table';
                }
                if (dialogName === 'th') {
                    var addCssClass = dialogDefinition.getContents('advanced').get('advCSSClasses');
                    addCssClass['default'] = 'table__th';
                }
                if (dialogName === 'tbody') {
                    var addCssClass = dialogDefinition.getContents('advanced').get('advCSSClasses');
                    addCssClass['default'] = 'table__body';
                }
                if (dialogName === 'tr') {
                    var addCssClass = dialogDefinition.getContents('advanced').get('advCSSClasses');
                    addCssClass['default'] = 'table__tr';
                }
                if (dialogName === 'td') {
                    var addCssClass = dialogDefinition.getContents('advanced').get('advCSSClasses');
                    addCssClass['default'] = 'table__td';
                }
            });

        },

        getContent: function (component, keditor) {
            flog('getContent "text" component', component);

            var componentContent = component.find('.keditor-component-content');
            var id = componentContent.attr('id');
            var editor = CKEDITOR.instances[id];
            if (editor) {
                return editor.getData();
            } else {
                return componentContent.html();
            }
        },

        destroy: function (component, keditor) {
            flog('destroy "text" component', component);

            var id = component.find('.keditor-component-content').attr('id');
            var editor = CKEDITOR.instances[id];
            if (editor) {
                editor.destroy();
            }
        }
    };

})(jQuery);
