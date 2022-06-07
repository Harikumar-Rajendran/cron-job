var express = require('express');
var app = express();
// var cron = require('node-cron');
const axios = require("axios");
var faunadb = require('faunadb'), q = faunadb.query
const util = require('./utils');

var client = new faunadb.Client({ secret: 'fnAEl0j-irAAR6IX8lj9-7TNb7xdkczzIvAjaTsK', domain: "db.us.fauna.com" })

// const options = {
//     method: 'GET',
//     url: 'https://yh-finance.p.rapidapi.com/market/v2/get-quotes',
//     params: {region: 'US', symbols: 'AMD,IBM,AAPL'},
//     headers: {
//       'X-RapidAPI-Host': 'yh-finance.p.rapidapi.com',
//       'X-RapidAPI-Key': '6bfd3bf9a0mshd637ef7ccc19913p1fe183jsn7b632bfd5cd0'
//     }
//   };

const getRoute = () => {

    return client.query(q.Paginate(q.Documents(q.Collection('Routes'))))
        .then((response) => {
            const allRefs = response.data
            const getAllDataQuery = allRefs.map((ref) => {
                return q.Get(ref)
            })
            return client.query(getAllDataQuery).then((ret) => {
                const rt = util.ParseRoute(ret)
                fetchStock(util.FormatRoute(rt[rt.length-1]))
            })
        }).catch((error) => {
            console.log("error", error)
            return ({
                statusCode: 400,
                body: JSON.stringify(error)
            })
        })
}

const postStock = (stockData) => {
    const data = JSON.parse(stockData)
    console.log("Function to Post Stock invoked", data)
    const createItem = {
        data: data
    }
    return client.query(q.Create(q.Collection("Stock"), createItem))
        .then((response) => {
            return ({
                statusCode: 200,
                body: JSON.stringify(response)
            })
        }).catch((error) => {
            console.log("error", error)
            return ({
                statusCode: 400,
                body: JSON.stringify(error)
            })
        })
}

const fetchStock = (ops) => {
    axios.request(ops).then(function (response) {
        postStock(JSON.stringify(response.data))
    }).catch(function (error) {
        console.error(error);
    });
}
//   cron.schedule('1 8,17 * * *', () => {
//     console.log('running a task every minute');
//     fetchStock()
//   });

app.get('/', function (req, res) {
    getRoute()
    res.send('Hello World');
})

var server = app.listen(process.env.PORT || 8081, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})

