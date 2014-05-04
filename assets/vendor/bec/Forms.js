/*
|--------------------------------------------------------------------------
| Forms
|--------------------------------------------------------------------------
|
| Copyright (c) 2013 Ben Cooling (http://bcooling.com.au)
| Licensed under the MIT License
|
| A Forms object based on convention over configuration.
|
| Features
| --------
| Async submit form  
| Respond to form with: page reload | validation hints |  flash data
| File uploads with progress knob & drag n drop
| 
| Markup
| ------
| Conventions for client request:
| Submission requires form attributes method & action
| Validation requires .form-row elements (.form-hint will be inserted within .form-row)
| Flash data required .flash element
|
| <form method="POST" action="/register" class="register">
|   <div class="form-row">
|     <label for="username">username</label>
|     <input class="input" type="text" name="username" id="username" />
|   </div>
|   <div class="form-actions">
|     <button class="button" type="submit">join now</button>
|   </div>
| </form>
| 
| Server
| ------
| Conventions for server response:
| Content-Type: application/json
| JSON object to have only 1 of these properties: 
| fieldHints { fieldName:[string] } or { fieldName:{status:[string],fieldHint:[string]} } 
| flashData [string]
| redirectUrl [string]
|
| Examples
| --------
| // Setup form for async file upload, drag n drop & progress
| Forms.fileUpload($('[type=file]'));
|
| // Cancel file upload
| $cancel.on('click', Forms.cancelFileUpload);
|
| // Simple form submit plain data
| $personalInfo.on('submit', Forms.submit);
|
*/
define([
 'Lang'
 ,'jquery'
 ,'jquery.knob'
 ,'jquery.iframe-transport'
 ,'jquery.fileupload'
], function(Lang){
  
  return new function(){

    var that = this;

    // toggleSubmitBtnLoadingIndicator
    // Add/Remove loading indicator for submit button
    this.toggleSubmitBtnLoadingIndicator = function(){};

    // submit
    // ======
    // Asynchronously submit form, returns jxhr object, manually set if require non json content type
    this.asyncSubmit = function($this, options){

      var defaults = {
        url  : $this.attr('action'),
        type : $this.attr('method'),
        data : $this.serialize(),
        dataType : 'json'
      },
      settings = $.extend(defaults, options);

      return $.ajax(settings);

    };

    // getFieldHint
    // ============
    // 
    // Compile field hint template
    // 
    this.getFieldHint = function(msg, status){

      var tpl = '<p class="field-hint {{status}}">{{msg}}</p>';

      return $(tpl.replace('{{msg}}', msg)
                  .replace('{{status}}', status));

    };

    // showFieldHints
    // --------------
    // Display field hints
    this.showFieldHints = function($form, result){

      $('.field-hint').remove(); // remove stale msg, prevent duplicates

      if (typeof result.fieldHints==='string'){
        $form.prepend(that.getFieldHint(result.fieldHints, result.status));
        return;
      }

      if ( result.fieldHints.hasOwnProperty('generic') )
        $form.prepend(that.getFieldHint(result.fieldHints.generic, result.status));

      $.each(result.fieldHints, function(fieldName, fieldValue){
        var fieldStatus = (fieldValue.hasOwnProperty('status')) ? fieldValue.status : result.status,
            fieldHint   = (fieldValue.hasOwnProperty('fieldHint')) ? fieldValue.fieldHint : fieldValue,
            $field      = $('[name='+fieldName+']', $form),
            $msg        = that.getFieldHint(fieldHint, fieldStatus),
            $formRow    = $field.parents('.form-row');

        if (!$formRow.length)
          return;

        $formRow.addClass('attention').children('label').before($msg);
        $msg.animate({'top':'2px', 'opacity':'1'}, 300);
      });

    };

    this.removeFieldHint = function(){
      var $this = $(this);
      // $this.siblings('.message-error').animate({'top':'-30px', 'opacity':'0'}, 300);
      $this.siblings('.field-hint').slideUp('slow', function(){
        $this.parents('.attention').removeClass('attention');
      });
    };

    // fileUpload
    this.fileUpload = function($input){

      var $form = $input.closest('form'),
          $knob = $('.knob', $form);

      // Prevent the default action when a file is dropped on the window
      $(document).on('drop dragover', function (e) {
        e.preventDefault();
      });

      // Form with file upload progress
      $knob.knob();

      // async response
      $form.on('submit', function(e){
        e.preventDefault();

        console.log('submit');
        return;
      });

      // file upload
      $input.fileupload({

        // This element will accept file drag/drop uploading
        dropZone: $form,
        sequentialUploads: false,
        dataType: 'json',

        done: function (e, data) {
          // $.each(data.files, function (index, file) {
          //   console.log('uploaded: ' + file.name);
          // });
          that.formResponseDone(data.result);
        },

        add: function(e, data){
          var name  = data.files[0].name,
              size  = data.files[0].size,
              jqXHR = data.submit();

          // TODO add filename & size to DOM
          $form.addClass('uploading').data('jqXHR', jqXHR); // upload
          $('.filename', $form).text(name);
          $('.size', $form).text(that.formatFileSize(size));
        },

        progress: function(e, data){

          // Calculate the completion percentage of the upload
          var progress = parseInt(data.loaded / data.total * 100, 10);

          // Update the hidden input field and trigger a change
          // so that the jQuery knob plugin knows to update the dial
          $knob.val(progress).change();

          if(progress == 100){
            $form.removeClass('uploading');
            $knob.val(0).change(); // reset
          }
        },

        fail:function(e, data){
          // Something has gone wrong!
          $form.addClass('error');
        }

      });

    };

    // Cancel file upload
    this.cancelFileUpload = function(e){
      var $form = $(this).closest('form'),
          $knob = $('.knob', $form),
          jqXHR = $form.data('jqXHR');

      e.preventDefault();

      // file form 2 states: .uploading or not.
      if($form.hasClass('uploading')){
        jqXHR.abort();
        $form.removeClass('uploading');
        $knob.val(0).change(); // reset
      }
    };

    this.submit = function(e){
      var $form  = $(this),
          $flash = $('#flash');

      e.preventDefault();

      // Regular form
      that.asyncSubmit($form)
        .done(function(result){
          if (result.hasOwnProperty('fieldHints'))
            that.showFieldHints($form, result);
          else if (result.hasOwnProperty('flashData'))
            $flash.flash(result.messages);
          else if (result.hasOwnProperty('reload'))
            window.location.reload();
          else if (result.hasOwnProperty('redirectUrl'))
            window.location.replace(result.redirectUrl);
          else 
            $flash.flash( Bec.Lang.error.request, 'error' );
        })
        .error(function(){
          $flash.flash( Bec.Lang.error.request, 'error' );
        });

    };

    this.formResponseDone = function(result){
      if (result.hasOwnProperty('fieldHints'))
        that.showFieldHints($form, result);
      else if (result.hasOwnProperty('flashData'))
        $flash.flash(result.messages);
      else if (result.hasOwnProperty('reload'))
        window.location.reload();
      else if (result.hasOwnProperty('redirectUrl'))
        window.location.replace(result.redirectUrl);
      else 
        $flash.flash( Bec.Lang.error.request, 'error' );
    };

    this.formResponseError = function(result){
      $flash.flash( Bec.Lang.error.request, 'error' );
    };

    // $('.radio-group label').on('click', Forms.radioGroup)
    this.radioGroup = function(){
      var $this       = $(this),
          $radioGroup = $this.parents('.radio-group');

      $('.active', $radioGroup).removeClass('active');
      $this.addClass('active');
    };

    this.formatFileSize = function(bytes) {
      if (typeof bytes !== 'number')
        return '';

      if (bytes >= 1000000000)
        return (bytes / 1000000000).toFixed(2) + ' GB';

      if (bytes >= 1000000)
        return (bytes / 1000000).toFixed(2) + ' MB';

      return (bytes / 1000).toFixed(2) + ' KB';
    };

  };
});