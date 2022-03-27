var currentPageDepartment = 1; // default
var sortField = "totalMember"; // default
var isAsc = false; // default desc

function initDepartment() {
    getListDepartment();
    resetFormDepartment();
}

function reset() {
    currentPageDepartment = 1;
    sortField = "totalMember";
    isAsc = false;
}

//khởi tạo danh sách cho bảng phòng ban
function getListDepartment() {
    $('.department-table tbody').empty();
    var url = "http://localhost:8080/api/v1/departments";

    url += "?pageNumber=" + currentPageDepartment + "&size=" + $('#pageSize').val();

    url += "&sort=" + sortField + "," + (isAsc ? "asc" : "desc");

    var departmentName = $('#search_department_name').val()
    var minDate = $('#min-date').val()
    var maxDate = $('#max-date').val()
    var type = $('#type-select').val()

    if (departmentName != "") {
        url += "&search=" + departmentName;
    }

    if (minDate != "") {
        url += "&minCreatedDate=" + minDate;
    }

    if (maxDate != "") {
        url += "&maxCreatedDate=" + maxDate;
    }

    if (type != "" && type != null) {
        url += "&type=" + type;
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
            console.log(result);
            if(result.code == 403){
                window.location.href = "http://127.0.0.1:5500/html/error.html";
                return;
            }
            result.content.forEach(function (item, index) {
                $('.department-table tbody').append(
                    '<tr>' +
                    '<td style="text-align: center"><input id="checkbox' + item.id + '" type="checkbox" name="checkbox-department"></td>' +
                    '<td>' + item.name + '</td>' +
                    '<td style="text-align: center">' + item.totalMember + '</td>' +
                    '<td style="text-align: center">' + item.type + '</td>' +
                    '<td style="text-align: center">' + item.createdDate + '</td>' +
                    '<td style="text-align: center">' +
                    '<a class="edit" title="Edit" data-toggle="tooltip" onclick="opendUpdateModalDepartment(' + item.id + ')"><i class="material-icons">&#xE254;</i></a>' +
                    '<a class="delete" title="Delete" data-toggle="tooltip" onClick="showDeleteDepartmentModal(' + item.id + ')"><i class="material-icons">&#xE872;</i></a>' +
                    '</td>' +
                    '</tr>'
                )
            });
            totalPages = result.totalPages;
        },
        error: function () {
            showAlertErrorDepartment('Error when loading list department');
        },
    });

    pagingTable(totalPages);
    renderSortUI();
    onResetCheckboxDepartment();
}

function changeInputForDepartment() {
    var searchDepartmentName = $('#search_department_name').val();
    if (searchDepartmentName != "") {
        $('#search_department_name').addClass("has-content");
    } else {
        $('#search_department_name').removeClass("has-content");
    }

    var searchTypeSelect = $('#type-select').val();
    if (searchTypeSelect != "") {
        $('#type-select').addClass("has-content");
    } else {
        $('#type-select').removeClass("has-content");
    }
}

function resetFormDepartment() {
    initTypeCbList();
    changeInputForDepartment();
}

// event enter key của department Name
function searchByDepartmentName(event) {
    if (event.keyCode === 13) {
        getListDepartment();
    }
}

// filter
function filterDepartment() {
    getListDepartment();
}

// tạo dropdown type
function initTypeCbList() {
    $('#type-select').empty();
    $('#type-select').append(
        '<option' + ' value=""></option>'
    )

    $('#type').empty();
    $('#type').append(
        '<option' + ' value=""></option>'
    )
    $.ajax({
        url: 'http://localhost:8080/api/v1/departments/types',
        type: 'GET',
        async: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + btoa(storage.getItem("username") + ":" + storage.getItem("password")));
        },
        success: function (result) {
            result.forEach(function (item) {
                $('#type-select').append(
                    '<option' + ' value="' + item.typeValue + '">' + item.typeName + '</option>'
                )
                $('#type').append(
                    '<option' + ' value="' + item.typeValue + '">' + item.typeName + '</option>'
                )
            });
        }
    });
}

