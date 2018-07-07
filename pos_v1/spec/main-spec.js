'use stricst'

const main = require('../main/main')
const { buildtagWithCounts, buildcartItems, buildreceiptItems, calTotalAndSaved, printReceipt } = require('../main/main')
describe('main().buildtagWithCounts(tags)-test', () => {
    it('should return  Array', () => {
        const tags = [
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000003-2.5',
            'ITEM000005',
            'ITEM000005-2',
        ];

        const cartItems = JSON.stringify(main.buildtagWithCounts(tags));

        const expectArray = JSON.stringify([
            { barcode: "ITEM000001", amount: 5 },
            { barcode: "ITEM000003", amount: 2.5 },
            { barcode: "ITEM000005", amount: 3 }]);
        expect(cartItems).toBe(expectArray);
    });
});

describe('main().buildcartItems()-test', () => {
    it('should return  Array', () => {
        const tags = [
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000003-2.5',
            'ITEM000005',
            'ITEM000005-2',
        ];
        const tagWithCounts = main.buildtagWithCounts(tags);

        const cartItems = JSON.stringify(main.buildcartItems(tagWithCounts));
        //const detailItems=5;
        const expectArray = JSON.stringify([
            {
                barcode: "ITEM000001", name: "雪碧", unit: "瓶", price: 3, num: 5, subtotal: 15
            },
            {
                barcode: "ITEM000003", name: "荔枝", unit: "斤", price: 15, num: 2.5, subtotal: 37.5
            },
            { barcode: "ITEM000005", name: "方便面", unit: "袋", price: 4.5, num: 3, subtotal: 13.5 },
        ]);
        expect(cartItems).toBe(expectArray);
    });
});

describe('main().buildreceiptItems-test', () => {
    it('should return  Array', () => {
        const tags = [
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000003-2.5',
            'ITEM000005',
            'ITEM000005-2',
        ];
        const tagWithCounts = buildtagWithCounts(tags);
        const cartItems = buildcartItems(tagWithCounts);

        const receipItems = JSON.stringify(buildreceiptItems(cartItems));

        const expectArray = JSON.stringify({ "items": [{ "barcode": "ITEM000001", "name": "雪碧", "unit": "瓶", "price": 3, "num": 5, "subtotal": 12 }, { "barcode": "ITEM000003", "name": "荔枝", "unit": "斤", "price": 15, "num": 2.5, "subtotal": 37.5 }, { "barcode": "ITEM000005", "name": "方便面", "unit": "袋", "price": 4.5, "num": 3, "subtotal": 9 }] });
        expect(receipItems).toBe(expectArray);
    });
});

describe('main().calTotalAndSaved-test', () => {
    it('should get  total and saved', () => {
        const tags = [
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000003-2.5',
            'ITEM000005',
            'ITEM000005-2',
        ];
        const tagWithCounts = buildtagWithCounts(tags);
        const cartItems = buildcartItems(tagWithCounts);

        const receipItems = buildreceiptItems(cartItems);

        const totalAndSaved = calTotalAndSaved(receipItems);

        const expectTotal = 58.50;
        const expectSaved = 7.50;
        expect(totalAndSaved.total).toBe(expectTotal);
        expect(totalAndSaved.saved).toBe(expectSaved);
    });
});


describe('pos', () => {

    it('should print text', () => {
  
      const tags = [
        'ITEM000001',
        'ITEM000001',
        'ITEM000001',
        'ITEM000001',
        'ITEM000001',
        'ITEM000003-2.5',
        'ITEM000005',
        'ITEM000005-2',
      ];
  
      spyOn(console, 'log');
  
      printReceipt(tags);
  
      const expectText = `***<没钱赚商店>收据***
名称：雪碧，数量：5瓶，单价：3.00(元)，小计：12.00(元)
名称：荔枝，数量：2.5斤，单价：15.00(元)，小计：37.50(元)
名称：方便面，数量：3袋，单价：4.50(元)，小计：9.00(元)
----------------------
总计：58.50(元)
节省：7.50(元)
**********************`;
    expect(console.log).toHaveBeenCalledWith(expectText);
  });
});

  
