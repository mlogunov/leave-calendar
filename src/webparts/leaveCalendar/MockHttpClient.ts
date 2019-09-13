import { IListItem } from "./components/IListItem";

export default class MockHttpClient {
    private static _items: IListItem[] = [
        {
            id: 1, 
            persona: 
            {
                primaryText: 'Марушев Валерий Вячеславович',
                secondaryText: 'Начальник управления'
            }, 
            dateFrom: new Date(2019, 8, 1), 
            dateTo: new Date(2019, 8, 5), 
            leaveType: 
            {
                title: 'Vacation',
                bgColor: '#00ff00'
            }
        },
        {
            id: 2, 
            persona: 
            {
                primaryText: 'Орешин Антон Сергеевич',
                secondaryText: 'Заместитель начальника управления'
            }, 
            dateFrom: new Date(2019, 8, 8), 
            dateTo: new Date(2019, 8, 15), 
            leaveType: 
            {
                title: 'Business Trip',
                bgColor: '#0000ff'
            }
        },
        {
            id: 3, 
            persona: 
            {
                primaryText: 'Абу Абдуллах Мухаммад ибн Муса аль-Хорезми',
                secondaryText: 'Персидский математик'
            }, 
            dateFrom: new Date(2019, 8, 15), 
            dateTo: new Date(2019, 8, 22), 
            leaveType: 
            {
                title: 'Vacation',
                bgColor: '#00ff00'
            }
        },
        {
            id: 4, 
            persona: 
            {
                primaryText: 'Логунов Максим Владимирович',
                secondaryText: 'Старший разработчик'
            }, 
            dateFrom: new Date(2019, 8, 11), 
            dateTo: new Date(2019, 8, 25), 
            leaveType: 
            {
                title: 'Vacation',
                bgColor: '#00ff00'
            }
        },
    ];
    public static get(): Promise<IListItem[]> {
        return new Promise<IListItem[]>((resolve) => {
            resolve(MockHttpClient._items);
        });
    }
}