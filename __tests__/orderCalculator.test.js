import OrderCalculator from '../classes/OrderCalculator.js';
import ProductModel from '../classes/database/ProductModel.js';

jest.mock('../classes/database/ProductModel.js', () => ({
    getProduct: jest.fn(),
}));

describe('OrderCalculator', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Testing for calculateBundle', () => {
        it('Testing calculating the correct bundle for a SIMPLE valid order', async () => {
            const order = { quantity: 15, code: 'R12' };
            const product = {
                code: 'R12',
                name: 'Roses',
                bundles: [10, 5],
                prices: { 10: 12.99, 5: 6.99 },
            };

            ProductModel.getProduct.mockResolvedValue(product);

            const result = await OrderCalculator.calculateBundle(order);

            expect(result).toEqual({
                name: 'Roses',
                code: 'R12',
                requestedQuantity: 15,
                totalCost: 19.98,
                10: 1,
                5: 1,
            });
        });

        it('Testing calculating the correct bundle for a COMPLEX valid order', async () => {
            const order = { quantity: 277, code: 'T58' };
            const product = {
                code: 'T58',
                name: 'Tulips',
                bundles: [9, 5, 3],
                prices: {3: 5.95, 5: 9.95, 9: 16.99},
            };

            ProductModel.getProduct.mockResolvedValue(product);

            const result = await OrderCalculator.calculateBundle(order);

            expect(result).toEqual({
                name: 'Tulips',
                code: 'T58',
                requestedQuantity: 277,
                totalCost: 524.5100000000002,
                9: 29,
                5: 2,
                3: 2,
            });
        });
    
        it('Testing error handling if the product is not found', async () => {
            const order = { quantity: 10, code: 'THIS_PRODUCT_CODE_DOES_NOT_EXIST' };

            ProductModel.getProduct.mockResolvedValue(null);

            await expect(OrderCalculator.calculateBundle(order)).rejects.toThrow('Product "THIS_PRODUCT_CODE_DOES_NOT_EXIST" not found!');
        });

        it('Testing calculating bundles returns no solution for an invalid order', async () => {
            const order = { quantity: 7, code: 'R12' };
            const product = {
                code: 'R12',
                name: 'Roses',
                bundles: [10, 5],
                prices: { 10: 12.99, 5: 6.99 },
            };

            ProductModel.getProduct.mockResolvedValue(product);

            const result = await OrderCalculator.calculateBundle(order);

            expect(result).toEqual({
                name: 'Roses',
                code: 'R12',
                requestedQuantity: 7,
                noSolution: 'No bundle combination found for 7 R12',
                totalCost: 0,
            });
        });
    });
});