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

var srvURL = "http://www.bluapps.in/api_dvj/Serv";
if(hostname == 'localhost')
{
    var srvURL = "http://localhost/api_dvj/Serv";
}
var version = "100";
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

        if(page == 'index' || page == 'login') // || page == 'main'
        {
            // call this to get a new token each time. don't call it to reuse existing token.
            
            navigator.notification.confirm(
                'Wish to Exit App ?',  // message
                onBtnConfirm,              // callback to invoke with index of button pressed
                '',            // title
                'Yes,No'          // buttonLabels
            );
       
            //navigator.app.backHistory();
        }else
        {
            myApp.hideIndicator();
            mainView.router.back();
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
}

myApp.onPageBeforeInit('index', function (page) {

  //Do something here with home page
  //myApp.alert('01 index page initialized ' + page + ' name'  ,'');

  logged_in = localStorage.getItem("logged_in");
        

}).trigger(); //And trigger it right away

myApp.onPageInit('login', function (page) {
    //mainView.hideToolbar();
    //mainView.hideNavbar();
    // run createContentPage func after link was clicked
    //alert('hello');
   $$('#loginbtn').on('click', function()
    {
        username = $$('#username').val();
        password = $$('#password').val();

        device_id= localStorage.getItem("device_uuid");
        device_platform= localStorage.getItem("device_platform");

        //alert('hello ' + username);
        var formData = myApp.formToData('#my-form');
        //alert(JSON.stringify(formData));
        var valid = 1;
        var errmessage = '';

        if(username.length <= 0)
        {
            errmessage += 'Please enter user id <br>';
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
            
            var url = srvURL + "login";//?mobile=9702502361&pass=9702502361
            
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
                        myApp.alert('Welcome ' + e.vendor_name,  ''); 

                        localStorage.setItem("logged_in", "yes");
                        localStorage.setItem("a_session_id", e.session_id);
                        localStorage.setItem("a_vendor_id", e.user_id);
                        localStorage.setItem("a_vendor_name", e.vendor_name);
                        
                        //sendID();

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
                    }; 

                }
            });
            
 
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

        if(forgot_mobile_no.length <4)
        {
            errmessage += 'Please type Username (min 4 char) <br>';

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

            var url = srvURL + "vendor_forgot";//?mobile=9702502361&pass=9702502361
            
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

                      var b= i%2;
                      //alert(b)
                      if(b == 0)
                      {
                        cadd += '<div class="row">';
                      }

                      cadd += '           <div class="col-50">';
                      cadd += '               <a href="#" onclick="ProductDisplay(' + "'" + category_id + "','" + category_name  +"');" + '">';
                      cadd += '                   <img src=" ' + category_image + '" style=" height: 120px; width: 140px;"/></a>';
                      cadd += '                  <span style="color: black;"><a href="#" onclick="ProductDisplay(' + "'" + category_id + "','" + category_name  +"');" + '">' + category_name + '</a></span>';
                      //cadd += '               </a>';
                      //cadd += '               <a class="external" href="' + urldecode(e.data.brochure[i].brochure_pdf)  + '"' + '>' + brochure_fname + '</a>';
                      cadd += '           </div>';
                      
                      if(b == 1)
                      {
                        cadd += '      </div>';
                      }
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
                      product_name = urldecode(e.data.products[i].product_name);
                      //brochure_fname = urldecode(e.data.products[i].brochure_fname);

                      var b= i%2;
                      //alert(b)
                      if(b == 0)
                      {
                        cadd += '<div class="row">';
                      }

                      cadd += '           <div class="col-50">';
                      cadd += '               <a href="#" onclick="ProductDetails(' + "'" + product_id + "');" + '">';
                      cadd += '                   <img src=" ' + product_image + '" style=" height: 250px; width: 140px;"/></a>';
                      cadd += '                  <span style="color: black;"><a href="#" onclick="ProductDetails(' + "'" + product_id + "');" + '">' + product_name + '</a></span>';
                      //cadd += '               </a>';
                      //cadd += '               <a class="external" href="' + urldecode(e.data.brochure[i].brochure_pdf)  + '"' + '>' + brochure_fname + '</a>';
                      cadd += '           </div>';
                      
                      if(b == 1)
                      {
                        cadd += '      </div>';
                      }
                    }
                    console.log(cadd)
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

function ProductDetails(id)
{


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
                      //alert(b)
                      if(b == 0)
                      {
                        cadd += '<div class="row">';
                      }

                      cadd += '           <div class="col-50">';
                      cadd += '               <a href="#" onclick="downbrochure(' + "'" + urldecode(e.data.brochure[i].brochure_pdf) + "');" + '">';
                      cadd += '                   <img src=" ' + brochure_image + '" style=" height: 120px; width: 140px;"/></a>';
                      cadd += '                  <span style="color: black;"><a href="#" onclick="downbrochure(' + "'" + urldecode(e.data.brochure[i].brochure_pdf) + "');" + '">' + brochure_name + '</a></span>';
                      //cadd += '               </a>';
                      //cadd += '               <a class="external" href="' + urldecode(e.data.brochure[i].brochure_pdf)  + '"' + '>' + brochure_fname + '</a>';
                      cadd += '           </div>';
                      
                      if(b == 1)
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


myApp.onPageInit('index', function (page) {

 var mySwiper = new Swiper('.swiper-container', {
  preloadImages: false,
  lazyLoading: true,
  pagination: '.swiper-pagination'
})   

});