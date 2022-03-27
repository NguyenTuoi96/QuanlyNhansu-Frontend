var currentPageAccount = 1; // default
var sortFieldAccount = "createdDate"; // default
var isAscAccount = false; // default desc

// init account
function initAccount() {
    getListAccount();
    initRoleCbList();
    initDepartmentCbList();
}

function resetForm() {
    currentPageAccount = 1;
    sortFieldAccount = "createdDate";
    isAscAccount = false;
}

function changeInputForAccount() {
    var selectRole = $('#select-account-role').val();
    if (selectRole != "") {
        $('#select-account-role').addClass("has-content");
    } else {
        $('#select-account-role').removeClass("has-content");
    }

    var selectAccountDepartment = $('#select-account-department').val();
    if (selectAccountDepartment != "") {
        $('#select-account-department').addClass("has-content");
    } else {
        $('#select-account-department').removeClass("has-content");
    }
}

// tạo dropdown role
function initRoleCbList() {
    $('#select-account-role').empty();
    $('#select-account-role').append(
        '<option' + ' value=""></option>'
    )

    $('#select-modal-role').empty();
    $('#select-modal-role').append(
        '<option' + ' value=""></option>'
    )
    $.ajax({
        url: 'http://localhost:8080/api/v1/accounts/roles',
        type: 'GET',
        async: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + btoa(storage.getItem("username") + ":" + storage.getItem("password")));
        },
        success: function (result) {
            result.forEach(function (item) {
                $('#select-account-role').append(
                    '<option' + ' value="' + item.roleValue + '">' + item.roleName + '</option>'
                )
                $('#select-modal-role').append(
                    '<option' + ' value="' + item.roleValue + '">' + item.roleName + '</option>'
                )
            });
        },
        error: function () {
            showAlertErrorAccount('Error when loading role data for dropdown');
        },
    });
}

// tạo dropdown department
function initDepartmentCbList() {
    $('#select-account-department').empty();
    $('#select-account-department').append(
        '<option value=""></option>'
    )

    $('#select-modal-department').empty();
    $('#select-modal-department').append(
        '<option value=""></option>'
    )

    $.ajax({
        url: 'http://localhost:8080/api/v1/departments/lists',
        type: 'GET',
        async: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + btoa(storage.getItem("username") + ":" + storage.getItem("password")));
        },
        success: function (result) {
            result.forEach(function (item) {
                $('#select-account-department').append(
                    '<option' + ' value="' + item.id + '">' + item.name + '</option>'
                )
                $('#select-modal-department').append(
                    '<option' + ' value="' + item.id + '">' + item.name + '</option>'
                )
            });
        },
        error: function () {
            showAlertErrorAccount('Error when loading department data for dropdown');
        },
    });
}

//khởi tạo danh sách cho bảng account
function getListAccount() {
    $('.account-table tbody').empty();
    var url = "http://localhost:8080/api/v1/accounts";

    url += "?pageNumber=" + currentPageAccount + "&size=" + $('#pageAccountSize').val();

    url += "&sort=" + sortFieldAccount + "," + (isAscAccount ? "asc" : "desc");

    var accountName = $('#search-account-name').val()
    var role = $('#select-account-role').val()
    var departmentId = $('#select-account-department').val()

    if (accountName != "") {
        url += "&search=" + accountName;
    }

    if (role != "" && role != null) {
        url += "&role=" + role;
    }

    if (departmentId != "" && departmentId != null) {
        url += "&departmentId=" + departmentId;
    }

    var totalPages = 0;

    $.ajax({
        url: url,
        type: 'GET',
        async: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + btoa(storage.getItem("username") + ":" + storage.getItem("password")));
        },
        success: function (result) {
            if (result.code == 403) {
                window.location.href = "http://127.0.0.1:5500/html/error.html";
                return;
            }
            result.content.forEach(function (item, index) {
                var department = item.departmentName == null ? '' : item.departmentName;
                var role = item.role == null ? '' : item.role;
                $('.account-table tbody').append(
                    '<tr>' +
                    '<td style="text-align: center"><input id="checkbox-account' + item.id + '" type="checkbox" name="checkbox-account"></td>' +
                    '<td>' + item.username + '</td>' +
                    '<td style="text-align: center">' + item.fullName + '</td>' +
                    '<td style="text-align: center">' + role + '</td>' +
                    '<td style="text-align: center">' + department + '</td>' +
                    '<td style="text-align: center">' +
                    '<a class="edit" title="Edit" data-toggle="tooltip" onclick="opendUpdateModalAccount(' + item.id + ')"><i class="material-icons">&#xE254;</i></a>' +
                    '<a class="delete" title="Delete" data-toggle="tooltip" onClick="showDeleteAccountModal(' + item.id + ')"><i class="material-icons">&#xE872;</i></a>' +
                    '</td>' +
                    '</tr>'
                )
            });
            totalPages = result.totalPages;
        },
        error: function () {
            showAlertErrorAccount('Error when loading list account');
        },
    });

    pagingTableAccount(totalPages);
    renderAccountSortUI();
    onResetCheckboxAccount();
}

