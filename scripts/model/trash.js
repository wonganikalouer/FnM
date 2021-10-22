class Trash {
    delete(id) {
        let data = { "ID": 0, "accountID": id };
        let connector = new sql_connector();
        //insert data using the insert query
        connector.insert("trash", data);
    }
}