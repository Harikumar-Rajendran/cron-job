var express = require('express');
var app = express();
// var cron = require('node-cron');
const axios = require("axios");
var faunadb = require('faunadb'), q = faunadb.query

var client = new faunadb.Client({ secret: 'fnAEl0j-irAAR6IX8lj9-7TNb7xdkczzIvAjaTsK', domain: "db.us.fauna.com" })
const options = {
    method: 'GET',
    url: 'https://yh-finance.p.rapidapi.com/market/v2/get-quotes',
    params: {region: 'US', symbols: 'AMD,IBM,AAPL'},
    headers: {
      'X-RapidAPI-Host': 'yh-finance.p.rapidapi.com',
      'X-RapidAPI-Key': '6bfd3bf9a0mshd637ef7ccc19913p1fe183jsn7b632bfd5cd0'
    }
  };

  
  const postStock = (stockData) => {
  
      //fauna code 
      
      /* parse the string body into a useable JS object */
      const data = JSON.parse(stockData)
      console.log("Function to Post Stock invoked", data)
      const createItem = {
          data: data
      }
      /* construct the fauna query */
      return client.query(q.Create(q.Collection("Stock"), createItem))
          .then((response) => {
              console.log("success", response)
              /* Success! return the response with statusCode 200 */
              return ({
                  statusCode: 200,
                  body: JSON.stringify(response)
              })
          }).catch((error) => {
              console.log("error", error)
              /* Error! return the error with statusCode 400 */
              return ({
                  statusCode: 400,
                  body: JSON.stringify(error)
              })
          })
  }

  const fetchStock = () =>{
    axios.request(options).then(function (response) {
        console.log(JSON.stringify(response.data));
        postStock(JSON.stringify(response.data))
        }).catch(function (error) {
            console.error(error);
        });
  }
//   cron.schedule('1 8,17 * * *', () => {
//     console.log('running a task every minute');
//     fetchStock()
//   });

//   setInterval(fetchStock, 60000);

app.get('/', function (req, res) {
    fetchStock()
    res.send('Hello World');
})

var server = app.listen(process.env.PORT || 8081, function () {
   var host = server.address().address
   var port = server.address().port
   
   

   console.log("Example app listening at http://%s:%s", host, port)
})