function pagingTableAccount(pageCount) {

    var pagingStr = "";

    if (pageCount > 1 && currentPageAccount > 1) {
        pagingStr +=
            '<li class="page-item">' +
            '<a class="page-link" onClick="prevPagingAccount()">&laquo;</a>' +
            '</li>';
    }

    for (i = 0; i < pageCount; i++) {
        pagingStr +=
            '<li class="page-item ' + (currentPageAccount == i + 1 ? "active" : "") + '">' +
            '<a class="page-link" onClick="changePageAccount(' + (i + 1) + ')">' + (i + 1) + '</a>' +
            '</li>';
    }

    if (pageCount > 1 && currentPageAccount < pageCount) {
        pagingStr +=
            '<li class="page-item">' +
            '<a class="page-link" onClick="nextPagingAccount()">&raquo;</a>' +
            '</li>';
    }

    $('#pagination-account').empty();
    $('#pagination-account').append(pagingStr);

}

function resetPaging() {
    currentPageAccount = 1;
    $('#pageAccountSize').val("10");
}

function prevPagingAccount() {
    changePageAccount(currentPageAccount - 1);
}

function nextPagingAccount() {
    changePageAccount(currentPageAccount + 1);
}

function changePageAccount(page) {
    if (page == currentPageAccount) {
        return;
    }
    currentPageAccount = page;
    getListAccount();
}

// changePageAccountNumber
function changePageAccountNumber() {
    resetForm();
    getListAccount();
}

// filter
function filterAccount() {
    getListAccount();
}

// event enter key của account Name
function searchByAccountName(event) {
    if (event.keyCode === 13) {
        getListAccount();
    }
}

function renderAccountSortUI() {
    var sortTypeClass = isAscAccount ? "fa-sort-asc" : "fa-sort-desc";

    removeIconSortAccount("username-sort");
    removeIconSortAccount("fullName-sort");
    removeIconSortAccount("role-sort");
    removeIconSortAccount("department-sort");

    switch (sortFieldAccount) {
        case 'username':
            changeIconSortAccount("username-sort", sortTypeClass);
            break;
        case 'fullName':
            changeIconSortAccount("fullName-sort", sortTypeClass);
            break;
        case 'role':
            changeIconSortAccount("role-sort", sortTypeClass);
            break;
        case 'department.name':
            changeIconSortAccount("department-sort", sortTypeClass);
            break;
        default:
            break;
    }
}

function changeIconSortAccount(id, sortTypeClass) {
    document.getElementById(id).classList.remove("fa-sort", "fa-sort-asc", "fa-sort-desc");
    document.getElementById(id).classList.add(sortTypeClass);
}

function removeIconSortAccount(id) {
    document.getElementById(id).classList.remove("fa-sort", "fa-sort-asc", "fa-sort-desc");
    document.getElementById(id).classList.remove("fa-sort", "fa-sort-asc", "fa-sort-desc");
    document.getElementById(id).classList.remove("fa-sort", "fa-sort-asc", "fa-sort-desc");
    changeIconSort(id, "fa-sort");
    changeIconSort(id, "fa-sort");
    changeIconSort(id, "fa-sort");
}

function changeAccountListSort(field) {
    if (field == sortFieldAccount) {
        isAscAccount = !isAscAccount;
    } else {
        sortFieldAccount = field;
        isAscAccount = true;
    }
    getListAccount();
}

function onChangeCheckboxAccountAll() {
    $('input[name="checkbox-account"]').prop('checked', document.getElementById("checkbox-account-all").checked)
}

function onResetCheckboxAccount() {
    $('input[name="checkbox-account"]').prop('checked', false)
    $('input[name="checkbox-account-all"]').prop('checked', false)
}


// modal

var deleteAccountId = "";
var selectedDeleteAccountList = [];

function hideAccountEditModal() {
    $("#accountEditModal").modal("hide");
}

function openAddNewModalAccount() {
    $("#accountEditModal").modal("show");
    // set title
    $('#account-edit-modal').text("Create New Account");
    resetModalAccount();
}

