import {Component, OnInit} from '@angular/core';
import {DataService} from "@core/http";
import {ActivatedRoute} from "@angular/router";
import {NgTableColDef} from "@powell/models";
import {ModelItem} from "@core/models/data.models";

@Component({
  selector: 'ng-manager',
  templateUrl: './manager.page.html',
  styleUrls: ['./manager.page.scss']
})
export class ManagerPage implements OnInit {
  constructor(private dataService: DataService,
              private route: ActivatedRoute) {
  }

  tableData: ModelItem[] = [];
  colDef: NgTableColDef<ModelItem>[] = [
    {field: 'id', header: 'ID'},
    {field: 'first_name', header: 'First Name'},
    {field: 'last_name', header: 'Last Name'},
    {field: 'age', header: 'Age'},
  ]

  ngOnInit() {
    this.route.params.subscribe(({modelName}) => {
      const loadData = async () => {
        this.tableData = await this.dataService.getItems(modelName);
      }
      loadData()
    });
  }
}
