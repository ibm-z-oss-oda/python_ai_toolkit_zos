import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TableHeaderItem, TableItem, TableModel } from 'carbon-components-angular';
import { TranslateService } from '@ngx-translate/core';
import { ConstantService } from '../../services/constant.service';
import { MessageService } from '../../services/message.service';
import { HttpClient } from '@angular/common/http';
import { HeaderService } from '../../header/header.service';
import { PackageInfoObject } from '../model/PackageInfoObject';
import { GlobalService } from '../../services/global.service';

@Component({
  selector: 'app-index-table',
  templateUrl: './index-table.component.html',
  styleUrls: ['./index-table.component.scss']
})
export class IndexTableComponent implements OnInit {

  @Input() id = "index-table";
  @Input() model = new TableModel();
  @Input() size = 'md';
  @Input() showSelectionColumn = false;
  @Input() striped = false;
  @Input() isDataGrid = false;

  @Input() toolbar = true;
  @Input() theme = 'dark';
  @Input() placeholder = 'Search';
  @Input() autocomplete = 'off';
  @Input() disabled = false;
  @Input() searchsize = 'lg';
  @Input() searchDomValue = "";
  @Input() sortable = true;

  @Input() ghost = "ghost";
  @Input() bottom = "bottom";

  @ViewChild("expandedPaneTemplate", { static: true }) protected expandedPaneTemplate: TemplateRef<any>;
  @ViewChild("tagsTableItemTemplate", { static: true }) protected tagsTableItemTemplate: TemplateRef<any>;
  // columns
  name: string = "";
  tags: string = "";
  versions: string = "";
  version: string = '';
  allData: TableItem[][] = []; // all table rows data
  searchMatchedData: TableItem[][] = []; // matched data of search
  filterMatchedData: TableItem[][] = []; // matched data of filter
  dataToConstrutPages: TableItem[][] = []; // data used to construct pages after filter or search performed
  indexData: any = [ // get these data from the json file
    // { "name": "Imageio", "tags": [ "Machine learning" ], "versions": "2.16.0,2.16.1", "info": {"description": "BM Python packages for z/OS maintains hundreds of packages available only on <a>z/OS</a> for your data science, needs on IBM Z. This channel provides the latest and greatest open installed into your z/OS environment.", "version": "2.16.1", "installComand": "pip install imageio=2.16.1", "detailsPage": "imgaeio.html"}}
  ];
  currentSortDrection: string = 'ascending';
  sorted: boolean = false; // table sorted?

  filterTags: Array<string> = [];
  checkedTags: Array<string> = []; // tags checked, used to do filter

  constructor(public translate: TranslateService, public constantService: ConstantService,
    public _messageService: MessageService, public http: HttpClient, public headService: HeaderService,
    public globals: GlobalService) { }

  ngOnInit(): void {
    // Get the columns name from the en.json
    this.translate.get('BUNDLE').subscribe(res => {
      this.name = res.HOME_TABLE_NAME;
      this.tags = res.HOME_TABLE_TAGS;
      this.version = res.HOME_TABLE_VERSIONS;
      this.model.header = [
        new TableHeaderItem({
          data: this.name,
          style: { 'z-Index': '9999px' },
          sortable: true,
        }),
        new TableHeaderItem({
          data: this.tags,
          style: { 'z-Index': '9999px' },
          sortable: false,
        }),
        new TableHeaderItem({
          data: this.versions,
          style: { 'z-Index': '9999px' },
          sortable: false
        })
      ]
    });

    // init filter tags
    this.filterTags = this.constantService.ALL_TAGS;

    // Load the data from json file
    this.http.get('assets/packageInfo.json').subscribe(data => {
      this.indexData = data;

      // construct all table rows data from json data
      this.allData = this.prepareData(this.indexData);
      this.dataToConstrutPages = this.allData; // default to all rows data

      this.model.pageLength = 10;
      this.model.totalDataLength = this.allData.length;
      this.selectPage(1);

    }, error => {
      console.log("An error happened when load the package info data.", error);
    });
  }

