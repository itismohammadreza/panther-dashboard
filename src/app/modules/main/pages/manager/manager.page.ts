import {Component, OnInit} from '@angular/core';
import {DataService} from "@core/http";
import {ActivatedRoute} from "@angular/router";
import {NgDialogFormConfig, NgTableActionsConfig, NgTableColDef} from "@powell/models";
import {OverlayService} from "@powell/api";
import {ModelData} from "@core/models/data.models";

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

  modelIndex: number;
  modelData: ModelData;
  objectiveRecord: any;
  dialogVisible: boolean;
  tableData: any[] = [];
  colDef: NgTableColDef<any>[] = [];
  templateRenderFieldNames: string[] = [];
  tableActions: NgTableActionsConfig = {
    header: "Actions",
    inSameColumn: false,
    actions: [
      {
        header: 'Delete',
        icon: 'pi pi-trash',
        onClick: (item, index) => {
          this.deleteModelData(item, index);
        }
      },
      {
        header: 'Show',
        icon: 'pi pi-info',
        onClick: async (item) => {
          this.modelData = await this.dataService.getModelDataById(this.modelIndex, item.id);
          this.dialogVisible = true;
        }
      }
    ]
  }
  pageLoaded: boolean = false;

  ngOnInit() {
    this.route.params.subscribe(({index}) => {
      this.modelIndex = index;
      this.loadData()
    });
  }

  async loadData() {
    this.modelData = await this.dataService.getModelData(this.modelIndex);
    const {data, fields} = this.modelData;
    this.generateTableColDef(fields);
    this.tableData = data;
  }

  generateTableColDef(fields: any) {
    this.colDef = [];
    const getRenderType = (field: string, type: any) => {
      if (typeof type == 'object') {
        this.templateRenderFieldNames.push(field)
        return 'ng-template';
      }
      return 'text';
    }
    Object.entries(fields).forEach(([field, type]) => {
      this.colDef.push({field: field, header: field, render: {as: getRenderType(field, type)}})
    })
    this.pageLoaded = true;
  }

  async deleteModelData(item, index) {
    const dialogRes = await this.overlayService.showConfirmDialog({
      header: 'Delete',
      message: 'Are you sure to delete this record?'
    });
    if (dialogRes) {
      await this.dataService.deleteModelData(this.modelIndex, item.id);
      this.tableData.splice(index, 1)
    }
  }

  addModelData() {
    this.overlayService.showDialogForm(this.generateModifyFormFields(this.modelData.fields), {header: ''})
  }

  generateModifyFormFields(fields: any) {
    const result: NgDialogFormConfig[] = [];
    Object.entries(fields).forEach(([field, type]) => {
      if (typeof type == 'object') {
        this.generateModifyFormFields(field)
      }
      switch (type) {
        case 'str':
          result.push({
            label: field,
            key: field,
            component: 'input-text'
          })
          break;
        case 'int':
          result.push({
            label: field,
            key: field,
            component: 'input-number'
          })
          break;
        case 'bool':
          result.push({
            label: field,
            key: field,
            component: 'checkbox'
          })
          break;
      }
    })
    return result;
  }

  showObjectRecordDetails(data: any, field: any) {
    this.objectiveRecord = data[field];
    this.dialogVisible = true;
  }
}
