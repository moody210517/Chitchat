(function ($) {
	'use strict';
	var readFileIntoDataUrl = function (fileInfo) {
		var loader = $.Deferred(),
			fReader = new FileReader();
		fReader.onload = function (e) {
			loader.resolve(e.target.result);
		};
		fReader.onerror = loader.reject;
		fReader.onprogress = loader.notify;
		fReader.readAsDataURL(fileInfo);
		return loader.promise();
	};
	$.fn.cleanHtml = function () {
		var html = $(this).html();
		return html && html.replace(/(<br>|\s|<div><br><\/div>|&nbsp;)*$/, '');
	};
	$.fn.wysiwyg = function (userOptions) {
		var editor = this,
			selectedRange,
			options,
			toolbarBtnSelector,
			updateToolbar = function () {
                if(!editor.is(':focus'))return;
				if (options.activeToolbarClass) {
					$(options.toolbarSelector).find(toolbarBtnSelector).each(function () {
						var command = $(this).data(options.commandRole);
						if (document.queryCommandState(command)) {
							$(this).addClass(options.activeToolbarClass);
						} else {
							$(this).removeClass(options.activeToolbarClass);
						}
					});
				}
			},
			execCommand = function (commandWithArgs, valueArg) {
				var commandArr = commandWithArgs.split(' '),
					command = commandArr.shift(),
					args = commandArr.join(' ') + (valueArg || '');
				document.execCommand(command, 0, args);
				updateToolbar();
			},
			bindHotkeys = function (hotKeys) {
				$.each(hotKeys, function (hotkey, command) {
					editor.keydown(hotkey, function (e) {
						if (editor.attr('contenteditable') && editor.is(':visible')) {
							e.preventDefault();
							e.stopPropagation();
							execCommand(command);
						}
					}).keyup(hotkey, function (e) {
						if (editor.attr('contenteditable') && editor.is(':visible')) {
							e.preventDefault();
							e.stopPropagation();
						}
					});
				});
			},
			getCurrentRange = function () {
				var sel = window.getSelection();
				if (sel.getRangeAt && sel.rangeCount) {
					return sel.getRangeAt(0);
				}
			},
			saveSelection = function () {
				selectedRange = getCurrentRange();
			},
			restoreSelection = function () {
				var selection = window.getSelection();
				if (selectedRange) {
					try {
						selection.removeAllRanges();
					} catch (ex) {
						document.body.createTextRange().select();
						document.selection.empty();
					}
					selection.addRange(selectedRange);
				}
                return selection.toString();
			},
            getSelectedText = function () {
                return window.getSelection().toString();
            },
            getSelectionBoundaryElement = function(isStart) {
                var range, sel, container;
                if (document.selection) {
                    range = document.selection.createRange();
                    range.collapse(isStart);
                    return range.parentElement();
                } else {
                    sel = window.getSelection();
                    if (sel.getRangeAt) {
                        if (sel.rangeCount > 0) {
                            range = sel.getRangeAt(0);
                        }
                    } else {
                        // Old WebKit
                        range = document.createRange();
                        range.setStart(sel.anchorNode, sel.anchorOffset);
                        range.setEnd(sel.focusNode, sel.focusOffset);

                        // Handle the case when the selection was selected backwards (from the end to the start in the document)
                        if (range.collapsed !== sel.isCollapsed) {
                            range.setStart(sel.focusNode, sel.focusOffset);
                            range.setEnd(sel.anchorNode, sel.anchorOffset);
                        }
                    }

                    if (range) {
                        container = range[isStart ? "startContainer" : "endContainer"];

                        // Check if the container is a text node and return its parent if so
                        return container.nodeType === 3 ? container.parentNode : container;
                    }
                }
            },
			insertFiles = function (files) {
				editor.focus();
				$.each(files, function (idx, fileInfo) {
					if (/^image\//.test(fileInfo.type)) {
						$.when(readFileIntoDataUrl(fileInfo)).done(function (dataUrl) {
							execCommand('insertimage', dataUrl);
						}).fail(function (e) {
							options.fileUploadError("file-reader", e);
						});

					} else {
						options.fileUploadError("unsupported-file-type", fileInfo.type);
					}
				});
			},
			markSelection = function (input, color) {
				restoreSelection();
				if (document.queryCommandSupported('hiliteColor')) {
					document.execCommand('hiliteColor', 0, color || 'transparent');
				}
				saveSelection();
				input.data(options.selectionMarker, color);
			},
			bindToolbar = function (toolbar, options) {
				toolbar.find(toolbarBtnSelector).click(function (e) {
					var selectedText=restoreSelection(), $el=$(this);
                    if ($el.data(options.commandRole+'Selected')&&!selectedText) {
                        return;
                    }
					editor.focus();
                    var command=$el.data(options.commandRole);
					execCommand(command);
                    if ($el.data(options.commandRole+'Toggle')) {
                        var command1=$el.data(options.commandRole+'Param1'),
                            command2=$el.data(options.commandRole+'Param2'),
                            parent=getSelectionBoundaryElement(),
                            $parent=$(parent);
                        if (parent&&$parent[0]) {
                            if (command == command2) {
                                if (editor.find('font')[0]!=$parent[0]&&!$parent.prev('hr')[0]) {
                                    $parent.before('<hr>');
                                }
                            } else {
                                $parent.prev('hr').remove()
                            }
                        }
                        if(command==command1){
                            command=command2;
                        }else{
                            command=command1;
                        }
                        $el.data(options.commandRole, command).attr('data-'+options.commandRole, command);
                        $el.toggleClass('enabled');

                    } else if (command=='unlink') {
                        $('.hyperlink_remove').addClass('to_hide');
                        $('.hyperlink_creat').removeClass('to_hide');
                    }
                    saveSelection();
				});
				toolbar.find('[data-toggle=dropdown]').click(restoreSelection);

				toolbar.find('input[type=text][data-' + options.commandRole + ']').on('webkitspeechchange change', function () {
					var $el=$(this), newValue = this.value; /* ugly but prevents fake double-calls due to selection restoration */
					this.value = '';
					restoreSelection();
					if (newValue) {
						editor.focus();
                        var command=$el.data(options.commandRole);
						execCommand(command, newValue);
                        if (command=='createLink') {
                            $('.hyperlink_remove').removeClass('to_hide');
                            $('.hyperlink_creat').addClass('to_hide');
                        }
					}
					saveSelection();
				}).on('focus', function () {
					var input = $(this);
					if (!input.data(options.selectionMarker)) {
						markSelection(input, options.selectionColor);
						input.focus();
					}
				}).on('blur', function () {
					var input = $(this);
					if (input.data(options.selectionMarker)) {
						markSelection(input, false);
					}
				});
				toolbar.find('input[type=file][data-' + options.commandRole + ']').change(function () {
					restoreSelection();
					if (this.type === 'file' && this.files && this.files.length > 0) {
						insertFiles(this.files);
					}
					saveSelection();
					this.value = '';
				});
			},
			initFileDrops = function () {
				editor.on('dragenter dragover', false)
					.on('drop', function (e) {
						var dataTransfer = e.originalEvent.dataTransfer;
						e.stopPropagation();
						e.preventDefault();
						if (dataTransfer && dataTransfer.files && dataTransfer.files.length > 0) {
							insertFiles(dataTransfer.files);
						}
					});
			},
            setControls = function(){
                if(!editor.is(':focus'))return;
                if (getSelectedText()) {
                    var parent=getSelectionBoundaryElement(),$parent=$(parent);
                    $('[data-edit-selected]').each(function(){
                        var $el=$(this);
                        if($el.is('.hyperlink_creat')&&$parent.is('a')){
                            $('.hyperlink_remove').removeClass('to_hide');
                            $('.hyperlink_creat').addClass('to_hide');
                        }
                    }).removeClass('disabled');
                    $('[data-edit-toggle]').each(function(){
                        var $el=$(this),tag=$el.data(options.commandRole+'Tag');
                        if(parent&&$parent.is(tag)){
                            var command1=$el.data(options.commandRole+'Param1'),
                                command2=$el.data(options.commandRole+'Param2');
                            if (command1=='fontSize ' + $(parent).attr('size')) {
                                $el.removeClass('enabled');
                                command1=command2;
                            }else{
                                $el.addClass('enabled');
                            }
                            $el.data(options.commandRole, command1).attr('data-'+options.commandRole, command1);
                        }
                    })
                } else {
                    $('[data-edit-selected]').addClass('disabled');
                    $('[data-edit-toggle]').each(function(){
                        var $el=$(this),command=$el.data(options.commandRole+'Param2');
                        $el.removeClass('enabled').data(options.commandRole, command)
                           .attr('data-'+options.commandRole, command);
                    });

                    $('.hyperlink_remove').addClass('to_hide');
                    $('.hyperlink_creat').removeClass('to_hide');
                    execCommand('fontSize 3');
                    if (document.queryCommandState('bold')) {
                        execCommand('bold');
                    }
                }
            };

		options = $.extend({}, $.fn.wysiwyg.defaults, userOptions);
		toolbarBtnSelector = 'a[data-' + options.commandRole + '],li[data-' + options.commandRole + '],button[data-' + options.commandRole + '],input[type=button][data-' + options.commandRole + ']';
		bindHotkeys(options.hotKeys);
		if (options.dragAndDropImages) {
			initFileDrops();
		}
		bindToolbar($(options.toolbarSelector), options);
		editor.attr('contenteditable', true)
        .on('mousemove touchmove', function(e){
            //setControls()
        }).on('mouseup keyup mouseout', function (e) {
            if (e.type === 'mouseup' || e.type === 'keyup') {
                setTimeout(setControls,1);
            }
			saveSelection();
			updateToolbar();
        }).on('mousedown touchstart', function (e) {
            setTimeout(setControls,1);
        }).on('focus' ,function(){
            //$('#editor_toolbar').removeClass('disabled');
        }).on('blur' ,function(){
            //$('#editor_toolbar').addClass('disabled');
        }).on('paste' ,function(e){
            e.preventDefault();
            var text = (e.originalEvent || e).clipboardData.getData('text/plain');
            text = grabsTextLink(text);
            execCommand('insertHTML', text);
        })
		$(window).on('touchend', function (e) {
			var isInside = (editor.is(e.target) || editor.has(e.target).length > 0),
				currentRange = getCurrentRange(),
				clear = currentRange && (currentRange.startContainer === currentRange.endContainer && currentRange.startOffset === currentRange.endOffset);
            if (!isInside) {
                setTimeout(setControls,1);
            }

            if (!clear || isInside) {
				saveSelection();
				updateToolbar();
			}
		}).on('click', function(e){
            var isInside = (editor.is(e.target) || editor.has(e.target).length > 0);
            if (!isInside && !$(options.toolbarSelector).find(e.target)[0] && !$(e.target).is('#blog_post_title')) {
                setTimeout(setControls,1);
            }
        })
		return this;
	};
	$.fn.wysiwyg.defaults = {
		hotKeys: {
			/*'ctrl+b meta+b': 'bold',
			'ctrl+i meta+i': 'italic',
			'ctrl+u meta+u': 'underline',
			'ctrl+z meta+z': 'undo',
			'ctrl+y meta+y meta+shift+z': 'redo',
			'ctrl+l meta+l': 'justifyleft',
			'ctrl+r meta+r': 'justifyright',
			'ctrl+e meta+e': 'justifycenter',
			'ctrl+j meta+j': 'justifyfull',
			'shift+tab': 'outdent',
			'tab': 'indent'*/
		},
		toolbarSelector: '[data-role=editor-toolbar]',
		commandRole: 'edit',
		activeToolbarClass: 'active',
		selectionMarker: 'edit-focus-marker',
		selectionColor: 'darkgrey',
		dragAndDropImages: true,
		fileUploadError: function (reason, detail) { console.log("File upload error", reason, detail); }
	};
}(window.jQuery));