// changePageDepartmentNumber
function changePageDepartmentNumber() {
    currentPageDepartment = 1;
    getListDepartment();
}

function renderSortUI() {
    var sortTypeClass = isAsc ? "fa-sort-asc" : "fa-sort-desc";

    removeIconSort("department-name-sort");
    removeIconSort("total-member-sort");
    removeIconSort("type-sort");
    removeIconSort("create-date-sort");

    switch (sortField) {
        case 'name':
            changeIconSort("department-name-sort", sortTypeClass);
            break;
        case 'totalMember':
            changeIconSort("total-member-sort", sortTypeClass);
            break;
        case 'type':
            changeIconSort("type-sort", sortTypeClass);
            break;
        case 'createdDate':
            changeIconSort("create-date-sort", sortTypeClass);
            break;
        default:
            break;
    }
}

function changeIconSort(id, sortTypeClass) {
    document.getElementById(id).classList.remove("fa-sort", "fa-sort-asc", "fa-sort-desc");
    document.getElementById(id).classList.add(sortTypeClass);
}

function removeIconSort(id) {
    document.getElementById(id).classList.remove("fa-sort", "fa-sort-asc", "fa-sort-desc");
    document.getElementById(id).classList.remove("fa-sort", "fa-sort-asc", "fa-sort-desc");
    document.getElementById(id).classList.remove("fa-sort", "fa-sort-asc", "fa-sort-desc");
    changeIconSort(id, "fa-sort");
    changeIconSort(id, "fa-sort");
    changeIconSort(id, "fa-sort");
}

function changeDepartmentListSort(field) {
    if (field == sortField) {
        isAsc = !isAsc;
    } else {
        sortField = field;
        isAsc = true;
    }
    getListDepartment();
}

function pagingTable(pageCount) {

    var pagingStr = "";

    if (pageCount > 1 && currentPageDepartment > 1) {
        pagingStr +=
            '<li class="page-item">' +
            '<a class="page-link" onClick="prevPaging()">&laquo;</a>' +
            '</li>';
    }

    for (i = 0; i < pageCount; i++) {
        pagingStr +=
            '<li class="page-item ' + (currentPageDepartment == i + 1 ? "active" : "") + '">' +
            '<a class="page-link" onClick="changePage(' + (i + 1) + ')">' + (i + 1) + '</a>' +
            '</li>';
    }

    if (pageCount > 1 && currentPageDepartment < pageCount) {
        pagingStr +=
            '<li class="page-item">' +
            '<a class="page-link" onClick="nextPaging()">&raquo;</a>' +
            '</li>';
    }

    $('#pagination').empty();
    $('#pagination').append(pagingStr);

}

function resetPaging() {
    currentPageDepartment = 1;
    $('#pageSize').val("10");
}

function prevPaging() {
    changePage(currentPageDepartment - 1);
}

function nextPaging() {
    changePage(currentPageDepartment + 1);
}

function changePage(page) {
    if (page == currentPageDepartment) {
        return;
    }
    currentPageDepartment = page;
    getListDepartment();
}

function onChangeCheckboxDepartmentAll() {
    $('input[name="checkbox-department"]').prop('checked', document.getElementById("checkbox-department-all").checked)
}

function onResetCheckboxDepartment() {
    $('input[name="checkbox-department"]').prop('checked', false)
    $('input[name="checkbox-department-all"]').prop('checked', false)
}


// Modal
var currentPageModalAccount = 0;
var sortFieldAccountList = ""; // default
var isAccountListAsc = true; // default
var selectedAccountList = [];
var selectedDepartmentList = [];
var deleteDepartmentId = "";

function renderAccountListSortUI() {
    var sortTypeClass = isAccountListAsc ? "fa-sort-asc" : "fa-sort-desc";

    removeAccountListIconSort("username-name-sort");
    removeAccountListIconSort("fullName-sort");
    removeAccountListIconSort("role-sort");

    switch (sortFieldAccountList) {
        case 'username':
            changeAccountListIconSort("username-name-sort", sortTypeClass);
            break;
        case 'fullName':
            changeAccountListIconSort("fullName-sort", sortTypeClass);
            break;
        case 'role':
            changeAccountListIconSort("role-sort", sortTypeClass);
            break;
        default:
            break;
    }
}

