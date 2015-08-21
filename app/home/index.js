module.exports = angular.module('app.home',[])
    .controller('homeController',["$http", require('./homeController')]);
//  .directive('myDirective',['someDep',require('./my-directive')])
//  .service('myService',['someDep',require('./my-service')])
//  .factory('myFactory',['someDep',require('./my-factory')])
//  .filter('myFilter',['someDep',require('./my-filter')])
