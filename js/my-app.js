// Initialize your app
var myApp = new Framework7({template7Pages: true, popupCloseByOutside:false, pushState: true,
                swipeBackPage: false, swipePanel: "left", autoLayout: true, animatePages:false});


// Export selectors engine
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});

var hostname = location.hostname;
//alert(hostname);

//var srvURL = "http://www.bluapps.in/api_dvj/Serv";
var srvURL = "http://www.dvj-design.com/api_dvj/Serv";
if(hostname == 'localhost')
{
    var srvURL = "http://localhost/api_dvj/Serv";
}
var version = "118";
var app_name ="DVJ";
var appname = "DVJ Design";

$$(document).on('ajaxStart', function (e) { myApp.showIndicator(); }); 
$$(document).on('ajaxComplete', function () { myApp.hideIndicator(); });


document.addEventListener("deviceready", onDeviceReady, false);
 //alert('ok');
 //$.mobile.fixedToolbars.show(true);
 
 function onDeviceReady() 
 {
    //myApp.alert('device.uuid ' + device.uuid, '');

    localStorage.setItem("device_platform", device.platform);
    localStorage.setItem("device_uuid", device.uuid);
    localStorage.setItem("device_browser", navigator.userAgent);

    document.addEventListener("backbutton", function(e)
    {
        //page = $.mobile.activePage[0].id;
        page = mainView.activePage.name;
        //myApp.alert('page ' + page,  ''); 
        //myApp.alert('model length: ' + $$('.modal-in').length , '')
        //myApp.alert('photo-browser length: ' + $$('.photo-browser').length , '')

        if(page == 'index' ) // || page == 'main' || page == 'login'
        {
            // call this to get a new token each time. don't call it to reuse existing token.
            
            /*
            navigator.notification.confirm(
                'Wish to Exit App ?',  // message
                onBtnConfirm,              // callback to invoke with index of button pressed
                '',            // title
                'Yes,No'          // buttonLabels
            );
            */

            localStorage.removeItem("last_main_call");
            navigator.app.clearHistory();
            navigator.app.exitApp();
            //navigator.app.backHistory();
        }else
        {
            myApp.hideIndicator();
            //mainView.router.back();

            //var len=myApp.getCurrentView().history.length; if(len>1){ myApp.getCurrentView().router.back(); }

            if($$('.photo-browser').length>0)
            {
                //myPhotoBrowserStandalone.close(); 
            }else
            {
                mainView.router.back();
            }

            //if ($$('.modal-in').length > 0) { myApp.closeModal(); return false; } else { mainView.router.back(); } return true; 
        }
    }, false);  
    
    // process the confirmation dialog result
    function onBtnConfirm(button) 
    {
        //alert('You selected :' + button + ' *');

        if(button == '2' || button == 2)
        {
            //alert('do nothing');
            myApp.hideIndicator();
            return;
            //ShowHome();
        }else if(button == '1' || button == 1)
        {
            //e.preventDefault();
            localStorage.removeItem("last_main_call");
            navigator.app.clearHistory();
            navigator.app.exitApp();
        }
    }


    var push = PushNotification.init({
        android: {
            senderID: "797051143620"
        },
        ios: {
            alert: "true",
            badge: "true",
            sound: "true"
        },
        windows: {}
    });

    push.on('registration', function(data) {
        // data.registrationId

        //alert(data.registrationId);
        //$("#username2").val(data.registrationId);
        sendID(data.registrationId, device.platform);
    });

    push.on('notification', function(data) {
        // data.message,

        //alert(JSON.stringify(data));

        //myApp.alert(data.message,'');
        //myApp.alert(device.platform,'');
        //alert('type: ' + data.additionalData.type);
        //alert('id ' + data.additionalData.id);
        //alert('id ' + data.id);
        //alert('title ' + data.title);
        //alert('category ' + data.additionalData.category);
        //alert('vibrate ' + data.vibrate);
        //$("#password").val(data.message);

        message = data.message;

        if (device.platform == 'iOS') {
            chat = data.additionalData.chat;
            myApp.alert('chat ' + chat, '');
            
            myApp.modal({
                title:  'Notification &nbsp;&nbsp;&nbsp;&nbsp;<a href="#" onclick="myApp.closeModal();"><i class="fa fa-window-close color-white" style="margin-left: 0px;">close</i></a>',
                text: message,
                buttons: [
                  {
                    text: 'Close',
                    onClick: function() {}
                  }]
               });
        }else{
            category_id = data.additionalData.cat_id;
            category = data.additionalData.category;
            chat = data.additionalData.chat;
            //type = data.additionalData.type;
            
            //myApp.alert('Category ' + category, '');
            //myalert();

            if(data.additionalData.category.length>0)
            {
                myApp.alert('Opening Category ' + category, '');
                ProductDisplay(category_id, category);
            }if(data.additionalData.chat.length>0)
            {
                //myApp.alert('Opening Category ' + category, '');
                Chat();
            }else
            {
                //myApp.alert('Notification Message<br>' + message, '');
                myApp.modal({
                title:  'Notification &nbsp;&nbsp;&nbsp;&nbsp;<a href="#" onclick="myApp.closeModal();"><i class="icon f7-icons active" style="margin-left: 0px;">close</i></a>',
                text: message,
                buttons: [
                  {
                    text: 'Close',
                    onClick: function() {}
                  }]
               });
            }
        }

        //type = data.additionalData.type;
    });

    push.on('error', function(e) {
        // e.message

        //alert(e.message);
        myApp.alert(e.message, '');
        //mainView.router.reloadPage('alerts.html');
        //$("#username2").val(e.message);
    });     
}

myApp.onPageBeforeInit('index', function (page) {

  //Do something here with home page
  //myApp.alert('01 index page initialized ' + page + ' name'  ,'');

  logged_in = localStorage.getItem("logged_in");
   
    

    dvj_logged_in = localStorage.getItem("dvj_logged_in");
    if(dvj_logged_in == null || dvj_logged_in == 'undefined')
        {  
            $$("#beforelogin").show();
            $$("#afterlogin").hide();
            $$(".sign1").show();
            $$(".chat1").hide();
            //myApp.alert('1','close')
        }
        else
        {
            $$("#beforelogin").hide();     
            $$("#afterlogin").show();     
            $$(".sign1").hide();
            $$(".chat1").show();
            //myApp.alert('2','close')
        }

}).trigger(); //And trigger it right away

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

var mySwiper = new Swiper('.swiper-container2', {
  preloadImages: true,
  lazyLoading: true,
  pagination: '.swiper-pagination',
  autoplay: 2500
})   

myApp.onPageInit('index', function (page) {


    dvj_logged_in = localStorage.getItem("dvj_logged_in");
    if(dvj_logged_in == null || dvj_logged_in == 'undefined')
        {  
            $$("#beforelogin").show();
            $$("#afterlogin").hide();
            $$(".sign1").show();
            $$(".chat1").hide();
            //myApp.alert('1','close')
        }
        else
        {
            $$("#beforelogin").hide();     
            $$("#afterlogin").show();     
            $$(".sign1").hide();
            $$(".chat1").show();

            //$$("#sign1").css("display", "block");
            //$$("#chat1").css("display", "block");
            //myApp.alert('2 will hide','close')
        }
        //$$("#sign11").css("background-color", "red");
        //$$(".su").css("background-color", "red");

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

    var mySwiper = new Swiper('.swiper-container2', {
      preloadImages: true,
      lazyLoading: true,
      pagination: '.swiper-pagination',
      autoplay: 2500
    })   

});

myApp.onPageInit('login', function (page) {
    //mainView.hideToolbar();
    //mainView.hideNavbar();
    // run createContentPage func after link was clicked
    //alert('hello');

    if (!myApp.device.ios) {
    $$(page.container).find('input, textarea').on('focus', function (event) 
    {
        var container = $$(event.target).closest('.page-content');
        var elementOffset = $$(event.target).offset().top;
        var pageOffset = container.scrollTop();
        var newPageOffset = pageOffset + elementOffset - 81;
        
        //myApp.alert('newPageOffset1 ' + newPageOffset, '');
        
        setTimeout(function () {
            container.scrollTop(newPageOffset, 300);
        }, 700);
    });
    }


   $$('#dealerloginbtn').on('click', function()
    {
        username = $$('#dealer_mobile').val();
        password = $$('#dealer_password').val();

        device_id= localStorage.getItem("device_uuid");
        device_platform= localStorage.getItem("device_platform");

        //alert('hello ' + username);
        //alert(JSON.stringify(formData));
        var valid = 1;
        var errmessage = '';

        if(username.length <= 0)
        {
            errmessage += 'Please enter Mobile No <br>';
            //myApp.alert('Please enableter user id');
            //$$('#username').css('border','1px solid red');
            valid = 0;
        }
        if(password.length <= 0)
        {
            errmessage += 'Please enter password';

            //myApp.alert('Please enter password');
            //$$('#password').css('border','1px solid red');
            valid = 0;
        }
        //alert(valid);

        if(valid == 1)
        {       
            //myApp.showPreloader('Checking login ..')
            //setTimeout(function () {
            //    myApp.hidePreloader();
            //}, 50000);

             //myApp.alert('Everything is correct',  '');
             //var mainView = myApp.addView('.view-main')          
        
            // Load page from about.html file to main View:

            //username = "9702502361";
            //password = "9702502361";
            
            var url = srvURL + "/dealer_login";//?mobile=9702502361&pass=9702502361
            
            $$.ajax({
                url: url,
                method: "POST",
                data: {mobile: username, pass: password, device_id:device_id, device_platform: device_platform, ver: version},
                processData: true,
                dataType: 'json',
                timeout : 50000,

                success: function (e, status, xhr)
                {

                    if(e.status == 'success')
                    {
                        //myApp.alert('session_id ' + e.session_id,  '');  
                        myApp.alert('Welcome ' + urldecode(e.vendor_name),  ''); 

                        localStorage.setItem("dvj_logged_in", "yes");
                        localStorage.setItem("dvj_session_id", e.session_id);
                        localStorage.setItem("dvj_vendor_id", e.user_id);
                        localStorage.setItem("dvj_vendor_name", e.vendor_name);
                        localStorage.setItem("dvj_isadmin", e.isadmin);
                        
                        //sendID();

                        $$("#beforelogin").hide();
                        $$("#afterlogin").show();

                        mainView.router.reloadPage('index.html');                      
                    }else
                    {
                        //myApp.alert('error: ' + e.status,  '');
                        myApp.alert(e.message,  ''); 
                    }
                },
                error: function (xhr, status)
                {
                    myApp.hideIndicator();

                    if(status == 0)
                    {
                        myApp.alert('Please Check Internet',  ''); 
                    }else
                    {
                        myApp.alert('failure * ' +  status,  '');  
                    }; 

                }
            });
            
            //localStorage.setItem("logged_in", "yes");

            //myApp.addNotification( {
            //    message: 'Welcome '+ username +'!'
            //  } );
            //mainView.router.loadPage('main.html');
            //$$.post('path-to-file.php', {username: username}, function (data) {
            //  console.log(data);
            //});            
        }else
        {
            myApp.alert(errmessage,  '');   
            //$$('#username').css('border','1px solid red');
        }


    }); 


    $$('#forgot-password').submit(function(e) 
    {
        //myApp.alert('hello','');
        e.preventDefault();
        return false;
    });

    $$('#forgotbtn').on('click', function()
    {
        forgot_mobile_no = $$('#forgot_mobile_no').val();

        //var formData = myApp.formToData('#Customer-add');
        //alert(JSON.stringify(formData));
        var valid = 1;
        var errmessage = '';

        if(forgot_mobile_no.length <10)
        {
            errmessage += 'Please type Mobile No (min 10 char) <br>';

            //myApp.alert('Please enter password');
            //$$('#password').css('border','1px solid red');
            valid = 0;
        }

        //alert(valid);

        //var valid =1;
        if(valid == 1)
        {       
            //myApp.showPreloader('Checking login ..')
            //setTimeout(function () {
            //    myApp.hidePreloader();
            //}, 50000);

             //myApp.alert('Everything is correct',  '');
             //var mainView = myApp.addView('.view-main')          
        
            // Load page from about.html file to main View:

            //username = "9702502361";
            //password = "9702502361";
            //a_session_id = localStorage.getItem("a_session_id");

            var url = srvURL + "/dealer_forgot";//?mobile=9702502361&pass=9702502361
            
            $$.ajax({
                url: url,
                method: "POST",
                data: {forgot_mobile_no: forgot_mobile_no},
                processData: true,
                dataType: 'json',
                timeout : 50000,
                //start: function() {
                    // body...
                //    myApp.alert('start', '');
                    //myApp.showPreloader('Checking login ..');
                    //setTimeout(function () {
                        //myApp.hidePreloader();
                    //}, 50000);
                //},
                //complete: function() {
                    // body...
                //    myApp.alert('complete', '');
                    //myApp.hideIndicator();
                //},
                success: function (e, status, xhr)
                {
                    //myApp.hidePreloader();
                    //myApp.alert('xhr ' + xhr,  '');  
                    //myApp.alert('status ' + status,  '');  
                    //myApp.alert('sucess <br>' + JSON.stringify(e),  '');  
                    
                    //alert(JSON.parse(e));
                    //var obj = JSON.parse(e);
                    //myApp.alert('e.status ' + e.session_id,  '');  
                    //myApp.alert('e.status ' + e.status,  '');  
                    if(e.status == 'success')
                    {
                        //myApp.alert('session_id ' + e.session_id,  '');  
                        myApp.alert(e.message,  ''); 
                        
                        mainView.router.loadPage('login.html');                      
                    }else
                    {
                        //myApp.alert('error: ' + e.status,  '');
                        myApp.alert(e.message,  ''); 
                    }
                },
                error: function (xhr, status)
                {
                    myApp.hideIndicator();

                    if(status == 0)
                    {
                        myApp.alert('Please Check Internet',  ''); 
                    }else
                    {
                        myApp.alert('failure * ' +  status,  '');  
                    };
                }
            });
            
            //localStorage.setItem("logged_in", "yes");

            //myApp.addNotification( {
            //    message: 'Welcome '+ username +'!'
            //  } );
            //mainView.router.loadPage('main.html');
            //$$.post('path-to-file.php', {username: username}, function (data) {
            //  console.log(data);
            //});            
        }else
        {
            myApp.alert(errmessage,  '');   
            //$$('#username').css('border','1px solid red');
        }
    }); 

});

function Logout()
{
     myApp.confirm('Are you sure to Logout?', '',
      function () {
        //myApp.alert('You clicked Ok button');
            //localStorage.setItem("logged_in", "");
            a_vendor_id = localStorage.getItem("a_vendor_id");
            //myApp.alert(a_vendor_id, '');

            a_session_id = localStorage.getItem("a_session_id");

            //localStorage.removeItem("logged_in");
            //localStorage.removeItem("a_vendor_id");
            //localStorage.removeItem("a_session_id");
            //localStorage.removeItem("a_vendor_name");
            localStorage.clear();
            window.localStorage.clear(); //try this to clear all local storage

            //mainView.router.loadPage('index.html');
            mainView.router.load({url: 'login.html',ignoreCache: true});
            //alert(navigator)
            //alert(navigator.app)
            if(navigator.app != undefined)
            {
                navigator.app.exitApp();
            }
      },
      function () {
        //myApp.alert('You clicked Cancel button');
      }
    );

}