function changeAccountListIconSort(id, sortTypeClass) {
    document.getElementById(id).classList.remove("fa-sort", "fa-sort-asc", "fa-sort-desc");
    document.getElementById(id).classList.add(sortTypeClass);
}

function removeAccountListIconSort(id) {
    document.getElementById(id).classList.remove("fa-sort", "fa-sort-asc", "fa-sort-desc");
    document.getElementById(id).classList.remove("fa-sort", "fa-sort-asc", "fa-sort-desc");
    document.getElementById(id).classList.remove("fa-sort", "fa-sort-asc", "fa-sort-desc");
    changeAccountListIconSort(id, "fa-sort");
    changeAccountListIconSort(id, "fa-sort");
    changeAccountListIconSort(id, "fa-sort");
}

function changeModalAccountListSort(field) {
    if (field == sortFieldAccountList) {
        isAccountListAsc = !isAccountListAsc;
    } else {
        sortFieldAccountList = field;
        isAccountListAsc = true;
    }
    getListAccountModal();
}


function hideAddNewModalDepartment() {
    $("#departmentModal").modal("hide");
}

function openAddNewModalDepartment() {
    $("#departmentModal").modal("show");
    // set title
    $('#department-edit-modal').text("Create New Department");
    resetModalDepartment();
}

function hideModalAccountList() {
    $("#accountListModal").modal("hide");
}

function showModalAccountList() {
    // set title
    $('#modat-title-account-list').text("Add account into " + $("#name").val());
    getListAccountModal();
    $("#accountListModal").modal("show");
}

function hideDeleteDepartmentModal() {
    deleteDepartmentId = "";
    selectedDepartmentList = [];
    $("#deleteDepartmentModal").modal("hide");
}

function showDeleteDepartmentModals() {
    getDeleteDepartments();
    if(selectedDepartmentList.length == 0){
        showInfomationDepartment("No departments have been selected yet");
    }else{
        // set title
        $('#delete-modal-title').text("Delete Departments");
        // set content
        $('#delete-modal-content').text("Do you want to delete these (" + selectedDepartmentList.length + ") departments");
        $("#deleteDepartmentModal").modal("show");
    }
}

function showDeleteDepartmentModal(departmentId) {
    deleteDepartmentId = departmentId;
    // set title
    $('#delete-modal-title').text("Delete Department");
    // set content
    $('#delete-modal-content').text("Do you want to delete department");

    $("#deleteDepartmentModal").modal("show");
}

function getListAccountModal() {
    $('.modal-list-account tbody').empty();
    var url = "http://localhost:8080/api/v1/accounts/list";

    url += "?pageNumber=" + currentPageModalAccount;

    url += "&departmentId=" + $("#departmentId").val();

    url += "&sort=" + sortFieldAccountList + "," + (isAccountListAsc ? "asc" : "desc");

    var totalPages = 0;

    $.ajax({
        url: url,
        type: 'GET',
        async: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + btoa(storage.getItem("username") + ":" + storage.getItem("password")));
        },
        success: function (result) {
            result.content.forEach(function (item, index) {
                $('.modal-list-account tbody').append(
                    '<tr>' +
                    '<td style="text-align: center"><input id="checkbox-account-modal' + item.id + '" type="checkbox" name="checkboxAddAccount"></td>' +
                    '<td>' + item.username + '</td>' +
                    '<td>' + item.fullName + '</td>' +
                    '<td style="text-align: center">' + item.role + '</td>' +
                    '</tr>'
                )
            });
            totalPages = result.totalPages;
        },
        error: function () {
            showAlertErrorDepartment('Error when loading list account');
        },
    });
    pagingTableAccountList(totalPages);
    renderAccountListSortUI();
}

