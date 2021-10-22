let settings;
let incrementValue = 500; //can be changed through the settings panel
let currentValue = 0; //when adding the value, this will be changed
let accountManager
let monthlyWage = 140000; //money get each and every month
let accountScheme
let trashManager
let hardware
let thisMonthsAdditionalMoney = 0

function __ready() {
    settings = new Settings();
    settings.read(results => {
            if (results.length == 0) {
                settings.setDefaults();
                toast("Settings saved")
            } else {
                // monthlyWage = results[0].wage;
                // alert(JSON.stringify(results))
                accountScheme = results[0]
            }
        })
        //for accountManager
    accountManager = new Account();
    trashManager = new Trash()
    hardware = new Hardware();
    setupListFromAccount();
    getStats()
    getRecentTransactions();

}

function _back_pressed() {
    App.close()
}

//when ui add money is pressed 
function addMoney(value, type = "add") {
    currentValue += value;
    if (currentValue < 0) {
        currentValue = 0
    }
    setValue("input-amount-to-" + type, currentValue)
}

//when add is clicked
function insertToAccount() {
    let valueToAdd = parseInt(getValue("input-amount-to-add"))
    let error = false
    if (valueToAdd <= 0) {
        toast("You cant add a negative value");
        error = true
        get("input-amount-to-add").style.border = "1px solid red"
    }

    if (getValue("description").length <= 0) {
        get("description").style.border = "1px solid red"
        error = true;
    }

    if (error) {
        return;
    }

    accountManager.addMoney(valueToAdd, getValue("description"))
    currentValue = 0 //
    setValue("input-amount-to-add", "")
    hide("alert-mask")
    hide("alert-dialog")
    getStats()
    getRecentTransactions()
}

//withdraw from accountManager
function withdrawFromAccount() {
    let amount = parseInt(getValue("input-amount-to-withdraw"))
    let accountScheme = getValue("account-scheme")
    let description = getValue("description-withdraw")

    let error = false
    if (amount <= 0 || amount.length == 0) {
        toast("You cant add a negative value");
        error = true
        get("input-amount-to-add").style.border = "1px solid red"
    }

    if (description.length <= 0) {
        get("description-withdraw").style.border = "1px solid red"
        toast("Describe your transaction first")
        error = true;
    }

    if (error) {
        return;
    }


    accountManager.withdrawMoney(amount, description, accountScheme, 1)
    setValue("input-amount-to-withdraw", "")
    hide("alert-mask-withdraw")
    hide("alert-dialog-withdraw")

    toast("withdrawed " + amount + get("account-scheme").innerHTML)
    getStats()
    getRecentTransactions()
}

function setupListFromAccount() {
    accountManager.getDescriptions(results => {
        // lets populate our data list

        var str = ""
        for (var i = 0; i < results.length; i++) {
            str += '<option value="' + results[i].description + '" />';
        }

        get("datalist").innerHTML = str;
    })
}

function getStats() {
    thisMonthsAdditionalMoney = 0
        //for savings
    accountManager.getAll(results => {
        //savings scheme
        let savingsPercent = parseInt(accountScheme.savings)
        let basicsPercent = parseInt(accountScheme.needs)
        let emergencyPercent = parseInt(accountScheme.wants)

        let numberFormater = Intl.NumberFormat('en-US')


        let amountForSavings = (savingsPercent / 100) * monthlyWage
        let amountForBasics = (basicsPercent / 100) * monthlyWage
        let amountForEmergency = (emergencyPercent / 100) * monthlyWage

        let usedSavings = 0; //how much has been used
        let usedBasics = 0; //how much basic usedSavings
        let usedEmergence = 0;

        let totalUsage = 0; //total amount used
        for (var i = 0; i < results.length; i++) {
            let result = results[i]
            let currentScheme = result.scheme.replaceAll("\"", "")
            let currentState = 0
            try {
                currentState = parseInt(result.state)
            } catch (err) {}
            //skip this one which means it has been deleted
            if (currentState == 0) {
                continue;
            }
            if (result.type == 0) {
                thisMonthsAdditionalMoney += parseInt(result.amount)
                continue;
            }

            if (currentScheme == "1") {
                usedSavings += parseInt(result.amount)
            } else if (currentScheme == "2") {
                usedBasics += parseInt(result.amount)
            } else {
                usedEmergence += parseInt(result.amount)
            }
            totalUsage += parseInt(result.amount)

        }
        //savings here
        let difference = amountForSavings - usedSavings

        let percentage = (difference / amountForSavings) * 100;
        setTransition("progressbar-savings", "300ms")
        setWidth("progressbar-savings", percentage + "%")
        setValue("savings-remainder", "MWK " + difference)

        //basics here
        let basicsDifference = amountForBasics - usedBasics
        let basicsInPercent = (basicsDifference / amountForBasics) * 100
        setTransition("progressbar-basics", "300ms")
        setWidth("progressbar-basics", basicsInPercent + "%")
        setValue("basics-remainder", "MWK " + basicsDifference)


        //emergency here
        let emergencyDifference = amountForEmergency - usedEmergence
        let emergencyInPercent = (emergencyDifference / amountForEmergency) * 100
        setTransition("progressbar-emergency", "300ms")
        setWidth("progressbar-emergency", emergencyInPercent + "%")
        setValue("emergency-remainder", "MWK " + emergencyDifference)

        //set value for full cash in account
        let balanceInAccount = monthlyWage - totalUsage
        setValue("current-amount", "MWK " + numberFormater.format(balanceInAccount + thisMonthsAdditionalMoney))
        setValue("amount-addons", "MWK " + numberFormater.format(thisMonthsAdditionalMoney))

    })
}

//read top 10 recent statistics made by the user
function getRecentTransactions() {
    setValue("recent-activities", "")
    accountManager.getAllRecents(results => {
        for (var i = 0; i < results.length; i++) {
            let result = results[i]
            let resultType = parseInt(result.type)
            let resultState = parseInt(result.state)

            if (resultState == 0) {
                continue;
            }
            let v = `<div class="list-item__center"> <i class="fa fa-arrow-:arrow: mr-3" style="color::color:;"></i> MWK :amount: <br>
                <small> [:description:]</small>
            </div>`
            if (resultType == 0) {
                v = v.replaceAll(":arrow:", "up")
                v = v.replaceAll(":color:", "green")
            } else {
                v = v.replaceAll(":arrow:", "down")
                v = v.replaceAll(":color:", "red")
            }
            v = v.replaceAll(":amount:", result.amount)
            v = v.replaceAll(":description:", result.description.replaceAll("\"", ""))

            let li = create("li")
            li.className = "list-item"
            li.innerHTML = v
            li.longClick(1, function(event) {
                showDelete("Delete record?", () => {
                    accountManager.delete(parseInt(result.ID))
                    toast("Record " + result.description + " deleted!" + parseInt(result.ID))
                    hide('delete-dialog-mask');
                    hide('delete-dialog')
                    getStats()
                    getRecentTransactions()

                })
            })
            set("recent-activities", li)
        }
    })
}

function showDelete(title, actionYes) {
    show("delete-dialog-mask")
    show("delete-dialog")
    deleteEvent = actionYes
    setValue("delete-dialog-title", title)
}

let deleteEvent

function perfomDeleteEvent() {
    deleteEvent()
}