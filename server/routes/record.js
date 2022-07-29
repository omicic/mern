const { response } = require('express');
const express = require('express')

const recordRoutes = express.Router()
const dbo = require('../db/conn')

const ObjectId = require('mongodb').ObjectId;

// This section will help you get a list of all the records.
recordRoutes.route("/record").get(function (req, res) {
    let db_connect = dbo.getDb("employees");
    db_connect
        .collection("records")
        .find({})
        .toArray(function (err, result) {
            if (err) throw err;
            res.json(result);
        });
});


recordRoutes.route("/record/add").post((req, res) => {
    let db_connect = dbo.getDb()
    let myobj = {
        name: req.body.name,
        position: req.body.position,
        level: req.body.level,
    };

    db_connect.collection("records").insertOne(myobj, (err, res) => {
        if (err) throw err;
        response.json(res)
    })
})

recordRoutes.route("/:id").delete((req, res) => {
    let db_connect = dbo.getDb()
    let my_query = { _id: ObjectId(req.params.id) }
    db_connect.collection('records').deleteOne(my_query, (err, obj) => {
        if (err) throw err;
        console.log("Deleted one record")
        res.json(obj)
    })
})

recordRoutes.route('/record/:id').get((req, res) => {
    let db_connect = dbo.getDb()
    let myquery = { _id: ObjectId(req.params.id) }
    db_connect.collection('records').findOne(myquery, function (err, result) {
        if (err) throw err;
        res.json(result)
    })

})

recordRoutes.route('/update/:id').post((req, res) => {

    let db_connect = dbo.getDb()
    let my_query = { _id: ObjectId(req.params.id) }
    let newValues = {
        $set: {
            name: req.body.name,
            position: req.body.position,
            level: req.body.level,
        }
    }
    //console.log(newValues)
    db_connect
        .collection('records')
        .updateOne(my_query, newValues, (err, result) => {
            if (err) throw err
            console.log("One document updated")
            res.json(result)
        })

})

module.exports = recordRoutes;