function opendUpdateModalAccount(accountId) {
    openAddNewModalAccount();
    // set title
    $('#account-edit-modal').text("Update Account");
    // gọi api lấy phòng ban theo id
    $.ajax({
        url: 'http://localhost:8080/api/v1/accounts/' + accountId,
        type: 'GET',
        async: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + btoa(storage.getItem("username") + ":" + storage.getItem("password")));
        },
        success: function (result) {
            //fill data
            $("#accountId").val(result.id);
            $("#username").val(result.username);
            $("#firstName").val(result.firstName);
            $("#lastName").val(result.lastName);
            $("#email").val(result.email);
            $("#select-modal-role").val(result.role);
            $("#select-modal-department").val(result.departmentId);
        }
    });

    // khóa input
    $("#username").prop('disabled', true);
    $("#firstName").prop('disabled', true);
    $("#lastName").prop('disabled', true);
    $("#email").prop('disabled', true);
}

function resetModalAccount() {
    $("#accountId").val("");
    $("#username").val("");
    $("#firstName").val("");
    $("#lastName").val("");
    $("#email").val("");
    $("#select-modal-role").val("");
    $("#select-modal-department").val("");
    $("#username").prop('disabled', false);
    $("#firstName").prop('disabled', false);
    $("#lastName").prop('disabled', false);
    $("#email").prop('disabled', false);

    $("#errUsername").text("");
    $("#errFirstName").text("");
    $("#errLastName").text("");
    $("#errEmail").text("");
    $("#errSelectRole").text("");
    $("#errSelectDepartment").text("");
}

function validateSaveAccount() {
    var accountId = $("#accountId").val();
    $("#errUsername").text("");
    $("#errFirstName").text("");
    $("#errLastName").text("");
    $("#errEmail").text("");
    $("#errSelectRole").text("");
    $("#errSelectDepartment").text("");

    var hasErr = false;

    if (accountId == null || accountId == "") {
        // username
        var username = $("#username").val();
        if (username == null || username == "") {            
            $("#errUsername").text(getMessage("Account.createAccount.form.username.NotBlank"));
            hasErr = true;
        }
        else {
            if (username.length < 8 || username.length > 20) {
                // check số kí tự
                $("#errUsername").text(getMessage("Account.createAccount.form.username.LengthRange"));
                hasErr = true;
            } else {
                // check trùng tên
                if (isUsernameDuplication(username)) {
                    $("#errUsername").text(getMessage("Account.createAccount.form.username.NotExists"));
                    hasErr = true;
                }
            }
        }

        // FirstName
        var firstName = $("#firstName").val();
        if (firstName == null || firstName == "") {
            $("#errFirstName").text(getMessage("Account.createAccount.form.firstName.NotBlank"));
            hasErr = true;
        }

        // LastName
        var lastName = $("#lastName").val();
        if (lastName == null || lastName == "") {
            $("#errLastName").text(getMessage("Account.createAccount.form.lastName.NotBlank"));
            hasErr = true;
        }

        // email
        var email = $("#email").val();
        if (email == null || email == "") {
            $("#errEmail").text(getMessage("Account.createAccount.form.email.NotBlank"));
            hasErr = true;
        } else {
            if (!isEmailFormatAcc(email)) {
                $("#errEmail").text(getMessage("Account.createAccount.form.email.WrongFormat"));
                hasErr = true;
            } 
            else if (isEmailDuplicationForCreate(email)) {
                // check trùng email
                $("#errEmail").text(getMessage("Account.createAccount.form.email.NotExists"));
                hasErr = true;
            }
        }

        // Role
        var role = $("#select-modal-role").val();
        if (role == null || role == "") {
            $("#errSelectRole").text(getMessage("Account.createAccount.form.role.NotBlank"));
            hasErr = true;
        }

        // Department
        var department = $("#select-modal-department").val();
        if (department == null || department == "") {
            $("#errSelectDepartment").text(getMessage("Account.createAccount.form.departmentId.NotBlank"));
            hasErr = true;
        }

    } else {

        // Role
        var role = $("#select-modal-role").val();
        if (role == null || role == "") {
            $("#errSelectRole").text(getMessage("Account.createAccount.form.role.NotBlank"));
            hasErr = true;
        }

        // Department
        var department = $("#select-modal-department").val();
        if (department == null || department == "") {
            $("#errSelectDepartment").text(getMessage("Account.createAccount.form.departmentId.NotBlank"));
            hasErr = true;
        }
    }

    if (hasErr == false) {
        saveAccount();
    }

}

// kiểm tra trùng username khi thêm
function isUsernameDuplication(username) {
    var check = false;
    $.ajax({
        async: false,
        url: "http://localhost:8080/api/v1/accounts/username/" + username,
        type: 'GET',
        async: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + btoa(storage.getItem("username") + ":" + storage.getItem("password")));
        },
        success: function (result) {
            check = result;
        }
    })

    return check;
}