function pagingTableAccountList(pageCount) {

    var pagingStr = "";

    if (pageCount > 1 && currentPageModalAccount > 1) {
        pagingStr +=
            '<li class="page-item">' +
            '<a class="page-link" onClick="prevPagingAccountModal()">&laquo;</a>' +
            '</li>';
    }

    for (i = 0; i < pageCount; i++) {
        pagingStr +=
            '<li class="page-item ' + (currentPageModalAccount == i + 1 ? "active" : "") + '">' +
            '<a class="page-link" onClick="changePageAccountList(' + (i + 1) + ')">' + (i + 1) + '</a>' +
            '</li>';
    }

    if (pageCount > 1 && currentPageModalAccount < pageCount) {
        pagingStr +=
            '<li class="page-item">' +
            '<a class="page-link" onClick="nextPagingAccountModal()">&raquo;</a>' +
            '</li>';
    }

    $('#pagination-account-list').empty();
    $('#pagination-account-list').append(pagingStr);

}

function resetPagingAccount() {
    currentPageModalAccount = 1;
    $('#pageSize').val("10");
}

function prevPagingAccountModal() {
    changePageAccountList(currentPageModalAccount - 1);
}

function nextPagingAccountModal() {
    changePageAccountList(currentPageModalAccount + 1);
}

function changePageAccountList(page) {
    if (page == currentPageModalAccount) {
        return;
    }
    currentPageModalAccount = page;
    getListAccountModal();
}

function validateSaveDepartment(){
    var departmentId = $("#departmentId").val();
    $("#errDepartmentName").text("");
    $("#errDepartmentType").text("");

    if (departmentId == null || departmentId == "") {        
        var departmentName = $("#name").val();
        
        // check null
        if(departmentName == null || departmentName == ""){
            $("#errDepartmentName").text(getMessage("Department.createDepartment.form.name.NotBlank"));
        }else{
            // check trùng tên
            if(isDepartmentNameDuplication(departmentName) == true){
                $("#errDepartmentName").text(getMessage("Department.createDepartment.form.name.NotExists"));
            }
        }
        
        var departmentType = $("#type").val();
        if(departmentType == null || departmentType == ""){
            $("#errDepartmentType").text(getMessage("Department.createDepartment.form.type.NotBlank"));
        }
    } else {
        var departmentType = $("#type").val();
        if(departmentType == null || departmentType == ""){
            $("#errDepartmentType").text(getMessage("Department.createDepartment.form.type.NotBlank"));
        }
    }

    if($("#errDepartmentName").text() == "" && $("#errDepartmentType").text() == ""){
        saveDepartment();
    }

}

function saveDepartment() {
    var departmentId = $("#departmentId").val();

    if (departmentId == null || departmentId == "") {        
        createNewDepartment();
    } else {
        updateDepartment(departmentId);
    }
}

// kiểm tra trùng tên department khi thêm
function isDepartmentNameDuplication(departmentName){
    var check = false;
    $.ajax({
        async: false,
        url: "http://localhost:8080/api/v1/departments/departmentName/" + departmentName,
        type: 'GET',
        async: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + btoa(storage.getItem("username") + ":" + storage.getItem("password")));
        },
        success:function(result){
            check = result;
        }
    })

    return check;
}

function createNewDepartment() {
    var departmentName = $("#name").val();
    var departmentType = $("#type").val();

    var accountList = [];

    selectedAccountList.forEach(function (item, index, array) {
        console.log(item, index);
        var temp = { "id": item };
        accountList.push(temp);
    })

    var department = {
        name: departmentName,
        type: departmentType,
        accounts: accountList
    }
    
    // gọi api thêm mới phòng ban
    $.ajax({
        url: 'http://localhost:8080/api/v1/departments',
        type: 'POST',
        data: JSON.stringify(department),
        contentType: "application/json;charset=utf-8",
        async: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + btoa(storage.getItem("username") + ":" + storage.getItem("password")));
        },
        success: function () {
            showAlertSuccessDepartment('add new department success');
        },
        error: function () {
            showAlertErrorDepartment('Error when add new department');
        }
    });

    reset();
    getListDepartment();
    hideAddNewModalDepartment();
}

