import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppStatsCard } from './app-stats-card';

describe('AppStatsCard', () => {
  let component: AppStatsCard;
  let fixture: ComponentFixture<AppStatsCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppStatsCard],
    }).compileComponents();

    fixture = TestBed.createComponent(AppStatsCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
