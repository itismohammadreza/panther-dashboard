import {Component, OnInit} from '@angular/core';
import {DataService} from "@core/http";
import {ActivatedRoute} from "@angular/router";
import {NgTableColDef} from "@powell/models";
import {TestModelItem} from "@core/models/data.models";

@Component({
  selector: 'ng-manager',
  templateUrl: './manager.page.html',
  styleUrls: ['./manager.page.scss']
})
export class ManagerPage implements OnInit {
  constructor(private dataService: DataService,
              private route: ActivatedRoute) {
  }

  tableData: TestModelItem[] = [];
  colDef: NgTableColDef<TestModelItem>[] = [];

  ngOnInit() {
    this.route.params.subscribe(({modelName}) => {
      const loadData = async () => {
        const {data, fields} = await this.dataService.getItems(modelName);
        this.generateTableColDef(fields);
        this.tableData = data;
      }
      loadData()
    });
  }

  generateTableColDef(fields: any) {
    this.colDef = [];
    Object.keys(fields).forEach(f => {
      this.colDef.push({field: f, header: f})
    })
  }
}
