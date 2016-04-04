import Hoge from '../../src/main';

describe('Hoge', () => {
    beforeEach(() => {
    });

    it('giventaining a greeting and a remove button', () => {
        var hoge = new Hoge();
        expect(hoge.add(1, 1)).toBe(2);
    });
});