  // check which tag should be show
  checkTagType(tag: string) {
    if (tag == null || tag == "") {
      return this.constantService.ALL_TAGS_TYPE[8];
    }
    let index = this.constantService.ALL_TAGS.indexOf(tag.toLowerCase());
    return this.constantService.ALL_TAGS_TYPE[index];
  }

  // Sub the description, only display 218 chars
  subDesc(description: string) {
    let res: string = description;
    if (description != "" && description != undefined) {
      if (description.length > 218) {
        res = description.substring(0, 219) + "...";
      }
    }
    return res;
  }

  // the data is all of the package data
  goToPackageInfo(data: PackageInfoObject) {
    this.headService.renderHome = false;
    this.headService.renderGetStarted = false;
    this.headService.renderResources = false;
    this.headService.renderPackageInfo = true;
    this.headService.packageInfoData = data;
  }

  // get one page data from the searchMatchedData or filterMatchedData or allData
  getPage(page: number) {
    const fullPage = [];

    for (let i = (page - 1) * this.model.pageLength; i < page * this.model.pageLength && i < this.model.totalDataLength; i++) {
      fullPage.push(this.dataToConstrutPages[i]);
    }

    return new Promise(resolve => {
      setTimeout(() => resolve(fullPage), 150);
    });
  }

  selectPage(page) {
    this.getPage(page).then((data: TableItem[][]) => {
      // set the data and update page
      this.model.data = data;
      this.model.currentPage = page;
    });
  }

  protected prepareData(data: Array<PackageInfoObject>) {
    // create new data from the service data
    let items: TableItem[][] = [];
    let version = ''
    data.forEach(dataRow => {
      if (dataRow.versions.split(' ').length > 2) {
        version = dataRow.versions.split(' ')[2]
      } else {
        version = dataRow.versions.split(' ')[1]
      }
      items.push([
        new TableItem({
          data: dataRow.name ? dataRow.name : "", key: this.constantService.INDEX_NAME,
          expandedData: dataRow ? dataRow : null,
          expandedTemplate: this.expandedPaneTemplate
        }),
        new TableItem({
          data: dataRow.tags ? dataRow.tags : null,
          key: this.constantService.INDEX_TAGS,
          template: this.tagsTableItemTemplate
        }),
        new TableItem({ data: version ? version : "", key: this.constantService.INDEX_VERSIONS }),
      ]);
    });
    return items;
  }

  /**
   * Respond to change of search value 
   * Search function
   * @param searchValue event
   */
  searchValueChange(searchValue: string) {
    let dataToBeSearched: TableItem[][] = [];
    // if filter applied now, search based on filter data
    // otherwise search based on all data
    if (this.filterMatchedData && this.filterMatchedData.length != 0) { // filter applied
      dataToBeSearched = this.filterMatchedData;
    } else { // no filter
      dataToBeSearched = this.allData;
    }
    this.searchMatchedData = this.globals.searchValueChange(searchValue, dataToBeSearched);
    // re-conuage page data
    this.dataToConstrutPages = this.searchMatchedData;
    this.model.totalDataLength = this.dataToConstrutPages.length;
    // if table is sorted, when dataToConstrutPages changed, need to resorted it based on dataToConstrutPages data
    if(this.sorted) {
      this.sortDataToConstrutPages(this.dataToConstrutPages, 0, this.currentSortDrection); // only supported sort on name column now, so index is 0
    }
    this.selectPage(1);
  }


  /**
   * Clear table search action
   */
  clearSearchValue() {
    this.searchDomValue = "";
    this.searchMatchedData = []; // clear search matched data

    // if filter applied, construct page by using filter data, else using all data
    if (this.filterMatchedData && this.filterMatchedData.length != 0) { // filter applied
      // if filter existed, need to replay filter baseed on all rows data, because search cleared
      this.dataToConstrutPages = this.filterMatchedData = this.globals.filterByTags(this.checkedTags, this.allData);
    } else { // no filter
      this.dataToConstrutPages = this.allData;
    }
    // re-conuage page data
    this.model.totalDataLength = this.dataToConstrutPages.length;
    // if table is sorted, when dataToConstrutPages changed, need to resorted it based on dataToConstrutPages data
    if(this.sorted) {
      this.sortDataToConstrutPages(this.dataToConstrutPages, 0, this.currentSortDrection); // only supported sort on name column now, so index is 0
    }
    this.selectPage(1);
  }

