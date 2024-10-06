import { produce } from "immer"
import { MBParameter, store } from "../model"
import path from "./service-const"



class MBParameterService {
    

    async getParameterForRoom(roomId:string){
        //fetch
        const theHeader = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+ localStorage.getItem("token")
        });
        const response = await fetch(`${path}/api/morpho/${roomId}/parameter}`, {
            headers: theHeader
        });
        const parameters : MBParameter[] = await response.json();
        //console.log(rooms);

        const model = produce(store.getValue(), draft => {
            draft.parameters = parameters;
        });

        store.next(model);

    }

    async createParameterForRoom(roomId : string, title: string) : Promise<MBParameter> {
        const theHeader = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+ localStorage.getItem("token")
        });
        const response = await fetch(`${path}/api/morpho/parameter`,{
            method: 'POST',
            headers: theHeader,
            body: JSON.stringify({
                'roomId': roomId,
                'title': title
            })
        });
        try {
            const parameter: MBParameter = await response.json();

            //add room to store
            const model = produce(store.getValue(), draft => {
                draft.parameters.push(parameter);
            })
            store.next(model);
            console.log(parameter);
            return parameter;
        }
        catch (error) {
            console.log(`Error in createParameterForRoom ${error}`);
            return null;
        }
    }
}


const mbParameterService = new MBParameterService();
export default mbParameterService;