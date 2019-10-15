import {WebPartContext} from '@microsoft/sp-webpart-base';
import { sp, WebEnsureUserResult } from "@pnp/sp";
import { IListItem } from '../models/IListItem';
import { ILeaveType } from '../models/ILeaveType';
import { IEmployee } from '../models/IEmployee';

export default class SPServices {
    constructor(private context: WebPartContext){
        sp.setup({
            spfxContext: this.context
        })
    }

    public async getUserId(loginName: string): Promise<number> {
        try{
            const user: WebEnsureUserResult = await sp.web.ensureUser(loginName);
            return user.data.Id
        }
        catch(error){
            console.dir(error);
            return Promise.reject(error);
        }
    }

    public async getLeaveCalendarListItems(startDate: string, endDate: string): Promise<IListItem[]> {
        let listItems: IListItem[] = [];
        try{
            const filter: string = `DateFrom le datetime'${endDate}' and DateTo ge datetime'${startDate}'`;
            const results: any[] = await sp.web.lists.getByTitle('Leave Calendar').items.filter(filter).get();
            if(results && results.length > 0){
                listItems = results.map((result: any): IListItem => {
                    return {id: result.ID, dateFrom: new Date(result.DateFrom), dateTo: new Date(result.DateTo), leaveTypeId:result.LeaveTypeId, authorId: result.AuthorId}
                })
            }
        }
        catch (error) {
            console.dir(error);
            return Promise.reject(error);
        }
        return listItems;
    }

    public async getLeaveTypesListItems(): Promise<ILeaveType[]> {
        let listItems: ILeaveType[] = [];
        try{
            const results: any[] = await sp.web.lists.getByTitle('Leave Types').items.getAll();
            if(results && results.length > 0){
                listItems = results.map((result: any): ILeaveType => {
                    return {id: result.ID, title: result.Title, bgColor: result.BgColor}
                })
            }
        }
        catch (error) {
            console.dir(error);
            return Promise.reject(error);
        }
        return listItems;
    }

    public async getEmployeeById(id: number): Promise<IEmployee> {
        try{
            const user: any = await sp.web.siteUsers.getById(id).get();
            const jobTitle: string = await sp.profiles.getUserProfilePropertyFor(user.LoginName, 'SPS-JobTitle')
            return {id: id, title: user.Title, position: jobTitle}
        }
        catch (error) {
            console.dir(error);
            return Promise.reject(error);
        }
    }

    public async addNewItem(dateFrom: Date, dateTo: Date, leaveTypeId: number): Promise<any> {
        try{
            await sp.web.lists.getByTitle('Leave Calendar').items.add(
                {
                  DateFrom: dateFrom,
                  DateTo: dateTo,
                  LeaveTypeId: leaveTypeId
                }
              )
        }
        catch(error){
            console.dir(error);
            return Promise.reject(error);
        }
    }

    public async updateItem(id: number, dateFrom: Date, dateTo: Date, leaveTypeId: number): Promise<any> {
        try{
            await sp.web.lists.getByTitle('Leave Calendar').items.getById(id).update(
                {
                  DateFrom: dateFrom,
                  DateTo: dateTo,
                  LeaveTypeId: leaveTypeId
                }
              )
        }
        catch(error){
            console.dir(error);
            return Promise.reject(error);
        }
    }

    public async deleteItem(id: number): Promise<any> {
        try{
            await sp.web.lists.getByTitle('Leave Calendar').items.getById(id).delete();
        }
        catch(error){
            console.dir(error);
            return Promise.reject(error);
        }
    }
}