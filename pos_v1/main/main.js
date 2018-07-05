'use strict';

function printReceipt(tags){
    //calculateSameItems(tags);
   let cartItems =buildcartItems(tags);
    //console.log(sameItems[0].barcode);
    //console.info(sameItems);
    let itemDetail=builditemDetail(cartItems);
    //console.info(detailItems);

    let receiptItems= buildreceiptItems(itemDetail);
    //console.info(receiptItems);
    
    console.info(JSON.stringify(generateReceipt(receiptItems)));
    console.log(generateReceipt(receiptItems));
};



function buildcartItems(collection) {
    // key-value
    let map = new Map();
    // 遍历集合中所有字符串
    for(let i=0;i<collection.length;i++){
      // 判断字符串长度， 如果等于1，直接做统计，否则做特殊处理统计
      if(collection[i].length == 10) {
        let ele = collection[i];
        // 判断是否已有存在的key
        if(!map.has(ele)) {
          map.set(ele, 0);
        }
        // 取出value加一
        map.set(ele,map.get(ele) + 1);
      } else {
        // 取字符串第一个字符作为key
        let ele = collection[i].substring(0,10);
        if(!map.has(ele)) {
          map.set(ele, 0);
        }
        // 取字符串中的数字并做类型转换
        let nums= Number(collection[i].substring(11));
        map.set(ele,map.get(ele) + nums);
      }
    }
    let sameItems=[];
    map.forEach(function(value,key){
      sameItems.push({
        barcode:key,
        amount:value
      });
    })
    //console.log(arr);
  return sameItems;
}

function builditemDetail(sameItems){
    let detailItems=[];
    let wholeItems=loadAllItems();
    // for(let i of sameItems){
    //     for(let j of wholeItems){
    //         if(sameItems[i]===wholeItems[j]){
    //             console.log(wholeItems[j].barcode);
    //         }
    //     }
        
    // }
    for(let i=0;i<sameItems.length;i++){
        for(let j=0;j<wholeItems.length;j++){
            if(sameItems[i].barcode===wholeItems[j].barcode){
                    detailItems.push({ 
                                    barcode:sameItems[i].barcode, 
                                    name:wholeItems[j].name,
                                    unit:wholeItems[j].unit,
                                    price:wholeItems[j].price,
                                    num:sameItems[i].amount,
                                    subtotal:sameItems[i].amount*wholeItems[j].price});
                 }
        }
    }
    //console.log(detailItems);
    return detailItems;
}

// function discount(detailItems){
//     let discountItem=loadPromotions();
//     let discount=0;
//     for(let i=0;i< discountItem[0].barcodes.length;i++){
//         for(let j=0; j<detailItems.length;j++){
//             if(discountItem[0].barcodes[i]===detailItems[j].barcode){
//                 if(detailItems[j].num>=2){
//                     detailItems[j].subtotal=detailItems[j].subtotal-detailItems[j].price;
//                     //detailItems[j].subtotal=detailItems[j].subtotal-(parseInt(detailItems[j].num/3)*2+detailItems[j].num%2);
//                     discount+=detailItems[j].price;
//                 }
//             }
//         }
        
//     }
//     detailItems.push({discou:discount});         //浅拷贝做法，导致原数组被改变
//     return detailItems;
// }

// function discount(detailItems){     //  深拷贝做法，达到效果
//     let discountItem=loadPromotions();
//     let discount=0;
//     let detailItemsClone=detailItems.slice(0);
//     //console.info(detailItemsClone);
//     for(let i=0;i< discountItem[0].barcodes.length;i++){
//         for(let j=0; j<detailItemsClone.length;j++){
//             if(discountItem[0].barcodes[i]===detailItemsClone[j].barcode){
//                 if(detailItemsClone[j].num>=2){
//                     detailItemsClone[j].subtotal=detailItemsClone[j].subtotal-detailItemsClone[j].price;         //满二只减一
//                     //detailItems[j].subtotal=detailItems[j].subtotal-(parseInt(detailItems[j].num/3)*2+detailItems[j].num%2);
//                     discount+=detailItemsClone[j].price;
//                 }
//             }
//         }
        
//     }
//     detailItemsClone.push({discou:discount});
//     return detailItemsClone;
// }
function buildreceiptItems(detailItems){     //  深拷贝做法，达到效果
    let discountItem=loadPromotions();
    let discount=0;
    let detailItemsClone=detailItems.slice(0);
    //console.info(detailItemsClone);
    for(let i=0;i< discountItem[0].barcodes.length;i++){
        for(let j=0; j<detailItemsClone.length;j++){
            if(discountItem[0].barcodes[i]===detailItemsClone[j].barcode){
                if(detailItemsClone[j].num>=2){
                    detailItemsClone[j].subtotal=detailItemsClone[j].subtotal-detailItemsClone[j].price*(Math.floor(detailItemsClone[j].num/3));    //每满二减一
                    //detailItems[j].subtotal=detailItems[j].subtotal-(parseInt(detailItems[j].num/3)*2+detailItems[j].num%2);
                    discount+=detailItemsClone[j].price;
                }
            }
        }
        
    }
    detailItemsClone.push({discou:discount});
    return detailItemsClone;
}

function generateReceipt(detailItemsForDis){
    let sum=0;          //数字要记得初始化
    let title="***<没钱赚商店>收据***\n";
    let content="";
    for(let i=0;i<detailItemsForDis.length-1;i++){
        sum=sum+detailItemsForDis[i].subtotal;
        let price=detailItemsForDis[i].price.toFixed(2);

        content+="名称："+detailItemsForDis[i].name+'，'+'数量：'+detailItemsForDis[i].num+detailItemsForDis[i].unit+'，' +
                 '单价：'+price+'(元)，'+'小计：'+detailItemsForDis[i].subtotal.toFixed(2)+'(元)\n';
    }

    let total='----------------------\n总计：'+sum.toFixed(2)+'(元)'+'\n';
    let subtotal='节省：'+detailItemsForDis[3].discou.toFixed(2)+'(元)'+'\n**********************';
    return title+content+total+subtotal;
}
