var chemistryAB = angular.module("chemistryAB", []);

chemistryAB.controller("bibliography", function($scope, $http) {
  $http.get("citations.json").success(function(citations) {
    $scope.references = citations;
  });
})

.directive("document", function() {
  return function(scope, document, attribute) {
    Countable.live(document[0], function(count) {
      console.log("Word count:", count);
    });
  };
});