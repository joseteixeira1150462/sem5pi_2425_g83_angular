import { Observable } from "rxjs";
import { OperationType } from "../models/OperationType/OperationType.model";

export abstract class IOperationTypeRepository {
    abstract getAll(): Observable<OperationType[]>;
}