myApp.onPageInit('changepassword', function (page) {
    // run createContentPage func after link was clicked
    //alert('hello');
    //alert(localStorage.getItem("logged_in"));
    //alert(localStorage.getItem("a_session_id"));
    //alert(localStorage.getItem("sess_assign_rights"))
   $$('#changepassbtn').on('click', function()
    {
        oldpass = $$('#oldpass').val();
        newpass = $$('#newpass').val();

        //alert($$('#customer_credit').is(":checked"));
        //alert('oldpass ' + oldpass);
        //alert(newpass.length);

        var formData = myApp.formToData('#Customer-add');
        //alert(JSON.stringify(formData));
        var valid = 1;
        var errmessage = '';

        if(oldpass.length <= 3)
        {
            errmessage += 'Please enter Current Password <br>';
            //myApp.alert('Please enableter user id');
            //$$('#username').css('border','1px solid red');
            valid = 0;
        }
        if(newpass.length <= 3)
        {
            errmessage += 'Please enter New Password <br>';

            //myApp.alert('Please enter password');
            //$$('#password').css('border','1px solid red');
            valid = 0;
        }

        //alert(valid);

        //var valid =1;
        if(valid == 1)
        {       
            //myApp.showPreloader('Checking login ..')
            //setTimeout(function () {
            //    myApp.hidePreloader();
            //}, 50000);

             //myApp.alert('Everything is correct',  '');
             //var mainView = myApp.addView('.view-main')          
        
            // Load page from about.html file to main View:

            //username = "9702502361";
            //password = "9702502361";
            a_session_id = localStorage.getItem("a_session_id");

            var url = srvURL + "changepass";//?mobile=9702502361&pass=9702502361
            
            $$.ajax({
                url: url,
                method: "POST",
                data: {session_id: a_session_id, oldpass: oldpass, newpass: newpass},
                processData: true,
                dataType: 'json',
                timeout : 50000,
                //start: function() {
                    // body...
                //    myApp.alert('start', '');
                    //myApp.showPreloader('Checking login ..');
                    //setTimeout(function () {
                        //myApp.hidePreloader();
                    //}, 50000);
                //},
                //complete: function() {
                    // body...
                //    myApp.alert('complete', '');
                    //myApp.hideIndicator();
                //},
                success: function (e, status, xhr)
                {
                    //myApp.hidePreloader();
                    //myApp.alert('xhr ' + xhr,  '');  
                    //myApp.alert('status ' + status,  '');  
                    //myApp.alert('sucess <br>' + JSON.stringify(e),  '');  
                    
                    //alert(JSON.parse(e));
                    //var obj = JSON.parse(e);
                    //myApp.alert('e.status ' + e.session_id,  '');  
                    //myApp.alert('e.status ' + e.status,  '');  
                    if(e.status == 'success')
                    {
                        myApp.alert(e.message,  '');  
                        //myApp.alert('Welcome ' + e.vendor_name,  ''); 
                        
                        mainView.router.loadPage('main.html');                      
                    }else
                    {
                        //myApp.alert('error: ' + e.status,  '');
                        myApp.alert(e.message,  ''); 
                    }
                },
                error: function (xhr, status)
                {
                    myApp.hideIndicator();

                    if(status == 0)
                    {
                        myApp.alert('Please Check Internet',  ''); 
                    }else
                    {
                        myApp.alert('failure * ' +  status,  '');  
                    }
                }
            });
            
            //localStorage.setItem("logged_in", "yes");

            //myApp.addNotification( {
            //    message: 'Welcome '+ username +'!'
            //  } );
            //mainView.router.loadPage('main.html');
            //$$.post('path-to-file.php', {username: username}, function (data) {
            //  console.log(data);
            //});            
        }else
        {
            myApp.alert(errmessage,  '');   
            //$$('#username').css('border','1px solid red');
        }
    }); 
});


function urldecode(str) {

  return decodeURIComponent((str + '')
    .replace(/%(?![\da-f]{2})/gi, function() {
      // PHP tolerates poorly formed escape sequences
      return '%25';
    })
    .replace(/\+/g, '%20'));
}


myApp.onPageInit('hooter', function (page) {

    if (!myApp.device.ios) {
    $$(page.container).find('input, textarea').on('focus', function (event) 
    {
        var container = $$(event.target).closest('.page-content');
        var elementOffset = $$(event.target).offset().top;
        var pageOffset = container.scrollTop();
        var newPageOffset = pageOffset + elementOffset - 81;
        
        //myApp.alert('newPageOffset1 ' + newPageOffset, '');
        
        setTimeout(function () {
            container.scrollTop(newPageOffset, 300);
        }, 700);
    });
    }

    product_id =page.context.product_id; 
    product_srno =page.context.product_srno; 
    client_id =page.context.client_id;
    $$("#product_id").val(product_id);
    $$("#product_srno").val(product_srno);
    $$("#client_id").val(client_id);

    $$('#submit6btn').on('click', function()
     {
        //myApp.alert('submit1btn button of page hooter clicked','');
        var valid = 1;
        var errmessage = '';

      
        remark = $$("#remark").val();
        action = $$("#action").val();
        product_id = $$("#product_id").val();
        product_srno = $$("#product_srno").val();
        client_id = $$("#client_id").val();
        var optionshooter = document.getElementsByName("hooter");
        //var optionsdamage = document.getElementsByName("damage");
        


      
           for (var i = 0; i < optionshooter.length; i++) {
            if (optionshooter[i].checked) {
                // do whatever you want with the checked radio
                var hooter = optionshooter[i].value;
                //alert( calcmodeofoperation);
                }
            }
            if(typeof hooter == "undefined")
            {
                //alert( " select the operation you want to perform");
                errmessage += 'Please Check one of the option from Status <br>';
                valid = 0;
            }
        //alert(modeofoperation)
        //alert(voltage)
            /*
            for (var i = 0; i < optionsdamage.length; i++) {
            if (optionsdamage[i].checked) {
                // do whatever you want with the checked radio
                var damage = optionsdamage[i].value;
                //alert( calcmodeofoperation);
                }
            }
            if(typeof damage == "undefined")
            {
                //alert( " select the operation you want to perform");
                errmessage += 'Please Check one of the option from damage <br>';
                valid = 0;
            }
            */
            
            if(remark.length <= 0)
            {
                //errmessage += 'Please Enter Remark <br>';
                //valid = 0;
            }
            if(action.length <= 0)
            {
                errmessage += 'Please Enter Action <br>';
                //myApp.alert('Please enableter user id');
                //$$('#username').css('border','1px solid red');
                valid = 0;
            }
            if(valid == 0)
            {
                myApp.alert(errmessage,'');
            }
            if(valid == '1')
            {
                //myApp.alert('Everything is okay for post','');
                //post with ajax

     
           

            //url = srvURL + '/inserthootersystem';
            url = srvURL + '/insertpumpsystem';
            console.log(url);
            //myApp.alert('url ' + url, '');
            //alert(url);//return false;
            //$_GET[“mode_of_operation”], $_GET[“pressure_drop_check”], $_GET[“gland”], $_GET[“bearing”], $_GET[“vibration”], $_GET[“remark”]

          
            $$.ajax({
                url: url,
                method: "GET",
                data: {product_id: product_id, product_srno: product_srno, client_id: client_id, hooter: hooter, remark: remark, action: action},
                processData: true,
                dataType: 'json',
                timeout : 50000,
                success: function (e, status, xhr)
                {
                    //myApp.hidePreloader();

                    if(e== 'Success')
                    {
                        //myApp.alert('session_id ' + e.session_id,  ''); 

                        myApp.alert('Data Stored on the Server',  '');   

                        mainView.router.load({
                                url: 'main.html',
                                context: {}});                      
                    }else
                    {
                        //myApp.alert('error: ' + e.status,  '');
                        myApp.alert(e,  ''); 
                    }
                },
                error: function (xhr, status)
                {
                    myApp.hideIndicator();

                    if(status == 0)
                    {
                        myApp.alert('Please Check Internet',  ''); 
                    }else
                    {
                        myApp.alert('failure * ' +  status,  '');  
                    };
                }
            });
        }
    });

});

myApp.onPageInit('products', function (page) {

  //myApp.alert('brochure started','');
  url = srvURL + '/category';
    $$.ajax({
          url: url,
          method: "GET",
          data: {},
          processData: true,
          dataType: 'json',
          timeout : 50000,
          success: function (e, status, xhr)
          {
              //myApp.hidePreloader();

              if(e.status == 'success')
              {
                  //myApp.alert('session_id ' + e.session_id,  ''); 

                  //myApp.alert('test Server',  '');   

                  total = e.data.category.length;
                   //myApp.alert(totalalerts);

                  cadd = '';
                  for(i=0; i< total; i++)
                  {
                      category_id = e.data.category[i].category_id;
                      //alert(brochure_id);
                      //datec = e.data.category[i].datec;

                      //status = e.data.category[i].status;

                      category_name = urldecode(e.data.category[i].category_name);
                      category_image = urldecode(e.data.category[i].category_image);
                      //brochure_pdf = urldecode(e.data.category[i].brochure_pdf);
                      //brochure_fname = urldecode(e.data.category[i].brochure_fname);

                      /*
                      var b= i%2;
                      //alert(b)
                      if(b == 0)
                      {
                        cadd += '<div class="row">';
                      }

                      cadd += '           <div class="col-50">';
                      cadd += '               <a href="#" onclick="ProductDisplay(' + "'" + category_id + "','" + category_name  +"');" + '">';
                      cadd += '                   <img src="' + category_image + '" style=" height: 120px; width: 140px;"/></a>';
                      cadd += '                  <span style="color: black;"><a href="#" onclick="ProductDisplay(' + "'" + category_id + "','" + category_name  +"');" + '">' + category_name + '</a></span>';
                      //cadd += '               </a>';
                      //cadd += '               <a class="external" href="' + urldecode(e.data.brochure[i].brochure_pdf)  + '"' + '>' + brochure_fname + '</a>';
                      cadd += '           </div>';
                      
                      if(b == 1)
                      {
                        cadd += '      </div>';
                      }

                      */

                      cadd += '<div class="row">';

                      cadd += '           <div class="col-100" style="background: transparent;">';
                      cadd += '               <a href="#" onclick="ProductDisplay(' + "'" + category_id + "','" + category_name  +"');" + '">';
                      cadd += '                   <img src="' + category_image + '" style="width: 100%;"/></a>';
                      cadd += '                  <div><center><a style="color: black; font-size: 22px;" href="#" onclick="ProductDisplay(' + "'" + category_id + "','" + category_name  +"');" + '">' + category_name + '</a></center></div>';
                      //cadd += '               </a>';
                      //cadd += '               <a class="external" href="' + urldecode(e.data.brochure[i].brochure_pdf)  + '"' + '>' + brochure_fname + '</a>';
                      cadd += '           </div>';
                      
                      cadd += '      </div>';

                    }
                    console.log(cadd)
                    $$("#productsdetails").html(cadd);
                                  
              }else
              {
                  //myApp.alert('error: ' + e.status,  '');
                  myApp.alert(e.message,  ''); 
              }
          },
          error: function (xhr, status)
          {
              myApp.hideIndicator();

              if(status == 0)
              {
                  myApp.alert('Please Check Internet',  ''); 
              }else
              {
                  myApp.alert('failure * ' +  status,  '');  
              };
          }
      });

    //localStorage.setItem("local_products", '');
    var mlen = 0;
    //a_session_id = localStorage.getItem("a_session_id");
    local_products = localStorage.getItem("local_products");
    //alert('local_products <br>' + local_products)
    console.log(local_products);
    if(local_products === null || local_products === 'undefined')
    {
    }else{
    //myApp.alert('length ' + local_products.length,'')

      if(local_products.length>0)
      {
        //myApp.alert('local_products ' + local_products,'')

        test = JSON.parse(local_products);
        mlen = test.length;
      }
    }
    if(mlen == 0)
    {
      mlen = '';
    }else
    {
      mlen = mlen + " Products";
    }
    $$("#t_amt").html(mlen);
});


function ProductDisplay(id, category)
{
  //myApp.alert(id,'');
   mainView.router.load({
                            url: 'productdetails.html',
                            context: {id: id, category: category}});   
}

