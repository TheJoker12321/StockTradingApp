import { stockMarket } from "../data/data.js"
import readline from 'readline-sync'

function searchStock(identifier) {
    let stocksFound = stockMarket.stocks.filter((obj) => obj.id === identifier || obj.name === identifier)
    if (stocksFound.length === 0) {
        console.log("stock not found.");
    }
    return stocksFound
}


function filterStocksByPrice(givenPrice, above) {
    let stocksFound = stockMarket.stocks.filter((obj) => above === 'true' ? obj.currentPrice > givenPrice : obj.currentPrice < givenPrice)
    if (stocksFound.length === 0) {
        console.log("stock not found");
    }
    
    return stocksFound
}


function OperateOnStock(operation, identifier) {
    if (operation !== "buy" && operation !== "sell") {
        throw new Error("operation must be buy or sell");    
    }
    let stockFound = stockMarket.stocks.filter((obj) => obj.id === identifier || obj.name === identifier)
    if (stockFound.length === 0) {
        throw new Error("id or name not found");
    }
    let numberUnits = Number(readline.question("how many units you want to buy or sell? "))
    for (const stock of stockFound) {
        let indexStock = stockMarket.stocks.indexOf(stock)
        let price = stockMarket.stocks[indexStock].currentPrice
        stockMarket.stocks[indexStock].previousPrices.push(price)
        if (operation === "buy") {
            stockMarket.stocks[indexStock].availableStocks -= numberUnits
            stockMarket.stocks[indexStock].currentPrice = price + (price / 100 * 5)
        } else {
            stockMarket.stocks[indexStock].availableStocks += numberUnits
            stockMarket.stocks[indexStock].currentPrice = price - (price / 100 * 5)
        } 
        for (const unitStock of stockMarket.stocks) {
            if (stockFound.indexOf(stock) > 0) {
                break
            }
            if (stockMarket.stocks.indexOf(unitStock) === indexStock) {
                continue
            } else {
                if (unitStock.category === stock.category) {
                    unitStock.previousPrices.push(unitStock.currentPrice)
                    if (operation === "buy") {
                        unitStock.currentPrice = unitStock.currentPrice + (unitStock.currentPrice / 100)
                    } else {
                        unitStock.currentPrice = unitStock.currentPrice - (unitStock.currentPrice / 100)
                    }
                }
            }
        } 
    }
}


function checkTopGrow(status) {
    let topStock = []
    for (const stock of stockMarket.stocks) {
        if (stock.previousPrices.length === 0) {
            continue
        }
        if (topStock.length < 3) {
            topStock.push(stock)
        } else {
            for (const top of topStock) {
                if (status === 'increase') {
                    if (stock.currentPrice - stock.previousPrices[stock.previousPrices.length - 1] > top.currentPrice - top.previousPrices[top.previousPrices.length - 1]) {
                        topStock.splice(topStock.indexOf(top), 1, stock)
                    } 

                } else if (status === 'decrease') {
                    if (stock.currentPrice - stock.previousPrices[stock.previousPrices.length - 1] < top.currentPrice - top.previousPrices[top.previousPrices.length - 1]) {
                        topStock.splice(topStock.indexOf(top), 1, stock)
                    }
                }
            }
        }
    }
    return topStock
}

function mostVolatile() {
    let maxVol = 0
    let maxVolStock = stockMarket.stocks[0]
    for (const stock of stockMarket.stocks) {
        let sum = 1
        sum += stock.previousPrices.length
        if (sum > maxVol) {
            maxVol = sum
            maxVolStock = stock.name
        }
    }
    return maxVolStock
}

function average(category) {
    let sumActive = 0
    let numberCategory = 0
    for (const stock of stockMarket.stocks) {
        if (stock.category === category) {
            sumActive += stock.previousPrices.length
            numberCategory += 1
        }
    }
    
    
    return sumActive / numberCategory
}

function analyzeMarketTrends() {
    let topGrow =checkTopGrow('increase')
    let topGrowDown = checkTopGrow('decrease')
    let mostVol = mostVolatile()
    return {
        topIncreasingStocks: topGrow,
        topDecreasingStocks: topGrowDown,
        mostVolatileStock: mostVol,
        categoryStability: {
            education: average('education'),
            AI: average('AI'),
            factories: average('factories'),
            generalTech: average('general tech'),
            oil: average('oil'),
            greenEnergy: average('green energy')
        }
    }
}




export {
    searchStock,
    filterStocksByPrice,
    OperateOnStock,
    analyzeMarketTrends
}
