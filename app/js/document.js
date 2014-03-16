angular.module("chemistryAB")

.directive("document", function() {
  return function(scope, document, attribute, $location) {
    Countable.live(document[0], function(count) {
      console.log("Word count:", count);
    });
    
    angular.element(document).onepage_scroll({
      sectionContainer: "section",
      animationTime: 1000,             
      pagination: true,                       
      loop: true,                     
      keyboard: true,
      updateURL: true,
      responsiveFallback: 600
    });
  };
});