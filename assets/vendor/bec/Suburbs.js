// Postcode to Subject object
// ---------------------------------
// Copyright (c) 2013 Ben Cooling (http://bcooling.com.au)
// Licensed under the MIT License
// 
// Populates a select menu with suburbs from the postcode entered into a text field using the geonames API 
// 
// dependencies
// ================
// jquery
//
// usage
// =========
// My_Suburbs = new Bec_Suburbs({
//   'textField': $('[name=postcode]'), 
//   'selectMenu': $('[name=suburbs]'),
//   'callback': 'XML'
// });
// 
define(['jquery'], function(){
  return function(options){

    var that     = this,
        defaults = {
          textField: $('[name=postcode]'),
          selectMenu: $('[name=suburbs]'),
          country: 'AU',
          postcode: '2000',
          callback: 'json',
          min: 3
        };
    
    this.settings = $.extend(defaults, options);
    this.xhr = false; 

    // getSuburbsByPostcode
    // ===========
    // **param** postcode *{number}* Postcode number
    this.getSuburbsByPostcode = function(postcode){ 
      return $.ajax({
        url: "http://www.geonames.org/postalCodeLookupJSON?postalcode="+postcode+"&country="+that.settings.country+"&callback="+that.settings.callback,
        type: "GET",
        dataype: "jsonp"
      });
    }

    this.keyupTextField = function(){
      var $this = $(this);
      if ($this.val().length>=that.settings.min){
        if (that.xhr) {
          console.log('abort', that.xhr);
          that.xhr.abort();
        }
        that.xhr = that.getSuburbsByPostcode().done(function(data){
          console.log(data);
        });
      }
    }

    this.construct = function(){
      that.settings.textField.on('keyup', that.keyupTextField);
    }

    that.construct();
  }
});
