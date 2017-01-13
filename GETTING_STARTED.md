Getting started with Angular 2
====================

TABLE OF CONTENTS
---------------------
* [Setting up Angular 2](#setting-up-angular-2)
* [Introduction](#introduction)
* [Adding more heroes](#adding-more-heroes)
* [Multiple components](#multiple-components)
* [Services](#services)
* [Routing](#routing)
* [HTTP-Promises](#http-promises)
* [HTTP-Observables](#http-observables)

## SETTING UP ANGULAR 2
---------------------
* [NodeJS](https://nodejs.org/en/)
* npm install -g angular-cli
* ng new Angular2Workshop
* cd Angular2Workshop
* ng serve

## INTRODUCTION
---------------------
Add new Hero class to src/app/app.component.ts file:

    export class Hero {
        id: number;
        name: string;
    }

Change title and add hero property to app.component.ts

    title = 'Tour of Heroes';
    hero: Hero = {
        id: 1,
        name: 'Windstorm'
    };

Open app.component.html and display title in h1, name of hero in h2 and create label and input for changing hero's name. Note that [(ngModel)] is 2-way data binding. When we change input, change is shown immediately.

    <h1>{{title}}</h1>
    <h2>{{hero.name}} details!</h2>
    <div><label>id: </label>{{hero.id}}</div>
    <div>
        <label>name: </label>
        <input [(ngModel)]="hero.name" placeholder="name">
    </div>

## ADDING MORE HEROES
---------------------

We will display more heroes, so we create a Hero array in app.component.ts below Hero class with 10 heroes.

    const HEROES: Hero[] = [
        { id: 11, name: 'Mr. Nice' },
        { id: 12, name: 'Narco' },
        { id: 13, name: 'Bombasto' },
        { id: 14, name: 'Celeritas' },
        { id: 15, name: 'Magneta' },
        { id: 16, name: 'RubberMan' },
        { id: 17, name: 'Dynama' },
        { id: 18, name: 'Dr IQ' },
        { id: 19, name: 'Magma' },
        { id: 20, name: 'Tornado' }
    ];

Assign HEROES array to heroes object, rename hero to selectedHero and unassign it. Also create onSelect method which takes a Hero parameter and assigns selectedHero.

    heroes = HEROES;
    selectedHero: Hero;
    onSelect(hero: Hero): void {
        this.selectedHero = hero;
    }

Go to .html file and add a ul with li and use *ngFor for iteration on heroes. 
We display hero.id and hero.name in the span. Also the selected hero with receive selected class and we create click handler for onSelect.

    <h1>{{title}}</h1>
    <h2>My Heroes</h2>
    <ul class="heroes">
        <li *ngFor="let hero of heroes"
        [class.selected]="hero === selectedHero"
        (click)="onSelect(hero)">
        <span class="badge">{{hero.id}}</span> {{hero.name}}
        </li>
    </ul>

Second part of .html is for display of selected hero (change hero -> selectedHero). We display it only if the selectedHero is assigned (*ngIf).

    <div *ngIf="selectedHero">
        <h2>{{selectedHero.name}} details!</h2>
        <div><label>id: </label>{{selectedHero.id}}</div>
        <div>
        <label>name: </label>
        <input [(ngModel)]="selectedHero.name" placeholder="name"/>
        </div>
    </div>

Styling can be added to app.component.css file.

    .selected {
      background-color: #CFD8DC !important;
      color: white;
    }
    .heroes {
      margin: 0 0 2em 0;
      list-style-type: none;
      padding: 0;
      width: 15em;
    }
    .heroes li {
      cursor: pointer;
      position: relative;
      left: 0;
      background-color: #EEE;
      margin: .5em;
      padding: .3em 0;
      height: 1.6em;
      border-radius: 4px;
    }
    .heroes li.selected:hover {
      background-color: #BBD8DC !important;
      color: white;
    }
    .heroes li:hover {
      color: #607D8B;
      background-color: #DDD;
      left: .1em;
    }
    .heroes .text {
      position: relative;
      top: -3px;
    }
    .heroes .badge {
      display: inline-block;
      font-size: small;
      color: white;
      padding: 0.8em 0.7em 0 0.7em;
      background-color: #607D8B;
      line-height: 1em;
      position: relative;
      left: -1px;
      top: -4px;
      height: 1.8em;
      margin-right: .8em;
      border-radius: 4px 0 0 4px;
    }

## MULTIPLE COMPONENTS
---------------------

Let's first extract Hero class to separate file. Create hero.ts in the /models folder.

    export class Hero {
        id: number;
        name: string;
    }

We will also extract hero details to separate component. You can generate new component by running ng g component hero-detail from CLI.
Add hero input to HeroDetailComponent class. Also, grab the html for displaying separate hero and paste it in the hero-detail.component.html and rename selectedHero -> hero.

    @Input()
    hero: Hero;

Finally, go to app.component.html and add hero-detail directive and bind hero property to selectedHero.

    <app-hero-detail [hero]="selectedHero"></app-hero-detail>

## SERVICES
---------------------

Create new services folder and generate hero service with ng g service services/hero. We must provide this service in app.module.ts

    providers: [HeroService]

Next, let's extract multiple heroes data to models/mock-heroes.ts file.

    import { Hero } from './hero';

    export const HEROES: Hero[] = [
        { id: 11, name: 'Mr. Nice' },
        { id: 12, name: 'Narco' },
        { id: 13, name: 'Bombasto' },
        { id: 14, name: 'Celeritas' },
        { id: 15, name: 'Magneta' },
        { id: 16, name: 'RubberMan' },
        { id: 17, name: 'Dynama' },
        { id: 18, name: 'Dr IQ' },
        { id: 19, name: 'Magma' },
        { id: 20, name: 'Tornado' }
    ];

Now go to hero.service.ts and add getHeroes method which returns a promise.

    getHeroes(): Promise<Hero[]> {
        return Promise.resolve(HEROES);
    }

Let's go to app.component.ts and consume this service.

    export class AppComponent implements OnInit{
        title = 'Tour of Heroes';
        heroes: Hero[] = [];
        selectedHero: Hero;

        constructor(private heroService: HeroService) { }

        getHeroes(): void {
            this.heroService.getHeroes().then(heroes => this.heroes = heroes);
        }

        ngOnInit(): void {
            this.getHeroes();
        }

        onSelect(hero: Hero): void {
            this.selectedHero = hero;
        }
    }

## ROUTING
---------------------

Create new Heroes component with ng g component heroes . We will move our heroes list to this component. Go to app.component.html and move everything to heroes template (.html file). 

    <h2>My Heroes</h2>
    <ul class="heroes">
        <li *ngFor="let hero of heroes" (click)="onSelect(hero)" [class.selected]="hero === selectedHero">
            <span class="badge">{{hero.id}}</span>{{hero.name}}
        </li>
    </ul>
    <app-hero-detail [hero]="selectedHero"></app-hero-detail>

Meanwhile, copy the .css from app.component.css to heroes.component.css.

Also, move all the variables and methods from .ts file to heroes.component.ts file, because we will need them there to display the heroes. Also delete the OnInit implements, because we are not using it anymore in app.component.ts.

    selectedHero: Hero;
    heroes: Hero[];

    constructor(private heroService: HeroService){}

    onSelect(hero: Hero){
        this.selectedHero = hero;
    }

    ngOnInit(): void {
        this.getHeroes();
    }

    getHeroes(): void {
        this.heroService.getHeroes().then(heroes => this.heroes = heroes);
    }

Let's create separate module for routing in the app/routing.module.ts (create new .ts file). Open app.module.ts and add routing module to imports array and copy content below to routing.module.ts.

    import { NgModule } from '@angular/core';
    import { RouterModule, Routes } from '@angular/router';
    import { DashboardComponent } from './dashboard/dashboard.component';
    import { HeroesComponent } from './heroes/heroes.component';
    import { HeroDetailComponent } from './hero-detail/hero-detail.component';

    const routes: Routes = [
        { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
        { path: 'dashboard', component: DashboardComponent },
        { path: 'detail/:id', component: HeroDetailComponent },
        { path: 'heroes', component: HeroesComponent }
    ];
    @NgModule({
        imports: [RouterModule.forRoot(routes)],
        exports: [RouterModule]
    })
    export class RoutingModule { }

Move the title of app in the app.component.html and add two links, to dashboard and heroes views.

    <h1>{{title}}</h1>
    <nav>
      <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
      <a routerLink="/heroes" routerLinkActive="active">Heroes</a>
    </nav>
    <router-outlet></router-outlet>

Create dashboard folder in /app and generate dashboard component with ng g component dashboard and add a title to dashboard.component.html. We will also display top 4 heroes here.

    <h3>My Dashboard</h3>
    <h3>Top Heroes</h3>
    <div class="grid grid-pad">
        <a *ngFor="let hero of heroes" [routerLink]="['/detail', hero.id]" class="col-1-4">
            <div class="module hero">
                <h4>{{hero.name}}</h4>
            </div>
        </a>
    </div>

We will now implement logic for top heroes. Open dashboard.component.ts and add.

    heroes: Hero[] = [];

    constructor(private heroService: HeroService) { }

    ngOnInit(): void {
        this.heroService.getHeroes()
            .then(heroes => this.heroes = heroes.slice(1, 5));
    }

Try to run ng serve and you should be able to navigate between two routes /dashboard, /heroes

We will now set up the navigation to specific hero with passing the hero id as a number in the params. Implement the ngOnInit and get the data from params on the component init in the hero-detail.component.ts.

    import { HeroService } from './../services/hero.service';
    import { Hero } from './../models/hero';
    import { Component, Input, OnInit } from '@angular/core';
    import { ActivatedRoute, Params } from '@angular/router';
    import { Location } from '@angular/common';
    import 'rxjs/add/operator/switchMap';

    constructor(
        private heroService: HeroService,
        private route: ActivatedRoute,
        private location: Location
    ) { }

    ngOnInit() {
        this.route.params.switchMap((params: Params) =>
            this.heroService.getHero(+params['id'])).subscribe(hero => this.hero = hero);
    }

We already have a method in our hero.service.ts to get all the heroes, but we need to add a method to get a specific hero, which we consume here in the ngOnInit. Add this to your hero.service.ts

    getHero(id: number): Promise<Hero> {
        return this.getHeroes().then(heroes => heroes.find(hero => hero.id === id));
    }

When we are on the hero.detail view, we want to have an option to get back to the dashboard. Let's add the back method and the button in the hero-detail component.

    <div>
        <button (click)="goBack()">Back</button>
    </div>

    goBack(): void {
        this.location.back();
    }

We will modify heroes component too, so when you click on hero, you will be presented with a link which takes you to the hero detail component. 

Delete this part in heroes.component.html

    <app-hero-detail [hero]="selectedHero"></app-hero-detail>

Add add this instead.

    <div *ngIf="selectedHero">
        <h2>
            {{selectedHero.name | uppercase}} is my hero
        </h2>
        <button (click)="goToDetail()">View Details</button>
    </div>

Let's implement goToDetail method in heroes.component.ts

    constructor(private heroService: HeroService, private router: Router) {}

    goToDetail(): void {
        this.router.navigate(['/detail', this.selectedHero.id]);
    }

The final thing in this chapter is styling of our app, just add this to hero-detail.component.css

    label {
        display: inline-block;
        width: 3em;
        margin: .5em 0;
        color: #607D8B;
        font-weight: bold;
    }
    input {
        height: 2em;
        font-size: 1em;
        padding-left: .4em;
    }
    button {
        margin-top: 20px;
        font-family: Arial;
        background-color: #eee;
        border: none;
        padding: 5px 10px;
        border-radius: 4px;
        cursor: pointer; cursor: hand;
    }
    button:hover {
        background-color: #cfd8dc;
    }
        button:disabled {
        background-color: #eee;
        color: #ccc; 
        cursor: auto;
    }

Add some dashboard styling too.

    [class*='col-'] {
    float: left;
    padding-right: 20px;
    padding-bottom: 20px;
    }
    [class*='col-']:last-of-type {
    padding-right: 0;
    }
    a {
    text-decoration: none;
    }
    *, *:after, *:before {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    }
    h3 {
    text-align: center; margin-bottom: 0;
    }
    h4 {
    position: relative;
    }
    .grid {
    margin: 0;
    }
    .col-1-4 {
    width: 25%;
    }
    .module {
    padding: 20px;
    text-align: center;
    color: #eee;
    max-height: 120px;
    min-width: 120px;
    background-color: #607D8B;
    border-radius: 2px;
    }
    .module:hover {
    background-color: #EEE;
    cursor: pointer;
    color: #607d8b;
    }
    .grid-pad {
    padding: 10px 0;
    }
    .grid-pad > [class*='col-']:last-of-type {
    padding-right: 20px;
    }
    @media (max-width: 600px) {
    .module {
        font-size: 10px;
        max-height: 75px; }
    }
    @media (max-width: 1024px) {
    .grid {
        margin: 0;
    }
    .module {
        min-width: 60px;
    }
    }

And finally, add these to src/styles.css (global styles)

    /* Master Styles */
    h1 {
    color: #369;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 250%;
    }
    h2, h3 {
    color: #444;
    font-family: Arial, Helvetica, sans-serif;
    font-weight: lighter;
    }
    body {
    margin: 2em;
    }
    body, input[text], button {
    color: #888;
    font-family: Cambria, Georgia;
    }
    /* . . . */
    /* everywhere else */
    * {
    font-family: Arial, Helvetica, sans-serif;
    }

## HTTP-Promises
---------------------

We can provide HTTP services by adding HttpModule in our app.module.ts. Since we are using Angular-CLI, our http is already included and provided under imports.

Let's create a new in-memory service with ng g service services/in-memory-data and add createDb method and heroes data to it.

Add this package in package.json under dependecies and run npm install.

    "angular-in-memory-web-api": "0.1.13",

In real example, we would be using a real API in the backend, but we will fake it with inmemory API module, so import these in the app.module.ts

    import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
    import { InMemoryDataService } from './services/in-memory-data.service';


    @NgModule({
    imports: [
        InMemoryWebApiModule.forRoot(InMemoryDataService),
    ],

in-memory-data.service.ts

    import { InMemoryDbService } from 'angular-in-memory-web-api';
  
    export class InMemoryDataService implements InMemoryDbService {
        createDb() {
            let heroes = [
            {id: 11, name: 'Mr. Nice'},
            {id: 12, name: 'Narco'},
            {id: 13, name: 'Bombasto'},
            {id: 14, name: 'Celeritas'},
            {id: 15, name: 'Magneta'},
            {id: 16, name: 'RubberMan'},
            {id: 17, name: 'Dynama'},
            {id: 18, name: 'Dr IQ'},
            {id: 19, name: 'Magma'},
            {id: 20, name: 'Tornado'}
            ];
            return {heroes};
        }
    }

Amazing work till now. We will now use HTTP in our hero service to get the heroes from our web api server.

    import { Injectable } from '@angular/core';
    import { Headers, Http } from '@angular/http';
    import 'rxjs/add/operator/toPromise';
    import { Hero } from './../models/hero';

    private heroesUrl = 'api/heroes';  // URL to web api

    constructor(private http: Http) { }

    getHeroes(): Promise<Hero[]> {
        return this.http.get(this.heroesUrl)
                .toPromise()
                .then(response => response.json().data as Hero[])
                .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

Next, we will modify the method where we get the hero by id. For now, we are getting all the heroes from web api and extracting the right hero on the client. We want to get only one hero by id.

    getHero(id: number): Promise<Hero> {
        const url = `${this.heroesUrl}/${id}`;
        return this.http.get(url)
            .toPromise()
            .then(response => response.json().data as Hero)
            .catch(this.handleError);
    }

We want to create fully featured CRUD capable app, so we will first add the ability to save changed hero details. First add a save button with click handler and implement it in hero-detail component.

    <button (click)="save()">Save</button>

    save(): void {
        this.heroService.update(this.hero)
            .then(() => this.goBack());
    }

This update method on heroService does not exist yet, so open hero.service.ts and implement it.

    private headers = new Headers({'Content-Type': 'application/json'});

    update(hero: Hero): Promise<Hero> {
        const url = `${this.heroesUrl}/${hero.id}`;
        return this.http
            .put(url, JSON.stringify(hero), {headers: this.headers})
            .toPromise()
            .then(() => hero)
            .catch(this.handleError);
    }

We added headers to http request, because we are transfering json. We call the put method to update the entry.
The R(read) and U(update) in CRUD are done. Now it is time to implement C(create) functionallity in our app. Let's add some input and button to our heroes.component.html on the top of the file.

    <div>
        <label>Hero name:</label> <input #heroName />
        <button (click)="add(heroName.value); heroName.value=''">
            Add
        </button>
    </div>

Now in heroes.component.ts implement the add method, where we pass the value of input field.

    add(name: string): void {
        name = name.trim();
        if (!name) { return; }
            this.heroService.create(name)
            .then(hero => {
                this.heroes.push(hero);
                this.selectedHero = null;
            });
    }

Lastly, let's implement the missing create method in heroService.

    create(name: string): Promise<Hero> {
        return this.http
            .post(this.heroesUrl, JSON.stringify({name: name}), {headers: this.headers})
            .toPromise()
            .then(res => res.json().data)
            .catch(this.handleError);
    }

Delete is the last part of CRUD we are going to implement. Add this delete button after the hero name in heroes.component.html and styling to heroes.component.css

    <button class="delete"
        (click)="delete(hero); $event.stopPropagation()">x</button>

    button.delete {
        float:right;
        margin-top: 2px;
        margin-right: .8em;
        background-color: gray !important;
        color:white;
    }

The logic of delete method is implemented in heroes.component.ts

    delete(hero: Hero): void {
        this.heroService
            .delete(hero.id)
            .then(() => {
                this.heroes = this.heroes.filter(h => h !== hero);
                if (this.selectedHero === hero) { this.selectedHero = null; }
            });
        }

Finally, we update the hero service with a delete method

    delete(id: number): Promise<void> {
        const url = `${this.heroesUrl}/${id}`;
        return this.http.delete(url, {headers: this.headers})
            .toPromise()
            .then(() => null)
            .catch(this.handleError);
    }

## HTTP-Observables
---------------------

Observables are HTTP response objects, just another way to get data from our API.

Let's add the hero search functionallity using observables. First, generate new hero-search service with angular-cli with: ng g service services/hero-search and add this service to the providers array in app.module.ts

    import { Injectable } from '@angular/core';
    import { Http, Response } from '@angular/http';
    import { Observable } from 'rxjs';
    import { Hero } from '../models/hero';

    @Injectable()
    export class HeroSearchService {
        constructor(private http: Http) {}
        search(term: string): Observable<Hero[]> {
            return this.http
                    .get(`app/heroes/?name=${term}`)
                    .map((r: Response) => r.json().data as Hero[]);
        }
    }

Notice that now, with search method, we don't convert it to promise, but return a observable instead.

Now, lets generate a new component with: ng g component hero-search and copy below code to its .html file

    <div id="search-component">
        <h4>Hero Search</h4>
        <input #searchBox id="search-box" (keyup)="search(searchBox.value)" />
        <div>
            <div *ngFor="let hero of heroes | async"
                (click)="goToDetail(hero)" class="search-result" >
            {{hero.name}}
            </div>
        </div>
    </div>

Apply some styling to hero-search component (hero-search.component.css).

    .search-result{
        border-bottom: 1px solid gray;
        border-left: 1px solid gray;
        border-right: 1px solid gray;
        width:195px;
        height: 20px;
        padding: 5px;
        background-color: white;
        cursor: pointer;
    }

    #search-box{
        width: 200px;
        height: 20px;
    }

Add logic for search and goToDetail (hero-search.component.ts).

    import { Component, OnInit } from '@angular/core';
    import { Router } from '@angular/router';
    import { Observable } from 'rxjs/Observable';
    import { Subject } from 'rxjs/Subject';
    import { HeroSearchService } from '../services/hero-search.service';
    import { Hero } from '../models/hero';

    @Component({
        selector: 'app-hero-search',
        templateUrl: './hero-search.component.html',
        styleUrls: ['./hero-search.component.css']
    })
    export class HeroSearchComponent implements OnInit {

        heroes: Observable<Hero[]>;
        private searchTerms = new Subject<string>();

        constructor(
            private heroSearchService: HeroSearchService,
            private router: Router) { }

        search(term: string): void {
            this.searchTerms.next(term);
        }

        ngOnInit(): void {
            this.heroes = this.searchTerms
            .debounceTime(300)        // wait for 300ms pause in events
            .distinctUntilChanged()   // ignore if next search term is same as previous
            .switchMap(term => term   // switch to new observable each time
                ? this.heroSearchService.search(term)
                : Observable.of<Hero[]>([]))
            .catch(error => {
                console.log(error);
                return Observable.of<Hero[]>([]);
            });
        }

        goToDetail(hero: Hero): void {
            let link = ['/detail', hero.id];
            this.router.navigate(link);
        }
    }


Add these rxjs operator import to the app.module.ts

    // Observable class extensions
    import 'rxjs/add/observable/of';
    import 'rxjs/add/observable/throw';

    // Observable operators
    import 'rxjs/add/operator/catch';
    import 'rxjs/add/operator/debounceTime';
    import 'rxjs/add/operator/distinctUntilChanged';
    import 'rxjs/add/operator/do';
    import 'rxjs/add/operator/filter';
    import 'rxjs/add/operator/map';
    import 'rxjs/add/operator/switchMap';

The last part of our search is to add search component to the dashboard under the list of top 4 heroes.

    <app-hero-search></app-hero-search>