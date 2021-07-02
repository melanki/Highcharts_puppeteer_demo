/**
 * This file creates a highchart, 
 * no html page is required.  The html is crafted
 * within this script.
 */
const puppeteer = require('puppeteer')
const htpt = require('http')
const fs = require('fs')

async function run() {



    const browser = await puppeteer.launch({
        headless: true
    })
    // const browser = await puppeteer.launch({
    //     headless: false,
    //     slowMo: 2000,
    //     devtools: true
    // })

    const page = await browser.newPage()
    page.on("console", msg => console.log(`Page Console: ${msg.text()}`));

    const loaded = page.waitForNavigation({
        waitUntil: 'load'
    })

    const html = fs.readFileSync('template.html')

    await page.setContent(html.toString())
    await loaded

    async function loadChart() {

        await page.evaluate(async (fs) => {

            console.log('page.evaluate Highcharts.version='
                + Highcharts.version)

            var myChart = Highcharts.chart('container', {
                chart: {
                    type: 'bar'
                },
                title: {
                    text: 'Fruit Consumption'
                },
                xAxis: {
                    categories: ['Apples', 'Bananas', 'Oranges']
                },
                yAxis: {
                    title: {
                        text: 'Fruit eaten'
                    }
                },
                plotOptions: {
                    series: {
                        animation: false
                    }
                },
                series: [{
                    name: 'Jane',
                    data: [1, 0, 4]
                }, {
                    name: 'John',
                    data: [5, 7, 3]
                }]
            });
        }, fs)
    }

    await loadChart()

    await page.pdf({
        path: 'chart.pdf'
    })

    await browser.close()
}

run()