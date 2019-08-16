import { ComponentFixture, getTestBed, TestBed, TestModuleMetadata } from '@angular/core/testing';

const resetProviders = (moduleDef?: TestModuleMetadata) => {
  if (!moduleDef) {
    return;
  }
  if (!moduleDef.providers) {
    return;
  }
  moduleDef.providers.forEach(provider => {
    if (!provider || !provider.useValue) {
      return;
    }
    const instance = provider.useValue;
    Object.keys(instance).forEach(property => {
      if (instance[property] && instance[property].reset) {
        instance[property].resetProvider();
      }
      if (instance[property] && instance[property].calls && instance[property].calls.reset) {
        instance[property].calls.reset();
      }
    });
  });
};

export const configureSuite = (configure?: () => void) => {
  const testBed: TestBed = getTestBed();
  const originalResetTestModule = TestBed.resetTestingModule;
  const originalConfigureTestingModule = TestBed.configureTestingModule;
  let moduleMetadata: TestModuleMetadata | undefined;

  beforeAll(() => {
    TestBed.resetTestingModule();
    TestBed.resetTestingModule = () => TestBed;
    TestBed.configureTestingModule = (moduleDef: TestModuleMetadata) => {
      moduleMetadata = moduleDef;
      return originalConfigureTestingModule(moduleMetadata);
    };
  });

  if (configure) {
    beforeAll((done: DoneFn) =>
      (async () => {
        configure();
        await TestBed.compileComponents();
      })()
        .then(done)
        .catch(done.fail)
    );
  }

  afterEach(() => {
    testBed['_activeFixtures'].forEach((fixture: ComponentFixture<any>) => {
      fixture.destroy();
    });
    testBed['_instantiated'] = false;
    resetProviders(moduleMetadata);
  });

  afterAll(() => {
    TestBed.resetTestingModule = originalResetTestModule;
    TestBed.resetTestingModule();
    TestBed.configureTestingModule = originalConfigureTestingModule;
  });
};
