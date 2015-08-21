'use strict';

var vm, $http;

export default function controller($http) {
    vm = this;
    $http = $http;

    /**
     * Public variables
     */
    vm.test = "It works";

    /**
     * Public functions
     */
    vm.alertTheWorld = alertTheWorld;
}

var alertTheWorld = function () {
    alert("OK");
}
