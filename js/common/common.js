var urlGetMess = "";
$(function () {
  if (storage.getItem("id") == null) {
    window.location.replace("http://127.0.0.1:5500/html/login.html");
  } else {
    $("#accountName").text(storage.getItem("fullName"));
    if (storage.getItem("role") != "ADMIN") {
      $("#view-department").css("display", "none");
      $("#view-account").css("display", "none");
    }else{
      $("#view-department").css("display", "block");
      $("#view-account").css("display", "block");
    }
    $(".main").load("/html/common/home.html");
    $(".footer").load("/html/common/footer.html");
    changeLanguage();
  }
});

$(document).ready(function () {
  $('#sidebarCollapse').on('click', function () {
    $('#sidebar').toggleClass('active');
  });
});

function changeLanguage() {
  urlGetMess = 'https://quanly-nhansu.herokuapp.com/api/v1/auth/messages';
  var langugeCode = $('#language').val();
  if(langugeCode == '1'){
    urlGetMess = urlGetMess + "/en";
  }else if(langugeCode == '2'){
    urlGetMess = urlGetMess + "/vi";
  }else if(langugeCode == '3'){
    urlGetMess = urlGetMess + "/fr";
  }
}

// đi đến trang chủ
function viewHome() {
  $(".main").load("/html/common/home.html");
}

// đi đến danh sách phòng ban
function viewDepartment() {
  $(".main").load("/html/departmentMain.html", function () {
    initDepartment();
  });
}

// đi đến danh sách account
function viewAccount() {
  $(".main").load("/html/accountMain.html", function () {
    initAccount();
  });
}

// show mess thành công của department
function showAlertSuccessDepartment(message) {
  $('#success-message-department').text(message);
  $("#alert-success-department").fadeTo(3000, 200).slideUp(2000, function () {
    $("#alert-success-department").slideUp(3000);
  });
}

// show mess thất bại của department
function showAlertErrorDepartment(message) {
  $('#error-message-department').text(message);
  $("#alert-error-department").fadeTo(3000, 200).slideUp(2000, function () {
    $("#alert-error-department").slideUp(3000);
  });
}

// show mess thành công của account
function showAlertSuccessAccount(message) {
  $('#success-message-account').text(message);
  $("#alert-success-account").fadeTo(3000, 200).slideUp(2000, function () {
    $("#alert-success-account").slideUp(3000);
  });
}

// show mess thất bại của account
function showAlertErrorAccount(message) {
  $('#error-message-account').text(message);
  $("#alert-error-account").fadeTo(3000, 200).slideUp(2000, function () {
    $("#alert-error-account").slideUp(3000);
  });
}

function logoutUser() {
  storage.removeItem("id");
  storage.removeItem("fullName");
  storage.removeItem("role");
  storage.removeItem("departmentName");
  storage.removeItem("username");
  storage.removeItem("password");
  window.location.replace("http://127.0.0.1:5500/html/login.html");
}

function getMessage(key) {
    var returnVal = "";
    // call api
    $.ajax({
        url: urlGetMess + '?key=' + key,
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