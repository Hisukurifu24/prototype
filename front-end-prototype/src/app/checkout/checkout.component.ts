import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule, StepperOrientation } from '@angular/material/stepper';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { AsyncPipe } from '@angular/common';
import { map, Observable } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import WebApp from '@twa-dev/sdk';
import { Deliver } from './deliver.model';
import { Payment } from './payment.model';


@Component({
  selector: 'app-checkout',
  standalone: true,
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
    provideNativeDateAdapter(),
  ],
  imports: [
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatSelectModule,
    AsyncPipe,
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
  private _formBuilder = inject(FormBuilder);

  selectedDeliver: string = '';
  selectedPayment: string = '';

  savedAddress = signal<Deliver[]>([]);
  createNewDeliver = signal<boolean>(false);

  savedPayments = signal<Payment[]>([]);
  createNewPayment = signal<boolean>(false);


  firstFormGroup = this._formBuilder.group({
    first_name: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
    last_name: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
    address: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9\\s,.-]+$')]],
    city: ['', [Validators.required, Validators.pattern('^[a-zA-Z\\s]+$')]],
    zip_code: ['', [Validators.required, Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')]],
    country: ['', [Validators.required, Validators.pattern('^[a-zA-Z\\s]+$')]],
    tel: ['', Validators.pattern('^[- +()0-9]+$')],
    save_address: [''],
  });
  secondFormGroup = this._formBuilder.group({
    full_name: ['', [Validators.required, Validators.pattern('^[a-zA-Z\\s]+$')]],
    number: ['', [Validators.required, Validators.pattern('^[0-9]{13,19}$')]],
    exp_month: ['', [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])$')]],
    exp_year: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]],
    cvv: ['', [Validators.required, Validators.pattern('^[0-9]{3,4}$')]],
    save_card: [''],
  });
  minDate = new Date()

  stepperOrientation: Observable<StepperOrientation>;

  constructor() {
    const breakpointObserver = inject(BreakpointObserver);

    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));

    WebApp.CloudStorage.getItem('address', (err, res) => {
      if (err) {
        console.error(err);
        return;
      }
      this.savedAddress.set(JSON.parse(res ?? ''));
    });

    WebApp.CloudStorage.getItem('payments', (err, res) => {
      if (err) {
        console.error(err);
        return;
      }
      this.savedPayments.set(JSON.parse(res ?? ''));
    });
  }

  isDeliverCompleted(): boolean {
    return this.firstFormGroup.valid || this.selectedDeliver !== '';
  }
  isPaymentCompleted(): boolean {
    return this.secondFormGroup.valid || this.selectedPayment !== '';
  }

  onDeliverSubmit($event: any) {
    $event.preventDefault();

    const save = this.firstFormGroup.get('save_address')?.value ?? false;
    if (save) {
      const newAddress: Deliver = {
        id: Date.now(),
        first_name: this.firstFormGroup.get('first_name')?.value,
        last_name: this.firstFormGroup.get('last_name')?.value,
        address: this.firstFormGroup.get('address')?.value,
        city: this.firstFormGroup.get('city')?.value,
        zip_code: this.firstFormGroup.get('zip_code')?.value,
        country: this.firstFormGroup.get('country')?.value,
        tel: this.firstFormGroup.get('tel')?.value,
      }
      let currentUserAddress: Deliver[] = [];
      WebApp.CloudStorage.getItem('address', (err, res) => {
        if (err) {
          console.error(err);
          return;
        }
        try {
          currentUserAddress = JSON.parse(res ?? '');
        } catch (e) {
          console.log('error parsing', e);
        }

        currentUserAddress.push(newAddress);

        WebApp.CloudStorage.setItem('address', JSON.stringify(currentUserAddress), (err, res) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log(res);
        });
      }
      );

    }
  }
  onPaymentSubmit($event: any) {
    $event.preventDefault();

    const save = this.secondFormGroup.get('save_card')?.value ?? false;
    if (save) {
      const newPayment: Payment = {
        id: Date.now(),
        name: this.secondFormGroup.get('full_name')?.value,
        cardNumber: this.secondFormGroup.get('number')?.value,
        exp_month: this.secondFormGroup.get('exp_month')?.value,
        exp_year: this.secondFormGroup.get('exp_year')?.value,
        cvv: this.secondFormGroup.get('cvv')?.value,
      }
      console.log('newPayment', newPayment);

      let currentUserCards: Payment[] = [];
      WebApp.CloudStorage.getItem('payments', (err, res) => {
        if (err) {
          console.log('error getting payments', err);

          console.error(err);
          return;
        }
        try {
          currentUserCards = JSON.parse(res ?? '[]');
        } catch (e) {
          console.log('error parsing', e);
        }

        currentUserCards.push(newPayment);

        WebApp.CloudStorage.setItem('payments', JSON.stringify(currentUserCards), (err, res) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log(res);
        });
      }
      );

    }
  }

  deleteDeliver(id: number) {
    const confirm = window.confirm('Are you sure you want to delete this address?');
    if (confirm) {
      let currentUserAddress: Deliver[] = [];

      // Get the current user address
      WebApp.CloudStorage.getItem('address', (err, res) => {
        if (err) {
          console.error(err);
          return;
        }
        // Parse the current user address
        currentUserAddress = JSON.parse(res ?? '');

        // Filter out the address with the given id
        currentUserAddress = currentUserAddress.filter((address) => address.id !== id);

        // Save the updated address
        WebApp.CloudStorage.setItem('address', JSON.stringify(currentUserAddress), (err, res) => {
          if (err) {
            console.error(err);
            return;
          }
          window.location.reload();
        });
      }
      );
    }
  }
  deletePayment(id: number) {
    const confirm = window.confirm('Are you sure you want to delete this payment method?');
    if (confirm) {
      let savedPaymentsMethods: Payment[] = [];

      // Get the current user address
      WebApp.CloudStorage.getItem('payments', (err, res) => {
        if (err) {
          console.error(err);
          return;
        }
        // Parse the current user address
        savedPaymentsMethods = JSON.parse(res ?? '');

        // Filter out the address with the given id
        savedPaymentsMethods = savedPaymentsMethods.filter((payment) => payment.id !== id);

        // Save the updated address
        WebApp.CloudStorage.setItem('payments', JSON.stringify(savedPaymentsMethods), (err, res) => {
          if (err) {
            console.error(err);
            return;
          }
          window.location.reload();
        });
      }
      );
    }
  }
}
