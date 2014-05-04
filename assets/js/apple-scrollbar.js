/*
|--------------------------------------------------------------------------
| Custom scrollbar in the style of Apple 
|--------------------------------------------------------------------------
|
| Scrollbar appears on scrolling. 
| Different view if mouseenter while scrolling
| Delay in hiding scrollbar after mouseleave and scrolling ended.
|
*/
define(['jquery'
      ,'sly'
      ,'modernizr'], function($){

  var $context = $('body'),
      $scrollbar = $('#scrollbar'),
      timerIdMoving,
      timerIdMouseenter,
      options = {
        // Scrolling
        scrollBy: 100,
        // Scrollbar
        scrollBar: $scrollbar,
        dragHandle: 1,
        dynamicHandle: 1,
        minHandleSize: 10,
        clickBar:      1,
        // Mixed options
        speed: 0,
        easing: 'linear'
      },
      frame = new Sly('#frame', options, {
        moveStart: function (){
          if (timerIdMoving)
            clearTimeout(timerIdMoving);
          $scrollbar.addClass('moving');
        },
        moveEnd: function(){
          timerIdMoving = setTimeout(function(){
            $scrollbar.removeClass('moving');
            if ($scrollbar.hasClass('mouseleave') && $scrollbar.hasClass('mouseenter'))
              $scrollbar.removeClass('mouseenter');
          }, 1000);
        }
      });

  // Initiate frame
  frame.init();

  // Reload on resize
  $(window).on('resize', function () {
    frame.reload();
  });

  $scrollbar
    .on('mouseenter',function(){
      if (timerIdMouseenter)
          clearTimeout(timerIdMouseenter);
      $scrollbar.removeClass('mouseleave').addClass('mouseenter');
    })
    .on('mouseleave',function(){
      timerIdMouseenter = setTimeout(function(){
        if (!$scrollbar.hasClass('moving'))
          $scrollbar.removeClass('mouseenter');
        $scrollbar.addClass('mouseleave');
      }, 1000);
    });

});