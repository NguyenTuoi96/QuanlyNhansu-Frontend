$(function () {
    var isRememberMe = storage.getRememberMe();
    document.getElementById("cbx-remember-me").checked = isRememberMe;
    hideError();
});

// message
var usernameNotNull = "";
var passwordNotNull = "";
var usernameAndPasswordNotExits = "";
var systemErr = "";

function validateLoginUser() {
    var hasErr = false;
    var username = $('#username').val();
    var password = $('#password').val();
    $('#errUsername').text("");
    $('#errPassword').text("");
    $('#errCommon').text("");

    // validate
    if (username == null || username == "") {
        usernameNotNull = usernameNotNull == "" ? getMessage("Account.createAccount.form.username.NotBlank") : usernameNotNull;
        showError('#errUsername', usernameNotNull);
        hasErr = true;
    }
    if (password == null || password == "") {
        passwordNotNull = passwordNotNull == "" ? getMessage("Account.createAccount.form.password.NotBlank") : passwordNotNull;
        showError('#errPassword', passwordNotNull);
        hasErr = true;
    }
    if (!hasErr) {
        if (username.length < 6 || username.length > 50) {
            usernameAndPasswordNotExits = usernameAndPasswordNotExits == "" ? getMessage("Login.form.UsernameAndPasswordNotExits") : usernameAndPasswordNotExits;
            showError('#errCommon', usernameAndPasswordNotExits);
            hasErr = true;
        }
        if (password.length < 6 || password.length > 12) {
            usernameAndPasswordNotExits = usernameAndPasswordNotExits == "" ? getMessage("Login.form.UsernameAndPasswordNotExits") : usernameAndPasswordNotExits;
            showError('#errCommon', usernameAndPasswordNotExits);
            hasErr = true;
        }
    }

    if (!hasErr) {
        loginUser(username, password);
    }
}

function showError(id, message) {
    $(id).text(message);
    $(id).css("display", "block");
}

function hideError(id) {
    $('#errUsername').css("display", "none");
    $('#errPassword').css("display", "none");
    $('#errCommon').css("display", "none");
}

function hideLoginInfomation() {
    $("#loginInfomation").modal("hide");

    $("#loginInfo").text("");
    $('#linkToChangePassword').css("display", "none");
}

function showLoginInfomation() {
    $("#loginInfomation").modal("show");
}

function loginUser(username, password) {
    // call api
    $.ajax({
        url: 'https://quanly-nhansu.herokuapp.com/api/v1/auth/login',
        type: 'GET',
        async: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + btoa(username + ":" + password));
        },
        success: function (result) {

            if (result.loginDate == null) {
                localStorage.setItem("idAccount", result.id);
                $("#loginInfo").text("New account activated, need to change password");
                $('#linkToChangePassword').css("display", "block");
                showLoginInfomation();
            } else if (result.ativeFlg == 1) {
                $("#loginInfo").text("account not activated");
                $('#linkToChangePassword').css("display", "none");
                showLoginInfomation();
            } else {
                // check remember
                var isRemember = document.getElementById("cbx-remember-me").checked;
                storage.saveRememberMe(isRemember);
                // lưu thông tin đăng nhập
                storage.setItem("id", result.id);
                storage.setItem("fullName", result.fullName);
                storage.setItem("role", result.role);
                storage.setItem("departmentName", result.departmentName);
                storage.setItem("username", username);
                storage.setItem("password", password);

                // chuyển trang
                window.location.replace("https://jolly-pothos-acc81d.netlify.app/index.html");
            }
        },
        error: function (result) {
            if (result.status == 401) {
                usernameAndPasswordNotExits = usernameAndPasswordNotExits == "" ? getMessage("Login.form.UsernameAndPasswordNotExits") : usernameAndPasswordNotExits;
                showError('#errCommon', usernameAndPasswordNotExits);
            } else {
                systemErr = systemErr == "" ? getMessage("Login.form.SystemError") : systemErr;
                showError('#errCommon', systemErr);
            }
        },
    });

}

function getMessage(key) {
    var returnVal = "";
    // call api
    $.ajax({
        url: 'https://quanly-nhansu.herokuapp.com/api/v1/auth/messages?key=' + key,
        type: 'GET',
        async: false,
        success: function (result) {
            returnVal = result;
        },
        error: function () {
            returnVal = "There has been a system error, please report it to the manager";
        },
    });
    return returnVal;
}

function hideAccountRegistModal() {
    $("#accountRegistModal").modal("hide");
}

function showAccountRegistModal() {
    $("#accountRegistModal").modal("show");

    resetModalRegistAccount();
}

function resetModalRegistAccount() {
    $("#errRegistUsername").text("");
    $("#errRegistFirstName").text("");
    $("#errRegistLastName").text("");
    $("#errRegistEmail").text("");
    $("#errRegistPassword").text("");
    $("#errRegist").text("");
    $('#errRegist').css("display", "none");

    $("#registUsername").val("");
    $("#registFirstName").val("");
    $("#registLastName").val("");
    $("#registEmail").val("");
    $("#registPassword").val("");
}

