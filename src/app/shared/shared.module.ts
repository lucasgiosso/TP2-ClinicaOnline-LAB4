import { NgModule } from '@angular/core';
import { LoadingComponent } from './loading/loading.component';
import { FilterEspPipe } from '../pipes/filter-esp.pipe';

@NgModule({
  declarations: [LoadingComponent],
  exports: [LoadingComponent],
})
export class SharedModule {}