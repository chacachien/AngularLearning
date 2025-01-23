import {
  Component,
  ElementRef,
  OnInit, ViewChild
} from '@angular/core';
import {
  FormControl,
  NgForm
} from "@angular/forms";
import {
  Item,
  ItemRow,
  User
} from "../models/user.interface";
import {
  MatTableDataSource
} from "@angular/material/table";
import {
  COMMA,
  ENTER
} from "@angular/cdk/keycodes";
import {Observable} from "rxjs";
import {
  MatAutocomplete, MatAutocompleteSelectedEvent
} from "@angular/material/autocomplete";
import {
  MatChipInputEvent
} from "@angular/material/chips";
import {map, startWith} from "rxjs/operators";
// Define the Item type

// Create an array of items
const items: Item[] = [];

// Generate 10 items
for (let i = 1; i <= 10; i++) {
  const item: Item = {
    STT: `Item-${i}`,              // String identifier
    HSD: new Date(Date.now() + i * 86400000), // Expiration date offset by days
    Inventory: Math.floor(Math.random() * 100) + 1,  // Random quantity between 1 and 100
  };
  items.push(item);
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  userInfo: User;
  displayedColumns: string[] = ['id', 'username'] //'gen', 'think', 'remember', 'createdAt'
  dataSource: MatTableDataSource<User>;
  visible = true;
  selectable = true;
  removeable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  userItemControls: Map<number, FormControl> = new Map();
  // Map to store filtered items Observable for each user
  userFilteredItems: Map<number, Observable<ItemRow[]>> = new Map();
  @ViewChild('itemInput') itemInput!: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete!: MatAutocomplete;
  constructor() {
    this.userInfo = {
      id: 0,
      username: '',
      gen: '',
      think: '',
      remember: false,
      items: [],
      createdAt: new Date()
    }

    this.dataSource = new MatTableDataSource();
  }

  getItemControl(userId: number) {
    if(!this.userItemControls.has(userId)) {
      this.userItemControls.set(userId, new FormControl(userId));
      this.setupFilteredItems(userId);
    }
    return this.userItemControls.get(userId)!;
  }


  ngOnInit(): void {
    let dataSource: { data: User[] } = {data: []};

    for (let i = 1; i <= 10; i++) {
      let item: ItemRow[] = [];
      //SL: Math.floor(Math.random() *
      // item.Inventory) + 1;// Random SL up to Inventory

      const randomCount = Math.floor(Math.random() * 10); // Random number of items to select

      for (let j = 0; j < randomCount; j++) {
        const randomIndex = Math.floor(Math.random() * items.length); // Select a random index
        const baseItem = items[randomIndex];

        // Convert to ItemRow with a random SL
        const itemRow: ItemRow = {
          ...baseItem,
          SL: Math.floor(Math.random() * baseItem.Inventory) + 1, // Random SL up to Inventory
        };

        item.push(itemRow);
      }

      const userInfo: User = {
        id: i,
        username: `Phat Nguyen ${i}`,
        gen: i % 2 === 0 ? "Male" : "Female", // Alternate genders for variety
        think: `HUHUHU ${i}`,
        remember: i % 2 === 0, // Alternate boolean values
        items: item,
        createdAt: new Date(new Date().getTime() - i * 1000 * 60 * 60), // Offset createdAt by hours
      };
      this.dataSource.data.push(userInfo);
    }

  }
  remove(id: number, item: ItemRow): void {
    const indexUser = this.dataSource.data[id];
    const indexItem = indexUser.items.indexOf(item);
    if (indexItem > 0){
      this.dataSource.data[id].items.splice(indexItem, 1);
    }
  }

  onSubmit(form: NgForm): void {
    console.log(form);
  }

  onClick() {
    this.userInfo.items.push();
  }

  add(event: MatChipInputEvent, id: number) {
    const input = event.input;
    const value = input.value;
    const user = this.dataSource.data.find(u=>u.id ===id);
    if(!user || !value){
      return;
    }
    const selectedItem = user.items.find(item => item.STT.toLowerCase()===value.toLowerCase())
    if(selectedItem && !user.items.some(i => i.STT.toLowerCase()===selectedItem.STT.toLowerCase())){
      const itemRow = {
        ...selectedItem,
        SL: Math.floor(Math.random() * 100) + 1,
      }
      user.items.push(itemRow);
    }
    event.input.value = '';
  }

  selected(event: MatAutocompleteSelectedEvent, id: number) {
    const user = this.dataSource.data.find(u => u.id === id);
    if (!user) return;

    const selectedItem = user.items.find(item =>
      item.STT === event.option.viewValue
    );
    if(selectedItem){
      const itemRow = {
        ...selectedItem,
        SL: Math.floor(Math.random() * 100) + 1,
      }
      user.items.push(itemRow);
      this.dataSource.data = [...this.dataSource.data];
    }
    this.getItemControl(id)?.setValue(null);
  }


  private setupFilteredItems(userId: number) {
    const control =this.userItemControls.get(userId)!;
    const filterItems = control.valueChanges.pipe(
      startWith(null),
      map((searchText: string|null) => {
        if(searchText===null || typeof searchText !== 'string'){
          return this.getAvailableItems(userId);
        }
        return this._filter(userId, searchText);
      }
    ));
    this.userFilteredItems.set(userId, filterItems);
  }

  private getAvailableItems(userId: number) {
    const user = this.dataSource.data.find(u => u.id == userId);
    if(!user){
      return []
    }
    const selectedSTTs = new Set(user.items.map(item => item.STT));
    return user.items.filter(item =>!selectedSTTs.has(item.STT));
  }

  private _filter(userId: number, searchText: string) {
    const filterValue = searchText.toLowerCase();
    const availableItems = this.getAvailableItems(userId);
    return availableItems.filter(item => item.STT.includes(searchText));
  }
  getFilterItems(id: number) {
    return this.userFilteredItems.get(id)!;
  }
}
