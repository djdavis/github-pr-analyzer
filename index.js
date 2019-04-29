const async = require("async");
const request = require("request");
const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
let currentPage = 1;
let nextPage = 2;
let monthlyCount = [];
let parsedData;
let params = {
    uri: `https://api.github.com/repos/ramda/ramda/pulls?access_token=dec6ab1877481383f7655a98fa5e55bc69b3a5d3&state=all&per_page=100&page=${currentPage}`,
    headers: {
        'User-Agent': 'Mozilla/5.0'
    }
};


async.whilst(function () {
        // Check that currentPage is less than newPage
        return currentPage < nextPage;
    },
    function (next) {
        params = getNewUrl(currentPage);
        request(params, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                parsedData = JSON.parse(body);
                for (var i = 0; i < parsedData.length; i++) {
                    // Cache some metrics for reporting later:
                    var parseDate = new Date(parsedData[i].created_at);
                    var mmYY = months[parseDate.getMonth()] + ' ' + parseDate.getFullYear();

                    // Monthly metrics
                    if (!monthlyCount[mmYY]) {
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

                if (parsedData.length > 0) {
                    // When the json has no more data loaded, nextPage will stop
                    // incrementing hence become equal to oldPage and return
                    // false in the test function.
                    nextPage++;
                } else {
                    console.log('Month-over-Month Pull Request creations count: \r\n');
                    console.log(monthlyCount);
                }
            }

            currentPage++;
            console.log(params.uri);
            console.log('Reading next page: ' + currentPage + '\r\n');
            next();
        });
    },
    function (err) {
        // All things are done!
    });


function getNewUrl(page) {
    return {
        uri: 'https://api.github.com/repos/ramda/ramda/pulls?access_token=dec6ab1877481383f7655a98fa5e55bc69b3a5d3&state=all&per_page=100&page=' + page,
        headers: {
            'User-Agent': 'Mozilla/5.0'
        }
    }
}