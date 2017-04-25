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

        if(page == 'index' ) // || page == 'main' || page == 'login'
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
                        
                        //sendID();

                        mainView.router.loadPage('index.html');                      
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
if(id)
{
  //myApp.alert(id.length,'')
}else{
  //myApp.alert('not defined','');
  return 1;
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
                      product_price = urldecode(e.data.products[i].product_price);
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

                      
                      //myApp.alert(myarray.indexOf(product_id))
                      if(myarray.indexOf(product_id) != -1)   
                      {
                        //myApp.alert('matching product_id ' + product_id)
                        cadd += '<br><span style="color: black;">' + 'Rs ' + product_price + ' <a href="#" onclick="RemoveProduct(' + "'" + product_id +  "','" + product_name  +  "','" + product_price  + "');" + '">Remove</a></span>';
                      }else
                      {
                        if(dvj_logged_in == 'yes')
                        {
                          cadd += '<br><span style="color: black;">' + 'Rs ' + product_price + ' <a href="#" onclick="AddProduct(' + "'" + product_id +  "','" + product_name  +  "','" + product_price  + "');" + '">Add</a></span>';
                        }
                      }

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

function AddProduct(id,product_name, product_price)
{
  //myApp.alert(id,'')
  //myApp.alert(product_name,'')
  //myApp.alert(product_price,'')

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
    alert('local_products <br>' + local_products)
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
      myApp.alert('test.length ' + test.length);
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
          if(myarray.indexOf(id) == -1)   
          {
              t = ',{"product_id": "' + id + '", "product_name": "' + product_name + '", "product_price": "' + product_price + '"}]';
               //t2 = JSON.parse(t);
               //myApp.alert('product_name  ' + t2[0].product_name)
               t3 = local_products.substring(0, (local_products.length-1)) + t;
                //myApp.alert('t3 ' + t3);
                console.log(t3)
               localStorage.setItem("local_products", t3);
               t4 = JSON.parse(t3);
               //myApp.alert('product_name2 ' + t4[0].product_name)
          }
      //}
    }else{
      //myApp.alert('new array','')

      t = '[{"product_id": "' + id + '", "product_name": "' + product_name + '", "product_price": "' + product_price + '"}]';
       t2 = JSON.parse(t);
       //myApp.alert(product_name + ' ' + t2[0].product_name)
       localStorage.setItem("local_products", t);
      
    }
    /*
      t = '[{"product_id": "' + id + '", "product_name": "' + product_name + '", "product_price": "' + product_price + '"}]';
       t2 = JSON.parse(t);
       alert(product_name + ' ' + t2[0].product_name)
       localStorage.setItem("local_products", t);
    */
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

 $$('#contact1btn').on('click', function()
     {
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

          url = srvURL + '/enquiry';
            console.log(url);
            //myApp.alert('url ' + url, '');
            //alert(url);//return false;
            //$_GET[“mode_of_operation”], $_GET[“pressure_drop_check”], $_GET[“gland”], $_GET[“bearing”], $_GET[“vibration”], $_GET[“remark”]

            $$.ajax({
                url: url,
                method: "POST",
                data: {enquiry_name: name, enquiry_mobile: mobile, enquiry_emailid: email, enquiry_msg: msg},
                processData: true,
                dataType: 'json',
                timeout : 50000,
                success: function (e, status, xhr)
                {
                    //myApp.hidePreloader();

                    if(e.status== 'success')
                    {
                        //myApp.alert('session_id ' + e.session_id,  ''); 

                        myApp.alert('Data Stored on the Server',  '');   

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


myApp.onPageInit('dealer_profile', function (page) {

 //myApp.alert('in dealer_profile','');

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
 {}else{ return 1;}

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
        dealer_mobile = $$("#dealer_mobile").val();
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

                        myApp.alert('Data Updated on the Server',  '');   

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

 $$('#dealerregbtn').on('click', function()
     {
        //myApp.alert('clicked dealerregbtn','')
        dealer_name = $$("#dealer_name").val();
        dealer_address = $$("#dealer_address").val();
        dealer_contact_person = $$("#dealer_contact_person").val();
        dealer_mobile = $$("#dealer_mobile").val();
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

                        myApp.alert('Data Stored on the Server',  '');   

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


