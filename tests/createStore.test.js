import {createStore} from "../src";

/**
 * credit to @developit for most of the tests
 * https://github.com/developit/unistore/blob/master/test/unistore.test.js
 */
describe('createStore()', () => {


    it('should attach state without triggering an update on the subscriptions', ()=>{
        let store = createStore();

        let sub1 = jest.fn();
        store.subscribe(sub1);

        store.attachState({a:'b'});

        expect(store.getState()).toMatchObject({ a: 'b' });

        expect(sub1).not.toBeCalled();

    });

    it('should be instantiable', () => {
        let store = createStore();
        expect(store).toMatchObject({
            setState: expect.any(Function),
            getState: expect.any(Function),
            subscribe: expect.any(Function),
            unsubscribe: expect.any(Function),
            attachState: expect.any(Function)
        });
    });

    it('should update state in-place', () => {
        let store = createStore();
        expect(store.getState()).toMatchObject({});
        store.setState({ a: 'b' });
        expect(store.getState()).toMatchObject({ a: 'b' });
        store.setState({ c: 'd' });
        expect(store.getState()).toMatchObject({ a: 'b', c: 'd' });
        store.setState({ a: 'x' });
        expect(store.getState()).toMatchObject({ a: 'x', c: 'd' });
        store.setState({ c: null });
        expect(store.getState()).toMatchObject({ a: 'x', c: null });
        store.setState({ c: undefined });
        expect(store.getState()).toMatchObject({ a: 'x', c: undefined });
    });


    it('should invoke subscriptions', () => {
        let store = createStore();

        let sub1 = jest.fn();
        let sub2 = jest.fn();

        let rval = store.subscribe(sub1);
        expect(rval).toBeInstanceOf(Function);

        store.setState({ a: 'b' });
        expect(sub1).toBeCalledWith(store.getState());

        store.subscribe(sub2);
        store.setState({ c: 'd' });

        expect(sub1).toHaveBeenCalledTimes(2);
        expect(sub1).toHaveBeenLastCalledWith(store.getState());
        expect(sub2).toBeCalledWith(store.getState());

    });



    it('should unsubscribe', () => {
        let store = createStore();

        let sub1 = jest.fn();
        let sub2 = jest.fn();
        let sub3 = jest.fn();

        store.subscribe(sub1);
        store.subscribe(sub2);
        let unsub3 = store.subscribe(sub3);

        store.setState({ a: 'b' });
        expect(sub1).toBeCalled();
        expect(sub2).toBeCalled();
        expect(sub3).toBeCalled();

        sub1.mockClear();
        sub2.mockClear();
        sub3.mockClear();

        store.unsubscribe(sub2);

        store.setState({ c: 'd' });
        expect(sub1).toBeCalled();
        expect(sub2).not.toBeCalled();
        expect(sub3).toBeCalled();

        sub1.mockClear();
        sub2.mockClear();
        sub3.mockClear();

        store.unsubscribe(sub1);

        store.setState({ e: 'f' });
        expect(sub1).not.toBeCalled();
        expect(sub2).not.toBeCalled();
        expect(sub3).toBeCalled();

        sub3.mockClear();

        unsub3();

        store.setState({ g: 'h' });
        expect(sub1).not.toBeCalled();
        expect(sub2).not.toBeCalled();
        expect(sub3).not.toBeCalled();
    });









});