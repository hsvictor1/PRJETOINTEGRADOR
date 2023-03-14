const Modal = {
    open() {
        document
            .querySelector(".modal-overlay")
            .classList
            .add('active')

    },
    close() {
        document
            .querySelector(".modal-overlay")
            .classList
            .remove('active')

    }
}
const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("billingplanner:transactions")) || []
    },

    set(transactions) {
        localStorage.setItem("billingplanner:transactions", JSON.stringify(transactions))
    }
}

const Transaction = {
    all: Storage.get(),
    add(transaction) {
        Transaction.all.push(transaction)
        App.reload()
    },
    remove(index) {
        Transaction.all.splice(index, 1)
        App.reload()



    },
    Total() {
        let expense = 0;
        Transaction.all.forEach(transaction => {
            if (transaction.amount > 0) {
                expense += transaction.amount;
            }
        })
        return expense;
    }
}
const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),
    addTransaction(transaction, index) {
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index
        DOM.transactionsContainer.appendChild(tr)
    },
    innerHTMLTransaction(transaction, index) {
        const amount = Utils.formatCurrency(transaction.amount)
        const html = `
        <tr>
        <td class= "date"> ${transaction.date}</td>
        <td class= "description">${transaction.description}</td>
        <td class= "expense">${amount}</td>

        <td onclick="Transaction.remove(${index})">
         DELETE 
    
        </td>
       
         </tr>
        `

        return html

    },

    updateBalance() {
        document
            .getElementById('totalDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.Total())
    },
    clearTransactions() {
        DOM.transactionsContainer.innerHTML = ""
    }
}

const Utils = {
    formatAmount(value) {
        value = Number(value) * 100
        return value
    },
    formatDate(date) {
        const splittedDate = date.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}${splittedDate[0]}`

    },
    formatCurrency(value) {
        value = String(value).replace(/\D/g, "")
        value = Number(value) / 100
        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })

        return (value)
    }
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },
    validateFields() {
        const { description, amount, date } = Form.getValues()
        if (
            description.trim() === "" ||
            amount.trim() === "" ||
            date.trim() === "") {
            throw new Error("Please fill in all fields.")
        }
    },
    formatValues() {
        let { description, amount, date } = Form.getValues()
        amount = Utils.formatAmount(amount)
        date = Utils.formatDate(date)
        return {
            description,
            amount,
            date
        }
    },
    saveTransaction(transaction) {
        Transaction.add(transaction)
    },
    clearFields() {
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""

    },
    submit(event) {
        event.preventDefault()
        try {
            Form.validateFields()
            const transaction = Form.formatValues()
            Transaction.add(transaction)
            Form.clearFields()
            Modal.close
        } catch (error) {
            alert(error.message)
        }
    }
}

const App = {
    init() {
        Transaction.all.forEach(DOM.addTransaction)

        DOM.updateBalance()

        Storage.set(Transaction.all)
    },
    reload() {
        DOM.clearTransactions()
        App.init()
    },
}
App.init()