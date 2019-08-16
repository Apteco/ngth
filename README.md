# What is ngth

ngth is the spiritual successor/extension to [ng-bullet](https://github.com/topnotch48/ng-bullet-workspace/tree/master/projects/ng-bullet). It offers the same functionality as well as resetting spy objects and mock services.

# Getting Started

## Installation

**Using `npm`**

```bash
npm install @apteco/ngth
```

**Using `yarn`\***

```bash
yarn add @apteco/ngth
```

## Spec Files

Most Angular spec files configure components like so:

```typescript
beforeEach(async(() => {
  TestBed.configureTestingModule({
    declarations: [
      /*list of components*/
    ],
    imports: [
      /* list of providers*/
    ]
  }).compileComponents();
}));
```

With **ngth** we change this to:

```typescript
    import { configureSuite } from '@apteco/ngth';
    ...
    configureSuite(() => {
        TestBed.configureTestingModule({
            declarations: [ /*list of components goes here*/ ],
            imports: [ /* list of providers goes here*/ ]
        })
    });
```

There is no longer any need to call TestBed#compileComponents as ngth will call this and make sure that all components are compiled once and only once.