myApp.onPageInit('productdetails', function (page) {

id =page.context.id; 
category =page.context.category; 

//id=14;
//category= 'test';

if(id)
{
  //myApp.alert(id.length,'')
}else{
  //myApp.alert('not defined','');
  return 1;
}

//myApp.alert('id: '+id + ' * category: ' + category,'');

    if (!myApp.device.ios) {
    $$(page.container).find('input, textarea').on('focus', function (event) 
    {
        var container = $$(event.target).closest('.page-content');
        var elementOffset = $$(event.target).offset().top;
        var pageOffset = container.scrollTop();
        var newPageOffset = pageOffset + elementOffset - 81;
        
        //myApp.alert('newPageOffset1 ' + newPageOffset, '');
        
        setTimeout(function () {
            container.scrollTop(newPageOffset, 300);
        }, 700);
    });
    }

    var myarray = [];

    local_products = localStorage.getItem("local_products");
    //alert('local_products <br>' + local_products)
    if(local_products === null || local_products === 'undefined')
    {
    }else{
    //myApp.alert('length ' + local_products.length,'')

      if(local_products.length>0)
      {
        //myApp.alert('local_products ' + local_products,'')

        test = JSON.parse(local_products);
        //myApp.alert('test.length ' + test.length);
        //myApp.alert('product_id ' + test[0].product_id);
        //test = JSON.parse(local_products);
        
        for(j = 0; j<test.length; j++)
        {
            //myApp.alert(test[j].product_id);
            myarray.push(test[j].product_id);
        }
      }}
      //myApp.alert(myarray,'')

     dvj_logged_in = localStorage.getItem("dvj_logged_in");
     dvj_session_id = localStorage.getItem("dvj_session_id");

    var mlen = 0;
    //a_session_id = localStorage.getItem("a_session_id");
    local_products = localStorage.getItem("local_products");
    //alert('local_products <br>' + local_products)
    console.log(local_products);
    if(local_products === null || local_products === 'undefined')
    {
    }else{
    //myApp.alert('length ' + local_products.length,'')
        console.log(local_products);

      if(local_products.length>0)
      {
        //myApp.alert('local_products ' + local_products,'')

        test = JSON.parse(local_products);
        mlen = test.length;
      }
    }
    if(mlen == 0)
    {
      mlen = '';
    }else
    {
      mlen = mlen + " Products";
    }
    $$("#t_amt2").html(mlen);

    //myApp.alert('brochure started','');
    url = srvURL + '/product_list';
    $$.ajax({
          url: url,
          method: "GET",
          data: {category_id: id},
          processData: true,
          dataType: 'json',
          timeout : 50000,
          success: function (e, status, xhr)
          {
              //myApp.hidePreloader();

              if(e.status == 'success')
              {
                  //myApp.alert('session_id ' + e.session_id,  ''); 

                  //myApp.alert('test Server',  '');   

                  total = e.data.products.length;
                   //myApp.alert(totalalerts);

                  cadd = '';
                  for(i=0; i< total; i++)
                  {
                      product_id = e.data.products[i].product_id;
                      //alert(brochure_id);
                      datec = e.data.products[i].datec;

                      status = e.data.products[i].status;
                      product_price = e.data.products[i].product_price;
                      is_new_arrival = e.data.products[i].is_new_arrival;

                      category_id = urldecode(e.data.products[i].category_id);
                      product_image = urldecode(e.data.products[i].product_image);
                      bigproduct_image = urldecode(e.data.products[i].bigproduct_image);
                      product_name = urldecode(e.data.products[i].product_name);
                      product_price = urldecode(e.data.products[i].product_price);
                      //brochure_fname = urldecode(e.data.products[i].brochure_fname);

                      //var b= i%2;
                      var b= i%1;
                      //alert(b)
                      if(b == 0)
                      {
                        cadd += '<div class="row">' + "\n\n";
                      }
                      if(dvj_logged_in == 'yes')
                      {
                        //price = 'Rs ' + product_price + ' <br>';
                        price = product_price + ' <br>';
                      }else
                      {
                        price = '';
                      }

                      cadd += '           <div class="col-100" style="background: transparent;">';
                      cadd += '               <a href="#" onclick="ProductDetails(' + "'" + product_id +"','" + bigproduct_image +  "');" + '">';
                      cadd += '                   <img src="' + product_image + '" style="width: 100%;"/></a>';
                      cadd += '                  <div><center><a style="color: black; font-size: 22px;" href="#" onclick="ProductDetails(' + "'" + product_id +"','" + bigproduct_image +  "');" + '">' + product_name + '</a>';
                      if(dvj_logged_in == 'yes')
                      {
                        cadd += '<br><p color: black; font-size: 22px;">Price: ' + price + '</p>';
                      }
                      cadd += '</center></div>' + "\n\n";

                      //console.log(cadd + '\n\n');


                      //myApp.alert(myarray.indexOf(product_id))


                        if(myarray.indexOf(product_id) != -1)   
                        {
                           //myApp.alert('matching product_id ' + product_id)
                           //cadd += '<span style="display: block; color: black;" id="pd_' + product_id +'">' + price + ' <a href="#" class="link" onclick="RemoveProduct(' + "'" + product_id +  "','" + product_name  +  "','" + product_price  + "');" + '">Remove 1</a></span>';
                           //cadd += '<span style="display: none; color: black;" id="pa_' + product_id +'">' + price + ' <a href="#" class="link" onclick="AddProduct(' + "'" + product_id +  "','" + product_name  +  "','" + product_price  + "');" + '">Add 1</a></span>';

                            for(j = 0; j<test.length; j++)
                              {
                                  //myApp.alert(test[j].product_id + ' ' + test[j].product_name + ' ' + test[j].product_qty,'' );
                                  //myarray.push(test[j].product_id);
                                  if(test[j].product_id == product_id)
                                  {
                                    qty = test[j].product_qty;break;
                                  }
                              }
                              //myApp.alert('qty: ' + qty, '');
                            /*
                            cadd += '<center><span style="display: block; color: black;" id="pd_' + product_id +'">' + price + '<a href="#" onclick="RemoveProduct2(' + "'" + product_id +  "','" + product_name  +  "','" + product_price  + "')" + '";' + '><img src="img/minus-64.png" style="width: 35px; height:35px;"></a>';
                            cadd += '<span id="lblqty_' + product_id + '" style="width: 50px; display: inline-block; background-color: #fff;line-height: 36px; vertical-align: top;">Qty ' + qty + ' </span><input type="hidden" style="width:10px;" value="' + qty +'" id="qty_' + product_id + '">';
                            cadd += '<a href="#" onclick="AddProduct2(' + "'" + product_id +  "','" + product_name  +  "','" + product_price  + "')" + '";' + '><img src="img/plus-64.png" style="width: 35px; height:35px;"></a></span>';
                            
                            cadd += '<span style="display: none; color: black;" id="pa_' + product_id +'">' + price + ' <a style="width:100px;" href="#" class="link button button-small button-fill color-red" onclick="AddProduct(' + "'" + product_id +  "','" + product_name  +  "','" + product_price  + "');" + '">Add </a></span></center>';
                            */
                            //</span><span style="width: 50px; display: inline-block; background-color: #fff;line-height: 36px; vertical-align: top;">

                            /*
                            cadd += '<center>';

                            cadd += '<span id="lblqty_' + product_id + '" style=" display: inline-block; background-color: #fff;line-height: 36px; vertical-align: top;"><a style="width:80px;" href="#" class="link button button-small button-fill color-red" onclick="Pchange(' + "'" + product_id + "');" + '">Update</a></span>';

                            cadd += '<span id="txtqty_' + product_id + '" style="display: inline-block; background-color: #fff;line-height: 36px; vertical-align: top;">&nbsp;&nbsp;Qty <input maxlength="4" type="number" style="width:29px; padding-right: 20px !important; text-align: left;" value="' + qty +'" id="qty_' + product_id + '"></span>&nbsp;&nbsp;';
                            
                            cadd += '<span style="display: inline-block; color: black;" id="pd_' + product_id +'"> <a style="width:80px;" href="#" class="link button button-small button-fill color-red" onclick="RemoveProductNew(' + "'" + product_id +  "','" + product_name  +  "','" + product_price  + "');" + '">Remove</a></span></center>' + "\n\n";

                            cadd += '<center><span style="display: none; color: black;" id="pa_' + product_id +'"> <a style="width:100px;" href="#" class="link button button-small button-fill color-red" onclick="AddProduct(' + "'" + product_id +  "','" + product_name  +  "','" + product_price  + "');" + '">Add</a></span></center>';
                            */

                            //myApp.alert('test','')
                            cadd += '<center>';

                            //cadd += '<span id="lblqty_' + product_id + '" style=" display: inline-block; background-color: #fff;line-height: 36px; vertical-align: top;"><a style="width:80px;" href="#" class="link button button-small button-fill color-red" onclick="Pchange(' + "'" + product_id + "');" + '">Update</a></span>';

                            //cadd += '<span id="txtqty_' + product_id + '" style="display: inline-block; background-color: #fff;line-height: 36px; vertical-align: top;">&nbsp;&nbsp;Qty <input maxlength="4" type="number" style="width:29px; padding-right: 20px !important; text-align: left;" value="' + qty +'" id="qty_' + product_id + '"></span>&nbsp;&nbsp;';
                            
                            //cadd += '<span style="display: inline-block; color: black;" id="pd_' + product_id +'"> <a style="width:80px;" href="#" class="link button button-small button-fill color-red" onclick="RemoveProductNew(' + "'" + product_id +  "','" + product_name  +  "','" + product_price  + "');" + '">Remove</a></span></center>' + "\n\n";

                            //cadd += '<center><span style="display: none; color: black;" id="pa_' + product_id +'"> <a style="width:100px;" href="#" class="link button button-small button-fill color-red" onclick="AddProduct(' + "'" + product_id +  "','" + product_name  +  "','" + product_price  + "');" + '">Add</a></span></center>';

                           cadd += '<span style="display: block; color: black;" id="pd_' + product_id +'">' + price + ' <a href="#" class="link button button-small button-fill color-red" style="width: 100px;" onclick="RemoveProduct(' + "'" + product_id +  "','" + product_name  +  "','" + product_price  + "');" + '">Remove</a></span>';
                           cadd += '<span style="display: none; color: black;" id="pa_' + product_id +'">' + price + ' <a href="#" class="link button button-small button-fill color-red" style="width: 100px;" onclick="AddProduct(' + "'" + product_id +  "','" + product_name  +  "','" + product_price + "','" + product_image + "');" + '">Add</a></span>';
                           cadd += '<center>';

                        }else
                        {
                          //cadd += '<span style="display: none; color: black;" id="pd_' + product_id +'">' + price + ' <a href="#" class="link" onclick="RemoveProduct(' + "'" + product_id +  "','" + product_name  +  "','" + product_price  + "');" + '">Remove 2</a></span>';

                          /*
                            cadd += '<center><span style="display: none; color: black;" id="pd_' + product_id +'">' + price + '<a href="#" onclick="RemoveProduct2(' + "'" + product_id +  "','" + product_name  +  "','" + product_price  + "')" + '";' + '><img src="img/minus-64.png" style="width: 35px; height:35px;"></a>';
                            cadd += '<span id="lblqty_' + product_id + '" style="width: 50px; display: inline-block; background-color: #fff;line-height: 36px; vertical-align: top;">Qty 1 </span><input type="hidden" style="width:10px;" value="1" id="qty_' + product_id + '">';
                            cadd += '<a href="#" onclick="AddProduct2(' + "'" + product_id +  "','" + product_name  +  "','" + product_price  + "')" + '";' + '><img src="img/plus-64.png" style="width: 35px; height:35px;"></a></span>';
                            
                            cadd += '<span style="display: block; color: black;" id="pa_' + product_id +'">' + price + ' <a style="width:100px;" href="#" class="link button button-small button-fill color-red" onclick="AddProduct(' + "'" + product_id +  "','" + product_name  +  "','" + product_price  + "');" + '">Add</a></span></center>';
                            */

                        /**/
                        /*
                            qty =1;
                            cadd += '<center>';

                            cadd += '<span id="lblqty_' + product_id + '" style="display: none; background-color: #fff;line-height: 36px; vertical-align: top;"><a style="width:80px;" href="#" class="link button button-small button-fill color-red" onclick="Pchange(' + "'" + product_id + "');" + '">Update</a></span>';

                            cadd += '<span id="txtqty_' + product_id + '" style="display: none; background-color: #fff;line-height: 36px; vertical-align: top;">&nbsp;&nbsp;Qty <input maxlength="4" type="number" style="width:29px;padding-right: 20px !important; text-align: left;" value="' + qty +'" id="qty_' + product_id + '"></span>&nbsp;&nbsp;';
                            
                            cadd += '<span style="display: none; color: black;" id="pd_' + product_id +'"> <a style="width:80px;" href="#" class="link button button-small button-fill color-red" onclick="RemoveProductNew(' + "'" + product_id +  "','" + product_name  +  "','" + product_price  + "');" + '">Remove</a></span></center>' + "\n\n";

                            cadd += '<center><span style="display: block; color: black;" id="pa_' + product_id +'"> <a style="width:100px;" href="#" class="link button button-small button-fill color-red" onclick="AddProduct(' + "'" + product_id +  "','" + product_name  +  "','" + product_price  + "');" + '">Add</a></span></center>';
                            */

                            //cadd += '<center><span style="display: none; color: black;" id="pd_' + product_id +'">' + price + '<a href="#" onclick="RemoveProduct2(' + "'" + product_id +  "','" + product_name  +  "','" + product_price  + "')" + '";' + '><img src="img/minus-64.png" style="width: 35px; height:35px;"></a>';
                            //cadd += '<span id="lblqty_' + product_id + '" style="width: 50px; display: inline-block; background-color: #fff;line-height: 36px; vertical-align: top;">Qty 1 </span><input type="hidden" style="width:10px;" value="1" id="qty_' + product_id + '">';
                            //cadd += '<a href="#" onclick="AddProduct2(' + "'" + product_id +  "','" + product_name  +  "','" + product_price  + "')" + '";' + '><img src="img/plus-64.png" style="width: 35px; height:35px;"></a></span>';
                            
                            //cadd += '<span style="display: block; color: black;" id="pa_' + product_id +'">' + price + ' <a style="width:100px;" href="#" class="link button button-small button-fill color-red" onclick="AddProduct(' + "'" + product_id +  "','" + product_name  +  "','" + product_price  + "');" + '">Add</a></span></center>';

                            //cadd += '<center>';
                            cadd += '<center><span style="display: none; color: black;" id="pd_' + product_id +'">' + price + '<a href="#" class="link button button-small button-fill color-red" onclick="RemoveProduct2(' + "'" + product_id +  "','" + product_name  +  "','" + product_price  + "')" + '";' + '>Remove</a></span></center>';
                            cadd += '<center><span style="display: block; color: black;" id="pa_' + product_id +'"> <a style="width:100px;" href="#" class="link button button-small button-fill color-red" onclick="AddProduct(' + "'" + product_id +  "','" + product_name  +  "','" + product_price +  "','" + product_image + "');" + '">Add</a></span></center>';
                           //cadd += '<center>';
                        }

                        //cadd += '<br /><a href="#" onclick="RemoveProduct2(' + "'" + product_id +  "','" + product_name  +  "','" + product_price  + "')" + '";' + '><img src="img/minus-64.png" style="width: 35px; height:35px;"></a>';
                        //cadd += '<span id="lblqty_' + product_id + '" style="width: 50px; display: inline-block; background-color: #fff;line-height: 36px; vertical-align: top;">Qty 1 </span><input type="hidden" style="width:10px;" value="0" id="qty_' + product_id + '">';
                        //cadd += '<a href="#" onclick="AddProduct2(' + "'" + product_id +  "','" + product_name  +  "','" + product_price  + "')" + '";' + '><img src="img/plus-64.png" style="width: 35px; height:35px;"></a>';


                      //}
                      //cadd += '               </a>';
                      //cadd += '               <a class="external" href="' + urldecode(e.data.brochure[i].brochure_pdf)  + '"' + '>' + brochure_fname + '</a>';
                      cadd += '           </div>' + "\n\n";
                      
                      if(b == 0)
                      {
                        cadd += '      </div>' + "\n\n";
                      }
                    }
                    console.log(cadd)

                    //console.log(localStorage.getItem("local_products"));

                    $$("#productsdetails2").html(cadd);
                    $$("#category_name").html(category);
                                  
              }else
              {
                  //myApp.alert('error: ' + e.status,  '');
                  myApp.alert(e.message,  ''); 
              }
          },
          error: function (xhr, status)
          {
              myApp.hideIndicator();

              if(status == 0)
              {
                  myApp.alert('Please Check Internet',  ''); 
              }else
              {
                  myApp.alert('failure * ' +  status,  '');  
              };
          }
      });

    
});


function AddProduct2(id,product_name, product_price)
    {
      //myApp.alert(id,'')
      //myApp.alert(product_name,'')
      //myApp.alert(product_price,'')
      qtyvar = "qty_" + id;
      qty = $$("#" + qtyvar).val();
      //qty = $$("#qty_112").val();
      //myApp.alert(qty,'')
      qty2 = parseInt(qty)+1;
      if(qty2 >100)
      {
        qty2 = 100;
      }

      $$("#qty_" + id).val(qty2);
      //$$("#lblqty_" + id).html('Qty ' + qty2);
      $$("#lblqty_" + id).html(qty2);
      $$("#qty2_" + id).val(qty2);
      //$$("#lblqty2_" + id).html('Qty ' + qty2);
      $$("#lblqty2_" + id).html(qty2);

      UpdateQty(id, qty2);
    }

