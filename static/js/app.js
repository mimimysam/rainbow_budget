function calculateTotalIncome() {
    let incomeAmounts = Array.from(document.getElementsByClassName('amount'));
    let savedIncome = [];
    for (var i of incomeAmounts){
        savedIncome.push(parseFloat(i.innerHTML))
    }
    console.log(savedIncome)
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    let totalIncome = savedIncome.reduce(reducer);
    console.log(totalIncome);
    document.getElementById('totalincome').innerHTML = totalIncome;
}
calculateTotalIncome()

var expenseAmounts = Array.from(document.getElementsByClassName('expenseamount'));
var savedExpAmt = [];
    for (var i of expenseAmounts){
        savedExpAmt.push(parseFloat(i.innerHTML))
    }
console.log(savedExpAmt)

function calculateTotalExpense() {
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    var totalExpense = savedExpAmt.reduce(reducer);
    console.log(totalExpense);
    document.getElementById('totalexpense').innerHTML = totalExpense;
}
calculateTotalExpense()

var income = parseFloat(document.getElementById('totalincome').innerHTML)
var expense = parseFloat(document.getElementById('totalexpense').innerHTML)
var savings = income - expense
console.log(savings)
document.getElementById('savings').innerHTML = "Total savings: $" + savings

var expenseDescriptions = Array.from(document.getElementsByClassName('expensedescription'));
var savedExpDescription = []
    for (var i of expenseDescriptions){
        savedExpDescription.push(i.innerHTML)
    }
console.log(savedExpDescription)

var expByName = {};
for (var i=0; i<savedExpDescription.length; i++) {
    expByName[savedExpDescription[i]] = expByName[savedExpDescription[i]] || 0;
    expByName[savedExpDescription[i]] += savedExpAmt[i];
}
console.log(expByName)

function percentOfExp() {
    var expByPercent = []
    for (let value in expByName) {
        expPercent = (expByName[value]/expense)*100
        expByPercent.push(expPercent)
        expByName[value] = (expByName[value]/expense)*100
    }
    console.log(expByPercent)
    console.log(expByName)
}
percentOfExp()

let incomebox = document.getElementsByClassName("entry")
Array.from(incomebox).forEach(function(element) {
    element.addEventListener('click', incomeClick)
})

function incomeClick(event) {
    let entry = event.target.closest(".entry");
    let id = entry.getAttribute('title');
    deleteBtn.setAttribute('data-id', id);
    $('#deleteEntryModal').modal('show');
}

let deleteBtn = document.getElementById('delete-btn');
deleteBtn.addEventListener('click', deleteIncome);

function deleteIncome(event) {
    event.preventDefault();
    let id = event.target.dataset.id
    let postParams = {
       method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
       headers: {
           'Content-Type': 'application/json; charset=UTF-8',
           'Access-Control-Allow-Headers': "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With",
           'Access-Control-Allow-Origin':'*'
       },
    };
    fetch(`/income/delete/${id}`, postParams)
        .then(res => {
            $('#deleteEntryModal').modal('hide')
    });
    location.reload()
}

let expensebox = document.getElementsByClassName("expenseentry")
Array.from(expensebox).forEach(function(element) {
    element.addEventListener('click', expenseClick);
  });

function expenseClick(event) {
    let entry = event.target.closest(".expenseentry");
    let id = entry.getAttribute('title');
    deleteExpBtn.setAttribute('data-id', id);
    $('#deleteExpenseModal').modal('show');
}

let deleteExpBtn = document.getElementById('delete-expense-btn');
deleteExpBtn.addEventListener('click', deleteExpense);

function deleteExpense(event) {
    event.preventDefault();
    let id = event.target.dataset.id
    let postParams = {
       method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
       headers: {
           'Content-Type': 'application/json; charset=UTF-8',
           'Access-Control-Allow-Headers': "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With",
           'Access-Control-Allow-Origin':'*'
       },
    };
    fetch(`/expense/delete/${id}`, postParams)
        .then(res => {
            $('#deleteExpenseModal').modal('hide')
    });
    location.reload()
}

let addIncomeBtn = document.getElementById('incomeaddbtn');
addIncomeBtn.addEventListener('click', addIncomeEntry)

function addIncomeEntry(event) {
    event.preventDefault();
    let description = document.getElementById('incomesource').value;
    let amount = document.getElementById('incomeamount').value;
    let postParams = {
        // method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Access-Control-Allow-Headers': "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With",
            'Access-Control-Allow-Origin':'*'
        },
        body: JSON.stringify()
     };
     fetch(`/income/${description}/${amount}`, postParams)
     location.reload()
}

let addExpenseBtn = document.getElementById('expenseaddbtn');
addExpenseBtn.addEventListener('click', addExpenseEntry)

function addExpenseEntry(event) {
    let description = document.getElementById('expensesource').value;
    let amount = document.getElementById('expenseamount').value;
    let postParams = {
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Access-Control-Allow-Headers': "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With",
            'Access-Control-Allow-Origin':'*'
        },
        body: JSON.stringify()
     };
     fetch(`/expense/${description}/${amount}`, postParams)
}

function createExpDescList() {
    fetch(`expense/desc`)
        .then(response => response.json())
        .then(dataObj => {
            console.log(dataObj)
            dataObj.forEach(expense => {
                createExpItem(expense)
            })
        })
    }
createExpDescList()

function createExpItem(expense) {
    let expDescList = document.getElementById('expDescList')
    let expenseItem = document.createElement('li');
    expenseItem.innerHTML = expense.description + "  ---  " + expense.amount;
    expDescList.appendChild(expenseItem)
}

window.onload = function() {

    var percentExpense = (expense/income) * 100
    var percentSavings = (savings/income) * 100

    var chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        title: {
            text: "Expense : Savings"
        },
        data: [{
            type: "pie",
            startAngle: 240,
            yValueFormatString: "##0.00\"%\"",
            indexLabel: "{label} {y}",
            dataPoints: [
                {y: percentExpense, label: "Expense"},
                {y: percentSavings, label: "Savings"},
    
            ]
        }]
    });
    chart.render();

    let expData = Object.entries(expByName)
        .map(([ label, y ] ) => ({ label, y }))

    var chart2 = new CanvasJS.Chart("expChartContainer", {
        theme: "light2",
        animationEnabled: true,
        title: {
            text: "Expenses"
        },
        data: [{
            type: "pie",
            indexLabelFontSize: 18,
            radius: 80,
            indexLabel: "{label} - {y}",
            yValueFormatString: "###0.0\"%\"",
            click: explodePie,
            dataPoints: expData
        }]
    });
    chart2.render();
    
    function explodePie(e) {
        for(var i = 0; i < e.dataSeries.dataPoints.length; i++) {
            if(i !== e.dataPointIndex)
                e.dataSeries.dataPoints[i].exploded = false;
        }
    }
}

document.getElementById("exportbutton").onclick = function () {
    location.href = "http://127.0.0.1:5000/export";
};

let resetbtn = document.getElementById('resetbutton');
resetbtn.addEventListener('click', resetbudget)

function resetbudget(event) {
    event.preventDefault();
    let postParams = {
        method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Access-Control-Allow-Headers': "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With",
            'Access-Control-Allow-Origin':'*'
        },
     };
     fetch(`/reset`, postParams)
     location.reload()
}

