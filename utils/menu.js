import {searchStock,
    filterStocksByPrice,
    OperateOnStock} from './stockFunc.js'

import readline from 'readline-sync'


function menu() {
    let flag = true
    while (flag) {
        console.log(`=====MENU=====
________________________________________
1. Search for a stock by name or id.
2. Show all stocks above or below a given price.
3. Buy or sell a stock.
0. Exit
________________________________________
`)
        let choose = readline.question("choose the option from the menu: ")
        let identifier;
        let result;
        switch (Number(choose)) {
            case 1:
                identifier = readline.question("Enter the identifier (name or id): ")
                result = searchStock(identifier)
                console.log(result)
                break
        
            case 2:
                let price = Number(readline.question("Enter the price: "))
                let above = readline.question("choose true above the price or false (below): ")
                result = filterStocksByPrice(price, above)
                console.log(result)
                break
            
            case 3:
                let operation = readline.question("Enter the operation (buy or sell): ")
                identifier = readline.question("Enter the identifier (name or id): ")
                OperateOnStock(operation, identifier)
                break

            case 0:
                flag = false

            default:
                console.log("you must print number from 0 - 3")
                break
                
        }
    }
}


export {menu}