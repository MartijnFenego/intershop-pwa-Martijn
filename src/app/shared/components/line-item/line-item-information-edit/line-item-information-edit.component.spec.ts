import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';
import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { LineItemCustomFieldsComponent } from 'ish-shared/components/line-item/line-item-custom-fields/line-item-custom-fields.component';

import { LineItemInformationEditComponent } from './line-item-information-edit.component';

describe('Line Item Information Edit Component', () => {
  let component: LineItemInformationEditComponent;
  let fixture: ComponentFixture<LineItemInformationEditComponent>;
  let element: HTMLElement;
  let context: ProductContextFacade;

  beforeEach(async () => {
    context = mock(ProductContextFacade);
    const appFacade = mock(AppFacade);
    when(appFacade.customFieldsForScope$('BasketLineItem')).thenReturn(of([]));

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [LineItemInformationEditComponent, MockComponent(LineItemCustomFieldsComponent)],
      providers: [],
    })
      .overrideComponent(LineItemInformationEditComponent, {
        set: {
          providers: [
            { provide: AppFacade, useFactory: () => instance(appFacade) },
            { provide: ProductContextFacade, useFactory: () => instance(context) },
          ],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LineItemInformationEditComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    when(context.select('loading')).thenReturn(of(false));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
