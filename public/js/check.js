function myFunction(i) {
    var x = document.getElementById(i);
    var y = document.getElementById(i+1);
        y.style.display = "block";
        y.scrollIntoView();
        x.style.display = "block";
        x.style.pointerEvents= "none";
     setTimeout(function(){
        y.style.display = "none";
        var z = document.getElementById(i+2);
        z.style.display = "block";
        z.scrollIntoView();
        }, 1300);
        
  }
// window.onload=
//   function checkuser(){
//     // Check browser support
//     var email=sessionStorage.getItem("email");
//     console.log(email +"locally")
//     $.ajax({
//         type:'post',
//         url:'./check/ajax/check',
//         data: {
//           email: email
//         },
//         success:function(response){
//             if(response.name==undefined){
//               window.location.replace('/');
//             }
//         }
//       })
//     }