function updateDepartment(departmentId) {
    var departmentName = $("#name").val();
    var departmentType = $("#type").val();

    var department = {
        name: departmentName,
        type: departmentType
    }
    // gọi api để cập nhật phòng ban
    $.ajax({
        url: 'http://localhost:8080/api/v1/departments/' + departmentId,
        type: 'PUT',
        data: JSON.stringify(department),
        async: false,
        contentType: "application/json;charset=utf-8",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + btoa(storage.getItem("username") + ":" + storage.getItem("password")));
        },
        success: function () {
            showAlertSuccessDepartment('update department success');
        },
        error: function () {
            showAlertErrorDepartment('Error when update department');
        }
    });
    
    reset();
    getListDepartment();
    hideAddNewModalDepartment();
}

function opendUpdateModalDepartment(departmentId) {
    openAddNewModalDepartment();
    // set title
    $('#department-edit-modal').text("Update Department");
    // gọi api lấy phòng ban theo id
    $.ajax({
        url: 'http://localhost:8080/api/v1/departments/' + departmentId,
        type: 'GET',
        async: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + btoa(storage.getItem("username") + ":" + storage.getItem("password")));
        },
        success: function (result) {
            //fill data
            $("#departmentId").val(result.id);
            $("#name").val(result.name);
            $("#type").val(result.type);
        }
    });

    // khóa input name
    $("#name").prop('disabled', true);
    // không hiển thị button add account 
    $("#add-account").hide();
}

function resetModalDepartment() {
    $("#departmentId").val("");
    $("#name").val("");
    $("#type").val("");
    $("#name").prop('disabled', false);
    $("#add-account").show();
    $("#errDepartmentName").text("");
    $("#errDepartmentType").text("");
    selectedAccountList = [];
    selectedDepartmentList = [];
}

function executeDeleteDepartment() {
    $.ajax({
        url: 'http://localhost:8080/api/v1/departments/' + deleteDepartmentId,
        type: 'DELETE',
        async: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + btoa(storage.getItem("username") + ":" + storage.getItem("password")));
        },
        success: function () {
            showAlertSuccessDepartment('delete department success');
        },
        error: function () {
            showAlertErrorDepartment('Error when delete department');
        }
    });

    getListDepartment();
    hideDeleteDepartmentModal();
}

function executeDeleteDepartments() {

    var departmentIds = {
        ids: selectedDepartmentList
    }
    $.ajax({
        url: 'http://localhost:8080/api/v1/departments',
        type: 'DELETE',
        data: JSON.stringify(departmentIds),
        contentType: "application/json;charset=utf-8",
        async: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + btoa(storage.getItem("username") + ":" + storage.getItem("password")));
        },
        success: function () {
            showAlertSuccessDepartment('delete departments success');
        },
        error: function () {
            showAlertErrorDepartment('Error when delete departments');
        }
    });

    getListDepartment();
    hideDeleteDepartmentModal();
}

function deleteDepartment() {
    if (deleteDepartmentId == null || deleteDepartmentId == "") {
        // delete nhiều department
        executeDeleteDepartments();
    } else {
        // delete 1 department
        executeDeleteDepartment();
    }
}

function getDeleteDepartments() {
    $('input[name="checkbox-department"]:checked').each(function () {
        var departmentId = this.id.substring(8);
        selectedDepartmentList.push(departmentId);
    });
}

function saveAccountList() {
    $('input[name="checkboxAddAccount"]:checked').each(function () {
        var accountId = this.id.substring(22);
        selectedAccountList.push(accountId);
    });

    hideModalAccountList();
}

// show Error Infomation
function showInfomationDepartment(infoMsg){    
    $("#infoContentDepartment").text(infoMsg);

    $("#infoMsgDepartment").show();
}

// hide Error Infomation
function closeInfomationDepartment(){
    $("#infoContentDepartment").text("");

    $("#infoMsgDepartment").hide();
}