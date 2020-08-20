function getAllIncome() {
    // document.getElementById('incomeentrywrap').innerHTML = ""
    fetch('/income')
        .then(response => response.json())
        console.log(response) 
        .then(dataObj => {
            console.log(dataObj)
            // createIncomeBoxes(dataObj)
        })
};
// getAllIncome();

function getSingleIncome() {
    document.getElementById('incomeentrywrap').innerHTML = ""
    fetch('/income/<id>')
        .then(response => response.json())
        .then(dataObj => {
            console.log(dataObj)
            // console.log(dataObj.id)
            createIncomeBox(dataObj)
        })
};
// getSingleIncome();

function createIncomeBoxes(dataObj){
    document.getElementById('incomeentrywrap').innerHTML = ""
    let incomeArr = dataObj.data;
    // let sorted = incomeArr.sort((a, b) => new Date(b.date.replace(/ /g,"T")) - new Date(a.date.replace(/ /g,"T")))
    incomeArr.forEach(income => {
        savedIncome.push(income)
        createIncomeBox(income)
    })
}

function createIncomeBox(income) {
    //Make Wrapper Div and attach Click listener
    let incomeBox = document.createElement('div');
    incomeBox.classList.add('entry');
    incomeBox.setAttribute('data-id', income.id);

    let date = document.createElement('div')
    date.classList.add("date")
    date.innerHTML = income.date;

    let description = document.createElement('div')
    description.classList.add("description")
    description.innerHTML = income.description;

    let amount = document.createElement('div')
    amount.classList.add("amount")
    amount.innerHTML = income.amount;

    incomeBox.appendChild(date)
    incomeBox.appendChild(description)
    incomeBox.appendChild(amount)

    let incomeentrywrap = document.getElementById("incomeentrywrap")
    incomeentrywrap.appendChild(incomeBox)
 }

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
    document.getElementById('totalincome').innerHTML = totalIncome
}
calculateTotalIncome()

function calculateTotalExpense() {
    let expenseAmounts = Array.from(document.getElementsByClassName('expenseamount'));
    let savedExpense = [];
    for (var i of expenseAmounts){
        savedExpense.push(parseFloat(i.innerHTML))
    }
    console.log(savedExpense)
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    let totalExpense = savedExpense.reduce(reducer);
    console.log(totalExpense);
    document.getElementById('totalexpense').innerHTML = totalExpense
}
calculateTotalExpense()

var income = parseFloat(document.getElementById('totalincome').innerHTML)
var expense = parseFloat(document.getElementById('totalexpense').innerHTML)
var savings = income - expense
console.log(savings)
document.getElementById('savings').innerHTML = "Total savings: $" + savings

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
//       body: JSON.stringify()
    };
    fetch(`/income/delete/${id}`, postParams)
//        .then(res => res.json())
        .then(res => {
            $('#deleteEntryModal').modal('hide')
    });
    // document.getElementById("incomesource").value = " ";
    // document.getElementById("incomeamount").value = " ";
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
//       body: JSON.stringify()
    };
    fetch(`/expense/delete/${id}`, postParams)
//        .then(res => res.json())
        .then(res => {
            $('#deleteExpenseModal').modal('hide')
    });
    // document.getElementById("incomesource").value = " ";
    // document.getElementById("incomeamount").value = " ";
    location.reload()
}

let addIncomeBtn = document.getElementById('incomeaddbtn');
addIncomeBtn.addEventListener('click', addIncomeEntry)

function addIncomeEntry(event) {
    // event.preventDefault();
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
        //  .then(res => res.json())
        //  .then(res => {
        //      calculateTotalIncome()
    //  });
}

let addExpenseBtn = document.getElementById('expenseaddbtn');
addExpenseBtn.addEventListener('click', addExpenseEntry)

function addExpenseEntry(event) {
    // event.preventDefault();
    let description = document.getElementById('expensesource').value;
    let amount = document.getElementById('expenseamount').value;
    let postParams = {
        // method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Access-Control-Allow-Headers': "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With",
            'Access-Control-Allow-Origin':'*'
        },
        body: JSON.stringify()
     };
     fetch(`/expense/${description}/${amount}`, postParams)
        //  .then(res => res.json())
        //  .then(res => {
        //      calculateTotalIncome()
    //  });
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