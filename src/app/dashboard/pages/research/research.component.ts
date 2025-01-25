import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { TitleComponent } from '@shared/title/title.component';
import { ModalComponent } from '../../../shared/modal/modal/modal.component';

@Component({
  standalone: true,
  imports: [CommonModule, TitleComponent, ModalComponent],
  templateUrl: './research.component.html',
  styles: ``,
})
export default class ResearchComponent {
  public dateFilters = signal([
    {
      id: 1,
      title: 'Last Week',
      active: true,
      value: 'week',
    },
    {
      id: 2,
      title: 'Last Month',
      active: false,
      value: 'month',
    },
    {
      id: 3,
      title: 'Last Year',
      active: false,
      value: 'year',
    },
    {
      id: 4,
      title: 'All Time',
      active: false,
      value: 'all',
    },
  ]);

  toggleDateRange(index: number) {
    const updatedDateFilters = this.dateFilters().map((date, i) => ({
      ...date,
      active: i === index ? !date.active : false,
    }));
    this.dateFilters.set(updatedDateFilters);
  }
}
