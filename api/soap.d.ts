import { Callback, Connection } from "../connection";
import { DescribeSObjectResult } from "../describe-result";

export class Soap {
  constructor(conn: Connection);

  describeSObjects(typeNames: string | string[], callback?: Callback<DescribeSObjectResult | Array<DescribeSObjectResult>>): Promise<DescribeSObjectResult | Array<DescribeSObjectResult>>
}