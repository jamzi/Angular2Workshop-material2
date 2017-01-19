import { Router } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';

import { Hero } from '../models/hero';
import { HeroService } from '../services/hero.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css'],
  providers: [HeroService]
})
export class HeroesComponent implements OnInit {
  selectedHero: Hero;
  heroes: Hero[];
  dialogRef: MdDialogRef<SelectedHeroDialog>;

  constructor(
    private heroService: HeroService,
    private router: Router,
    private dialog: MdDialog) { }

  ngOnInit(): void {
    this.getHeroes();
  }

  getHeroes(): void {
    this.heroService.getHeroes().then(heroes =>
      this.heroes = heroes);
  }

  onSelect(hero: Hero): void {
    this.dialogRef = this.dialog.open(SelectedHeroDialog);
    this.dialogRef.componentInstance.selectedHero = hero;
  }

  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.heroService.create(name)
      .then(hero => {
        this.heroes.push(hero);
        this.selectedHero = null;
      });
  }

  delete(hero: Hero): void {
    this.heroService
      .delete(hero.id)
      .then(() => {
        this.heroes = this.heroes.filter(h => h !== hero);
        if (this.selectedHero === hero) {
          this.selectedHero = null;
        }
      });
  }

  gotoDetail(): void {
    this.router.navigate(['/detail', this.selectedHero.id]);
  }
}

@Component({
  selector: 'selected-hero-dialog',
  template: `
  <h2>
    {{selectedHero.name | uppercase}} is my hero
  </h2>
  <button md-raised-button color="primary" (click)="gotoDetail()">View Details</button>
  <button md-raised-button (click)="dialogRef.close()">Close dialog</button>`
})
export class SelectedHeroDialog {
  selectedHero: any;

  constructor(
    public dialogRef: MdDialogRef<SelectedHeroDialog>,
    private router: Router) { }

  gotoDetail(): void {
    this.dialogRef.close();
    this.router.navigate(['/detail', this.selectedHero.id]);
  }
}