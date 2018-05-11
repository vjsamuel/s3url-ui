AWSCognito.config.region = 'us-east-1';
    var identityPoolId = 'us-east-1:67ad78ba-c5ea-4f78-be7b-e99bb2e0974d';
    var poolData = {
            UserPoolId : 'us-east-1_GeloAvylw',
            ClientId : '3p55l1bg9gc4ano3sahd8qdn81'
        };
    var userPool =  new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
    var uname;
    var coguser,auth2;
    var id_token;
    var profile;

    function onSignInSuccess(user) {
      // if (clicked) {
      id_token = user.getAuthResponse().id_token;
      profile = user.getBasicProfile();
      console.log('token' + id_token);
      console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
      console.log('Name: ' + profile.getName());
      console.log('Image URL: ' + profile.getImageUrl());
      console.log('Email: ' + profile.getEmail());
      AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: identityPoolId,
        Logins: {
           'accounts.google.com': id_token
        }
     });
      AWS.config.credentials.get(function(){
        // Access AWS resources here.
        uname = profile.getName();
        $('#uname').text("Hello " + uname);
        $('#userdash').show();
        $('#logout').show();
        $('#loginBtn').hide();
        $('#signupBtn').hide();
       });
  //   }
  }
 function onSignInFailure() {
  // Handle sign-in errors
  alert("Sign in failed")
}

  function signoutUser() {
      coguser = userPool.getCurrentUser()
       auth2 = gapi.auth2.getAuthInstance();
      if(auth2!=null) {
      auth2.signOut().then(function () {
       console.log('User signed out.');
       uname='';
       $('#uname').html(uname);
       });
        auth2=null;
    }
      console.log(userPool.getCurrentUser())
    if(coguser != null) {
   coguser.signOut( {
        onSuccess: function (result) {
            console.log('call result: ' + result);
        },
        onFailure: function(err) {
            alert(err);
        }
    });
    coguser=null;
}

    $('#loginBtn').show();
    $('#signupBtn').show();
    $('#logout').hide();
  }

  //function signoutUser() { }

$(function() {

     var clicked=false;
   $(document).on("click", ".navbar-right .dropdown-menu", function(e){
        e.stopPropagation();
   });
   $(document).ready(function () {
        $('#devdash').hide();
        $('#userdash').hide();
         if(coguser == null || auth2 == null)
          $('#logout').hide();
         
        var cognitoUser = userPool.getCurrentUser();
         if (cognitoUser != null) {
                     uname = cognitoUser.username;
                     $('#devdash').show();
                     $('#uname').text("Hello " + uname);
                     $('#userdash').show();
                     $('#logout').show();
                     $('#loginBtn').hide();
                     $('#signupBtn').hide();
         }
        
   });

  function validateForm(){
        return false;
    }
   /* function clickLogin()
  {
      clicked=true;
  } */

   $('#socialsignin').click(function(e) {
    e.preventDefault();
    clicked=true;
   });


    $('#login-submit').click(function(e) {
        e.preventDefault();
        //var username = $('#username').val()
        var email = $('#username').val()
        var password = $('#password').val()
      //  authenticateUser(username,password)
        authenticateUser(email,password)
        console.log(email,password)
    });

    $('#register-submit').click(function(e) {
        e.preventDefault();
        var username = $('#regusername').val()
        var email = $('#regemail').val()
      //  var phone = $('#phnum').val()
        var password = $('#regpassword').val()
        var confirmpassword = $('#confirm-password').val()

        addUser(username,email,password,confirmpassword)
        console.log(username,email,password,confirmpassword)

    });

    function addUser(username,email,password,confirmpassword){
        var cognitoUser;
        var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);

        var attributeList = [];

        var dataEmail = {
            Name : 'email',
            Value : email
        };

      var dataGivenName = {
            Name : 'given_name',
            Value : username
        };
    var attributeEmail = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataEmail);

    var attributeGivenName = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataGivenName);

        attributeList.push(attributeEmail);

        attributeList.push(attributeGivenName);

        userPool.signUp(username, password, attributeList, null, function(err, result){
            if (err) {
                alert(err);
                return;
            }
            cognitoUser = result.user;
            $('#myModal').modal({backdrop: 'static', keyboard: false})
            $('#myModal').modal('show');
            $('#verify-submit').click(function(e) {
                e.preventDefault();
                var verifycode = $('#verifycode').val()
                verifyUser(cognitoUser,verifycode)
            });

        });
        $('resend-verify-code').click(function(){
            resendVerifyCode(cognitoUser)
        })
        $('delete-user').click(function(){
            deleteUser(cognitoUser)
        })
    }

     function authenticateUser(email,password){
        var authenticationData = {
            Username : email,
            Password : password,
        };
        var authenticationDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);
        var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
        var userData = {
            Username : email,
            Pool : userPool
        };
        var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function (result) {
                console.log('access token + ' + result.getAccessToken().getJwtToken());
                console.log('idToken + ' + result.idToken.jwtToken);
                console.log(result)
                coguser=cognitoUser;
                 cognitoUser.getUserAttributes(function(err, result) {
             if (err) {
                 return;
             }

              //  for (i = 0; i < result.length; i++) { }
                 var logemail=result[3].getName();
                 searchpattern=/s3url.awsapps.com/;
                if(logemail.search(searchpattern)) {
                    $('#devdash').show();
                }
             });

              $('#uname').text("Hello " + cognitoUser.getUsername());
              $('#logout').show();
              $('#userdash').show();
              $('#loginBtn').hide();
              $('#signupBtn').hide();
            },

            onFailure: function(err) {
                console.log("auth error:",err)
                alert(err);
            },

        });

    }

    function verifyUser(cognitoUser,verifycode){
        cognitoUser.confirmRegistration(verifycode, true, function(err, result) {
            if (err) {
                alert(err);
                return;
            }
            console.log('call result: ' + result);
            $('#myModal').modal('hide');
            alert('Email confirmed. Login to S3URL')
            //window.location.href = '/verify.html';

        });
    }
    function resendVerifyCode(cognitoUser){
        console.log("resendVerifyCode")
        cognitoUser.resendConfirmationCode(function(err, result) {
            if (err) {
                alert(err);
                return;
               }
            alert(result);
        });
    }
  
    function deleteUser(cognitoUser){
        console.log("deleteUser")
        cognitoUser.deleteUser(function(err, result) {
            if (err) {
                alert(err);
                return;
            }
            console.log('call result: ' + result);
            $('#myModal').modal('hide');
        });
    }

});

function getAccessToken() {
    g = gapi.auth2.getAuthInstance().currentUser.get().Zi;
    if (g != null) {
        return g.id_token;
    } else {
        c = userPool.getCurrentUser()
        if (c != null) {
            return c.storage["CognitoIdentityServiceProvider." + c.pool.clientId + "." + c.username + ".idToken"];
        }
    }
    
    return ""
}
