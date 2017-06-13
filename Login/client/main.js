function signupController($http) {
    this.user = {};
    this.register = function() {
        $http.post('/sign', this.user).then(function() {
            this.user = {};
        }.bind(this));
    };
}

function loginController($http) {
    this.user = {};
    this.login = function() {
        $http.post('/login', this.user).then(function() {
            this.user = {};
        }.bind(this));
    };
}

