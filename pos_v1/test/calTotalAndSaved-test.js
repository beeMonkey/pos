describe('calTotalAndSaved-test', () => {
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
          const cartItems =buildcartItems(tags);
          const itemDetail=builditemDetail(cartItems);
          
          const receipItems=buildreceiptItems(itemDetail);

          const totalAndSaved=calTotalAndSaved(receipItems);

          const expectTotal=58.50;
          const expectSaved=7.50;
          expect(totalAndSaved.total).toBe(expectTotal);
          expect(totalAndSaved.saved).toBe(expectSaved);
    });
  });