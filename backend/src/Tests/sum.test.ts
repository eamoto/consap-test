import { describe, expect, it } from 'vitest';
import sum from './../Controllers/sum';

describe('#sum', () => {
    it("bla", ()=>{
        expect(sum()).toBe(0);
    });
    
    it("bla2", ()=>{
        expect(sum(1,2,3)).toBe(6);
    });

    it("bla4", ()=>{
        expect(sum(1)).toBe(1);
    });
});