    var myApp = new Framework7({template7Pages: true, popupCloseByOutside:false, pushState: true,
                swipeBackPage: false, swipePanel: "left", autoLayout: true, animatePages:false});
      
      var $$ = Dom7;
      
      var mainView = myApp.addView('.view-main', {
        dynamicNavbar: true
      });
      
          /*=== Default standalone ===*/
          var myPhotoBrowserStandalone = myApp.photoBrowser({
              photos : [
                  'img/brochure3.jpg',
              ],
              toolbar: false
          });
          //Open photo browser on click
          $$('.pb-standalone').on('click', function () {
              myPhotoBrowserStandalone.open();
          });
          
          /*=== Popup ===*/
          var myPhotoBrowserPopup = myApp.photoBrowser({
              photos : [ 'img/brochure3.jpg'],
              type: 'popup',
              toolbar: false
          });
          $$('.pb-popup').on('click', function () {
              myPhotoBrowserPopup.open();
          });


      myApp.onPageInit('index', function (page) 
      {
        //myApp.alert('in index','')
          /*=== Default standalone ===*/
          var myPhotoBrowserStandalone = myApp.photoBrowser({
              photos : [
                  'img/brochure3.jpg',
              ],
              toolbar: false
          });
          //Open photo browser on click
          $$('.pb-standalone').on('click', function () {
              myPhotoBrowserStandalone.open();
          });
          
          /*=== Popup ===*/
          var myPhotoBrowserPopup = myApp.photoBrowser({
              photos : [
                   'img/brochure3.jpg'],
              type: 'popup',
              toolbar: false
          });
          $$('.pb-popup').on('click', function () {
              myPhotoBrowserPopup.open();
          });

        var mySwiper = new Swiper('.swiper-container2', {
          preloadImages: true,
          lazyLoading: true,
          pagination: '.swiper-pagination',
          autoplay: 2500
        })     

      });


var mySwiper = new Swiper('.swiper-container2', {
  preloadImages: true,
  lazyLoading: true,
  pagination: '.swiper-pagination',
  autoplay: 2500
})                          
