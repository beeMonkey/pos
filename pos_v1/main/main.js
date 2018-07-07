'use strict';

const fixtures = require('../spec/fixtures')
const { loadAllItems, loadPromotions } = require('../spec/fixtures')

function printReceipt(tags) {
    let tagWithCounts = buildtagWithCounts(tags);
    let cartItems = buildcartItems(tagWithCounts);
    let receiptItems = buildreceiptItems(cartItems);
    calTotalAndSaved(receiptItems);
    console.log(generateReceipt(receiptItems));
};
function buildformattedBarcodes(tags) {
    return tags.map((tag) => {
        if (tag.indexOf("-") !== -1) {
            let [barcode, amount ] = tag.split("-");    //数组解构赋值，将数组中的值分割给变量
            return {
                barcode: barcode,
                amount: parseFloat(amount)
            }
        }
        return {
            barcode: tag,
            amount: 1
        }
    });
}

function calTagCount(formattedBarcodes) {
    let cartItems = [];
    for (let formattedBarcode of formattedBarcodes) {
        let existCartItem = null;
        for (let cartItem of cartItems) {
            if (cartItem.barcode === formattedBarcode.barcode)
                existCartItem = cartItem;
        }
        if (existCartItem != null) {
            existCartItem.amount += formattedBarcode.amount;
        } else {
            cartItems.push({ ...formattedBarcode });
        }
    }
    return cartItems;

}

function buildtagWithCounts(tags) {
    let formattedBarcodes = buildformattedBarcodes(tags);
    let tagWithCounts = calTagCount(formattedBarcodes);
    return tagWithCounts;
}

function buildcartItems(tagWithCounts) {
    let allItems = fixtures.loadAllItems();
    return tagWithCounts.map((tagWithCount)=>{
        const itemByFind=allItems.find(function(item){
            return tagWithCount.barcode === item.barcode;
        })
    const{name,unit,price}=itemByFind;
    const{barcode,amount}=tagWithCount;
    const subtotal=price*amount;
    //console.info({barcode,name,unit,price,amount})
    return {barcode,name,unit,price,num:amount,subtotal};
})  
}
function buildreceiptItems(cartItems) {     //  深拷贝做法，达到效果
    let promotions = loadPromotions()[0].barcodes;
    let receipt = {};
    let cartItemsClone = cartItems.slice(0);
    for (let promotion of promotions) {
        for (let cartItem of cartItemsClone) {
            if (promotion === cartItem.barcode) {
                cartItem.subtotal = cartItem.subtotal - cartItem.price * (Math.floor(cartItem.num / 3));    //每满二减一
            }
        }
    }
    receipt.items = cartItemsClone;
    return receipt;
}
function calTotalAndSaved(receipt) {
    let total = 0;
    let saved = 0;
    for (let item of receipt.items) {
        total += item.subtotal;
        saved += item.price * item.num - item.subtotal;
    }
    receipt.total = total;
    receipt.saved = saved;

    return receipt;
}
function generateReceipt(receipt) {
    let content = "***<没钱赚商店>收据***\n";
    for (let item of receipt.items) {
        let price = item.price.toFixed(2);
        content += `名称：${item.name}，数量：${item.num}${item.unit}，单价：${price}(元)，小计：${item.subtotal.toFixed(2)}(元)\n`;
    }
    content += `----------------------\n总计：${receipt.total.toFixed(2)}(元)\n`;
    content += `节省：${receipt.saved.toFixed(2)}(元)\n**********************`;
    return content;
}

module.exports = {
    buildtagWithCounts,
    buildcartItems,
    buildreceiptItems,
    calTotalAndSaved,
    printReceipt
}