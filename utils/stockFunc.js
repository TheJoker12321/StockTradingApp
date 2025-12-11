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




export {
    searchStock,
    filterStocksByPrice,
    OperateOnStock
}
