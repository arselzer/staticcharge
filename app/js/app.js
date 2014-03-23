$(document).ready(function() {
  $(".document").onepage_scroll({
      sectionContainer: "section",
      animationTime: 1000,             
      pagination: false,                       
      loop: true,                     
      keyboard: true,
      updateURL: true,
      responsiveFallback: 600
    });
});