function RemoveProduct2(id,product_name, product_price)
    {
      //myApp.alert(id,'')
      //myApp.alert(product_name,'')
      //myApp.alert(product_price,'')
      qtyvar = "qty_" + id;
      qty = $$("#" + qtyvar).val();

      if(isNaN(qty))
      {
        qty = 0;
      }
      //qty = $$("#qty_112").val();
      //myApp.alert(qty,'')
      qty2 = parseInt(qty)-1;
      if(qty2 <0)
      {
        qty2 = 0;
      }

      if(qty2 == 0)
      {
        qty3 = 1;
      }else
      {
        qty3 = qty2;
      }

      $$("#qty_" + id).val(qty3);
      //myApp.alert(qty3,'')
      //$$("#lblqty_" + id).html('Qty ' + qty3);
      $$("#lblqty_" + id).html(qty3);
      $$("#qty2_" + id).val(qty3);
      //$$("#lblqty2_" + id).html('Qty ' + qty3);
      $$("#lblqty2_" + id).html(qty3);

      //myApp.alert(qty2,''); return false;

      if(qty2 == 0)
      {
        RemoveProduct(id,product_name, product_price);
      }else
      {
        UpdateQty(id, qty2);
      }
    }

function RemoveProductNew(id,product_name, product_price)
{
    $$("#lblqty_"+id).hide();
    $$("#txtqty_"+id).hide();
    $$("#pd_"+id).hide();
    $$("#pa_"+id).show();

    $$("#qty_"+id).val(1);
    RemoveProduct(id,product_name, product_price);
}

function Pchange(id)
{
    qty = $$("#qty_"+id).val();
    qty = parseInt(qty);
    //myApp.alert('id ' + id + ' qty: ' + qty,'')
    if(qty <1 || isNaN(qty))
    {
        myApp.alert('Please Enter correct Quantity','')
    }else{
        myApp.alert('Product Updated','')
        UpdateQty(id, qty);
    }

    //$$("#t_amt2").html(qty);
    //myApp.alert(qty,'');//return false;
}

function UpdateQty(id, qty)
{
    //myApp.alert('id: '+id + ' qty: '+qty,'')

    $$("#lblqty_"+id).show();
    $$("#txtqty_"+id).show();
    $$("#pd_"+id).show();
    $$("#pa_"+id).hide();

    $$("#" + "lblqty_" + id).css("display", "inline-block");
    $$("#" + "txtqty_" + id).css("display", "inline-block");
    $$("#" + "pd_" + id).css("display", "inline-block");

   var mlen = 0;
    //a_session_id = localStorage.getItem("a_session_id");
  local_products = localStorage.getItem("local_products");
  //alert('local_products <br>' + local_products)
  console.log(local_products);
  if(local_products === null || local_products === 'undefined')
  {
  }else{
  //myApp.alert('length ' + local_products.length,'')

    if(local_products.length>0)
    {
      //myApp.alert('local_products ' + local_products,'')

      test = JSON.parse(local_products);
      mlen = test.length;
    }
  }

  var myarray = [];
  if(myarray.indexOf(id) == -1) 
    {
        //myarray.push(id);
        //myApp.alert('not found : ' + cat_name);
        //console.log("is in array");
        //myApp.alert(uloc_id + ' ' + comp_cat_id + ' * ' + cat_name , '');
    }

    //a_session_id = localStorage.getItem("a_session_id");
    local_products = localStorage.getItem("local_products");
    //alert('local_products <br>' + local_products)
    if(local_products === null || local_products === 'undefined')
    {
        local_products = '';
        localStorage.setItem("local_products", local_products);
    }
    //myApp.alert('length ' + local_products.length,'')

    if(local_products.length>0)
    {
      //myApp.alert('local_products ' + local_products,'')

      test = JSON.parse(local_products);
      //myApp.alert('test.length ' + test.length);
      //myApp.alert('product_id ' + test[0].product_id);
      //test = JSON.parse(local_products);
      
      var myarray = [];
      for(j = 0; j<test.length; j++)
      {
          //myApp.alert(test[j].product_id);
          myarray.push(test[j].product_id);
      }
      //for(j = 0; j<test.length; j++)
      //{
          //myApp.alert(test[j].product_id);
          //product_id = test[j].product_id;
          //if(product_id != id)
          if(myarray.indexOf(id) != -1)   
          {
              //myApp.alert('product ' + id + ' matching','')

              t5 ='';
              for(j = 0; j<test.length; j++)
              {
                  //myApp.alert(test[j].product_id);
                  //myarray.push(test[j].product_id);
                  if(test[j].product_id == id)
                  {
                    t5 += ',{"product_id": "' + test[j].product_id + '", "product_name": "' + test[j].product_name + '", "product_qty": "' + qty + '", "product_price": "' + test[j].product_price + '", "product_image": "' + test[j].product_image + '"}';
                  }else
                  {
                    t5 += ',{"product_id": "' + test[j].product_id + '", "product_name": "' + test[j].product_name + '", "product_qty": "' + test[j].product_qty + '", "product_price": "' + test[j].product_price + '", "product_image": "' + test[j].product_image + '"}';
                  }
              }

              t5 = '[' + t5.substring(1, (t5.length)) + ']';
              //myApp.alert(t5,'');

              console.log(t5)
              localStorage.setItem("local_products", t5);
              //t4 = JSON.parse(t3);
              //myApp.alert('product_name2 ' + t4[0].product_name)
              //myApp.alert('Product Updated','')
          }
    }else{
      myApp.alert('blank array U','')
      
    }

}

function AddProduct111(id,product_name, product_price)
{
    //$$("#" + "pa_" + id).hide();
    $$("#" + "lblqty_" + id).show();
    //$$("#" + "pd_" + id).show();
    $$("#" + "lblqty_" + id).css("display", "inline-block");
    $$("#" + "pd_" + id).css("display", "inline-block");
}

function AddProduct(id,product_name, product_price, product_image)
{
    //myApp.alert($$("#qty_87").val(),'');return false;
  //myApp.alert(id,'')
  //myApp.alert(product_name,'')
  //myApp.alert(product_price,'')
  //myApp.alert(product_image,'')

  //var pid = "p_" + id;
  //alert(pid)
  //$$("#" + "pa_" + id).hide();
  //$$("#" + "pd_" + id).show();

    $$("#" + "lblqty_" + id).css("display", "inline-block");
    $$("#" + "pd_" + id).css("display", "inline-block");


  //$$("#" + "pd_" + id).css("display", "block");

  $$("#elist").show();
  //myApp.alert("#" + "pd_" + id, '');

  //eturn false;

  var myarray = [];
  if(myarray.indexOf(id) == -1) 
    {
        //myarray.push(id);
        //myApp.alert('not found : ' + cat_name);
        //console.log("is in array");
        //myApp.alert(uloc_id + ' ' + comp_cat_id + ' * ' + cat_name , '');
    }

    var product_qty =1;
    var mlen = 0;
    //a_session_id = localStorage.getItem("a_session_id");
    local_products = localStorage.getItem("local_products");
    //alert('local_products <br>' + local_products)
    console.log(local_products);

    if(local_products === null || local_products === 'undefined')
    {
        local_products = '';
        t = '[{"product_id": "' + id + '", "product_name": "' + product_name + '", "product_qty": "' + product_qty + '", "product_price": "' + product_price + '", "product_image": "' + product_image+ '"}]';
        //myApp.alert(t,'')
        t2 = JSON.parse(t);
        //myApp.alert(product_name + ' ' + t2[0].product_name)
        localStorage.setItem("local_products", t);
        //localStorage.setItem("local_products", local_products);
    }else{
        //myApp.alert('length ' + local_products.length,'')

      if(local_products.length>0)
      {
        //myApp.alert('local_products ' + local_products,'')

        test = JSON.parse(local_products);
        //myApp.alert('test.length ' + test.length);
        //myApp.alert('product_id ' + test[0].product_id);
        //test = JSON.parse(local_products);
        
        var myarray = [];
        for(j = 0; j<test.length; j++)
        {
            //myApp.alert(test[j].product_id);
            myarray.push(test[j].product_id);
        }
        mlen = test.length;
        //for(j = 0; j<test.length; j++)
        //{
            //myApp.alert(test[j].product_id);
            //product_id = test[j].product_id;
            //if(product_id != id)

            if(test.length >0)
            {
              if(myarray.indexOf(id) == -1)   
              {
                  t = ',{"product_id": "' + id + '", "product_name": "' + product_name + '", "product_qty": "' + product_qty + '", "product_price": "' + product_price + '", "product_image": "' + product_image+ '"}]';
                   //t2 = JSON.parse(t);
                   //myApp.alert('product_name  ' + t2[0].product_name)
                   t3 = local_products.substring(0, (local_products.length-1)) + t;
                    //myApp.alert('t3 ' + t3);
                    console.log(t3)
                   localStorage.setItem("local_products", t3);
                   //t4 = JSON.parse(t3);
                   //myApp.alert('product_name2 ' + t4[0].product_name)
                   myApp.alert('Product ' + product_name + ' added','')
                   mlen = parseInt(mlen) + 1;
              }
            }else{
              if(myarray.indexOf(id) == -1)   
              {
                  t = '{"product_id": "' + id + '", "product_name": "' + product_name + '", "product_qty": "' + product_qty + '", "product_price": "' + product_price + '", "product_image": "' + product_image + '"}]';
                   //t2 = JSON.parse(t);
                   //myApp.alert('product_name  ' + t2[0].product_name)
                   t3 = local_products.substring(0, (local_products.length-1)) + t;
                    //myApp.alert('t3 ' + t3);
                    console.log(t3)
                   localStorage.setItem("local_products", t3);
                   //t4 = JSON.parse(t3);
                   //myApp.alert('product_name2 ' + t4[0].product_name)
                   myApp.alert('Product ' + product_name + ' added','')
                   mlen = parseInt(mlen) + 1;
              }
            }
        //}
      }else{
        //myApp.alert('new array','')

        t = '[{"product_id": "' + id + '", "product_name": "' + product_name + '", "product_qty": "' + product_qty + '", "product_price": "' + product_price + '", "product_image": "' + product_image+ '"}]';
                   //t2 = JSON.parse(t);
                   //myApp.alert('product_name  ' + t2[0].product_name)
                   t3 = local_products.substring(0, (local_products.length-1)) + t;
                    //myApp.alert('t3 ' + t3);
                    console.log(t3)
                   localStorage.setItem("local_products", t3);
                   //t4 = JSON.parse(t3);
                   //myApp.alert('product_name2 ' + t4[0].product_name)
                   myApp.alert('Product ' + product_name + ' added','')
                   mlen =  1;
      }
    }
    /*
      t = '[{"product_id": "' + id + '", "product_name": "' + product_name + '", "product_price": "' + product_price + '"}]';
       t2 = JSON.parse(t);
       alert(product_name + ' ' + t2[0].product_name)
       localStorage.setItem("local_products", t);
    */
    //myApp.alert(t3,'')
    console.log(t3);
    if(mlen == 0)
    {
      mlen = '';
    }else
    {
      mlen = mlen + " Products";
    }
    $$("#t_amt2").html(mlen);
    //AddProduct2(id,product_name, product_price);
    UpdateQty(id, 1);
}

function RemoveProduct(id,product_name, product_price)
{
  //myApp.alert(id,'')
  //myApp.alert(product_name,'')
  //myApp.alert(product_price,'')
  $$("#" + "pa_" + id).show();
  $$("#" + "pd_" + id).hide();
  $$("#" + "divd_" + id).hide();

  //eturn false;
  var mlen = 0;
    //a_session_id = localStorage.getItem("a_session_id");
  local_products = localStorage.getItem("local_products");
  //alert('local_products <br>' + local_products)
  console.log(local_products);
  if(local_products === null || local_products === 'undefined')
  {
  }else{
  //myApp.alert('length ' + local_products.length,'')

    if(local_products.length>0)
    {
      //myApp.alert('local_products ' + local_products,'')

      test = JSON.parse(local_products);
      mlen = test.length;
    }
  }

  var myarray = [];
  if(myarray.indexOf(id) == -1) 
    {
        //myarray.push(id);
        //myApp.alert('not found : ' + cat_name);
        //console.log("is in array");
        //myApp.alert(uloc_id + ' ' + comp_cat_id + ' * ' + cat_name , '');
    }

    //a_session_id = localStorage.getItem("a_session_id");
    local_products = localStorage.getItem("local_products");
    //alert('local_products <br>' + local_products)
    if(local_products === null || local_products === 'undefined')
    {
        local_products = '';
        localStorage.setItem("local_products", local_products);
    }
    //myApp.alert('length ' + local_products.length,'')

    if(local_products.length>0)
    {
      //myApp.alert('local_products ' + local_products,'')

      test = JSON.parse(local_products);
      //myApp.alert('test.length ' + test.length);
      //myApp.alert('product_id ' + test[0].product_id);
      //test = JSON.parse(local_products);
      
      var myarray = [];
      for(j = 0; j<test.length; j++)
      {
          //myApp.alert(test[j].product_id);
          myarray.push(test[j].product_id);
      }
      //for(j = 0; j<test.length; j++)
      //{
          //myApp.alert(test[j].product_id);
          //product_id = test[j].product_id;
          //if(product_id != id)
          if(myarray.indexOf(id) != -1)   
          {
              //myApp.alert('product ' + id + ' matching','')

              t5 ='';
              for(j = 0; j<test.length; j++)
              {
                  //myApp.alert(test[j].product_id);
                  //myarray.push(test[j].product_id);
                  if(test[j].product_id != id)
                  {
                    t5 += ',{"product_id": "' + test[j].product_id + '", "product_name": "' + test[j].product_name + '", "product_qty": "' + test[j].product_qty + '", "product_price": "' + test[j].product_price + '"}';
                  }
              }

              t5 = '[' + t5.substring(1, (t5.length)) + ']';
              //myApp.alert(t5);

              console.log(t5)
              localStorage.setItem("local_products", t5);
              //t4 = JSON.parse(t3);
              //myApp.alert('product_name2 ' + t4[0].product_name)
              myApp.alert('Product ' + product_name + ' removed','')
              mlen = parseInt(mlen) - 1;
          }
      //}
    }else{
      myApp.alert('blank array 2','')
      
    }

    if(mlen == 0)
    {
      mlen = '';
      $$("#elist").hide();
    }else
    {
      mlen = mlen + " Products";
    }
    $$("#t_amt2").html(mlen);
    /*
      t = '[{"product_id": "' + id + '", "product_name": "' + product_name + '", "product_price": "' + product_price + '"}]';
       t2 = JSON.parse(t);
       alert(product_name + ' ' + t2[0].product_name)
       localStorage.setItem("local_products", t);
    */
}

