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
    calTotalAndSaved(receiptItems);
    //console.info(JSON.stringify(generateReceipt(receiptItems)));
    //let formattedBarcodes=buildformattedBarcodes(tags);
    //setcartItems(formattedBarcodes);
    console.log(generateReceipt(receiptItems));
};

function buildformattedBarcodes(tags){
    let formattedBarcodes=[];
    for(let tag of tags){
        let  barcodeObject={
            barcode:tag,
            count:1
        }
        if(tag.indexOf("-")!==-1){
            let tempArray=tag.split("-");
            barcodeObject={
                barcode:tempArray[0],
                count:parseFloat(tempArray[1])
            }
        }
        formattedBarcodes.push(barcodeObject);
    }
    return formattedBarcodes;
}
function setcartItems(formattedBarcodes){
    console.info(formattedBarcodes);
    let cartItems = [];
    for(let formattedBarcode of formattedBarcodes){
        let existCartItem =null;
        for(let cartItem of cartItems){
            if(cartItem.barcode===formattedBarcode.barcode)
            existCartItem = cartItem; 
        }
        if(existCartItem!=null){
            existCartItem.count+=formattedBarcode.count;
        }else{
            cartItems.push({...formattedBarcode});
        }
        console.info(cartItems);
    }
}




function buildcartItems(collection) {
    // key-value
    let map = new Map();
    // 遍历集合中所有字符串
    for(let i=0;i<collection.length;i++){
      // 判断字符串长度， 如果等于10，直接做统计，否则做特殊处理统计
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
    let promotions=loadPromotions();
    //let saved=0;
    let receipt={};
    let detailItemsClone=detailItems.slice(0);
    //console.info(detailItemsClone);
    for(let i=0;i< promotions[0].barcodes.length;i++){
        for(let j=0; j<detailItemsClone.length;j++){
            if(promotions[0].barcodes[i]===detailItems[j].barcode){
                //if(detailItemsClone[j].num>=2){
                    detailItemsClone[j].subtotal=detailItemsClone[j].subtotal-detailItemsClone[j].price*(Math.floor(detailItemsClone[j].num/3));    //每满二减一
                    //detailItems[j].subtotal=detailItems[j].subtotal-(parseInt(detailItems[j].num/3)*2+detailItems[j].num%2);
                    //saved+=detailItemsClone[j].price*(Math.floor(detailItemsClone[j].num/3));
                //}
            }
        }
        
    }
    receipt.items=detailItemsClone;
    //receipt.saved=saved;
    //detailItemsClone.push({saved:saved});
    return receipt;
}
function calTotalAndSaved(receipt){
    let total=0;
    let saved=0;
    for(let item of receipt.items){
        total+=item.subtotal;
        saved+=item.price*item.num-item.subtotal;
    }
    receipt.total=total;
    receipt.saved=saved;

    return receipt;
}
function generateReceipt(receipt){
    //let sum=0;          //数字要记得初始化
    let title="***<没钱赚商店>收据***\n";
    let content=title;
    for(let item of receipt.items){
        let price=item.price.toFixed(2);
        //sum=sum+item.subtotal;
        content+="名称："+item.name+'，'+'数量：'+item.num+item.unit+'，' +
                 '单价：'+price+'(元)，'+'小计：'+item.subtotal.toFixed(2)+'(元)\n';
    }
    // for(let i=0;i<receipt.item.length-1;i++){
    //     let price=receipt[i].price.toFixed(2);

    //     content+="名称："+receipt[i].name+'，'+'数量：'+receipt[i].num+receipt[i].unit+'，' +
    //              '单价：'+price+'(元)，'+'小计：'+receipt[i].subtotal.toFixed(2)+'(元)\n';
    // }

    content+='----------------------\n总计：'+receipt.total.toFixed(2)+'(元)'+'\n';
    content+='节省：'+receipt.saved.toFixed(2)+'(元)'+'\n**********************';
    return content;
}
