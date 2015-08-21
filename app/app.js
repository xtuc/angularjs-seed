'use strict';

import home from "./home"
import routes from "./routes"

angular
    .module('app',['ui.router',
                  home.name
                ])
    .config(['$stateProvider',
             '$urlRouterProvider',
             routes]);
