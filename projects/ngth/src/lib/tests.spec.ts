import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { configureSuite } from './ng-test-helper';

@Component({
  template: `
    <h1>This is a test component</h1>
  `
})
class TestComponent {}

class MockProvider {
  foo() {
    console.log('legit one');
  }
}

class TestMockProvider {
  foo() {
    console.log('foo called');
  }

  resetProvider() {
    console.log('It was called');
  }
}

describe('when using configure suite', () => {
  const originalResetTestingModule = TestBed.resetTestingModule;
  const originalConfigureTestingModule = TestBed.configureTestingModule;
  let compileComponentsSpy: jasmine.Spy;

  const configureSupplied: any = describe('and a configure action is supplied', () => {
    configureSuite(() => {
      TestBed.configureTestingModule({
        declarations: [TestComponent],
        providers: [
          {
            provide: MockProvider,
            useValue: new TestMockProvider()
          }
        ]
      });
    });

    beforeEach(() => {
      compileComponentsSpy = spyOn(TestBed, 'compileComponents');
      const provider = TestBed.get(MockProvider);
    });

    it('that resetTestingModule is replaced', () => {
      expect(TestBed.resetTestingModule).not.toEqual(originalResetTestingModule);
    });

    it('that configureTestingModule is replaced', () => {
      expect(TestBed.configureTestingModule).not.toEqual(originalConfigureTestingModule);
    });

    it('that compileComponents is called automatically and only once', () => {
      expect(compileComponentsSpy).not.toHaveBeenCalledTimes(1);
    });

    it('that jasmine callbacks are set correctly', () => {
      if ('beforeAllFns' in configureSupplied && 'afterAllFns' in configureSupplied && 'afterFns' in configureSupplied && 'beforeFns' in configureSupplied) {
        expect(configureSupplied.beforeAllFns.length).toBe(2);
        expect(configureSupplied.afterAllFns.length).toBe(2);
        expect(configureSupplied.afterFns.length).toBe(1);
        expect(configureSupplied.beforeFns.length - 1).toBe(0);
      } else {
        fail('Could not find jasmine callbacks');
      }
    });

    afterAll(() => {
      compileComponentsSpy = undefined;
    });
  });

  const configureNotSupplied: any = describe('and a configure action is not supplied', () => {
    configureSuite();

    beforeEach(() => {
      compileComponentsSpy = spyOn(TestBed, 'compileComponents');
    });

    it('that resetTestingModule is replaced', () => {
      expect(TestBed.resetTestingModule).not.toEqual(originalResetTestingModule);
    });

    it('that configureTestingModule is replaced', () => {
      expect(TestBed.configureTestingModule).not.toEqual(originalConfigureTestingModule);
    });

    it('that compileComponents is not called automatically', () => {
      expect(compileComponentsSpy).not.toHaveBeenCalled();
    });

    it('that jasmine callbacks are set correctly', () => {
      if (
        'beforeAllFns' in configureNotSupplied &&
        'afterAllFns' in configureNotSupplied &&
        'afterFns' in configureNotSupplied &&
        'beforeFns' in configureNotSupplied
      ) {
        expect(configureNotSupplied.beforeAllFns.length).toBe(1);
        expect(configureNotSupplied.afterAllFns.length).toBe(2);
        expect(configureNotSupplied.afterFns.length).toBe(1);
        expect(configureNotSupplied.beforeFns.length - 1).toBe(0);
      } else {
        fail('Could not find jasmine callbacks');
      }
    });

    afterAll(() => {
      compileComponentsSpy = undefined;
    });
  });
});