function ProductDetails(id, img)
{

    //myApp.alert(id + ' * ' + img,'')

    var myPhotoBrowserStandalone = myApp.photoBrowser({
              photos : [
                  img
              ],
              zoom: true,
              swipeToClose: false,
              exposition: false,
              toolbar: false
          });
      //Open photo browser on click
    myPhotoBrowserStandalone.open();
}

myApp.onPageInit('brochure', function (page) {

  //myApp.alert('brochure started','');
  url = srvURL + '/brochure';
    $$.ajax({
          url: url,
          method: "GET",
          data: {},
          processData: true,
          dataType: 'json',
          timeout : 50000,
          success: function (e, status, xhr)
          {
              //myApp.hidePreloader();

              if(e.status == 'success')
              {
                  //myApp.alert('session_id ' + e.session_id,  ''); 

                  //myApp.alert('test Server',  '');   

                  total = e.data.brochure.length;
                   //myApp.alert(totalalerts);

                  cadd = '';
                  for(i=0; i< total; i++)
                  {
                      brochure_id = e.data.brochure[i].brochure_id;
                      //alert(brochure_id);
                      datec = e.data.brochure[i].datec;

                      status = e.data.brochure[i].status;

                      brochure_name = urldecode(e.data.brochure[i].brochure_name);
                      brochure_image = urldecode(e.data.brochure[i].brochure_image);
                      brochure_pdf = urldecode(e.data.brochure[i].brochure_pdf);
                      brochure_fname = urldecode(e.data.brochure[i].brochure_fname);

                      var b= i%2;
                      var b =0;
                      //alert(b)
                      if(b == 0)
                      {
                        cadd += '<div class="row">';
                      }

                      cadd += '           <div class="col-100" style="background: transparent;">';
                      cadd += '               <a href="#" onclick="downbrochure(' + "'" + urldecode(e.data.brochure[i].brochure_pdf) + "');" + '">';
                      cadd += '                   <img src="' + brochure_image + '" style="width: 100%;"/></a>';
                      cadd += '                  <span><center><a style="color: black;" href="#" onclick="downbrochure(' + "'" + urldecode(e.data.brochure[i].brochure_pdf) + "');" + '">' + brochure_name + '</a></center></span>';
                      //cadd += '               </a>';
                      //cadd += '               <a class="external" href="' + urldecode(e.data.brochure[i].brochure_pdf)  + '"' + '>' + brochure_fname + '</a>';
                      cadd += '           </div>';
                      
                      //if(b == 1)
                      {
                        cadd += '      </div>';
                      }
                    }
                    console.log(cadd)
                    $$("#brochuredetails").html(cadd);
                                  
              }else
              {
                  //myApp.alert('error: ' + e.status,  '');
                  myApp.alert(e.message,  ''); 
              }
          },
          error: function (xhr, status)
          {
              myApp.hideIndicator();

              if(status == 0)
              {
                  myApp.alert('Please Check Internet',  ''); 
              }else
              {
                  myApp.alert('failure * ' +  status,  '');  
              };
          }
      });
});

function downbrochure(URL)
{
  //myApp.alert(URL,'')
  //downloader.init({folder: "dvjdesign", unzip: true});
  //downloader.get(URL);
  window.open( URL, '_system');
}

function downbrochure11(URL)
{
  myApp.alert(URL,'')
  Folder_Name = 'abc';
  File_Name = 'sample.pdf';
  window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, fileSystemSuccess, fileSystemFail);

function fileSystemSuccess(fileSystem) {
    var download_link = encodeURI(URL);
    //ext = download_link.substr(download_link.lastIndexOf('.') + 1); //Get extension of URL

    var directoryEntry = fileSystem.root; // to get root path of directory
    //alert('main source: ' + directoryEntry);

    directoryEntry.getDirectory(Folder_Name, { create: true, exclusive: false }, onDirectorySuccess, onDirectoryFail); // creating folder in sdcard
    var rootdir = fileSystem.root;
    //var fp = rootdir.fullPath.toURL(); // Returns Fulpath of local directory
    var fp = rootdir.toURL(); // Returns Fulpath of local directory
    alert('fp1: ' + fp)
    //fp = fp + "/" + Folder_Name + "/" + File_Name + "." + ext; // fullpath and name of the file which we want to give
    //fp = fp + "/" + app_name + "/"  + Folder_Name + "/" + File_Name; // fullpath and name of the file which we want to give
    fp = fp + "/" + app_name + "/"  + Folder_Name + "/" + File_Name; // fullpath and name of the file which we want to give
    alert('fp2: ' + fp)
    // download function call
    filetransfer(download_link, fp);
  }


  function onDirectorySuccess(parent) {
      // Directory created successfuly
      alert('directory created')
  }

  function onDirectoryFail(error) {
      //Error while creating directory
      alert("Unable to create new directory: " + error.code);
  }

  function fileSystemFail(evt) {
    //Unable to access file system
    alert(evt.target.error.code);
 }
}

function filetransfer(download_link, fp) 
{
    var fileTransfer = new FileTransfer();
    // File download function with URL and local path
    alert(download_link);
    fileTransfer.download(download_link, fp,
                        function (entry) 
                        {
                            alert("download complete: " + entry.fullPath);
                           alert("folder: " + fp);
                    },
                 function (error) {
                     //Download abort errors or download failed errors
                     alert("folder: " + fp);
                     alert("download error source: " + error.source);
                     alert("download error target " + error.target);
                     //alert("upload error code" + error.code);
                 }
            );
}


function downbrochure2(id)
{
  myApp.alert(id, '')
  var fileTransfer = new FileTransfer();
  var uri = encodeURI(id);

  fileTransfer.download(
      uri,
      fileURL,
      function(entry) {
          console.log("download complete: " + entry.toURL());
      },
      function(error) {
          console.log("download error source " + error.source);
          console.log("download error target " + error.target);
          console.log("download error code" + error.code);
      },
      false,
      {
          headers: {
              "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
          }
      }
  );
}


myApp.onPageBeforeInit('index', function (page) {

  var swiper = new Swiper('.swiper-container', {
        zoom: false,
        pagination: '.swiper-pagination',
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        autoplay: 2500
    });

}).trigger(); //And trigger it right away

myApp.onPageInit('index', function (page) {

 var swiper = new Swiper('.swiper-container', {
        zoom: false,
        pagination: '.swiper-pagination',
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        autoplay: 2500
    });
});


myApp.onPageInit('contact', function (page) {

 //myApp.alert('in contact','');

 dvj_logged_in = localStorage.getItem("dvj_logged_in");
 dvj_session_id = localStorage.getItem("dvj_session_id");
 //alert(dvj_logged_in)

 if(dvj_logged_in)
 {

        url = srvURL + '/dealer_data';
          console.log(url);
          //myApp.alert('url ' + url, '');
          //alert(url);//return false;
          //$_GET[“mode_of_operation”], $_GET[“pressure_drop_check”], $_GET[“gland”], $_GET[“bearing”], $_GET[“vibration”], $_GET[“remark”]

          $$.ajax({
              url: url,
              method: "POST",
              data: {session_id: dvj_session_id },
              processData: true,
              dataType: 'json',
              timeout : 50000,
              success: function (e, status, xhr)
              {
                  //myApp.hidePreloader();

                  if(e.status== 'success')
                  {
                      //myApp.alert('session_id ' + e.session_id,  ''); 

                      //myApp.alert('Data Stored on the Server',  '');   

                              
                      datec = e.data.profile[0].datec;
                      dealer_name = urldecode(e.data.profile[0].dealer_name);
                      dealer_address = urldecode(e.data.profile[0].dealer_address);
                      dealer_contact_person = urldecode(e.data.profile[0].dealer_contact_person);
                      dealer_mobile = e.data.profile[0].dealer_mobile;
                      dealer_email = urldecode(e.data.profile[0].dealer_email);
                      dealer_profile = urldecode(e.data.profile[0].dealer_profile);
                      dealer_status = e.data.profile[0].dealer_status;

                      $$("#name").val(dealer_name);
                      //$$("#dealer_address").val(dealer_address);
                      //$$("#dealer_contact_person").val(dealer_contact_person);
                      $$("#mobile").val(dealer_mobile);
                      $$("#email").val(dealer_email);
                      //$$("#dealer_profile").val(dealer_profile);
                  }else
                  {
                      //myApp.alert('error: ' + e.status,  '');
                      myApp.alert(e,  ''); 
                  }
              },
              error: function (xhr, status)
              {
                  myApp.hideIndicator();

                  if(status == 0)
                  {
                      myApp.alert('Please Check Internet',  ''); 
                  }else
                  {
                      myApp.alert('failure * ' +  status,  '');  
                  };
              }
          });
      }

   var mlen = 0;
    //a_session_id = localStorage.getItem("a_session_id");
      local_products = localStorage.getItem("local_products");
      //alert('local_products <br>' + local_products)
      console.log(local_products);
      if(local_products === null || local_products === 'undefined')
      {
      }else{
      //myApp.alert('length ' + local_products.length,'')

        if(local_products.length>0)
        {
          //myApp.alert('local_products ' + local_products,'')

          test = JSON.parse(local_products);
          mlen = test.length;
        }
      }

    var myarray = [];

    //a_session_id = localStorage.getItem("a_session_id");
    local_products = localStorage.getItem("local_products");
    //alert('local_products <br>' + local_products)
    if(local_products === null || local_products === 'undefined')
    {
        local_products = '';
        localStorage.setItem("local_products", local_products);
    }
    //myApp.alert('length ' + local_products.length,'')

    if(local_products.length>0)
    {
      //myApp.alert('local_products ' + local_products,'')

      test = JSON.parse(local_products);
      //myApp.alert('test.length ' + test.length);
      //myApp.alert('product_id ' + test[0].product_id);
      //test = JSON.parse(local_products);
      
      var myarray = [];
      for(j = 0; j<test.length; j++)
      {
          //myApp.alert(test[j].product_id);
          myarray.push(test[j].product_id);
      }
      //for(j = 0; j<test.length; j++)
      //{
          //myApp.alert(test[j].product_id);
          //product_id = test[j].product_id;
          //if(product_id != id)
              //myApp.alert('product ' + id + ' matching','')

              t5 ='';
              elist = '';
              //myApp.alert(test.length,'')
              if(test.length >0)
              {
                  //elist += '<div class="row home"><div class="col-50" style="background-color: #000; color: #fff;"><b>Image</b></div>';
                  //elist += '<div class="col-50" style="background-color: #000; color: #fff;"><b>Product Name</b></div>';
                  //elist += '<div class="col-20" style="background-color: #000; color: #fff;"><b>Qty/Pcs</b></div>';
                  //elist += '<div class="col-10" style="background-color: #000; color: #fff;"><b>Remove</b></div>';

                  elist += '<div class="row no-gutter">';
                  elist += '      <div class="col-20" style="background-color: #000; color: #fff; font-size: 12px;">Image</div>';
                  elist += '      <div class="col-40" style="background-color: #000; color: #fff; font-size: 12px;">Product Name</div>';
                  elist += '      <div class="col-20" style="background-color: #000; color: #fff; font-size: 12px;">Qty/Pcs</div>';
                  elist += '      <div class="col-15" style="background-color: #000; color: #fff; font-size: 12px;">Remove</div>';
                  elist += '      <div class="col-5"  style="background-color: #000; color: #fff; font-size: 12px;">&nbsp;</div>';
                  elist += '    </div>';
                  elist += '</div>' + "\n\n";

                  for(j = 0; j<test.length; j++)
                  {
                      //myApp.alert(test[j].product_id);
                      
                        t5 += ',{"product_id": "' + test[j].product_id + '", "product_name": "' + test[j].product_name + '", "product_qty": "' + test[j].product_qty + '", "product_price": "' + test[j].product_price + '", "product_image": "' + test[j].product_image + '"}';
                        
                        product_id = test[j].product_id;
                        product_name = test[j].product_name;
                        price = test[j].product_price;
                        product_price = test[j].product_price;
                        product_image = test[j].product_image;
                        qty = test[j].product_qty;
                        price ='';

                        //elist += '<div class="col-25">Product ID: ' + test[j].product_id + '</div>';
                        elist += '<div class="row no-gutter" id="divd_' + product_id +'">';
                        elist += '<div class="col-20" style="background-color: transparent;"><img src=' + test[j].product_image + ' height="60"></div>';
                        elist += '<div class="col-40" style="background-color: transparent; color: #000;">' + test[j].product_name + '</div>';
                        //elist += '<div class="col-50">' + test[j].product_qty + '</div></div>';
                        //elist += 'Product ID: ' + test[j].product_id + '<br>';

                        //elist += '<div class="col-50"><span style="display: block; color: black; height:20px; text-align: left;" id="pd2_' + product_id +'">' + price + '<a href="#" onclick="RemoveProduct2(' + "'" + product_id +  "','" + product_name  +  "','" + product_price  + "')" + '";' + '><img src="img/minus-64.png" style="width: 35px; height:35px;"></a>';
                        //elist += '<span id="lblqty2_' + product_id + '" style="width: 50px; display: inline-block; background-color: #fff;line-height: 36px; vertical-align: top;">Qty ' + qty + ' </span><input type="hidden" style="width:10px;" value="' + qty + '" id="qty2_' + product_id + '">';
                        //elist += '<a href="#" onclick="AddProduct2(' + "'" + product_id +  "','" + product_name  +  "','" + product_price  + "')" + '";' + '><img src="img/plus-64.png" style="width: 35px; height:35px;"></a></span></div></div>' + "\n\n";

                        //elist += '<div class="col-20"><span style="display: block; color: black; height:20px; text-align: left;" id="pd2_' + product_id +'">' + '';
                        elist += '<div class="col-28" style="background-color: transparent; "><span style="display: block; color: black; height:20px; text-align: left;" id="pd2_' + product_id +'">' + price + '';
                        //elist += '<span id="lblqty2_' + product_id + '" style="width: 100px; display: inline-block; background-color: #fff;line-height: 36px; vertical-align: top;">' + qty + ' </span><input type="hidden" style="width:10px;" value="' + qty + '" id="qty2_' + product_id + '"></div>';

                        elist += '<center><span style="display: none1; color: black;" id="pd_' + product_id +'">' + price + '<a href="#" onclick="RemoveProduct2(' + "'" + product_id +  "','" + product_name  +  "','" + product_price  +  "','" + qty  + "')" + '";' + '><img src="images/minus.png" style="width: 20px; height:20px;"></a>';
                        //elist += '<span id="lblqty_' + product_id + '" style="width: 30px; display: inline-block; background-color: transparent; line-height: 36px; vertical-align: top; font-size:20px;">' + qty +' </span><input type="hidden1" style="width:10px;" value="' + qty + '" id="qty_' + product_id + '">';
                        elist += '<span id="lblqty_' + product_id + '" style="width: 0px; display: inline-block; background-color: transparent; line-height: 36px; vertical-align: top; font-size:20px;"></span><input type="text" style="width:10px;margin: 5px; padding:5px !important;" value="' + qty + '" id="qty_' + product_id + '">';
                        elist += '<a href="#" onclick="AddProduct2(' + "'" + product_id +  "','" + product_name  +  "','" + product_price  + "')" + '";' + '><img src="images/plus.png" style="width: 20px; height:20px;"></a></span>';
                        //elist += '<img src="img/plus-64.png" style="width: 35px; height:35px;">';
                        elist += '</div>';

                        elist += '<div class="col-8" style="background-color: transparent; ">' + '<a href="#" onclick="RemoveProductNew(' + "'" + product_id +  "','" + product_name  +  "','" + product_price  + "');" + '"><img src="images/x.png" style="width: 20px; height:20px;"></a>' + '</div>';
                        elist += '<div class="col-2" style="background-color: transparent; ">&nbsp;</div>';
                        elist += '</div>' + "\n\n";

                        console.log(elist)
                        //myApp.alert(elist)
                        //elist += '<a href="#" class="link button button-small button-fill color-red" onclick="RemoveProductNew(' + "'" + product_id +  "','" + product_name  +  "','" + product_price  + "')" + '";' + '>Remove</a></span></div></div>' + "\n\n";
                        //<a style="width:100px;" href="#" class="link button button-small button-fill color-red" onclick="RemoveProductNew(' + "'" + product_id +  "','" + product_name  +  "','" + product_price  + "');" + '">Remove</a>
                  }

                  t5 = '[' + t5.substring(1, (t5.length)) + ']';
              }
              console.log(elist);
              //myApp.alert(elist);
              //myApp.alert(t5);

              console.log(t5)
              $$("#elistcontact").html(elist);
              //localStorage.setItem("local_products", t5);
              //t4 = JSON.parse(t3);
              //myApp.alert('product_name2 ' + t4[0].product_name)
              //myApp.alert('Product Updated','')
          
    }else{
      //myApp.alert('blank array','')
      
    }

 $$('#contact1btn').on('click', function()
     {
         dvj_session_id = localStorage.getItem("dvj_session_id");
         //alert(dvj_session_id)
         if(dvj_session_id == null || dvj_session_id =='undefined')
         {
            dvj_session_id = '';
         }
        //myApp.alert('clicked contact1btn','')
        name = $$("#name").val();
        mobile = $$("#mobile").val();
        email = $$("#email").val();
        msg = $$("#msg").val();
        var errmessage = '';
        var valid = 1;

        if(name.length <= 0)
        {
            errmessage += 'Please Enter Name <br>';
            //myApp.alert('Please enableter user id');
            //$$('#username').css('border','1px solid red');
            valid = 0;
        }
        if(mobile.length <= 9)
        {
            errmessage += 'Please Enter Mobile <br>';
            valid = 0;
        }
        if(msg.length <= 0)
        {
            errmessage += 'Please Enter Message <br>';
            //myApp.alert('Please enableter user id');
            //$$('#username').css('border','1px solid red');
            valid = 0;
        }
        if(valid == 0)
        {
            myApp.alert(errmessage,'');
        }
        if(valid == '1')
        {
          //myApp.alert('Will post','');
          local_products = localStorage.getItem("local_products");
          url = srvURL + '/enquiry';
            console.log(url);
            //myApp.alert('url ' + url, '');
            //alert(url);//return false;
            //$_GET[“mode_of_operation”], $_GET[“pressure_drop_check”], $_GET[“gland”], $_GET[“bearing”], $_GET[“vibration”], $_GET[“remark”]

            $$.ajax({
                url: url,
                method: "POST",
                data: {session_id: dvj_session_id, enquiry_name: name, enquiry_mobile: mobile, enquiry_emailid: email, enquiry_msg: msg, enquiry_product: local_products},
                processData: true,
                dataType: 'json',
                timeout : 50000,
                success: function (e, status, xhr)
                {
                    //myApp.hidePreloader();

                    if(e.status== 'success')
                    {
                        //myApp.alert('session_id ' + e.session_id,  ''); 

                        myApp.alert('Enquiry Saved',  '');  
                        localStorage.setItem("local_products", ''); 

                        mainView.router.load({
                                url: 'index.html',
                                context: {}});                      
                    }else
                    {
                        //myApp.alert('error: ' + e.status,  '');
                        myApp.alert(e.message,  ''); 
                    }
                },
                error: function (xhr, status)
                {
                    myApp.hideIndicator();

                    if(status == 0)
                    {
                        myApp.alert('Please Check Internet',  ''); 
                    }else
                    {
                        myApp.alert('failure * ' +  status,  '');  
                    };
                }
            });

        }
    });

});


