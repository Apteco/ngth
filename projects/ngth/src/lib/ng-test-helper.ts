import {
  ComponentFixture,
  getTestBed,
  TestBed,
  TestModuleMetadata,
} from '@angular/core/testing';

const resetProviders = (moduleDef?: TestModuleMetadata) => {
  if (!moduleDef) {
    return;
  }
  if (!moduleDef.providers) {
    return;
  }

  moduleDef.providers.forEach((provider) => {
    if (!provider || !provider.useValue) {
      return;
    }
    const instance = provider.useValue;
    if (instance && instance.resetProvider) {
      instance.resetProvider();
    }
    Object.keys(instance).forEach((property) => {
      if (
        instance[property] &&
        instance[property].calls &&
        instance[property].calls.reset
      ) {
        instance[property].calls.reset();
      }
    });
  });
};

const cleanUpStyles = () => {
  const head: HTMLHeadElement = document.getElementsByTagName('head')[0];
  const styles:
    | HTMLCollectionOf<HTMLStyleElement>
    | [] = head.getElementsByTagName('style');
  for (let i = 0; i < styles.length; i++) {
    head.removeChild(styles[i]);
  }
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
    testBed['_testModuleRef'] = null;
    resetProviders(moduleMetadata);
  });

  afterAll(() => {
    cleanUpStyles();
    TestBed.resetTestingModule = originalResetTestModule;
    TestBed.resetTestingModule();
    TestBed.configureTestingModule = originalConfigureTestingModule;
  });
};
