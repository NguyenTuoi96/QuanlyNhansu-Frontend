$(function () {
    resetChangePasswordForm();
});

function showMessageChangePassword(id, message) {
    $(id).text(message);
    $(id).css("display", "block");
}

function resetChangePasswordForm() {
    $("#newPassword").val("");
    $("#confirmNewPassword").val("");

    $("#errNewPassword").text("");
    $("#errConfirmPassword").text("");
    $("#errResetPassword").text("");

    $("#infoChangePass").text("");

    $('#errNewPassword').css("display", "none");
    $('#errConfirmPassword').css("display", "none");
    $('#errResetPassword').css("display", "none");
    $('#infoChangePass').css("display", "none");
}

function validateChangePassword() {
    $("#errNewPassword").text("");
    $("#errConfirmPassword").text("");
    $("#errResetPassword").text("");

    var hasErr = false;

    // Password
    var password = $("#newPassword").val();
    if (password == null || password == "") {
        showMessageChangePassword("#errNewPassword", getMessageChangePass("Account.createAccount.form.password.NotBlank"));
        hasErr = true;
    } else {
        if (password.length < 6 || password.length > 8) {
            showMessageChangePassword("#errNewPassword", getMessageChangePass("Account.createAccount.form.password.LengthRange"));
            hasErr = true;
        }
    }

    // Confirm Password
    var confirmNewPassword = $("#confirmNewPassword").val();
    if (confirmNewPassword == null || confirmNewPassword == "") {
        showMessageChangePassword("#errConfirmPassword", getMessageChangePass("Account.createAccount.form.password.NotBlank"));
        hasErr = true;
    } else {
        if (confirmNewPassword.length < 6 || confirmNewPassword.length > 8) {
            showMessageChangePassword("#errConfirmPassword", getMessageChangePass("Account.createAccount.form.password.LengthRange"));
            hasErr = true;
        }
    }

    if(!hasErr){
        if(password != confirmNewPassword){
            showMessageChangePassword("#errResetPassword", getMessageChangePass("Account.createAccount.form.password.samePassword"));
            hasErr = true;
        }
    }

    if (!hasErr) {
        changePassword();
    }

}

function changePassword() {
    var password = $("#newPassword").val();
    var idAccount = localStorage.getItem("idAccount") != null ? localStorage.getItem("idAccount") : sessionStorage.getItem("idAccount");
    console.log(idAccount);
    var account = {
        id: idAccount,
        password: password
    }

    // gọi api thay pass
    $.ajax({
        url: 'http://localhost:8080/api/v1/auth',
        type: 'PUT',
        data: JSON.stringify(account),
        contentType: "application/json;charset=utf-8",
        async: false,
         
        success: function () {
            showMessageChangePassword("#infoChangePass", getMessageChangePass("ChangePassword.form.SuccessMessage"));
            localStorage.removeItem("idAccount");
            sessionStorage.removeItem("idAccount");
        },
        error: function () {
            showMessageChangePassword("#errResetPassword", getMessageChangePass("Login.form.SystemError"));
            localStorage.removeItem("idAccount");
            sessionStorage.removeItem("idAccount");
        }

    });
}

function getMessageChangePass(key) {
    var returnVal = "";
    // call api
    $.ajax({
        url: 'http://localhost:8080/api/v1/auth/messages?key=' + key,
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