  /**
   * filter check and uncheck
   * @param filterTag 
   * @param checked 
   */
  filterPackages(filterTag: string, checked: boolean) {
    let dataToBeFiltered: TableItem[][] = [];

    // if search applied now, filter based on searched data
    // otherwise search based on all data
    if (this.searchMatchedData && this.searchMatchedData.length != 0) { // search applied
      dataToBeFiltered = this.searchMatchedData;
    } else { // no searh
      dataToBeFiltered = this.allData;
    }

    if (checked) { // add tag
      this.checkedTags.push(filterTag);
    } else { // delete tag
      this.checkedTags.splice(this.checkedTags.indexOf(filterTag), 1);
    }

    // no tags checked, replay seacrh on all data
    if(this.checkedTags.length == 0) { 
      this.resetFilter();
      return;
    }

    // do filter
    this.filterMatchedData = this.globals.filterByTags(this.checkedTags, dataToBeFiltered);

    // re-conuage page data
    this.dataToConstrutPages = this.filterMatchedData;
    this.model.totalDataLength = this.dataToConstrutPages.length;
    // if table is filtered, when dataToConstrutPages changed, need to resorted it based on dataToConstrutPages data
    if(this.sorted) {
      this.sortDataToConstrutPages(this.dataToConstrutPages, 0, this.currentSortDrection); // only supported sort on name column now, so index is 0
    }
    this.selectPage(1);
  }

  // reset filter
  resetFilter() {
    this.filterMatchedData = [];
    this.checkedTags = [];
    if (this.searchMatchedData && this.searchMatchedData.length != 0) { // search applied
      this.searchValueChange(this.searchDomValue); // re-search
    } else { // no searh, render all data
       // re-conuage page data
      this.dataToConstrutPages = this.allData;
      this.model.totalDataLength = this.dataToConstrutPages.length;
      // if table is sorted, when dataToConstrutPages changed, need to resorted it based on dataToConstrutPages data, so the current page can display correct page data
      if(this.sorted) {
        this.sortDataToConstrutPages(this.dataToConstrutPages, 0, this.currentSortDrection); // only supported sort on name column now, so index is 0
      }
      this.selectPage(1);
    }
  }

  overflowOnClick = (event: any) => {
    event.stopPropagation();
  }

  customSort(index: number) {
    let sortDrection = 'ascending';
    // if not sorted or currentSortDrection is descending, needs to do ascending
    if(!this.sorted || this.currentSortDrection == 'descending') { 
      sortDrection =  'ascending';
    } else { // sorted and currentSortDrection is ascending, needs to do descending
      sortDrection =  'descending';
    }
    // sort the dataToConstrutPages data by sortDrection
    this.sortDataToConstrutPages(this.dataToConstrutPages, index, sortDrection);

    // select the current page data from the sorted dataToConstrutPages to display on the current table page
    this.selectPage(this.model.currentPage);

    // filp the sorting direction icon on the column
    if(this.sorted) {
      this.model.header[index].sorted = true;
      this.model.header[index].ascending = this.currentSortDrection == 'ascending' ? true : false;
    }
  }

  /**
   * sort dataToConstrutPages data by sortDrection
   * @param dataToConstrutPages 
   * @param index index of the sortted colum
   * @param sortDrection
   * @returns 
   */
   sortDataToConstrutPages(dataToConstrutPages: any[], index: number, sortDrection: string) {
    if(sortDrection == 'ascending') { 
      dataToConstrutPages.sort((a, b) => {
        return a[index].data.localeCompare(b[index].data); // ascending
      });
      this.currentSortDrection = 'ascending';
    } else {
      dataToConstrutPages.sort((a, b) => { 
        return b[index].data.localeCompare(a[index].data); // descending
      });
      this.currentSortDrection = 'descending';
    }
    this.sorted = true;
  }
}
