import { Injectable } from '@angular/core';
import { LoggerService } from 'src/app/shared/services/logger.service';

@Injectable()
export class TableStateService {
    stateLabel = "allTableStates";

    constructor(
        private logger: LoggerService
    ){}

    setState(componentKey, obj){
        try{
            const state = this.getStateFromLocalStorage();
            state[componentKey] = obj;
            localStorage.setItem(this.stateLabel, JSON.stringify(state));
        }catch(e){
            this.logger.log(componentKey, ": Error in saving state: "+e);
        }
    }

    getState(componentKey){
        let componentState:any = {};
        try{
            const state = this.getStateFromLocalStorage();
            componentState = state[componentKey];
        }catch(e){
            this.logger.log(componentKey, ": Error in getting state: "+e);
        }
        return componentState;
    }

    getStateFromLocalStorage(){
        const state = localStorage.getItem(this.stateLabel);
        if(!(state && state!="undefined")){
            localStorage.setItem("allTableStates", JSON.stringify({}));
            return {};
        }
        return JSON.parse(state);
    }

    persistOnly(componentKey){
        let componentState = this.getState(componentKey);
        this.clearAll();
        this.setState(componentKey, componentState);
    }

    clearPreservedData(componentKey){
        try{
            const componentState = this.getState(componentKey);
            componentState["data"] = [];
            componentState["bucketNumber"] = 0;
            componentState["selectedRowIndex"] = 0;
            this.setState(componentKey, componentState);
        }catch(e){
            this.logger.log(componentKey, ": Error in clearing state: "+e);
        }
    }

    clearPreservedFilters(componentKey){
        try{
            const componentState = this.getState(componentKey);
            componentState["filters"]?.forEach(filter => {
                filter.value = undefined;
                filter.filterValue = undefined;
            });
            componentState["bucketNumber"] = 0;
            componentState["selectedRowIndex"] = 0;
            componentState["totalRows"] = 0;
            this.setState(componentKey, componentState);
        }catch(e){
            this.logger.log(componentKey, ": Error in clearing state: "+e);
        }
    }

    clearAllPreservedFilters() {
        const storedState = this.getStateFromLocalStorage();
        const updatedState = Object.keys(storedState).reduce((acc, next) => {
            storedState[next].data = [];
            storedState[next].filters = [];
            storedState[next].bucketNumber = 0;
            storedState[next].selectedRowIndex = undefined;
            storedState[next].totalRows = 0;
            acc[next] = storedState[next];
            return acc;
        }, {});
        localStorage.setItem(this.stateLabel, JSON.stringify(updatedState));
    }

    clearState(componentKey){
        try{
            const componentState = this.getState(componentKey);
            componentState["data"] = [];
            componentState["bucketNumber"] = 0;
            componentState["selectedRowIndex"] = undefined;
            componentState["totalRows"] = 0;
            
            this.setState(componentKey, componentState);
        }catch(e){
            this.logger.log(componentKey, ": Error in clearing state: "+e);
        }
    }

    clearStateByFields(componentKey, fieldsToClear){
        try{
            this.logger.log("info", `clearing ${componentKey} with fields ${fieldsToClear}`);
            
            const componentState = this.getState(componentKey);
            fieldsToClear.forEach(field => {
                componentState[field] = undefined;
                if(field==="data"){
                    this.clearState(componentKey);
                } else {
                    componentState[field] = undefined;
                }
            })
            
            this.setState(componentKey, componentState);
        }catch(e){
            this.logger.log(componentKey, ": Error in clearing state: "+e);
        }
    }

    clearAll(){
        const state = this.getStateFromLocalStorage();
        if(state){
            const storedStatesKeys = Object.keys(state);
            storedStatesKeys.forEach(state => {
                this.clearState(state);
            })
        }
    }
}