
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
            schema: {
                model: {
                    fields: {
                        BookId: { type: "number" },
                        BookName: { type: "string" },
                        BookCategory: { type: "string" },
                        BookAuthor: { type: "string" },
                        BookBoughtDate: { type: "date" },
                        BookDeliveredDate: { type: "string" },
                        BookPrice: { type: "number" },
                        BookAmount: { type: "number" },
                        BookTotal: { type: "number" }
                    }
                }
            },
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
            { command: { text: "刪除", click: deletedata }, width: "100px" },
            { field: "BookId", title: "書籍編號", width: "120px" },
            { field: "BookName", title: "書籍名稱", width: "180px" },
            { field: "BookCategory", values: bookCategoryList, title: "書籍種類", width: "120px" },
            { field: "BookAuthor", title: "作者", width: "120px" },
            { field: "BookBoughtDate", title: "購買日期", format: "{0: yyyy-MM-dd}", width: "120px" },
            { field: "BookDeliveredDate", title: "送達狀態", template: "#if(BookDeliveredDate != null){#<i class='fas fa-truck' id='icon' onmouseover='Domouseover(this)'></i>#}#", width: "120px" },
            { field: "BookPrice", title: "金額", width: "80px" },
            { field: "BookAmount", title: "數量", width: "120px" },
            { field: "BookTotal", title: "總計", format: "{0:n0}元", width: "120px" }]
    });

    //刪除
    function deletedata(x) {
        x.preventDefault();
        var dataItem = this.dataItem($(x.target).closest("tr"));
        var dataSource = $("#book_grid").data("kendoGrid").dataSource;
        kendo.confirm("確定刪除「" + dataItem.BookName + "」 嗎?").then(function () {
            dataSource.remove(dataItem);
        });
    };

    //新增書籍
    $("#add_book").click(function () {
        $("#bookform").kendoWindow()({
            width: "600px",
            title: "About Alvar Aalto",
            visible: false,
            actions: [
                "Pin",
                "Minimize",
                "Maximize",
                "Close"
            ],
            close: onClose
        }).data("kendoWindow").center().open();
    });

});

function Domouseover(e) {
    var dataSource = $("#book_grid").data("kendoGrid");
    var dataItem = dataSource.dataItem($(e).closest("tr"));
    $("#book_grid").kendoTooltip({
        filter: "i",
        animation: false,
        content: function (e) {
            return dataItem.BookDeliveredDate;
        }
    });
    console.log(dataItem.BookDeliveredDate);
};

function Check_date() {
    var container = $("#book_form");
    kendo.init(container);
    container.kendoValidator({
        rules: {
            greaterdate: function (input) {
                //console.log(input.val());
                if (input.is("[data-greaterdate-msg]") && input.val() != "") {
                    var date = kendo.parseDate(input.val()),
                        otherDate = kendo.parseDate($("[name='" + input.data("greaterdateField") + "']").val());
                    //console.log(input.val());
                    return otherDate == null || otherDate.getTime() < date.getTime();
                }
                return true;
            }
        }
    });
}

//搜尋
$(document).ready(function () {
    $("#FieldFilter").keyup(function () {

        var value = $("#FieldFilter").val();
        grid = $("#book_grid").data("kendoGrid");
        if (value) {
            grid.dataSource.filter({
                logic: "or",
                filters: [{ field: "BookName", operator: "contains", value: value }, { field: "BookAuthor", operator: "contains", value: value }]
            }
            );
        }

        else {
            grid.dataSource.filter({});
        }
    });
});

$(document).ready(function () {
    $("#addbook").click(function () {
        $("#vision").data("kendoWindow").open();
        $("#addbook").fadeOut();
    });

    function onClose() {
        $("#addbook").fadeIn();
    }

    $("#vision").kendoWindow({
        width: "600px",
        title: "新增書籍",
        visible: false,
        modal: true,
        actions: [
            "Pin",
            "Minimize",
            "Maximize",
            "Close"
        ],
        close: onClose
    })

    //資料
    var validatable = $("#book_form").kendoValidator().data("kendoValidator");
    var book_category = document.getElementById("book_category");
    for (var i = 0; i < bookCategoryList.length; i++) {
        var book_category_opt = document.createElement('option');
        book_category_opt.appendChild(document.createTextNode(bookCategoryList[i].text));
        book_category_opt.value = bookCategoryList[i].value;
        book_category.appendChild(book_category_opt);
    }
    //圖片變更
    $("#book_category").kendoDropDownList({
        change: function (e) {
            var get_value = $("#book_category").val();
            console.log(get_value);
            for (var x = 0; x < bookCategoryList.length; x++) {
                if (get_value == bookCategoryList[x]["value"]) {
                    var img_src = bookCategoryList[x]["src"];
                    $(".book-image").attr("src", img_src);
                }
            }
        }
    });
    //日期
    Check_date();
    $("#bought_datepicker").kendoDatePicker({
        value: new Date(),
        format: "yyyy-MM-dd",
        parseFormats: ["yyyy/MM/dd",
            "yyyyMMdd",
            "yyyy-MM-dd"]
    });
    $("#add_book").fadeOut();
    $("#delivered_datepicker").kendoDatePicker({
        format: "yyyy-MM-dd",
        parseFormats: ["yyyy/MM/dd",
            "yyyyMMdd",
            "yyyy-MM-dd"]
    });

    $("#book_price,#book_amount").kendoNumericTextBox({
        decimals: 0,
        format: "{0:n0}",
        min: 0,
        change: function () {
            var price = $("#book_price").val();
            var amount = $("#book_amount").val();
            if (price != "" && amount != "") {
                var total = parseInt(price) * parseInt(amount);
                document.getElementById("book_total").innerHTML = total;
            } else {
                document.getElementById("book_total").innerHTML = 0;
            }
        }
    });

    $("#save_book").click(function () {
        /*  var book_allid = localStorage.getItem("BookId");
          document.getElementById("BookId").value = book_allid;
          var max_id = Math.max.apply(null, book_id); 
          max_id += 1;*/
        var validator = $("#book_form").data("kendoValidator");
        var book_name = $("#book_name").val();
        var book_category = $("#book_category").val();
        var book_author = $("#book_author").val();
        if ($("#bought_datepicker").val() == "") {
            var bought_datepicker = ""
        } else {
            var bought_datepicker = $("#bought_datepicker").val();
        }
        if ($("#delivered_datepicker").val() == '') {
            var delivered_datepicker = null;
        } else {
            var delivered_datepicker = $("#delivered_datepicker").val();
        }
        var book_price = $("#book_price").val();
        var book_amount = $("#book_amount").val();
        var book_total = parseInt(book_price) * parseInt(book_amount);
        console.log(book_total);
        if (validator.validate()) {
            var data = $("#book_grid").data("kendoGrid").dataSource;
            data.add({
                //  BookId: book_id,
                BookName: book_name,
                BookCategory: book_category,
                BookAuthor: book_author,
                BookBoughtDate: bought_datepicker,
                BookDeliveredDate: delivered_datepicker,
                BookPrice: book_price,
                BookAmount: book_amount,
                BookTotal: book_total
            });
            data.sync();
            alert("新增成功");
        } else {
            alert('新增失敗');
        }

    });
});


