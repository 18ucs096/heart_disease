function Validate() {
    var name = document.getElementById("name").value;
    console.log(name)
    if (name==null||name==undefined||name=='') {
        alert("Please enter your name");
        return false;
    }
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("passwordverify").value;
    if (password != confirmPassword) {
        alert("Passwords do not match.");
        return false;
    }
    else if( document.getElementById("email").value=="" ){
        alert("Login with Google Required");
        return false;
        
    }
    return true;
}


  // function checkuser(){
  //   // Check browser support
  //   sessionStorage.setItem("email", document.getElementById("email").value);    
  //       var email=sessionStorage.getItem("email");
    
  //   $.ajax({
  //       type:'post',
  //       url:'./check/ajax/check',
  //       data: {
  //         email: email
  //       },
  //       success:function(response){
  //           console.log(response);
  //       }
  //     })
        
  //   }


    
        