myApp.onPageInit('search', function (page) {

 //myApp.alert('in search','');

 
    var myarray = [];

    local_products = localStorage.getItem("local_products");
    //alert('local_products <br>' + local_products)
    if(local_products === null || local_products === 'undefined')
    {
    }else{
    //myApp.alert('length ' + local_products.length,'')

      if(local_products.length>0)
      {
        //myApp.alert('local_products ' + local_products,'')

        test = JSON.parse(local_products);
        //myApp.alert('test.length ' + test.length);
        //myApp.alert('product_id ' + test[0].product_id);
        //test = JSON.parse(local_products);
        
        for(j = 0; j<test.length; j++)
        {
            //myApp.alert(test[j].product_id);
            myarray.push(test[j].product_id);
        }
      }}



 $$('#search1btn').on('click', function()
     {

        //myApp.alert('clicked search1btn','')
        errmessage = '';
        valid = '1';
        text = $$("#text").val();

        if(text.length <= 0)
        {
            errmessage += 'Please Enter Search Text <br>';
            //myApp.alert('Please enableter user id');
            //$$('#username').css('border','1px solid red');
            valid = 0;
        }
       
        if(valid == 0)
        {
            myApp.alert(errmessage,'');
        }
        if(valid == '1')
        {
          //myApp.alert('Will post','');
          local_products = localStorage.getItem("local_products");
          url = srvURL + '/search';
            console.log(url);
            //myApp.alert('url ' + url, '');
            //alert(url);//return false;
            //$_GET[“mode_of_operation”], $_GET[“pressure_drop_check”], $_GET[“gland”], $_GET[“bearing”], $_GET[“vibration”], $_GET[“remark”]

            $$.ajax({
                url: url,
                method: "POST",
                data: {text: text},
                processData: true,
                dataType: 'json',
                timeout : 50000,
                success: function (e, status, xhr)
                {
                    //myApp.hidePreloader();

                    if(e.status== 'success')
                    {
                        //myApp.alert('session_id ' + e.session_id,  ''); 

                        //myApp.alert('Search Data',  '');  

                        total = e.data.products.length;
                        myApp.alert("Result " + total + " found",'');

                      cadd = '';
                      for(i=0; i< total; i++)
                      {
                          product_id = e.data.products[i].product_id;
                          //alert(brochure_id);
                          datec = e.data.products[i].datec;

                          status = e.data.products[i].status;
                          product_price = e.data.products[i].product_price;
                          is_new_arrival = e.data.products[i].is_new_arrival;

                          category_id = urldecode(e.data.products[i].category_id);
                          product_image = urldecode(e.data.products[i].product_image);
                          bigproduct_image = urldecode(e.data.products[i].bigproduct_image);
                          product_name = urldecode(e.data.products[i].product_name);
                          product_price = urldecode(e.data.products[i].product_price);
                          //brochure_fname = urldecode(e.data.products[i].brochure_fname);
                         
                          var b= i%1;
                          //alert(b)
                          if(b == 0)
                          {
                            cadd += '<div class="row">' + "\n\n";
                          }
                          if(dvj_logged_in == 'yes')
                          {
                            //price = 'Rs ' + product_price + ' <br>';
                            price = product_price + ' <br>';
                          }else
                          {
                            price = '';
                          }

                          cadd += '           <div class="col-100" style="background: transparent;">';
                          cadd += '               <a href="#" onclick="ProductDetails(' + "'" + product_id +"','" + bigproduct_image +  "');" + '">';
                          cadd += '                   <img src="' + product_image + '" style="width: 100%;"/></a>';
                          cadd += '                  <div><center><a style="color: black; font-size: 22px;" href="#" onclick="ProductDetails(' + "'" + product_id +"','" + bigproduct_image +  "');" + '">' + product_name + '</a>';
                          if(dvj_logged_in == 'yes')
                          {
                            cadd += '<br><p color: black; font-size: 22px;">Price: ' + price + '</p>';
                          }
                          cadd += '</center></div>' + "\n\n";

                        if(myarray.indexOf(product_id) != -1)   
                        {
                           //myApp.alert('matching product_id ' + product_id)
                           //cadd += '<span style="display: block; color: black;" id="pd_' + product_id +'">' + price + ' <a href="#" class="link" onclick="RemoveProduct(' + "'" + product_id +  "','" + product_name  +  "','" + product_price  + "');" + '">Remove 1</a></span>';
                           //cadd += '<span style="display: none; color: black;" id="pa_' + product_id +'">' + price + ' <a href="#" class="link" onclick="AddProduct(' + "'" + product_id +  "','" + product_name  +  "','" + product_price  + "');" + '">Add 1</a></span>';

                            for(j = 0; j<test.length; j++)
                              {
                                  //myApp.alert(test[j].product_id + ' ' + test[j].product_name + ' ' + test[j].product_qty,'' );
                                  //myarray.push(test[j].product_id);
                                  if(test[j].product_id == product_id)
                                  {
                                    qty = test[j].product_qty;break;
                                  }
                              }
                              //myApp.alert('qty: ' + qty, '');

                            /*
                            cadd += '<center>';

                            cadd += '<span id="lblqty_' + product_id + '" style=" display: inline-block; background-color: #fff;line-height: 36px; vertical-align: top;"><a style="width:80px;" href="#" class="link button button-small button-fill color-red" onclick="Pchange(' + "'" + product_id + "');" + '">Update</a></span>';

                            cadd += '<span id="txtqty_' + product_id + '" style="display: inline-block; background-color: #fff;line-height: 36px; vertical-align: top;">&nbsp;&nbsp;Qty <input maxlength="4" type="number" style="width:29px; padding-right: 20px !important; text-align: left;" value="' + qty +'" id="qty_' + product_id + '"></span>&nbsp;&nbsp;';
                            
                            cadd += '<span style="display: inline-block; color: black;" id="pd_' + product_id +'"> <a style="width:80px;" href="#" class="link button button-small button-fill color-red" onclick="RemoveProductNew(' + "'" + product_id +  "','" + product_name  +  "','" + product_price  + "');" + '">Remove</a></span></center>' + "\n\n";

                            cadd += '<center><span style="display: none; color: black;" id="pa_' + product_id +'"> <a style="width:100px;" href="#" class="link button button-small button-fill color-red" onclick="AddProduct(' + "'" + product_id +  "','" + product_name  +  "','" + product_price  + "');" + '">Add</a></span></center>';
                            */

                            cadd += '<center>';

                            //cadd += '<span id="lblqty_' + product_id + '" style=" display: inline-block; background-color: #fff;line-height: 36px; vertical-align: top;"><a style="width:80px;" href="#" class="link button button-small button-fill color-red" onclick="Pchange(' + "'" + product_id + "');" + '">Update</a></span>';

                            //cadd += '<span id="txtqty_' + product_id + '" style="display: inline-block; background-color: #fff;line-height: 36px; vertical-align: top;">&nbsp;&nbsp;Qty <input maxlength="4" type="number" style="width:29px; padding-right: 20px !important; text-align: left;" value="' + qty +'" id="qty_' + product_id + '"></span>&nbsp;&nbsp;';
                            
                            cadd += '<span style="display: inline-block; color: black;" id="pd_' + product_id +'"> <a style="width:80px;" href="#" class="link button button-small button-fill color-red" onclick="RemoveProductNew(' + "'" + product_id +  "','" + product_name  +  "','" + product_price  + "');" + '">Remove</a></span></center>' + "\n\n";

                            cadd += '<center><span style="display: none; color: black;" id="pa_' + product_id +'"> <a style="width:100px;" href="#" class="link button button-small button-fill color-red" onclick="AddProduct(' + "'" + product_id +  "','" + product_name  +  "','" + product_price +  "','" + product_image  + "');" + '">Add</a></span></center>';
                        }else
                        {

                            qty =1;
                            /*
                            cadd += '<center>';

                            cadd += '<span id="lblqty_' + product_id + '" style="display: none; background-color: #fff;line-height: 36px; vertical-align: top;"><a style="width:80px;" href="#" class="link button button-small button-fill color-red" onclick="Pchange(' + "'" + product_id + "');" + '">Update</a></span>';

                            cadd += '<span id="txtqty_' + product_id + '" style="display: none; background-color: #fff;line-height: 36px; vertical-align: top;">&nbsp;&nbsp;Qty <input maxlength="4" type="number" style="width:29px;padding-right: 20px !important; text-align: left;" value="' + qty +'" id="qty_' + product_id + '"></span>&nbsp;&nbsp;';
                            
                            cadd += '<span style="display: none; color: black;" id="pd_' + product_id +'"> <a style="width:80px;" href="#" class="link button button-small button-fill color-red" onclick="RemoveProductNew(' + "'" + product_id +  "','" + product_name  +  "','" + product_price  + "');" + '">Remove</a></span></center>' + "\n\n";

                            cadd += '<center><span style="display: block; color: black;" id="pa_' + product_id +'"> <a style="width:100px;" href="#" class="link button button-small button-fill color-red" onclick="AddProduct(' + "'" + product_id +  "','" + product_name  +  "','" + product_price  + "');" + '">Add</a></span></center>';
                            */

                            cadd += '<center>';

                            //cadd += '<span id="lblqty_' + product_id + '" style="display: none; background-color: #fff;line-height: 36px; vertical-align: top;"><a style="width:80px;" href="#" class="link button button-small button-fill color-red" onclick="Pchange(' + "'" + product_id + "');" + '">Update</a></span>';

                            //cadd += '<span id="txtqty_' + product_id + '" style="display: none; background-color: #fff;line-height: 36px; vertical-align: top;">&nbsp;&nbsp;Qty <input maxlength="4" type="number" style="width:29px;padding-right: 20px !important; text-align: left;" value="' + qty +'" id="qty_' + product_id + '"></span>&nbsp;&nbsp;';
                            
                            cadd += '<span style="display: none; color: black;" id="pd_' + product_id +'"> <a style="width:80px;" href="#" class="link button button-small button-fill color-red" onclick="RemoveProductNew(' + "'" + product_id +  "','" + product_name  +  "','" + product_price  + "');" + '">Remove</a></span></center>' + "\n\n";

                            cadd += '<center><span style="display: block; color: black;" id="pa_' + product_id +'"> <a style="width:100px;" href="#" class="link button button-small button-fill color-red" onclick="AddProduct(' + "'" + product_id +  "','" + product_name  +  "','" + product_price  +  "','" + product_image + "');" + '">Add</a></span></center>';
                        }

                        cadd += '           </div>' + "\n\n";
                      
                          if(b == 0)
                          {
                            cadd += '      </div>' + "\n\n";
                          }
                       }
                        console.log(cadd)

                        //console.log(localStorage.getItem("local_products"));

                        $$("#productsdetails2").html(cadd);

                        //mainView.router.load({
                        //        url: 'index.html',
                        //        context: {}});                      
                    }else
                    {
                        //myApp.alert('error: ' + e.status,  '');
                        myApp.alert(e.message,  ''); 
                    }
                },
                error: function (xhr, status)
                {
                    myApp.hideIndicator();

                    if(status == 0)
                    {
                        myApp.alert('Please Check Internet',  ''); 
                    }else
                    {
                        myApp.alert('failure * ' +  status,  '');  
                    };
                }
            });

        }
    });

});


