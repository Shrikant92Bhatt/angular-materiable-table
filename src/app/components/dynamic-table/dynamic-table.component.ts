import { Component, OnInit, ViewChild, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ELEMENT_DATA, VisleanElement } from '../../models/data.model';
import { MatDialog } from '@angular/material/dialog';
import { DialogFormComponent } from '../dialog-form/dialog-form.component';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { MatIcon } from '@angular/material/icon';
@Component( {
  selector: 'app-dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.sass']
} )
export class DynamicTableComponent implements OnInit, AfterViewInit, OnChanges {
  displayedColumns: string[] = ['actId', 'orgName', 'owner', 'taskName', 'status', 'taskType', 'edit'];
  public dataSource: MatTableDataSource<VisleanElement>;
  @ViewChild( MatPaginator ) paginator: MatPaginator;
  @ViewChild( MatSort ) sort: MatSort;
  @ViewChild( MatTable, { static: true } ) table: MatTable<any>;

  constructor ( public dialog: MatDialog, private http: HttpClient ) {
    this.http.get( '/assets/data.json' ).pipe( map(
      ( data: Array<VisleanElement> ) => {
        this.dataSource = new MatTableDataSource<VisleanElement>( data );
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    ) ).subscribe( ( data ) => {
      console.log( data );

    } );
  }

  ngAfterViewInit (): void {

  }

  ngOnInit (): void {

  }
  ngOnChanges ( change: SimpleChanges ): void {
    console.log( change );
  }

  getStatusStyle ( styleId ): object {
    const obj = {
      'border-color': 'red',
      'background-color': 'red'
    };

    // tslint:disable-next-line: radix
    switch ( parseInt( styleId ) ) {
      case 1:
        obj['border-color'] = '#f9fc35';
        obj['background-color'] = '#f9fc35';
        break;
      case 2:
        obj['border-color'] = '#e8070b';
        obj['background-color'] = '#e8070b';
        break;
      case 3:
        obj['border-color'] = '#28cf25';
        obj['background-color'] = '#28cf25';
        break;
      case 4:
        obj['border-color'] = '#47913d';
        obj['background-color'] = '#47913d';
        break;
      case 5:
        obj['border-color'] = '#47913d';
        obj['background-color'] = '#47913d';
        break;

      default:
        obj['border-color'] = '#000';
        obj['background-color'] = '#000';
        break;
    }
    return obj;
  }
  getStatusText ( statusId ): string {
    // tslint:disable-next-line: no-inferrable-types
    let statusType: string = '';
    // tslint:disable-next-line: radix
    switch ( parseInt( statusId ) ) {
      case 1:
        statusType = 'Not Committed';
        break;
      case 2:
        statusType = 'Not Ready';
        break;
      case 3:
        statusType = 'Ready';
        break;
      case 4:
        statusType = 'Forced Ready';
        break;
      case 5:
        statusType = 'Started';
        break;
      default:
        statusType = 'NA';
        break;
    }
    return statusType;
  }

  openDialog ( element?): void {
    let isNewForm: boolean = false;
    if ( !element ) {
      const elmObj: VisleanElement = {
        actId: this.getUniqueId().toString(),
        orgName: '',
        owner: '',
        status: 1,
        taskName: '',
        taskType: '',
        plannedWorkers: this.getWorker(),
        actualWorkers: this.getWorker()
      }
      element = elmObj;
      isNewForm = true;
    }
    this.getUniqueId();
    const dialogRef = this.dialog.open( DialogFormComponent, {
      data: { element, isNewForm }
    } );

    dialogRef.afterClosed().subscribe( result => {
      if ( result ) {
        this.updateData( result );
      }
    } );
  }
  /**
   * This function used to update data or add data
   * @param data Is form filled data
   * If dataObj is emptyObj then it directly add new obj to array it mean new row
   * This function must have update/post request but due to less time CURD opration only on UI
   */
  updateData ( data: VisleanElement ): void {
    const dataObj = this.dataSource.data.find( ( element ) => element.actId == data.actId );
    console.log( dataObj );
    if ( dataObj ) {
      dataObj.orgName = data.orgName;
      dataObj.owner = data.owner;
      dataObj.status = data.status;
      dataObj.taskName = data.taskName;
      dataObj.taskType = data.taskType;
      // this.http.put( '/assets/data.json', data ).subscribe( ( resp ) => {
      //   console.log( 'put' + resp );

      // } );
    }
    else {
      // this.http.post( '/assets/data.json', data ).subscribe( ( resp ) => {
      //   console.log( 'post' + resp );
      // } );
      this.dataSource.data.push( data );
    }
    // UPDATE/POST
    this.dataSource._updateChangeSubscription();

  }

  /**
   * This Function used to delete row
   * @param id as row account number
   * This function must have Observabe of Delete request due to lack of time just removing from local
   */
  deletAccount ( id ): void {
    const data = this.dataSource.data;
    let i = data.length;
    while ( i-- ) {
      if ( data[i] && ( data[i]['actId'] == id ) ) {

        this.dataSource.data.splice( i, 1 );

        break;
      }
    }
    // DELETE request
    this.dataSource._updateChangeSubscription();
  }

  getUniqueId (): number {
    const idArray: Array<number> = this.dataSource.data.map( ( elm ) => parseInt( elm.actId, 10 ) );
    const mia = idArray.reduce( ( acc, cur, ind, arr ) => {
      const diff = cur - arr[ind - 1];
      if ( diff > 1 ) {
        let i = 1;
        while ( i < diff ) {
          acc.push( arr[ind - 1] + i );
          i++;
        }
      }
      return acc;
    }, [] );
    if ( mia.length == 0 ) {
      return idArray[idArray.length - 1] + 1;
    } else {
      return mia[0];
    }

  }
  /*
   * This is to get random number & random timestamp as our data required
   * Logically this must be part of form
  **/
  getWorker (): object {
    const obj: object = {};
    const date = new Date();
    const nextDay = new Date().setDate( date.getDate() + 10 ); // Day 10 day elapsed
    obj[date.getTime().toString()] = Math.floor( Math.random() * ( 99 - 1 ) + 1 );
    obj[new Date( nextDay ).getTime().toString()] = Math.floor( Math.random() * ( 99 - 1 ) + 1 );
    return obj;
  }

}
