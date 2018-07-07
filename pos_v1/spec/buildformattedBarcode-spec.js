'use stricst'
const main = require('../main/main')
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
        const expectArray = JSON.stringify([
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000001',
            'ITEM000003-2.5',
            'ITEM000005',
            'ITEM000005-2',
        ]);
        expect(cartItems).toBe(expectArray);
    });
});