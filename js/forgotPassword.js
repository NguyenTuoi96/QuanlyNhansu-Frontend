$(function () {
    $("#errForgotPasswordEmail").text("");
    $("#forgotPasswordEmail").val("");
});

var idAccount = "";

function showErrorForgotPassword(id, message) {
    $(id).text(message);
    $(id).css("display", "block");
}

function hideErrorForgotPassword() {
    $('#errForgotPasswordEmail').css("display", "none");
}

function checkEmail() {
    var hasErr = false;
    var email = $("#forgotPasswordEmail").val();
    if (email == null || email == "") {
        showErrorForgotPassword("#errForgotPasswordEmail", getMessageForgotPass("Account.createAccount.form.email.NotBlank"));
        hasErr = true;
    } else {
        if (!isEmailFormatForgotPass(email)) {
            showErrorForgotPassword("#errForgotPasswordEmail", getMessageForgotPass("Account.createAccount.form.email.WrongFormat"));
            hasErr = true;
        } else {
            // check email tồn tại
            if (!isEmailNotExits(email)) {
                showErrorForgotPassword("#errForgotPasswordEmail", getMessageForgotPass("Account.createAccount.form.email.Exists"));
                hasErr = true;
            }
        }
    }

    if(!hasErr){
        hideErrorForgotPassword();
        sendEmail(email);
    }

}

function sendEmail(email){
    var url = 'https://quanly-nhansu.herokuapp.com/api/v1/auth/emailsend?email=' + email;
    // call api
    $.ajax({
        url: url,
        type: 'GET',
        async: false,
        success: function (result) {
            showErrorForgotPassword("#errForgotPasswordEmail", getMessageForgotPass("ForgotPassword.form.sendEmail"));
            localStorage.setItem("idAccount", idAccount);
        },
        error: function (result) {
            showErrorForgotPassword("#errForgotPasswordEmail", getMessageForgotPass("Login.form.SystemError"));
        },
    });
}

// kiểm tra email tồn tại
function isEmailNotExits(email) {
    var check = false;
    $.ajax({
        async: false,
        url: "https://quanly-nhansu.herokuapp.com/api/v1/auth/account/email?email=" + email,
        type: 'GET',
        async: false,
        success: function (result) {
            if(result.id != null){
                idAccount = result.id;
                check = true;
            }
        }
    })

    return check;
}

function getMessageForgotPass(key) {
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

// kiểm tra email
function isEmailFormatForgotPass(email) {
    var regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
    return regex.test(email);
}