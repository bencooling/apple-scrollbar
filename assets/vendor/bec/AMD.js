/*
|--------------------------------------------------------------------------
| AMD Template
|--------------------------------------------------------------------------
|
| Copyright (c) 2013 Ben Cooling (http://bcooling.com.au)
| Licensed under the MIT License
|
| An AMD template for passing a settings object literal to a function constructor
|
| Dependencies
| ------------
| jquery
|
| Examples
| --------
| My_Module = new Bec_Module({'name': 'Ben Cooling'});
|
*/

define(['jquery'], function(){
  return function(options){

    var that     = this,
        defaults = {
          name: 'Ben Cooling'
        };
    
    this.settings = $.extend(defaults, options);

    // getSuburbsByPostcode
    // --------------------
    this.getSuburbsByPostcode = function(postcode){ 
      return $.ajax({
        url: "",
        type: "POST"
      });
    }

    this.keyupTextField = function(){
      // do something...
    }

    this.construct = function(){
      that.settings.textField.on('keyup', that.keyupTextField);
    }

    that.construct();
  }
});
