import { ComponentFactoryResolver, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DynamicContentLoaderService {

  constructor(private componentFactoryResolver: ComponentFactoryResolver) { }
}
