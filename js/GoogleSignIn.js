function startGSingIn(googleUser) {
    window.userInfo = getAccountData(googleUser);
    console.log("VOT");
    console.log(googleUser);
    console.log(window.userInfo);
    window.location.href = "#welcome";
    return window.userInfo;
}
function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    console.log(JSON.parse(jsonPayload));
    return JSON.parse(jsonPayload);
}

function getAccountData(googleUser) {
    var jwt = googleUser.credential;
    return parseJwt(jwt);
}
