from flask import Flask, Response, request, jsonify, render_template, make_response
from datetime import datetime
import json
from flask_sqlalchemy import SQLAlchemy
import sqlite3
from flask_marshmallow import Marshmallow
import csv
from io import StringIO
import sys


app = Flask(__name__)

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite3'

def db_connection():
    conn = None
    try:
        conn = sqlite3.connect("db.sqlite")
    except sqlite3.error as e:
        print(e)
    return conn

if __name__ == "__main__":
    app.run(debug=True)

db = SQLAlchemy(app)
ma = Marshmallow(app)

class Income(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(50), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    date = db.Column(db.DateTime, default=datetime.now)

    def __repr__(self):
        return "<Description: {}>".format(self.description)

class Expense(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(50), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    date = db.Column(db.DateTime, default=datetime.now)

class IncomeSchema(ma.Schema):
    class Meta:
        fields = ('id','description','amount','date')

get_income_schema = IncomeSchema()
income_schema = IncomeSchema(many=True)

class ExpenseSchema(ma.Schema):
    class Meta:
        fields = ('id','description','amount','date')

get_expense_schema = ExpenseSchema()
expense_schema = ExpenseSchema(many=True)

@app.route("/", methods=["GET", "POST"])
def home():
    # if request.form:
    #     incomeentry = Income(description=request.form.get("incomesource"), 
    #     amount=request.form.get("incomeamount"))
    #     db.session.add(incomeentry)
    #     expenseentry = Expense(description=request.form.get("expensesource"), 
    #     amount=request.form.get("expenseamount"))
    #     db.session.add(expenseentry)
    #     db.session.commit()
    allIncome = Income.query.all()
    allExpense = Expense.query.all()
    return render_template("budget_interface.html", allIncome=allIncome, allExpense=allExpense)

### ======================INCOME METHODS====================== ###

@app.route('/income', methods=["GET"])
def get_all_income():
    income = Income.query.all()
    result = income_schema.dump(income)
    return jsonify(result)

@app.route('/income/<id>', methods=["GET"])
def get_income(id):
    income = Income.query.filter_by(id=id).first()
    result = get_income_schema.dump(income)
    return jsonify(result)

@app.route('/income/<description>/<amount>')
def insert_income(description,amount):
    income = Income(description=description, amount=amount)
    db.session.add(income)
    db.session.commit()
    return "<h2>new income entry added</h2>"

@app.route('/income/delete/<id>', methods=["DELETE"])
def delete_income(id):
    income = Income.query.filter_by(id=id).delete()
    db.session.commit()
    return '<h2>income entry has been deleted</h2>'

### ======================EXPENSE METHODS====================== ###

@app.route('/expense', methods=["GET"])
def get_all_expense():
    expense = Expense.query.all()
    result = expense_schema.dump(expense)
    return jsonify(result)

@app.route('/expense/<description>')
def get_expense(description):
    expense = Expense.query.filter_by(description=description)
    return f'The amount for this expense is: { income.amount }'

@app.route('/expense/<description>/<amount>')
def insert_expense(description, amount):
    expense = Expense(description=description, amount=amount)
    db.session.add(expense)
    db.session.commit()
    return '<h2>new expense entry added</h2>'

@app.route('/expense/delete/<id>', methods=["DELETE"])
def delete_expense(id):
    expense = Expense.query.filter_by(id=id).delete()
    db.session.commit()
    # return '<h2>expense entry has been deleted</h2>'

@app.route('/expense/desc')
def show_expense_desc():
    expense = Expense.query.order_by(Expense.amount.desc())
    result = expense_schema.dump(expense)
    return jsonify(result)

### ======================EXPORT AND RESET METHODS====================== ###

@app.route('/export', methods=['GET'])
def export(): 
    with sqlite3.connect("db.sqlite3") as connection:
        si = StringIO()
        csvWriter = csv.writer(si)
        c = connection.cursor()

        c.execute("select * from income")
        rows = c.fetchall()
        for i in rows:
            csvWriter.writerow(i)

        c.execute("select * from expense")
        rows2 = c.fetchall()
        for e in rows2:
            csvWriter.writerow(e)

        output = make_response(si.getvalue())
        output.headers["Content-Disposition"] = "attachment; filename=budget_export.csv"
        output.headers["Content-type"] = "text/csv"
        return output

@app.route('/reset', methods=['DELETE'])
def delete_all_records():
    db.session.query(Income).delete()
    db.session.query(Expense).delete()
    db.session.commit()
