import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { TitleComponent } from '../../../shared/title/title.component';
import { switchMap } from 'rxjs';
import { InfluencerService } from '@services/influencer/influencer.service';
import { CommonModule } from '@angular/common';
import { QuantityParsePipe } from '../../../pipes/quantity-parse.pipe';
import { SpinnerComponent } from '../../../shared/spinner/spinner.component';
import { ModalComponent } from '@shared/modal/modal.component';

@Component({
  standalone: true,
  imports: [TitleComponent, CommonModule, QuantityParsePipe, SpinnerComponent],
  templateUrl: './influencer.component.html',
  styles: ``,
})
export default class InfluencerComponent {
  private route = inject(ActivatedRoute);
  private influencerService = inject(InfluencerService);

  public filters = {
    categories: [
      'All',
      'Sleep',
      'Performance',
      'Hormones',
      'Nutrition',
      'Exercise',
      'Stress',
      'Cognition',
      'Motivation',
      'Recovery',
      'Mental Health',
    ],
    status: ['All', 'Verificated', 'Questionable', 'Debunked'],
  };

  public influencer = toSignal(
    this.route.params.pipe(
      switchMap(({ id }) => this.influencerService.getInfluencerById(id))
    )
  );

  constructor() {}
}
