function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
  }
  window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }
      $(".dropdown-content button").click(function() {
        $(".main-btn").text($(this).text());
        })
 
       $(".dropdown-content #show-all").click(function() {
  
              $(".all").show();
              $(".display-no").hide();
              if (!$(".card")[0]){
                  $(".display-no").show();
              } else {
                  $(".display-no").hide();
              }
          })
  
          $(".dropdown-content #soft-engr").click(function() {
  
                $(".all").hide();
                $(".display-no").hide();
                $(".se").show();
                if (!$(".se")[0]) {
                    $(".display-no").show();
                } else {
                    $(".display-no").hide();
                }
  
            })
            $(".dropdown-content #sqa").click(function() {
  
                    $(".all").hide();
                    $(".display-no").hide();
                    $(".sqa").show();
  
                  if (!$(".sqa")[0]){
                      $(".display-no").show();
                  } else {
                      $(".display-no").hide();
                  }
  
              })
              $(".dropdown-content #marketing").click(function() {
  
                    $(".all").hide();
                    $(".display-no").hide();
                    $(".mkt").show();
  
                    if (!$(".mkt")[0]){
                        $(".display-no").show();
                    } else {
                        $(".display-no").hide();
                    }
  
                })

                $(".dropdown-content #admin").click(function() {
  
                      $(".all").hide();
                      $(".display-no").hide();
                      $(".adm").show();
  
  
  
                      if (!$(".adm")[0]) {
                          $(".display-no").show();
                      } else {
                          $(".display-no").hide();
                      }
  
  
                  })
  
  
      $('.button-filters').on('click', '.btn-fil', function() {
        $(this).addClass('active').siblings().removeClass('active');
      });
  
      $('.dropdown-filter').on('click', '.dropdown-item', function() {
        $(this).addClass('active').siblings().removeClass('active');
      });
  
          $(document).ready(function(){
  
            $(".display-no").hide();
              if (!$(".card")[0]){
                  $(".display-no").show();
              } else {
                  $(".display-no").hide();
              }
  
            $("#show-all").click(function(){
              $(".all").show();
              $(".display-no").hide();
              if (!$(".card")[0]){
                  $(".display-no").show();
              } else {
                  $(".display-no").hide();
              }
  
            });
            $("#soft-engr").click(function(){
              $(".all").hide();
              $(".display-no").hide();
              $(".se").show();
  
  
              if (!$(".se")[0]) {
                  $(".display-no").show();
              } else {
                  $(".display-no").hide();
              }
  
            });
  
            $("#sqa").click(function(){
              $(".all").hide();
              $(".display-no").hide();
              $(".sqa").show();
  
            if (!$(".sqa")[0]){
                $(".display-no").show();
            } else {
                $(".display-no").hide();
            }
  
            });
  
  
            $("#marketing").click(function(){
              $(".all").hide();
              $(".display-no").hide();
              $(".mkt").show();
  
              if (!$(".mkt")[0]){
                  $(".display-no").show();
              } else {
                  $(".display-no").hide();
              }
  
            });
  
            $("#admin").click(function(){
              $(".all").hide();
              $(".display-no").hide();
              $(".adm").show();
  
              if (!$(".adm")[0]) {
                  $(".display-no").show();
              } else {
                  $(".display-no").hide();
              }
            });
          });
          