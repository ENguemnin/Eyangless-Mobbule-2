import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CommentsComponent } from '../../../components/comments/comments.component';

@Component({
  selector: 'app-comments-full',
  template: `
    <app-comments [cityId]="cityId" [isOpen]="true"></app-comments>
  `,
  standalone: true,
  imports: [
    CommonModule,
    CommentsComponent
  ]
})
export class CommentsFullPage implements OnInit {
  cityId?: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.cityId = Number(this.route.snapshot.paramMap.get('id'));
  }
}