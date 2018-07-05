describe('buildcartItems', () => {
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
  
      const cartItems=JSON.stringify(buildcartItems(tags));
      
      const expectArray =JSON.stringify([
                            {barcode: "ITEM000001", amount: 5},
                            {barcode: "ITEM000003", amount: 2.5},
                            {barcode: "ITEM000005", amount: 3}]);
      expect(cartItems).toBe(expectArray);
    });
  });