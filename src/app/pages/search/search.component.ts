import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {

  data = {
    filter: 'week',
    name: '',
    claims: 50,
    token: ''
  }

  dateFilters = [
    {
      id: 1,
      title: "Last Week",
      active: true,
      value: "week"
    },
    {
      id: 2,
      title: "Last Month",
      active: false,
      value: "month"
    },
    {
      id: 3,
      title: "Last Year",
      active: false,
      value: "year"
    },
    {
      id: 4,
      title: "All Time",
      active: false,
      value: "all"
    }
  ]

  selectRange(range: any) {
    this.dateFilters.map((date) => date.active = false);
    this.data.filter = range.value
    range.active = true;
  }

  search() {
    console.log(this.data);
  }
}