myApp.onPageBeforeInit('dealer_profile', function (page) {

/*
 dvj_logged_in = localStorage.getItem("dvj_logged_in");
 dvj_session_id = localStorage.getItem("dvj_session_id");
 //alert(dvj_logged_in)

 if(dvj_logged_in)
 {}else{ myApp.alert('Please Login 1',''); 

          mainView.router.load({
                                url: 'index.html',
                                context: {}}); 
        }

*/


  //mainView.router.load({url: 'login.html'})



});

myApp.onPageInit('dealer_profile', function (page) {

 //myApp.alert('in dealer_profile','');

    if (!myApp.device.ios) {
    $$(page.container).find('input, textarea').on('focus', function (event) 
    {
        var container = $$(event.target).closest('.page-content');
        var elementOffset = $$(event.target).offset().top;
        var pageOffset = container.scrollTop();
        var newPageOffset = pageOffset + elementOffset - 81;
        
        //myApp.alert('newPageOffset1 ' + newPageOffset, '');
        
        setTimeout(function () {
            container.scrollTop(newPageOffset, 300);
        }, 700);
    });
    }




  $$('#climit').hide();
  $$('#cpass').on('change', function()
  {
      cpass = $$('#cpass').is(":checked");
      if(cpass == true)
      {
          $$('#climit').show();
      }else
      {
          $$('#climit').hide();
      }
  });

 dvj_logged_in = localStorage.getItem("dvj_logged_in");
 dvj_session_id = localStorage.getItem("dvj_session_id");
 //alert(dvj_logged_in)

 if(dvj_logged_in)
 {}else{ myApp.alert('Please Login',''); 

      
                                return 1;}

        url = srvURL + '/dealer_data';
          console.log(url);
          //myApp.alert('url ' + url, '');
          //alert(url);//return false;
          //$_GET[“mode_of_operation”], $_GET[“pressure_drop_check”], $_GET[“gland”], $_GET[“bearing”], $_GET[“vibration”], $_GET[“remark”]

          $$.ajax({
              url: url,
              method: "POST",
              data: {session_id: dvj_session_id },
              processData: true,
              dataType: 'json',
              timeout : 50000,
              success: function (e, status, xhr)
              {
                  //myApp.hidePreloader();

                  if(e.status== 'success')
                  {
                      //myApp.alert('session_id ' + e.session_id,  ''); 

                      //myApp.alert('Data Stored on the Server',  '');   

                              
                      datec = e.data.profile[0].datec;
                      dealer_name = urldecode(e.data.profile[0].dealer_name);
                      dealer_address = urldecode(e.data.profile[0].dealer_address);
                      dealer_contact_person = urldecode(e.data.profile[0].dealer_contact_person);
                      dealer_mobile = e.data.profile[0].dealer_mobile;
                      dealer_email = urldecode(e.data.profile[0].dealer_email);
                      dealer_profile = urldecode(e.data.profile[0].dealer_profile);
                      dealer_status = e.data.profile[0].dealer_status;

                      $$("#dealer_name").val(dealer_name);
                      $$("#dealer_address").val(dealer_address);
                      $$("#dealer_contact_person").val(dealer_contact_person);
                      $$("#dealer_mobile").val(dealer_mobile);
                      $$("#dealer_email").val(dealer_email);
                      $$("#dealer_profile").val(dealer_profile);
                  }else
                  {
                      //myApp.alert('error: ' + e.status,  '');
                      myApp.alert(e,  ''); 
                  }
              },
              error: function (xhr, status)
              {
                  myApp.hideIndicator();

                  if(status == 0)
                  {
                      myApp.alert('Please Check Internet',  ''); 
                  }else
                  {
                      myApp.alert('failure * ' +  status,  '');  
                  };
              }
          });


    $$('#dealerupdbtn').on('click', function()
     {
        //myApp.alert('clicked dealerupdbtn','')
        dealer_name = $$("#dealer_name").val();
        dealer_address = $$("#dealer_address").val();
        dealer_contact_person = $$("#dealer_contact_person").val();
        dealer_mobile = $$("#dealer_mobile2").val();
        dealer_email = $$("#dealer_email").val();
        dealer_password = $$("#dealer_password").val();
        dealer_profile = $$("#dealer_profile").val();

        var errmessage = '';
        var valid = 1;

        if(dealer_name.length <= 0)
        {
            errmessage += 'Please Enter Company Name <br>';
            //myApp.alert('Please enableter user id');
            //$$('#username').css('border','1px solid red');
            valid = 0;
        }
        if(dealer_mobile.length <= 9)
        {
            errmessage += 'Please Enter Mobile <br>';
            valid = 0;
        }
        if(dealer_address.length <= 0)
        {
            errmessage += 'Please Enter Address <br>';
            //myApp.alert('Please enableter user id');
            //$$('#username').css('border','1px solid red');
            valid = 0;
        }
        if(dealer_contact_person.length <= 0)
        {
            errmessage += 'Please Enter Contact person <br>';
            //myApp.alert('Please enableter user id');
            //$$('#username').css('border','1px solid red');
            valid = 0;
        }
        if(dealer_email.length <= 0)
        {
            errmessage += 'Please Enter Email ID <br>';
            //myApp.alert('Please enableter user id');
            //$$('#username').css('border','1px solid red');
            valid = 0;
        }
        if(dealer_profile.length <= 0)
        {
            errmessage += 'Please Enter Company Profile <br>';
            //myApp.alert('Please enableter user id');
            //$$('#username').css('border','1px solid red');
            valid = 0;
        }

        cpass = $$('#cpass').is(":checked");
        if(cpass == true)
        {
          if(dealer_password.length <= 3)
          {
              errmessage += 'Please Enter Password <br>';
              //myApp.alert('Please enableter user id');
              //$$('#username').css('border','1px solid red');
              valid = 0;
          }
        }else
        {
          $$("#dealer_password").val('');
          dealer_password = '';
        }

        if(valid == 0)
        {
            myApp.alert(errmessage,'');
        }
        if(valid == '1')
        {
          //myApp.alert('Will post','');
           dvj_session_id = localStorage.getItem("dvj_session_id");

          url = srvURL + '/dealer_profile';
            console.log(url);
            //myApp.alert('url ' + url, '');
            //alert(url);//return false;
            //$_GET[“mode_of_operation”], $_GET[“pressure_drop_check”], $_GET[“gland”], $_GET[“bearing”], $_GET[“vibration”], $_GET[“remark”]

            $$.ajax({
                url: url,
                method: "POST",
                data: {session: dvj_session_id, dealer_name: dealer_name, dealer_address: dealer_address, dealer_contact_person: dealer_contact_person, dealer_mobile: dealer_mobile, dealer_email: dealer_email, dealer_profile: dealer_profile, dealer_password: dealer_password },
                processData: true,
                dataType: 'json',
                timeout : 50000,
                success: function (e, status, xhr)
                {
                    //myApp.hidePreloader();

                    if(e.status== 'success')
                    {
                        //myApp.alert('session_id ' + e.session_id,  ''); 

                        myApp.alert('Profile Updated',  '');   

                        mainView.router.load({
                                url: 'index.html',
                                context: {}});                      
                    }else
                    {
                        //myApp.alert('error: ' + e.status,  '');
                        myApp.alert(e,  ''); 
                    }
                },
                error: function (xhr, status)
                {
                    myApp.hideIndicator();

                    if(status == 0)
                    {
                        myApp.alert('Please Check Internet',  ''); 
                    }else
                    {
                        myApp.alert('failure * ' +  status,  '');  
                    };
                }
            });

        }
    });

});

myApp.onPageInit('dealer', function (page) {

 //myApp.alert('in dealer','');

    if (!myApp.device.ios) {
    $$(page.container).find('input, textarea').on('focus', function (event) 
    {
        var container = $$(event.target).closest('.page-content');
        var elementOffset = $$(event.target).offset().top;
        var pageOffset = container.scrollTop();
        var newPageOffset = pageOffset + elementOffset - 81;
        
        //myApp.alert('newPageOffset1 ' + newPageOffset, '');
        
        setTimeout(function () {
            container.scrollTop(newPageOffset, 300);
        }, 700);
    });
    }

 $$('#dealerregbtn').on('click', function()
     {
        //myApp.alert('clicked dealerregbtn','')
        dealer_name = $$("#dealer_name").val();
        dealer_address = $$("#dealer_address").val();
        dealer_contact_person = $$("#dealer_contact_person").val();
        dealer_mobile = $$("#dealer_mobile1").val();
        dealer_email = $$("#dealer_email").val();
        dealer_profile = $$("#dealer_profile").val();

        var errmessage = '';
        var valid = 1;

        if(dealer_name.length <= 0)
        {
            errmessage += 'Please Enter Company Name <br>';
            //myApp.alert('Please enableter user id');
            //$$('#username').css('border','1px solid red');
            valid = 0;
        }
        if(dealer_mobile.length <= 9)
        {
            errmessage += 'Please Enter Mobile <br>';
            valid = 0;
        }
        if(dealer_address.length <= 0)
        {
            errmessage += 'Please Enter Address <br>';
            //myApp.alert('Please enableter user id');
            //$$('#username').css('border','1px solid red');
            valid = 0;
        }
        if(dealer_contact_person.length <= 0)
        {
            errmessage += 'Please Enter Contact person <br>';
            //myApp.alert('Please enableter user id');
            //$$('#username').css('border','1px solid red');
            valid = 0;
        }
        if(dealer_email.length <= 0)
        {
            errmessage += 'Please Enter Email ID <br>';
            //myApp.alert('Please enableter user id');
            //$$('#username').css('border','1px solid red');
            valid = 0;
        }
        if(dealer_profile.length <= 0)
        {
            errmessage += 'Please Enter Company Profile <br>';
            //myApp.alert('Please enableter user id');
            //$$('#username').css('border','1px solid red');
            valid = 0;
        }
        if(valid == 0)
        {
            myApp.alert(errmessage,'');
        }
        if(valid == '1')
        {
          //myApp.alert('Will post','');

          url = srvURL + '/dealer_register';
            console.log(url);
            //myApp.alert('url ' + url, '');
            //alert(url);//return false;
            //$_GET[“mode_of_operation”], $_GET[“pressure_drop_check”], $_GET[“gland”], $_GET[“bearing”], $_GET[“vibration”], $_GET[“remark”]

            $$.ajax({
                url: url,
                method: "POST",
                data: {dealer_name: dealer_name, dealer_address: dealer_address, dealer_contact_person: dealer_contact_person, dealer_mobile: dealer_mobile, dealer_email: dealer_email, dealer_profile: dealer_profile },
                processData: true,
                dataType: 'json',
                timeout : 50000,
                success: function (e, status, xhr)
                {
                    //myApp.hidePreloader();

                    if(e.status== 'success')
                    {
                        //myApp.alert('session_id ' + e.session_id,  ''); 

                        myApp.alert('Registration Done',  '');   

                        mainView.router.load({
                                url: 'index.html',
                                context: {}});                      
                    }else
                    {
                        //myApp.alert('error: ' + e.status,  '');
                        myApp.alert(e.message,  ''); 
                    }
                },
                error: function (xhr, status)
                {
                    myApp.hideIndicator();

                    if(status == 0)
                    {
                        myApp.alert('Please Check Internet',  ''); 
                    }else
                    {
                        myApp.alert('failure * ' +  status,  '');  
                    };
                }
            });

        }
    });

});


myApp.onPageInit('aboutus', function (page) {

 //myApp.alert('in aboutus','');

 /*=== Default standalone ===*/
    var myPhotoBrowserPopup = myApp.photoBrowser({
        photos : [
            'http://www.dvj-design.com/img/brochure/8fecc19db32c9dc9b19b430c3a305ce9.jpg'
        ],
        type: 'page', 
        zoom: true,

        toolbar: false
    });
    //Open photo browser on click
    $$('.pb-standalone').on('click', function () 
    {
        myPhotoBrowserPopup.open();
    });

});


function ContactPage()
{

    //myApp.alert('in contact us','');

     dvj_session_id = localStorage.getItem("dvj_session_id");
         //alert(dvj_session_id)
         if(dvj_session_id == null || dvj_session_id =='undefined')
         {
             mainView.router.load({url: 'contact.html',ignoreCache: true});
         }else
         {
           
            local_products = localStorage.getItem("local_products");
            //alert('local_products <br>' + local_products)
            if(local_products === null || local_products === 'undefined')
            {
                mainView.router.load({url: 'contact.html',ignoreCache: true});
            }
            else
            {
                if(local_products.length<1)
                {
                     // myApp.alert('Please select products before sending any enquiry','');
                    mainView.router.load({url: 'contact.html',ignoreCache: true});

                    return true;
                }
                
            msg = 'Enquiry';
            var valid = 1;
            var valid = 0;
            if(valid == '0')
            {

                 // myApp.alert('Please select products before sending any enquiry','');
                mainView.router.load({url: 'contact.html',ignoreCache: true});

                return true;
               
            }

            if(valid == '1')
            {
              //myApp.alert('Will post','');

              url = srvURL + '/enquiry';
                console.log(url);
                //myApp.alert('url ' + url, '');
                //alert(url);//return false;
                //$_GET[“mode_of_operation”], $_GET[“pressure_drop_check”], $_GET[“gland”], $_GET[“bearing”], $_GET[“vibration”], $_GET[“remark”]

                $$.ajax({
                    url: url,
                    method: "POST",
                    data: {session_id: dvj_session_id, enquiry_msg: msg, enquiry_product: local_products},
                    processData: true,
                    dataType: 'json',
                    timeout : 50000,
                    success: function (e, status, xhr)
                    {
                        //myApp.hidePreloader();

                        if(e.status== 'success')
                        {
                            //myApp.alert('session_id ' + e.session_id,  ''); 

                            myApp.alert('Enquiry Saved',  '');   
                            localStorage.setItem("local_products", '');

                            mainView.router.load({
                                    url: 'index.html',
                                    context: {}});                      
                        }else
                        {
                            //myApp.alert('error: ' + e.status,  '');
                            myApp.alert(e.message,  ''); 
                        }
                    },
                    error: function (xhr, status)
                    {
                        myApp.hideIndicator();

                        if(status == 0)
                        {
                            myApp.alert('Please Check Internet',  ''); 
                        }else
                        {
                            myApp.alert('failure * ' +  status,  '');  
                        };
                    }
                });

            }
        }
    }

}

