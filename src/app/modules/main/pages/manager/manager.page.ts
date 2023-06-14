import {Component, OnInit} from '@angular/core';
import {DataService} from "@core/http";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'ng-manager',
  templateUrl: './manager.page.html',
  styleUrls: ['./manager.page.scss']
})
export class ManagerPage implements OnInit {
  constructor(private dataService: DataService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
  }

  async loadData() {
  }
}