function validateSaveRegistAccount() {
    $("#errRegistUsername").text("");
    $("#errRegistFirstName").text("");
    $("#errRegistLastName").text("");
    $("#errRegistEmail").text("");
    $("#errRegistPassword").text("");
    $("#errRegist").text("");

    var hasErr = false;

    // username
    var username = $("#registUsername").val();
    if (username == null || username == "") {
        $("#errRegistUsername").text("Username mustn't be null value");
        hasErr = true;
    } else {
        // check số kí tự
        if (username.length < 6 || username.length > 50) {
            $("#errRegistUsername").text("Username must have a number of characters from 6 to 50");
            hasErr = true;
        } else {
            // check trùng tên
            if (isUsernameDuplication(username)) {
                $("#errRegistUsername").text("Username is exits");
                hasErr = true;
            }
        }
    }

    // FirstName
    var firstName = $("#registFirstName").val();
    if (firstName == null || firstName == "") {
        $("#errRegistFirstName").text("First Name mustn't be null value");
        hasErr = true;
    }

    // LastName
    var lastName = $("#registLastName").val();
    if (lastName == null || lastName == "") {
        $("#errRegistLastName").text("Last Name mustn't be null value");
        hasErr = true;
    }

    // email
    var email = $("#registEmail").val();
    if (email == null || email == "") {
        $("#errRegistEmail").text("Email mustn't be null value");
        hasErr = true;
    } else {
        if (!isEmailFormat(email)) {
            $("#errRegistEmail").text("Email is wrong format");
            hasErr = true;
        } else {
            // check trùng email
            if (isEmailDuplication(email)) {
                $("#errRegistEmail").text("Email is exits");
                hasErr = true;
            }
        }
    }

    // Password
    var password = $("#registPassword").val();
    if (password == null || password == "") {
        $("#errRegistPassword").text("Password mustn't be null value");
        hasErr = true;
    } else {
        if (password.length < 6 || password.length > 12) {
            $("#errRegistPassword").text("Password must have a number of characters from 6 to 12");
            hasErr = true;
        }
    }

    if (hasErr == false) {
        registNewAccount();
    }

}

function registNewAccount() {
    var username = $("#registUsername").val();
    var firstName = $("#registFirstName").val();
    var lastName = $("#registLastName").val();
    var email = $("#registEmail").val();
    var password = $("#registPassword").val();

    var account = {
        username: username,
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password
    }

    // gọi api thêm mới account
    $.ajax({
        url: 'https://quanly-nhansu.herokuapp.com/api/v1/auth',
        type: 'POST',
        data: JSON.stringify(account),
        contentType: "application/json;charset=utf-8",
        async: false,
        success: function (result) {
            console.log(result.code);
            if (result.code == 401) {
                $("#errRegist").text("Error when add new account");
                $('#errRegist').css("display", "block");
            } else {
                gotoHomePage(username, password);
                $("#errRegist").text("");
                $('#errRegist').css("display", "none");
            }
        },
        error: function () {
            $("#errRegist").text("Error when add new account, please confirm to manager");
        }
    });
}

function gotoHomePage(username, password) {
    // call api
    $.ajax({
        url: 'https://quanly-nhansu.herokuapp.com/api/v1/auth/login',
        type: 'GET',
        async: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + btoa(username + ":" + password));
        },
        success: function (result) {
            storage.saveRememberMe(false);
            // lưu thông tin đăng nhập
            storage.setItem("id", result.id);
            storage.setItem("fullName", result.fullName);
            storage.setItem("role", result.role);
            storage.setItem("departmentName", result.departmentName);
            storage.setItem("username", username);
            storage.setItem("password", password);

            // chuyển trang
            window.location.replace("https://jolly-pothos-acc81d.netlify.app/index.html");
        },
        error: function (result) {
            if (result.status == 401) {
                alert("Username or Password not exits");
            } else {
                alert("System error");
            }
        },
    });

}

// kiểm tra trùng username khi thêm
function isUsernameDuplication(username) {
    var check = false;
    $.ajax({
        async: false,
        url: "https://quanly-nhansu.herokuapp.com/api/v1/auth/username/" + username,
        type: 'GET',
        async: false,
        success: function (result) {
            check = result;
        }
    })

    return check;
}

// kiểm tra trùng email khi thêm
function isEmailDuplication(email) {
    var check = false;
    $.ajax({
        async: false,
        url: "https://quanly-nhansu.herokuapp.com/api/v1/auth/email/" + email,
        type: 'GET',
        async: false,
        success: function (result) {
            check = result;
        }
    })

    return check;
}

// kiểm tra email
function isEmailFormat(email) {
    var regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
    return regex.test(email);
}

function forgotPassword() {
    window.location.href = "https://quanly-nhansu.herokuapp.com/html/forgotPassword.html";
}