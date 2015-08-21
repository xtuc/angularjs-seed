/**
 * Created by Marco Romero on 1/8/2015.
 */
'use strict';

export default function Routes($stateProvider,$urlRouterProvider){
    $urlRouterProvider.otherwise('/');
    //
    // Now set up the states
    $stateProvider
        .state('index', {
            url: '/',
            templateUrl: 'views/home.html',
            controller:'homeController as vm'
        });
}
