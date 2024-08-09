import { Api, ApiListResponse } from './base/api';
import {IOrder, IOrderResult, IProductItem } from "../types";


export class WebLarekApi extends Api {
	contentDeliveryNetwork: string;

    constructor( contentDeliveryNetwork: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this. contentDeliveryNetwork =  contentDeliveryNetwork;
    }

    getProductItem() {
        return this.get(`/product`)
           .then((data: ApiListResponse<IProductItem>) => {
						return data.items.map((item) => ({ ...item}))
					 })
    }


    orderLots(order: IOrder): Promise<IOrderResult> {
        return this.post('/order', order).then(
            (data: IOrderResult) => data
        );
    }

}