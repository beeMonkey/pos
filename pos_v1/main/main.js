'use strict';

const fixtures = require('../spec/fixtures')
const { loadAllItems, loadPromotions } = require('../spec/fixtures')

function printReceipt(tags) {
    let tagWithCounts = buildtagWithCounts(tags);
    let cartItems = buildicartItems(tagWithCounts);
    let receiptItems = buildreceiptItems(cartItems);
    calTotalAndSaved(receiptItems);
    console.log(generateReceipt(receiptItems));
};
function buildformattedBarcodes(tags) {
    return tags.map((tag) => {
        if (tag.indexOf("-") !== -1) {
            let [barcode, amount ] = tag.split("-");
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
function buildformattedBarcodes(tags) {
    let formattedBarcodes = [];
    for (let tag of tags) {
        let barcodeObject = {
            barcode: tag,
            amount: 1
        }
        if (tag.indexOf("-") !== -1) {
            let tempArray = tag.split("-");
            barcodeObject = {
                barcode: tempArray[0],
                amount: parseFloat(tempArray[1])
            }
        }
        formattedBarcodes.push(barcodeObject);
    }
    return formattedBarcodes;
}
// function calTagCount(formattedBarcodes) {
//     let arr = [];
//     for (var i = 0; i < formattedBarcodes.length;) {
//         var count = 0;
//         for (var j = i; j < formattedBarcodes.length; j++) {
//             if (formattedBarcodes[i] === formattedBarcodes[j]) {
//                 formattedBarcodes[i].amount = formattedBarcodes[i].amount + formattedBarcodes[j].amount;
//             }
//         }

//         arr.push({
//             barcode: formattedBarcodes[i],
//             amount: formattedBarcodes[i].amount 
//         })
//         i += count;
//     }
//     console.info(arr)
//     return arr;
// }
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


// function buildtagWithCounts(tags) {
//     // key-value
//     let map = new Map();
//     // 遍历集合中所有字符串
//     for (let tag of tags) {
//         // 判断字符串长度， 如果等于10，直接做统计，否则做特殊处理统计
//         if (tag.length == 10) {
//             let ele = tag;
//             // 判断是否已有存在的key
//             if (!map.has(ele)) {
//                 map.set(ele, 0);
//             }
//             // 取出value加一
//             map.set(ele, map.get(ele) + 1);
//         } else {
//             // 取字符串第一个字符作为key
//             let ele = tag.substring(0, 10);
//             if (!map.has(ele)) {
//                 map.set(ele, 0);
//             }
//             // 取字符串中的数字并做类型转换
//             let nums = parseFloat(tag.substring(11));
//             map.set(ele, map.get(ele) + nums);
//         }
//     }
//     let tagWithCounts = [];
//     map.forEach(function (value, key) {
//         tagWithCounts.push({
//             barcode: key,
//             amount: value
//         });
//     })
//     return tagWithCounts;
// }



function buildicartItems(tagWithCounts) {
    let detailItems = [];
    let allItems = fixtures.loadAllItems();
    for (let tagWithCount of tagWithCounts) {
        for (let itemOfAll of allItems) {
            if (tagWithCount.barcode === itemOfAll.barcode) {
                detailItems.push({
                    barcode: tagWithCount.barcode,
                    name: itemOfAll.name,
                    unit: itemOfAll.unit,
                    price: itemOfAll.price,
                    num: tagWithCount.amount,
                    subtotal: tagWithCount.amount * itemOfAll.price
                });
            }
        }
    }
    return detailItems;
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
    buildicartItems,
    buildreceiptItems,
    calTotalAndSaved,
    printReceipt
}