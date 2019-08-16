import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { DebugElement, Type } from '@angular/core';

export class ComponentFixtureWrapper<T> {
  constructor(public fixture: ComponentFixture<T>) {}

  public get component(): T {
    return this.fixture.componentInstance;
  }

  public get debugElement(): DebugElement {
    return this.fixture.debugElement;
  }

  public get element(): HTMLElement {
    return this.debugElement.nativeElement;
  }

  public detectChanges() {
    this.fixture.detectChanges();
  }
}

export const createComponent = <T>(component: Type<T>) => {
  return new ComponentFixtureWrapper<T>(TestBed.createComponent<T>(component));
};

export const createStableComponent = async <T>(component: Type<T>) => {
  const fixtureWrapper = createComponent(component);
  fixtureWrapper.detectChanges();
  await fixtureWrapper.fixture.whenStable();
  fixtureWrapper.detectChanges();
  return fixtureWrapper;
};
