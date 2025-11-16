import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'paginator',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.css'
})
export class PaginatorComponent implements OnInit {

  @Input() url: string = '';
  @Input() paginator: any = {};

  ngOnInit(): void {
    console.log('PaginatorComponent initialized with paginator:', this.paginator);
  }

}