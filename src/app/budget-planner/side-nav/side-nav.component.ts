import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
declare var $: any; // Declare jQuery to avoid TypeScript errors

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.css'
})
export class SideNavComponent implements OnInit, AfterViewInit {

  isSideOut: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.initializeBootstrapComponents();
  }

  toggleSideOut(): void {
    this.isSideOut = !this.isSideOut;
    // Remove the body overflow manipulation
  }

  initializeBootstrapComponents(): void {
    // Initialize tooltips
    $('[data-bs-toggle="tooltip"]').tooltip();

    // Initialize popovers
    $('[data-bs-toggle="popover"]').popover({
      trigger: 'hover'
    });
  }

  private hidePopovers(): void {
    $('[data-bs-toggle="popover"]').popover('hide');
  }

  onDash() {
    this.hidePopovers();
    this.router.navigate(['/budget-planner/dashboard']);
  }

  onProfile() {
    this.hidePopovers();
    this.router.navigate(['/budget-planner/profile']);
  }

  onHistory() {
    this.hidePopovers();
    this.router.navigate(['/budget-planner/history']);
  }

  onLogout() {
    this.hidePopovers();
    this.router.navigate(['/login']);
  }
}
