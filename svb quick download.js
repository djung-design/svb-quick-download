var accountsCSV = [
    "6|48045577",//CASH COLLATERAL ACCOUNT&nbsp;&nbsp;***0017</option>
    "6|81516444",//NEW OPERATING ACCOUNT&nbsp;&nbsp;***6981</option>
    "6|289324394",//NEW PAYABLES ACCOUNT&nbsp;&nbsp;***7632</option>
    "6|129075881",//OPERATING (EUR) ACCOUNT&nbsp;&nbsp;***1306</option>
    "6|129075880",//OPERATING (GBP) ACCOUNT&nbsp;&nbsp;***1292</option>
    "6|48921348", //PAYROLL ACCOUNT&nbsp;&nbsp;***2409</option>
    "6|48921350", //RECEIVABLES ACCOUNT&nbsp;&nbsp;***2428</option></select> -->
];

var accountsQFX = [
    "6|48045577",//CASH COLLATERAL ACCOUNT&nbsp;&nbsp;***0017</option>
    "6|81516444",//NEW OPERATING ACCOUNT&nbsp;&nbsp;***6981</option>
    "6|289324394",//NEW PAYABLES ACCOUNT&nbsp;&nbsp;***7632</option>
    "6|48921348", //PAYROLL ACCOUNT&nbsp;&nbsp;***2409</option>
    "6|48921350", //RECEIVABLES ACCOUNT&nbsp;&nbsp;***2428</option></select> -->
];

if(document.readyState !== 'loading') {
    console.log( 'document is already ready, just execute code here');
    appendCustomButtons();
} else {
    document.addEventListener('DOMContentLoaded', function () {
        console.log( 'document was not ready, place code here' );
        appendCustomButtons();
    });
}

function appendCustomButtons(){
    let prevWeekCSVBtn = document.createElement('button');
    prevWeekCSVBtn.innerHTML = "Previous 5 Business Days (CSV)";
    prevWeekCSVBtn.setAttribute("class", "prev-week-btn csv-btn custom-btn"); 
    prevWeekCSVBtn.addEventListener('click', function(){test(true,true)});
    
    let parentElem = document.getElementsByName('acctReportingForm')[0];
    parentElem.appendChild(prevWeekCSVBtn);

    let prevDayCSVBtn = document.createElement('button');
    prevDayCSVBtn.innerHTML = "Previous Business Day (CSV)";
    prevDayCSVBtn.setAttribute("class", "prev-day-btn csv-btn custom-btn"); 
    prevDayCSVBtn.addEventListener('click', function(){test(false,true)});

    parentElem.appendChild(prevDayCSVBtn);

    let prevWeekQFXBtn = document.createElement('button');
    prevWeekQFXBtn.innerHTML = "Previous 5 Business Days (QFX)";
    prevWeekQFXBtn.setAttribute("class", "prev-day-btn qfx-btn custom-btn"); 
    prevWeekQFXBtn.addEventListener('click', function(){test(true,false)});

    parentElem.appendChild(prevWeekQFXBtn);

    let prevDayQFXBtn = document.createElement('button');
    prevDayQFXBtn.innerHTML = "Previous Business Day (QFX)";
    prevDayQFXBtn.setAttribute("class", "prev-day-btn qfx-btn custom-btn"); 
    prevDayQFXBtn.addEventListener('click', function(){test(false,false)});

    parentElem.appendChild(prevDayQFXBtn);

}


document.addEventListener('click', function(e){
    e.preventDefault();
    e.stopPropagation();
});


function test(gettingWeek, gettingCSV) {
    let customStartDate;
    let customEndDate
    if(gettingWeek){
        customStartDate = getPreviousMonday();
        customEndDate = getPreviousFriday();
        if(!validDates(customStartDate, customEndDate)){
            customEndDate = forceChangeEndDate(customEndDate);
        }
    }else{
        customStartDate = getPreviousDay();
        customEndDate = customStartDate;
    }

    //select dates range to download
    var fromDateElem = document.getElementsByName('fromDateStr')[0];
    var toDateElem = document.getElementsByName('toDateStr')[0];
    fromDateElem.value = formatDate(customStartDate);
    toDateElem.value = formatDate(customEndDate);

    //selects file format to download
    var formatSelectorElem = document.getElementsByName('fileDownloadTypeFromUI')[0];
    if(gettingCSV){
        formatSelectorElem.value = '0';
    }else{
        formatSelectorElem.value = '14';
    }


    //loop through the accounts
    var accounts = [];
    if(gettingCSV){
        accounts = accountsCSV;
    }else{
        accounts = accountsQFX;
    }
    let accountSelectorElem = document.getElementsByName('selectedAcctGrpAndIdentifier')[0]//document.getElementsByName('selectedAcctGrpAndIdentifier')[0];
    let delay = 1000;
    setTimeout(function(){alert("done!")}, (accounts.length * delay)+1000);
    let i = 1;
    const timer = ms => new Promise(res => setTimeout(res, ms));

    async function load () { // We need to wrap the loop into an async function for this to work
              for(;i<=accounts.length; i++){
                accountSelectorElem.value = accounts[i-1];
                console.log(accountSelectorElem.value);
                $('form[name=acctReportingForm]').submit();
                await timer(delay); // then the created Promise can be awaited
                }
    }
    load();
}

