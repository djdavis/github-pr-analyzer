const https = require('https');

const params = {
    hostname: 'api.github.com',
    path: '/repos/ramda/ramda/pulls\?state\=all',
    headers: { 'User-Agent': 'Mozilla/5.0' }
};

const months = ["JAN", "FEB", "MAR","APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

https.get(params, (resp) => {
    let data = '';

    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
        data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
        var parsedData = JSON.parse(data);
        var monthlyCount = [];

        for(var i = 0; i < parsedData.length; i++)
        {
            // Cache some metrics for reporting later:
            var parseDate = new Date(parsedData[i].created_at);
            var mmYY = months[parseDate.getMonth()] + ' ' + parseDate.getFullYear();

            // Monthly metrics
            if (! monthlyCount[mmYY]) {
                monthlyCount[mmYY] = 1;
            } else {
                monthlyCount[mmYY]++;
            }

            // Output data
            console.log(
                'Title: ' + parsedData[i].title + '\r\n' +
                'Url: ' + parsedData[i].html_url + '\r\n' +
                'Created At: ' + parsedData[i].created_at + '\r\n' +
                'Updated At: ' + parsedData[i].updated_at + '\r\n' +
                'Closed At: ' + parsedData[i].closed_at + '\r\n' +
                'Merged At: ' + parsedData[i].merged_at + '\r\n' +
                'Status: ' + parsedData[i].state + '\r\n' +
                '------------------------------------');
        }

        console.log('Month-over-Month Pull Request creations count: \r\n');
        console.log(monthlyCount);
    });

}).on("error", (err) => {
    console.log("Error: " + err.message);
});