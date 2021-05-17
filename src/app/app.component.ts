import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';

import { Stock, StockOwner, SplitType } from 'src/app/models';
import { DataService } from './services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  title = 'wevestr-viktor';
  data: Map<string, Stock> = new Map();
  totalPrice: number;
  total: number;
  keys = Object.keys;
  splitTypeId: number;
  splitTypes: {[key: string]: SplitType} = {};
  stockTypes = ['COMMON', 'PREFERRED'];
  owners: StockOwner[] = [];
  editableFormGroup = new FormGroup({
    name: new FormControl(),
    ownerName: new FormControl(),
    type: new FormControl()
  });
  newStockFormGroup = new FormGroup({
    id: new FormControl(),
    name: new FormControl(),
    ownerName: new FormControl(),
    type: new FormControl(),
    count: new FormControl()
  });
  stockCounts: number[] = [100, 400, 500, 1000];

  editableId: number;

  private _subscriptions = new Subscription();

  constructor(private _dataService: DataService,
              private _changeDetector: ChangeDetectorRef) {
    this.getData();
    this.getOwners();
    this.getSplitTypes();
  }

  getData(): void {
    this._subscriptions.add(
      this._dataService.getData()
        .subscribe((res) => {
          res.forEach(item => this.data[item.id] = item);
          this._getTotalCount(this.data);
        })
    );
  }

  getOwners(): void {
    this._subscriptions.add(
      this._dataService.getOwners()
        .subscribe(res => this.owners = res)
    );
  }

  getSplitTypes(): void {
    this._subscriptions.add(
      this._dataService.getSplitTypes()
        .subscribe(res => {
          if (res) {
            this.splitTypeId = res[0].id;
            res.forEach(item => this.splitTypes[item.id] = item);
          }
        })
    );
  }

  onEdit(id: number): void {
    if (this.editableId) {
      this.data[this.editableId].isEdit = false;
    }
    this.editableId = id;
    this.data[id].isEdit = true;
    this._fillEditableForm(this.data[id]);
  }

  onSave(item: Stock): void {
    const stock: Stock = this.data[item.id];
    stock.name = this.editableFormGroup.value['name'];
    stock.owner.name = this.editableFormGroup.value['ownerName'];
    stock.type = this.editableFormGroup.value['type'];
    this.data[item.id].isEdit = false;
    this.editableId = null;
  }

  onAddShareholder(): void {
    this._fillAddStockForm();
  }

  onSaveShareholder(): void {
    const obj = this.newStockFormGroup.value;
    (this.data[obj.id] as Stock) = {
      id: obj.id,
      name: obj.name,
      count: +obj.count,
      price: 12,
      type: obj.type,
      owner: {id: obj.id, name: obj.ownerName}
    };
    this._clearAddStockForm();
    this._getTotalCount(this.data);
  }

  onDelete(id: number): void {
    if (confirm('Are you sure you want to delete stock?')) {
      delete this.data[id];
      this._getTotalCount(this.data);
    }
  }

  onSplit(id: number, splitTypeId: number) {
    const type = this.splitTypes[splitTypeId];
    const stock: Stock = this.data[id];
    stock.price = stock.price / type.value;
    stock.count = stock.count * type.value;
    this.data[id].isSplit = false;

    this._getTotalCount(this.data);
  }

  onClear(id?: number): void {
    if (id) {
      this.data[id].isSplit = false;
      this.data[id].isEdit = false;
      this._clearEditableForm();
      return;
    }
    this._clearAddStockForm();
  }

  private _getTotalCount(data: Map<string, Stock>): void {
    this.totalPrice = 0;
    this.total = 0;

    const keys = Object.keys(data);
    keys.forEach(key => {
      this.totalPrice = this.totalPrice + (data[key].count * data[key].price);
      this.total = this.total + data[key].count;
    });
  }

  private _clearEditableForm(): void {
    this.editableFormGroup.setValue({ownerName: '', name: '', type: ''});
  }

  private _fillEditableForm(item: Stock): void {
    this.editableFormGroup.setValue({
      ownerName: item.owner.name,
      name: item.name,
      type: item.type
    });
  }

  private _fillAddStockForm(): void {
    const id = Number(new Date());
    this.newStockFormGroup.setValue({
      id,
      name: `Name ${id}`,
      ownerName: 'John Doe',
      type: this.stockTypes[0],
      count: 100
    });
  }

  private _clearAddStockForm(): void {
    this.newStockFormGroup.setValue({id: null, name: '', ownerName: '', type: '', count: null});
  }

  ngOnDestroy() { // just to show that OnDestroy hook is a must but not in root module, of course
    this._subscriptions.unsubscribe();
  }
}
