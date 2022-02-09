import { Component, OnInit } from '@angular/core';
import Handsontable from "handsontable";

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  settings: Handsontable.GridSettings = {
    data: Handsontable.helper.createSpreadsheetData(1, 3),
    rowHeaders: true,
    width: '100%',
    height: 'auto',
    colWidths: 80,
    stretchH: 'all',
    colHeaders: true,
    licenseKey: '00000-00000-00000-00000-00000',
    dropdownMenu: true,
    columnSorting: {
      // By default, it doesn't sort well
      // So we implement a basic sort function.
      compareFunctionFactory(sortOrder) {
        return (value, nextValue) => {
          const res = value.localeCompare(nextValue);
          if (sortOrder === 'desc') {
            return -1 * res;
          }
          return res;
        };
      },
    },
    contextMenu: {
      items: {
        row_above: {
          name: 'Insérer une nouvelle ligne au-dessus',
        },
        row_below: {
          name: 'Insérer une nouvelle ligne en dessous',
        },
        separator1: Handsontable.plugins.ContextMenu.SEPARATOR,
        remove_row: {
          name: 'Supprimer cette ligne',
        },
        separator3: Handsontable.plugins.ContextMenu.SEPARATOR,
        cut: {
          name: 'Couper',
        },
        copy: {
          name: 'Copier',
        },
        undo: {
          name: 'Annuler',
        },
        separator2: Handsontable.plugins.ContextMenu.SEPARATOR,
        clear_custom: {
          name: 'Effacer tout le tableau',
          callback(): void {
            this.clear();
          },
        },
      },
    },
  };

  dataset: any[] = [
    {name: 'Ted Right', address: 'Wall Street'},
    {name: 'Frank Honest', address: 'Pennsylvania Avenue'},
    {name: 'Joan Well', address: 'Broadway'},
    {name: 'Gail Polite', address: 'Bourbon Street'},
    {name: 'Michael Fair', address: 'Lombard Street'},
    {name: 'Mia Fair', address: 'Rodeo Drive'},
    {name: 'Cora Fair', address: 'Sunset Boulevard'},
    {name: 'Jack Right', address: 'Michigan Avenue'},
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
