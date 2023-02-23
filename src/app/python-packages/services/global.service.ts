import { Injectable } from '@angular/core';
import { TableItem, TableModel } from 'carbon-components-angular';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  constructor() { }

  /**
   * Table search
   * Do the search in the search box
   * @param  value   search value in the search box
   * @param  allData data to be searched
   * @return TableItem[][] mathced rows data
   */
  searchValueChange(value: string, allData: TableItem[][]) {
    let matchedData: TableItem[][] = [];
    if (value != undefined && allData != undefined) {
      if (value === "") {
        matchedData = allData;
      } else {
        matchedData = allData.filter(data => this.isMatched(value, data)).
          map(filteredData => filteredData);
      }
    }
    return matchedData;
  }

  /**
  * Check whether data includes searchValue or filter
  * @param  value search content in the search box
  * @param  data          each table item in the table
  * @return               true if matched, false if not matched
  */
  private isMatched(value: string, data: TableItem[]): boolean {
    for (let i = 0; i < data.length; i++) {
      if (String(data[i]["data"]).toLowerCase().includes(value.toLowerCase())) { // only search column, not searh expanded data
        //Please add visable:boolean flag when you construct the TableItem
        // console.log(data[i]["data"]);
        return true;
      }
    }
    return false;
  }

  /**
  * Table filter
  * Do the filter
  * @param  checkedTags   checked tags used to do filter
  * @param  allData data to be filtered
  * @return TableItem[][] mathced rows data
  */
  filterByTags(checkedTags: Array<string>, allData: TableItem[][]) {
    let matchedData: TableItem[][] = [];
    if (checkedTags != undefined && allData != undefined) {
      if (checkedTags.length === 0) {
        matchedData = allData;
      } else {
        let filterRes = allData;
        checkedTags.forEach(filterTag => {// every tag do filter
          filterRes= filterRes.filter(data => this.isMatched(filterTag, data)).
          map(filteredData => filteredData);
        });
        matchedData = filterRes;
      }
    }
    // console.log(matchedData);
    return matchedData;
  }

  /**
  * Replace the substituted variable in template string
  * @param {String} str the template string
  * @param {Object} data json data {key:value}
  */
  substitute(str, data) {
    return str.replace(/\\?\$\{([^\{}]+)\}/g, function (match, name) {
      return (data[name] === undefined) ? '' : data[name];
    });
  }

  /**
 * First char to uppercase, The rest of the string to lowercase.
 * Example: str : ABC ==> Abc
 * @param str 
 * @returns 
 */
  firstCharToUpper(str) {
    if (str != undefined) {
      str = str.trim();
      return str.substring(0, 1).toUpperCase() + str.substring(1).toLowerCase();
    }
    return null;
  }
}
