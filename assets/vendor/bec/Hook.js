/*
|--------------------------------------------------------------------------
| Hook
|--------------------------------------------------------------------------
|
| Copyright (c) 2013 Ben Cooling (http://bcooling.com.au)
| Licensed under the MIT License
|
| An object that allows you to create "Actions" and "Hooks"
| Programically add/modify/remove/call Hooked functions on Actions
| Useful for modules using event handlers that can conflict
| with other modules, such as window.resize or keypress.up
|
| Examples
| --------
| MyAction = {};
| Hook.addItem(MyAction, 'HelloWorld', function(){ console.log('Hello World'); });
| Hook.modifyItem(MyAction, 'HelloWorld', 'disable'  });
| Hook.run(MyAction);
|
*/

define(function(){
  return function(){

    // addItem
    // ===========
    // **param** Action *{object}* An object to contain all the hooked functions by name
    // **param** item *{string}* The name/handle for the hooked function
    // **param** fn *{function}* The hooked function
    // **param** params *{object}* An object of param keys & values. Event listeners and handlers
    // Can add params
    // **return** *{void}*
    this.addItem = function(Action, item, fn, params) {
      Action[item] = {fn:fn, params:params, enabled:true};
    };

    // modifyItem
    // ==============
    // **param** Action *{object}* The object containing all the hooked functions
    // **param** item *{string}* The name/handle for the hooked function
    // **param** action *{string}* 'enable' | 'disable' | 'delete'
    // **return** *{void}*
    this.modifyItem = function(Action, item, action) {
      switch(action)
      {
        case 'enable':
          Action[item].enabled = true;
          break;
        case 'disable':
        Action[item].enabled = false;
          break;
        case 'delete':
          delete(Action[item]);
          break;
      }
    };

    // run
    // =======
    // **param** Action *{object}* The object containing all the hooked functions
    // **param** e *{object}* The event object if involving DOM event handlers
    // **return** *{void}*
    this.run = function(Action, e){
      $.each(Action, function(name, item) {
        if (item.enabled) {
          params = {};
          if (e) {
            if (item.params) params['e'] = e;
            else params = e;
          }
            if (typeof item.fn == "function") item.fn.call(item.fn, params);
          }
      });
    };
  
  }
});