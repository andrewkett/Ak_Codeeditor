



document.observe("dom:loaded", function() {

    if (typeof WysiwygWidget != "undefined" && typeof WysiwygWidget.Widget  != "undefined") {
        WysiwygWidget.Widget.addMethods({
            updateContent: function(content) {
                if (this.wysiwygExists()) {
                    this.getWysiwyg().execCommand("mceInsertContent", false, content);
                } else {
                    if (eManager.getEditor(this.widgetTargetId)) {
                        eManager.getEditor(this.widgetTargetId).insert(content);
                    } else {
                        var textarea = document.getElementById(this.widgetTargetId);
                        updateElementAtCursor(textarea, content);
                    }
                    varienGlobalEvents.fireEvent('tinymceChange');
                }
            }
        });
    }


    if (typeof Variables != "undefined") {
        Variables.insertVariable = function(value){

            this.closeDialogWindow(this.dialogWindow);
            if (eManager.getEditor(this.textareaElementId)) {
                eManager.getEditor(this.textareaElementId).insert(value);
            } else {
                var textareaElm = $(this.textareaElementId);
                if (textareaElm) {
                    var scrollPos = textareaElm.scrollTop;
                    updateElementAtCursor(textareaElm, value);
                    textareaElm.focus();
                    textareaElm.scrollTop = scrollPos;
                    textareaElm = null;
                }
            }
            return;
        }
    }

    if (typeof Variables != "undefined") {

        Mediabrowser.addMethods({
            insert: function(event) {
                var div;
                if (event != undefined) {
                    div = Event.findElement(event, 'DIV');
                } else {
                    $$('div.selected').each(function (e) {
                        div = $(e.id);
                    });
                }
                if ($(div.id) == undefined) {
                    return false;
                }
                var targetEl = this.getTargetElement();
                if (! targetEl) {
                    alert("Target element not found for content update");
                    Windows.close('browser_window');
                    return;
                }

                var params = {filename:div.id, node:this.currentNode.id, store:this.storeId};

                if (targetEl.tagName.toLowerCase() == 'textarea') {
                    params.as_is = 1;
                }

                new Ajax.Request(this.onInsertUrl, {
                    parameters: params,
                    onSuccess: function(transport) {
                        try {
                            this.onAjaxSuccess(transport);
                            if (this.getMediaBrowserOpener()) {
                                self.blur();
                            }
                            Windows.close('browser_window');
                            if (targetEl.tagName.toLowerCase() == 'input') {
                                targetEl.value = transport.responseText;
                            } else {

                                if (eManager.getEditor(targetEl.id)) {
                                    eManager.getEditor(targetEl.id).insert(transport.responseText);
                                } else {
                                    updateElementAtCursor(targetEl, transport.responseText);
                                }

                                if (varienGlobalEvents) {
                                    varienGlobalEvents.fireEvent('tinymceChange');
                                }
                            }
                        } catch (e) {
                            alert(e.message);
                        }
                    }.bind(this)
                });
            }
        });
    }
    varienGlobalEvents

    /**
     * Allow HTML5 elements
     * http://alanstorm.com/magento_html5_tinymce
     */
    if(window.tinyMceWysiwygSetup)
    {
        tinyMceWysiwygSetup.prototype.originalGetSettings = tinyMceWysiwygSetup.prototype.getSettings;
        tinyMceWysiwygSetup.prototype.getSettings = function(mode)
        {
            var settings = this.originalGetSettings(mode);

            //add some html5 attributes to tinymce
            settings.extended_valid_elements = ''+
                'input[placeholder|accept|alt|checked|disabled|maxlength|name|readonly|size|src|type|value],'+
                'section[class|id],' +
                'article[class|id],';

            //this isn't working
            //settings.apply_source_formatting = true;

            return settings;
        }
    }
});

/*jshint browser:true, devel:true, prototypejs:true */
(function () {
    "use strict";

    var CodeEditor = window.CodeEditor = {}


    /**
     * @class List
     */
    CodeEditor.Manager = Class.create({

        /**
         * @constructor
         */
        initialize: function () {
            this.editors = [];
        },

        /**
         * Update list content
         *
         * @param {string} text
         */
        attachEditorToTextarea: function (elementId) {

            var textarea = $(elementId),
                editorId = elementId+"_editor";



            var pre = new Element('pre', {
                'class': 'codeeditor',
                'id': editorId,
                'type': 'text/javascript',
                'charset': 'utf-8'

            }).update(textarea.value)
              .setStyle({
                    height: '400px' //@todo make dynamic off height of text area textarea.getHeight()
                });

            textarea.insert ({'after': pre})
                .addClassName('codeeditor-enabled')
                    .setAttribute('data-editorid', editorId)
                    ;
            ace.require("ace/ext/language_tools");
            var editor = ace.edit(editorId);
            editor.setTheme("ace/theme/textmate");
            editor.setWrapBehavioursEnabled(true);
            editor.getSession().setMode("ace/mode/html");

            editor.setOptions({
                enableBasicAutocompletion: true,
                enableSnippets: true
            });


            editor.getSession().on("change", function(){
              textarea.value = editor.getSession().getValue();
            });

            this.editors[elementId] = editor;

        },

        /**
         *
         * @param elementId
         * @returns {*}
         */
        getEditor: function (elementId) {
            return this.editors[elementId];
        }
    });

})();