function formatDate(customDate){
    let dd = String(customDate.getDate()).padStart(2, '0');
    let mm = String(customDate.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = customDate.getFullYear();

    let formattedDate = mm + '/' + dd + '/' + yyyy;
    return formattedDate;
}

function getPreviousMonday(){
    let today = new Date();
    let day = today.getDay();
    let prevMonday = new Date();
    if(today.getDay() == 0){
        prevMonday.setDate(date.getDate() - 7);
    }
    else{
        prevMonday.setDate(today.getDate() - (day-1));
    }

    console.log("StartDate: " + prevMonday);
    return prevMonday;
}

function getPreviousFriday(){
    let today = new Date();
    let day = today.getDay();
    let prevFriday = new Date();
    if(today.getDay() == 0){
        prevFriday.setDate(date.getDate() - 3);
    }
    else{
        prevFriday.setDate(today.getDate() - (day-5));
    }

    console.log("EndDate: " + prevFriday);
    return prevFriday;
}

function getPreviousDay(){
    let today = new Date();
    let day = today.getDay();
    let prevDay = new Date();
    if(today.getDay() == 0){
        prevDay.setDate(date.getDate() - 3);
    }else{
        prevDay.setDate(today.getDate() - 1);
    }
    console.log("EndDate: " + prevDay);
    return prevDay;
}

//checks the start and end date are within the same month
function validDates(customStartDate, customEndDate){
    let startMonth = customStartDate.getMonth();
    let endMonth = customEndDate.getMonth();

    if(startMonth == endMonth){
        return true;
    }
    return false;
}

//set end date to last day of the month
function forceChangeEndDate(customEndDate){
    return customEndDate.setDate(0);
} 




// <!-- <select name="selectedAcctGrpAndIdentifier" size="0" onchange="javascript:accountSelComboChanged(this)" id="selectedAcctGrpAndIdentifier" class="dropDownMenuStyle"><option value="-1|-1">Select an Account</option>
// <option value="2|-1">All SVB Deposit Accounts (USA/USD)</option>
// <option value="11|-1">All SVB MCA Accounts (USA)</option>
// <option value="12|-1">All SVB Deposit Accounts (UK)</option>
// <option value="6|662910155">BUSINESS ACCOUNT&nbsp;&nbsp;***9367</option>
// <option value="6|662910156">BUSINESS ACCOUNT&nbsp;&nbsp;***9371</option>
// <option value="6|48045577">CASH COLLATERAL ACCOUNT&nbsp;&nbsp;***0017</option>
// <option value="6|543488168">COLLATERAL MMA&nbsp;&nbsp;***5601</option>
// <option value="6|297962659">INSPIREDLABS (GBP) OPERATING ACCOUNT&nbsp;&nbsp;***1515</option>
// <option value="6|81516444">NEW OPERATING ACCOUNT&nbsp;&nbsp;***6981</option>
// <option value="6|289324394">NEW PAYABLES ACCOUNT&nbsp;&nbsp;***7632</option>
// <option value="6|129075881">OPERATING (EUR) ACCOUNT&nbsp;&nbsp;***1306</option>
// <option value="6|129075880">OPERATING (GBP) ACCOUNT&nbsp;&nbsp;***1292</option>
// <option value="6|48921348">PAYROLL ACCOUNT&nbsp;&nbsp;***2409</option>
// <option value="6|48921350">RECEIVABLES ACCOUNT&nbsp;&nbsp;***2428</option></select> -->

// <select name="fileDownloadTypeFromUI" size="0" onchange="enableDisableDates()" id="downloadFormt" class="dropDownMenuStyle"><option value="-1" selected="selected">Select a file format</option>
// <option value="13">QuickBooks® (QBO)</option>
// <option value="14">Quicken® (QFX)</option>
// <option value="17">True CSV Format : Balances</option>
// <option value="16">True CSV Format : Transactions</option>
// <option value="15">True CSV Format : Balances and Transactions</option>
// <option value="0">CSV Transactions: Microsoft® Excel</option>
// <option value="6">CSV Current Day Transactions: Microsoft® Excel</option>
// <option value="1">CSV Statement Equivalent:  Microsoft® Excel</option>
// <option value="2">CSV Balances and Transactions: Microsoft® Excel</option>
// <option value="7">CSV Balances and Transactions Consolidated: Microsoft® Excel</option>
// <option value="3">BAI2 Balances and Transactions: Standard Bank Format</option>
// <option value="4">BAI2 Transactions: Standard Bank Format</option>
// <option value="8">BAI2 Current Day Transactions: Standard Bank Format</option></select>
