import { IListItem } from "../models/IListItem";
import { ILeaveType } from "../models/ILeaveType";
import { IEmployee } from "../models/IEmployee";
import * as _ from 'lodash';

export default class MockHttpClient {
    private static _currentUserID = 4;
    private static _items: IListItem[] = [
        {
            id: 1, 
            dateFrom: new Date(2019, 8, 1), 
            dateTo: new Date(2019, 8, 5), 
            authorId: 1,
            leaveTypeId: 1
        },
        {
            id: 2,  
            dateFrom: new Date(2019, 8, 8), 
            dateTo: new Date(2019, 8, 15), 
            authorId: 2,
            leaveTypeId: 4
        },
        {
            id: 3, 
            dateFrom: new Date(2019, 8, 9), 
            dateTo: new Date(2019, 8, 22), 
            authorId: 3,
            leaveTypeId: 3
        },
        {
            id: 4,  
            dateFrom: new Date(2019, 8, 2), 
            dateTo: new Date(2019, 8, 6), 
            authorId: 4,
            leaveTypeId: 2
        },
        {
            id: 5,  
            dateFrom: new Date(2019, 8, 23), 
            dateTo: new Date(2019, 8, 29), 
            authorId: 1,
            leaveTypeId: 1
        },
        {
            id: 6,  
            dateFrom: new Date(2019, 8, 16), 
            dateTo: new Date(2019, 8, 20), 
            authorId: 4,
            leaveTypeId: 1
        }
    ];
    private static _leaveTypes: ILeaveType[] = [
        {
            id: 1,
            title: 'Отпуск',
            bgColor: '#FFFACD'
        },
        {
            id: 2,
            title: 'Обучение',
            bgColor: '#E6E6FA'
        },
        {
            id: 3,
            title: 'Больничный',
            bgColor: '#FFE4E1'
        },
        {
            id: 4,
            title: 'Командировка',
            bgColor: '#B0E0E6'
        }
    ];

    private static _personas: IEmployee[] = [
        {
            id: 1,
            title: 'Марушев Валерий Вячеславович',
            position: 'Начальник управления'
        },
        {
            id: 2,
            title: 'Орешин Антон Сергеевич',
            position: 'Заместитель начальника управления'
        },
        {
            id: 3,
            title: 'Абу Абдуллах Мухаммад ибн Муса аль-Хорезми',
            position: 'Персидский математик'
        },
        {
            id: 4,
            title: 'Логунов Максим Владимирович',
            position: 'Старший разработчик'
        }
    ];

    public static getCurrentUserId(): Promise<number> {
        return new Promise<number>((resolve) => {
            resolve(this._currentUserID)
        })
    }

    public static getItems(): Promise<IListItem[]> {
        return new Promise<IListItem[]>((resolve) => {
            resolve(this._items);
        });
    }

    public static getLeaveTypes(): Promise<ILeaveType[]> {
        return new Promise<ILeaveType[]>((resolve) => {
            resolve(this._leaveTypes);
        });
    }

    public static getEmployees(): Promise<IEmployee[]> {
        return new Promise<IEmployee[]>((resolve) => {
            resolve(this._personas);
        });
    }

    public static getEmployeeById(emloyeeId: number): Promise<IEmployee> {
        return new Promise<IEmployee>((resolve)=>{
            resolve(_.find(this._personas, {id: emloyeeId}));
        })
    }
}