// kiểm tra trùng email khi thêm
function isEmailDuplicationForCreate(email) {
    var check = false;
    $.ajax({
        async: false,
        url: "http://localhost:8080/api/v1/accounts/email/" + email,
        type: 'GET',
        async: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + btoa(storage.getItem("username") + ":" + storage.getItem("password")));
        },
        success: function (result) {
            check = result;
        }
    })

    return check;
}

function saveAccount() {
    var accountId = $("#accountId").val();
    if (accountId == null || accountId == "") {
        createNewAccount();
    } else {
        updateAccount(accountId);
    }
}

function createNewAccount() {
    var username = $("#username").val();
    var firstName = $("#firstName").val();
    var lastName = $("#lastName").val();
    var email = $("#email").val();
    var role = $("#select-modal-role").val();
    var departmentId = $("#select-modal-department").val();

    var account = {
        username: username,
        firstName: firstName,
        lastName: lastName,
        email: email,
        role: role,
        departmentId: departmentId
    }

    // gọi api thêm mới account
    $.ajax({
        url: 'http://localhost:8080/api/v1/accounts',
        type: 'POST',
        data: JSON.stringify(account),
        contentType: "application/json;charset=utf-8",
        async: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + btoa(storage.getItem("username") + ":" + storage.getItem("password")));
        },
        success: function () {
            showAlertSuccessAccount('add new account success');
        },
        error: function () {
            showAlertErrorAccount('Error when add new account');
        }
    });

    resetForm();
    resetPaging();
    getListAccount();
    hideAccountEditModal();
}

function updateAccount(accountId) {
    var role = $("#select-modal-role").val();
    var departmentId = $("#select-modal-department").val();

    var account = {
        id: accountId,
        role: role,
        departmentId: departmentId
    }

    // gọi api cập nhật account
    $.ajax({
        url: 'http://localhost:8080/api/v1/accounts',
        type: 'PUT',
        data: JSON.stringify(account),
        contentType: "application/json;charset=utf-8",
        async: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + btoa(storage.getItem("username") + ":" + storage.getItem("password")));
        },
        success: function () {
            showAlertSuccessAccount('update account success');
        },
        error: function () {
            showAlertErrorAccount('Error when update account');
        }
    });

    resetForm();
    resetPaging();
    getListAccount();
    hideAccountEditModal();
}

function showDeleteAccountModal(accountId) {
    deleteAccountId = accountId;
    if (accountId == null || accountId == "") {
        getDeleteAccounts();
        // set title
        $('#delete-account-modal-title').text("Delete Accounts");
        // set content
        $('#delete-account-modal-content').text("Do you want to delete these (" + selectedDeleteAccountList.length + ") accounts");
    } else {
        // set title
        $('#delete-account-modal-title').text("Delete Account");
        // set content
        $('#delete-account-modal-content').text("Do you want to delete account");
    }

    $("#deleteAccountModal").modal("show");
}

function hideDeleteAccountModal() {
    deleteAccountId = "";
    selectedDeleteAccountList = [];
    $("#deleteAccountModal").modal("hide");
}

function getDeleteAccounts() {
    $('input[name="checkbox-account"]:checked').each(function () {
        var accountId = this.id.substring(16);
        selectedDeleteAccountList.push(accountId);
    });
}

function deleteAccount() {
    if (deleteAccountId == null || deleteAccountId == "") {
        // delete nhiều account
        executeDeleteAccounts();
    } else {
        // delete 1 account
        executeDeleteAccount();
    }

    getListAccount();
    hideDeleteAccountModal();
}

function executeDeleteAccount() {
    $.ajax({
        url: 'http://localhost:8080/api/v1/accounts/' + deleteAccountId,
        type: 'DELETE',
        async: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + btoa(storage.getItem("username") + ":" + storage.getItem("password")));
        },
        success: function () {
            showAlertSuccessAccount('delete account success');
        },
        error: function () {
            showAlertErrorAccount('Error when delete account');
        }
    });
}

function executeDeleteAccounts() {

    var accountIds = {
        ids: selectedDeleteAccountList
    }

    $.ajax({
        url: 'http://localhost:8080/api/v1/accounts',
        type: 'DELETE',
        data: JSON.stringify(accountIds),
        contentType: "application/json;charset=utf-8",
        async: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + btoa(storage.getItem("username") + ":" + storage.getItem("password")));
        },
        success: function () {
            showAlertSuccessAccount('delete accounts success');
        },
        error: function () {
            showAlertErrorAccount('Error when delete accounts');
        }
    });
}

// kiểm tra email
function isEmailFormatAcc(email) {
    var regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
    return regex.test(email);
}