angular.module("chemistryAB")

.controller("bibliography", function($scope, $http) {
  $http.get("citations.json").success(function(citations) {
    $scope.references = citations;
  });
})