class Settings {
    savings = 20;
    needs = 50;
    wants = 30;
    constructor() {}

    setData(results) {
        this.savings = results.savings;
        this.needs = results.needs;
        this.wants = results.wants;
    }

    setDefaults() {
        this.savings = 20;
        this.needs = 50;
        this.wants = 30;

        let data = { "ID": 0, "savings": this.savings, "needs": this.needs, "wants": this.wants };
        let connector = new sql_connector();
        //insert data using the insert query
        connector.insert("settings", data);
    }

    toString() {
        let s = {
            savings: this.savings,
            needs: this.needs,
            wants: this.wants
        }

        return JSON.stringify(s);
    }

    read(callback) {
        let sql_query = "SELECT * FROM settings";
        let connector = new sql_connector();
        connector.execute_query(sql_query, (results) => {
            //to do code goes here
            callback(results);
        })
    }
}