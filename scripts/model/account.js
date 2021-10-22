class Account {
    //account type where 0 for input and 1 for withdraw
    //month is this scenario will be a plus 1
    //scheme 1 for savings, 2 for basic needs and 3 for wants
    SAVINGS = 1;
    BASICS = 2;
    WANTS = 3;
    tableName = "account_table";
    addMoney(amount, description, scheme = 1, type = 0) {
        const d = new Date();
        let month = d.getMonth();
        let data = { "amount": amount, "month": month, "type": type, "description": description, "scheme": scheme, "state": 1 };
        let connector = new sql_connector();
        //insert data using the insert query
        connector.insert(this.tableName, data);
    }

    withdrawMoney(amount, description, scheme) {
        this.addMoney(amount, description, scheme, 1);
    }

    getDescriptions(callback) {
        let sql = "select * from " + this.tableName
        let connector = new sql_connector();
        connector.execute_query(sql, (results) => {
            //to do code goes here
            callback(results)
        })
    }

    getTotalAmountWithdrawn(callback, month = null) {
        if (month == null) {
            const d = new Date();
            month = d.getMonth();
        }
        let sql_query = `SELECT sum(amount) as total FROM ${this.tableName} where type=1 and month = ${month}`;
        let connector = new sql_connector();
        connector.execute_query(sql_query, (results) => {
            //to do code goes here
            callback(results)
        })
    }

    getTotalAmountDeposited(callback, month = null) {
        if (month == null) {
            const d = new Date();
            month = d.getMonth();
        }
        let sql_query = `SELECT sum(amount) as total FROM ${this.tableName} where type=0 and month = ${month}`;
        let connector = new sql_connector();
        connector.execute_query(sql_query, (results) => {
            //to do code goes here
            callback(results)
        })
    }

    getSavings(callback, month = null) {
        if (month == null) {
            const d = new Date();
            month = d.getMonth();
        }
        let sql_query = `SELECT * FROM ${this.tableName} where scheme = ${this.SAVINGS} and month = ${month}`;
        let connector = new sql_connector();
        connector.execute_query(sql_query, (results) => {
            //to do code goes here
            callback(results)
        })
    }

    getBasics(callback, month = null) {
        if (month == null) {
            const d = new Date();
            month = d.getMonth();
        }
        let sql_query = `SELECT * FROM ${this.tableName} where scheme = ${this.BASICS} and month = ${month}`;
        let connector = new sql_connector();
        connector.execute_query(sql_query, (results) => {
            //to do code goes here
            callback(results)
        })
    }

    getWants(callback, month = null) {
        if (month == null) {
            const d = new Date();
            month = d.getMonth();
        }
        let sql_query = `SELECT * FROM ${this.tableName} where scheme = ${this.WANTS} and month = ${month}`;
        let connector = new sql_connector();
        connector.execute_query(sql_query, (results) => {
            //to do code goes here
            callback(results)
        })
    }

    getAll(callback) {
        let sql_query = "SELECT * FROM " + this.tableName; //except the deleted ones
        let connector = new sql_connector();
        connector.execute_query(sql_query, (results) => {
            //to do code goes here
            callback(results)
        })
    }

    getAllRecents(callback) {
        let sql_query = "SELECT * FROM " + this.tableName + " order by ID desc limit 10";
        let connector = new sql_connector();
        connector.execute_query(sql_query, (results) => {
            //to do code goes here
            callback(results)
        })
    }

    delete(id) {
        let sql = `UPDATE ${this.tableName} SET state =  0 WHERE ID = ${id} `;
        var con = new sql_connector();
        con.exec(sql);
    }
}