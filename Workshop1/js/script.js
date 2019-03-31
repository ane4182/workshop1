
var bookDataFromLocalStorage = [];
var bookCategoryList = [
    { text: "資料庫", value: "database", src: "image/database.jpg" },
    { text: "網際網路", value: "internet", src: "image/internet.jpg" },
    { text: "應用系統整合", value: "system", src: "image/system.jpg" },
    { text: "家庭保健", value: "home", src: "image/home.jpg" },
    { text: "語言", value: "language", src: "image/language.jpg" }
];

// 載入書籍資料
function loadBookData() {
    bookDataFromLocalStorage = JSON.parse(localStorage.getItem('bookData'));
    if (bookDataFromLocalStorage == null) {
        bookDataFromLocalStorage = bookData;
        localStorage.setItem('bookData', JSON.stringify(bookDataFromLocalStorage));
    }
}


$(function () {
    loadBookData();
});

$(document).ready(function () {
    kendo.culture("zh-TW");
    $("#book_grid").kendoGrid({
        dataSource: {
            data: bookDataFromLocalStorage,

            pageSize: 20
        },
        height: 550,
        groupable: false,
        sortable: true,
        filterable: false,
        pageable: {
            input: true,
            numeric: false,
        },
        toolbar: ["<input type=text class=form-control id='FieldFilter' placeholder='我想要找...'>"],
        columns: [
            { command: "刪除" ,width: "100px"},
            { field: "BookId", title: "書籍編號", width: "120px" },
            { field: "BookName", title: "書籍名稱", width: "180px" },
            { field: "BookCategory", values: bookCategoryList, title: "書籍種類", width: "120px" },
            { field: "BookAuthor", title: "作者", width: "120px" },
            { field: "BookBoughtDate", title: "購買日期", width: "120px" },
            { field: "BookPublisher", title: "送達狀態", width: "120px" },
            { field: "BookPrice", title: "金額", width: "80px" },
            { field: "BookAmount", title: "數量", width: "120px" },
            { field: "BookTotal", title: "總計", width: "120px" }]
    });
});
//搜尋
$(document).ready(function () {
    $("#FieldFilter").keyup(function () {

        var value = $("#FieldFilter").val();
        grid = $("#book_grid").data("kendoGrid");
        if (value) {
            grid.dataSource.filter({ field: "BookName", operator: "contains", value: value });
            grid.dataSource.filter({ field: "BookAuthor", operator: "contains", value: value });
        }
        else {
            grid.dataSource.filter({});
        }
    });
});




