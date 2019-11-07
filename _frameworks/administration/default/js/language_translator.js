var LanguageTranslator = function() {

    var $this = this;
    this.translateAllLanguage = false;
    this.translateAlreadyTranslatedWords = false;
    this.items = {};

    this.onStart = function(wordId){
        $('#' + wordId).attr('disabled', true);
        adminLanguageEditor.wordPreloaderShow(wordId);
    }

    this.onFinish = function(wordId){
        $('#' + wordId).attr('disabled', false);
        adminLanguageEditor.wordPreloaderHide(wordId);
    }

    this.onStartBatch = function(){
        $('.translate_all_button, textarea, input[type=text]').attr('disabled', true);
        $('.google_translate_is_used').hide();
        $('#translate_all_button_preloader').show();
    }

    this.onFinishBatch = function(wordKeys){
        $('.translate_all_button, textarea, input[type=text]').attr('disabled', false);
        $('#translate_all_button_preloader').hide();
        $('.google_translate_is_used').show();
    }

    this.translateAll = function()
    {
        if($this.isDemoMode()) {
            return false;
        }

        if($('#translate_all_button_preloader').is(':visible')) {
            return;
        }

        if (!confirm(l('are_you_sure'))) {
            return false;
        }

        if($('#mail_content').length) {
            $('#mail_content').val(tinymce.get('mail_content').getContent());
        }

        var items = {};

        // choose all items on page
        $('.translateable').each(function(){
            items[$(this).attr('id')] = $(this).val();
        });

        $this.onStartBatch();
        $this.translateBatch(items);

    }

    this.translateBatch = function(items)
    {
        console.log('start translateBatch');

        // console.log(items);

        var request = {
            cmd: 'translate_batch_site_module',
            ajax: 1,
            translate_type: $('.translate_type').val(),
            translate_from: $('#translate_from').val(),
            translate_to: $('#translate_to').val(),
            data: window.JSON.stringify(items),
        };

        $this.translateRequest(request);

        return;
    }

    this.translateRequest = function(request)
    {
        $.post('language_edit.php', request, function(data) {

            try {
                var jsonData = window.JSON.parse(data);
            } catch(e) {
                console.log('json error');
                alert(l('translation_error_please_try_later'));
                $this.onFinishBatch(false, true);
                return;
            }

            var wordKeys = [];
            if(jsonData.translate) {
                var translate = jsonData.translate;

                if(jsonData.error) {
                    alert(jsonData.error);
                    $this.onFinishBatch(false);
                    return;
                }

                //console.log('translate', translate);

                for(translationItem in translate) {
                    //console.log('translationItem', translationItem);
                    var wordKey = translationItem;
                    wordKeys.push(wordKey);

                    if(wordKey == 'mail_content') {
                        tinymce.get('mail_content').setContent(translate[translationItem]);
                        tinymce.get('mail_content').save();
                    } else {
                        $('#' + wordKey).val($this.decodeHtml(translate[translationItem]));
                    }
                }
            } else {
                console.log('translation error');
                alert(l('translation_error_please_try_later'));
                $this.onFinishBatch(false, true);
                return;
            }

            $this.onFinishBatch(wordKeys);
        });

    }

    this.decodeHtml = function(html) {
        return $("<textarea/>").html(html).text();
    }

    this.setBatchTranslationButtonText = function()
    {
        $('.translate_all_button > span.status').html($this.getTranslationStatusText());
    }

    this.isDemoMode = function()
    {
        if(IS_DEMO) {
            alert(l('feature_disabled_in_demo_mode'));
            return true;
        } else {
            return false;
        }
    }

    return this;
}

adminLanguageTranslator = new LanguageTranslator();