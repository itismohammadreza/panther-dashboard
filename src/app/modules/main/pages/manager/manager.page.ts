import {Component, OnInit} from '@angular/core';
import {DataService} from "@core/http";
import {ActivatedRoute} from "@angular/router";
import {NgTableAction, NgTableActionsConfig, NgTableColDef} from "@powell/models";
import {OverlayService} from "@powell/api";

@Component({
  selector: 'ng-manager',
  templateUrl: './manager.page.html',
  styleUrls: ['./manager.page.scss']
})
export class ManagerPage implements OnInit {
  constructor(private dataService: DataService,
              private route: ActivatedRoute,
              private overlayService: OverlayService) {
  }

  currentModelIndex: number;
  currentRecord: any;
  dialogVisible: boolean;
  tableData: any[] = [];
  colDef: NgTableColDef<any>[] = [];
  tableActions: NgTableActionsConfig = {
    header: "Actions",
    inSameColumn: false,
    actions: [
      {
        header: 'Delete',
        icon: 'pi pi-trash',
        onClick: (item, index) => {
          this.deleteRecord(item, index);
        }
      },
      {
        header: 'Show',
        icon: 'pi pi-info',
        onClick: async (item) => {
          this.currentRecord = await this.dataService.getRecordById(this.currentModelIndex, item.id);
          this.dialogVisible = true;
        }
      }
    ]
  }

  ngOnInit() {
    this.route.params.subscribe(({index}) => {
      this.currentModelIndex = index;
      const loadData = async () => {
        const {data, fields} = await this.dataService.getRecords(index);
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

  async deleteRecord(item, index) {
    const dialogRes = await this.overlayService.showConfirmDialog({
      header: 'Delete',
      message: 'Are you sure to delete this record?'
    });
    if (dialogRes) {
      await this.dataService.deleteRecord(this.currentModelIndex, item.id);
      const idx = this.tableData.findIndex(data => data.id === item.id);
      this.tableData.splice(idx, 1)
    }
  }
}