function sendID(id, platform)
{
    device_id= localStorage.getItem("device_uuid");
    device_platform= localStorage.getItem("device_platform");
    device_browser= localStorage.getItem("device_browser");
    session_version= localStorage.getItem("session_version");
    user_id = localStorage.getItem("dvj_vendor_id");

    //alert(device_id);

    //loc_id = localStorage.getItem("session_id_club_id");
    if(user_id == 'undefined' || user_id == null)
    {
        user_id='';
        //return false;
    }

    url = "http://www.dvj-design.com/api_dvj/send.php";

    $$.ajax({
            url: url,
            method: "POST",
            data: {id: id,  device: device_id, device_platform: device_platform, device_browser: device_browser, user_id: user_id},
            processData: true,
            dataType: 'json',
            timeout : 50000,
            success: function (e, status, xhr)
            {
                //myApp.alert(e.message,  ''); 
            },
            error: function (xhr, status)
            {
                myApp.hideIndicator();
            }
        });                 
}

function Notification()
{
    device_uuid = localStorage.getItem("device_uuid");

    var url = srvURL + "/myalert";//?mobile=9702502361&pass=9702502361
    
    var loc_id = '';
    $$.ajax({
        url: url,
        method: "POST",
        data: {device_uuid: device_uuid},
        processData: true,
        dataType: 'json',
        timeout : 50000,
        success: function (e, status, xhr)
        {
            //myApp.alert('sucess <br>' + JSON.stringify(e),  '');  
            
            //alert(JSON.parse(e));
            //var obj = JSON.parse(e);
            //myApp.alert('e.status ' + e.session_id,  '');  
            //myApp.alert('e.status ' + e.status,  '');  
            if(e.status == 'success')
            {
                //myApp.alert('session_id ' + e.session_id,  '');  
                //myApp.alert('Welcome ' + e.vendor_name,  ''); 
                totalalerts = e.data.alerts.length;
                //myApp.alert('totalalerts ' + totalalerts,  ''); 
                //myApp.alert(urldecode(e.data.history),  '');
                //myApp.alert(history,  '');

                 //var name = $$('#customer_fname2').val();
                //alert(cadd);
                //alert(history2);

                mainView.router.load({
                    url: 'alerts.html',
                    context: {
                       e: e
                    }
                });
            }else
            {
                //myApp.alert('error: ' + e.status,  '');
                myApp.alert(e.message,  ''); 
            }
        },
        error: function (xhr, status)
        {
            myApp.hideIndicator();

            if(status == 0)
            {
                myApp.alert('Please Check Internet',  ''); 
            }else
            {
                myApp.alert('failure * ' +  status,  '');  
            }
        }
    });
}

myApp.onPageInit('alerts', function (page) {
     //myApp.alert('hello',  '');   
     //tel =page.context.tel; 
     //myApp.alert(customer_fname);
     //myApp.alert(page.context.history, '');
     //$$("#customer_fname2").val(tel);
     //card = page.context.card;
     e = page.context.e;

     //myApp.alert(e);
     totalalerts = e.data.alerts.length;
     //myApp.alert(totalalerts);

    cadd = '';
    for(i=0; i< totalalerts; i++)
    {
        mess_id = e.data.alerts[i].mess_id;
        //alert(mess_id);

        datec = e.data.alerts[i].datec;
        m_status = e.data.alerts[i].m_status;
        message = urldecode(e.data.alerts[i].message);

        comp_details = '<p>';
        //comp_details += '<b>Name: </b>' +  m_status + '<br>';
        comp_details += '' +  message + '<br><br>';
        comp_details +=  datec ;

        comp_details += '</p>';

        cadd += '<div class="card"><div class="card-content"><div class="card-content-inner">' + comp_details + '</div></div></div>';
    }    

    if(totalalerts == 0)
    {
        cadd = '<div class="card"><div class="card-header">No New Alerts</div></div> ';
    }
    //alert(cadd)
    //myApp.alert(cadd);
     //history2 = page.context.history2;
     //comp_status = page.context.comp_status;
     //complain_id = page.context.complain_id;
     //loc_id = page.context.loc_id;

     //myApp.alert('alerts.html ' + card, '');
     $$("#showalert").html(cadd);
});


function Chat()
{
    dvj_logged_in = localStorage.getItem("dvj_logged_in");
    //myApp.alert(dvj_logged_in,'')
    if(dvj_logged_in == 'yes')
    {
        dvj_isadmin = localStorage.getItem("dvj_isadmin");
        //myApp.alert('dvj_isadmin ' + dvj_isadmin, '')
        if(dvj_isadmin == 0)
        {
            mainView.router.load({url: 'chat.html',context: {}});
        }else{
            mainView.router.load({url: 'chatlist.html',context: {}});            
        }
    }else{
        myApp.alert('Please login for the Chat option','')
    }
}

myApp.onPageInit('chatlist', function (page) {
    //myApp.alert('chatlist','')


    //chats += '                        <li>';
    //chats += '                          <div class="item-content">';
    //chats += '                            <div class="item-inner">';
    //chats += '                              <div class="item-title">Aaron </div>';
    //chats += '                            </div>';
    //chats += '                          </div>';
    //chats += '                        </li>';
    
    dvj_vendor_id = localStorage.getItem("dvj_vendor_id");
    dvj_vendor_name = localStorage.getItem("dvj_vendor_name");
    dvj_isadmin = localStorage.getItem("dvj_isadmin");
    device_uuid = localStorage.getItem("device_uuid");
    var url = srvURL + "/onlinelist";//?mobile=9702502361&pass=9702502361
    chats = '';

    $$.ajax({
        url: url,
        method: "POST",
        data: {device_uuid: device_uuid, vendor_id: dvj_vendor_id},
        processData: true,
        dataType: 'json',
        timeout : 50000,
        success: function (e, status, xhr)
        {            
            //myApp.alert(e.status,  ''); 
            if(e.status == 'success')
            {
                totalalerts = e.data.chat.length;
                //myApp.alert(totalalerts,  '');

                chats = '';
                chats += '<div class="list-group">';
                chats += '<ul style="background: transparent;">';
                
                for(i=0; i< totalalerts; i++)
                {
                    dealer_id = e.data.chat[i].dealer_id;
                    //alert(dealer_id);

                    last_online = e.data.chat[i].last_online;
                    dealer_name = urldecode(e.data.chat[i].dealer_name);
                    dealer_contact_person = urldecode(e.data.chat[i].dealer_contact_person);
                    //alert(dealer_contact_person);

                    chats += '<li>';
                    chats += '<div class="item-content">';
                    chats += '<div class="item-inner">';
                    chats += '<div class="item-title"><a href="#" onClick="ChatUser(' + "'" + dealer_id + "');" + '">' + dealer_contact_person + ' (' + last_online + ')' + '</a></div>';
                    chats += '</div>';
                    chats += '</div>';
                    chats += '</li>';
                    //myApp.alert(chats,'');
                }   
                chats += '                    </ul>';
                chats += '                    </div>';
                //myApp.alert(chats,'');
                //myApp.alert(e.message,  ''); 
                console.log(chats)
                //myApp.alert(chats,'')
                $$("#chatlist2").html(chats);
            }else
            {
                //myApp.alert('error: ' + e.status,  '');
                //myApp.alert(e.message,  ''); 
            }
        },
        error: function (xhr, status)
        {
            myApp.hideIndicator();

            if(status == 0)
            {
                myApp.alert('Please Check Internet',  ''); 
            }else
            {
                myApp.alert('failure * ' +  status,  '');  
            }
        }
    });

    //chats += '                        <li>';
    //chats += '                          <div class="item-content">';
    //chats += '                            <div class="item-inner">';
    //chats += '                              <div class="item-title">Abbie</div>';
    //chats += '                            </div>';
    //chats += '                          </div>';
    //chats += '                        </li>';
        
});

function ChatUser(user)
{
    //myApp.alert('Chat with user: ' + user,'')
    mainView.router.load({url: 'chat.html',context: {user: user}});
}

myApp.onPageInit('chat', function (page) {

//myApp.alert('I am in chat','')
    user =page.context.user; 
    //myApp.alert('start with user: ' + user,'')
    if(user == undefined)
    {
        toid = "admin";
    }else{
        toid = user;
    }
    //myApp.alert('start with user: ' + user,'')

    // Conversation flag
    var conversationStarted = false;
     
    // Init Messages
    var myMessages = myApp.messages('.messages', {
      autoLayout:true
    });
        
    dvj_vendor_id = localStorage.getItem("dvj_vendor_id");
    dvj_vendor_name = localStorage.getItem("dvj_vendor_name");
    dvj_isadmin = localStorage.getItem("dvj_isadmin");
    dvj_vendor_name = urldecode(dvj_vendor_name);
    //myApp.alert('dvj_vendor_id: ' + dvj_vendor_id + ' <br> dvj_vendor_name: '+dvj_vendor_name + '<br> dvj_isadmin: ' + dvj_isadmin,'')

    device_uuid = localStorage.getItem("device_uuid");
    var url = srvURL + "/chatlist";//?mobile=9702502361&pass=9702502361
    
    $$.ajax({
        url: url,
        method: "POST",
        data: {device_uuid: device_uuid, first: true, vendor_id: dvj_vendor_id, toid: toid},
        processData: true,
        dataType: 'json',
        timeout : 50000,
        success: function (e, status, xhr)
        {            
            //myApp.alert(e.status,  ''); 
            if(e.status == 'success')
            {
                totalalerts = e.data.chat.length;
                for(i=0; i< totalalerts; i++)
                {
                    chatid = e.data.chat[i].chatid;
                    //alert(mess_id);

                    datec = e.data.chat[i].datec;
                    readstatus = e.data.chat[i].readstatus;
                    to = e.data.chat[i].to;
                    fromname = urldecode(e.data.chat[i].fromname);
                    from = e.data.chat[i].from;
                    message = urldecode(e.data.chat[i].message);

                    if(dvj_vendor_id == from)
                    {
                        type = 'sent';
                    }else{
                        type = 'received';
                    }
                    //myApp.alert(e.status,  ''); 

                     var avatar, name;
                       myMessages.addMessage({
                        // Message text
                        text: message,
                        // Random message type
                        type: type,
                        // Avatar and name:
                        avatar: '',
                        name: fromname,
                        // Day
                        day: datec
                      })
                }   

                //myApp.alert(e.message,  ''); 
            }else
            {
                //myApp.alert('error: ' + e.status,  '');
                //myApp.alert(e.message,  ''); 
            }
        },
        error: function (xhr, status)
        {
            myApp.hideIndicator();

            if(status == 0)
            {
                myApp.alert('Please Check Internet',  ''); 
            }else
            {
                myApp.alert('failure * ' +  status,  '');  
            }
        }
    });

    setInterval(function()
    { 

        device_uuid = localStorage.getItem("device_uuid");
        var url = srvURL + "/chatlist";//?mobile=9702502361&pass=9702502361
        
        $$.ajax({
            url: url,
            method: "POST",
            data: {device_uuid: device_uuid, vendor_id: dvj_vendor_id, toid: toid},
            processData: true,
            dataType: 'json',
            timeout : 50000,
            success: function (e, status, xhr)
            {            
                //myApp.alert(e.status,  ''); 
                if(e.status == 'success')
                {
                    totalalerts = e.data.chat.length;
                    for(i=0; i< totalalerts; i++)
                    {
                        chatid = e.data.chat[i].chatid;
                        //alert(mess_id);

                        datec = e.data.chat[i].datec;
                        readstatus = e.data.chat[i].readstatus;
                        to = e.data.chat[i].to;
                        from = e.data.chat[i].from;
                        fromname = urldecode(e.data.chat[i].fromname);
                        message = urldecode(e.data.chat[i].message);

                        type = 'received';
                        if(to == '1')
                        {
                            type = 'sent';
                        }
                        //myApp.alert(e.status,  ''); 

                         var avatar, name;
                           myMessages.addMessage({
                            // Message text
                            text: message,
                            // Random message type
                            type: type,
                            // Avatar and name:
                            avatar: '',
                            name: fromname,
                            // Day
                            day: datec
                          })
                    }   

                    //myApp.alert(e.message,  ''); 
                }else
                {
                    //myApp.alert('error: ' + e.status,  '');
                    //myApp.alert(e.message,  ''); 
                }
            },
            error: function (xhr, status)
            {
                myApp.hideIndicator();

                if(status == 0)
                {
                    myApp.alert('Please Check Internet',  ''); 
                }else
                {
                    myApp.alert('failure * ' +  status,  '');  
                }
            }
        });

        //alert("Hello"); 
        /*
        var avatar, name;
       myMessages.addMessage({
        // Message text
        text: 'Hello',
        // Random message type
        type: 'sent',
        // Avatar and name:
        avatar: avatar,
        name: name,
        // Day
        day: !conversationStarted ? 'Today' : false,
        time: !conversationStarted ? (new Date()).getHours() + ':' + (new Date()).getMinutes() : false
      })
    
        */
    }, 5000);



// Init Messagebar
var myMessagebar = myApp.messagebar('.messagebar');
 //myApp.alert('I am in chat','')

// Handle message
$$('.messagebar .link').on('click', function () {
  // Message text
  var messageText = myMessagebar.value().trim();
  //myApp.alert('I am in 2','')

  // Exit if empy message
  if (messageText.length === 0) return;
 
  // Empty messagebar
  myMessagebar.clear()
 
  // Random message type
  var messageType = (['sent', 'received'])[Math.round(Math.random())];
 
  // Avatar and name for received message
  var avatar, name;
  if(messageType === 'received') {
    avatar = 'http://lorempixel.com/output/people-q-c-100-100-9.jpg';
    name = 'Kate';
  }
  avatar = '';
  name = 'anil';
  // Add message

    device_uuid = localStorage.getItem("device_uuid");
    var url = srvURL + "/chatnew";//?mobile=9702502361&pass=9702502361
    
    $$.ajax({
        url: url,
        method: "POST",
        data: {device_uuid: device_uuid, name: dvj_vendor_name, message: messageText,  vendor_id: dvj_vendor_id, toid: toid},
        processData: true,
        dataType: 'json',
        timeout : 50000,
        success: function (e, status, xhr)
        {            
            //myApp.alert('e.status ' + e.status,  '');  
            if(e.status == 'success')
            {
                //myApp.alert(e.message,  ''); 
            }else
            {
                //myApp.alert('error: ' + e.status,  '');
                //myApp.alert(e.message,  ''); 
            }
        },
        error: function (xhr, status)
        {
            myApp.hideIndicator();

            if(status == 0)
            {
                myApp.alert('Please Check Internet',  ''); 
            }else
            {
                myApp.alert('failure * ' +  status,  '');  
            }
        }
    });

var messageType = 'sent';
  myMessages.addMessage({
    // Message text
    text: messageText,
    // Random message type
    type: messageType,
    // Avatar and name:
    avatar: avatar,
    name: dvj_vendor_name,
    // Day
    day: !conversationStarted ? 'Today' : false,
    time: !conversationStarted ? (new Date()).getHours() + ':' + (new Date()).getMinutes() : false
  })
 
  // Update conversation flag
  conversationStarted = true;
});   

});