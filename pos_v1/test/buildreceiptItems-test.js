describe('buildreceiptItems', () => {
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
      const cartItems =buildcartItems(tags);
      const itemDetail=builditemDetail(cartItems);
      
      const receipItems=JSON.stringify(buildreceiptItems(itemDetail));
      
      const expectArray =JSON.stringify([
                            {barcode: "ITEM000001", name: "雪碧", unit: "瓶", price: 3, num: 5, subtotal:12
                            },
                            {barcode: "ITEM000003", name: "荔枝", unit: "斤", price: 15, num: 2.5, subtotal:37.5
                            },
                            {barcode: "ITEM000005", name: "方便面", unit: "袋", price: 4.5, num: 3, subtotal:9},
                            {discou: 7.5}
                            ]);
      expect(receipItems).toBe(expectArray);
    });
  });