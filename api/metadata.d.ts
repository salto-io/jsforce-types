import { Callback, Connection } from '../connection';
import { EventEmitter } from 'events';
import { Stream } from 'stream';
import { Buffer } from 'buffer';
import { PicklistEntry } from '../describe-result';

interface DeployResult {
    id: string;
    checkOnly: boolean;
    completedDate: string;
    createdDate: string;
    details?: object[];
    done: boolean;
    errorMessage?: string;
    errorStatusCode?: string;
    ignoreWarnings?: boolean;
    lastModifiedDate: string;
    numberComponentErrors: number;
    numberComponentsDeployed: number;
    numberComponentsTotal: number;
    numberTestErrors: number;
    numberTestsCompleted: number;
    numberTestsTotal: number;
    rollbackOnError?: boolean;
    startDate: string;
    status: string;
    success: boolean;
}

interface MetadataObject {
    childXmlNames: string[];
    directoryName: string;
    inFolder: boolean;
    metaFile: boolean;
    suffix: string;
    xmlName: string;
}

interface DescribeMetadataResult {
    metadataObjects: MetadataObject[];
    organizationNamespace: string;
    partialSaveAllowed: boolean;
    testRequired: boolean;
}

interface FileProperties {
    type: string;
    createdById: string;
    createdByName: string;
    createdDate: string;
    fileName: string;
    fullName: string;
    id: string;
    lastModifiedById: string;
    lastModifiedByName: string;
    lastModifiedDate: string;
    manageableState?: string;
    namespacePrefix?: string;
}

interface ListMetadataQuery {
    type: string;
    folder?: string;
}

interface MetadataInfo {
    fullName: string;
}

interface RetrieveRequest {
}

interface RetrieveResult {
    fileProperties: FileProperties[];
    id: string;
    messages: object[];
    zipFile: string
}

interface SaveResult {
    success: boolean;
    fullName: string;
}

interface UpdateMetadataInfo {
    currentName: string;
    metadata: MetadataInfo;
}

interface UpsertResult {
    success: boolean;
    fullName: string;
    created: boolean;
}

interface AsyncResult {
    done: boolean;
    id: string;
    state: string;
    statusCode?: string;
    message?: string;
}

interface DeployOptions {
    allowMissingFiles?:	boolean;
    autoUpdatePackage?: boolean;
    checkOnly?:	boolean;
    ignoreWarnings?: boolean;
    performRetrieve?: boolean;
    purgeOnDelete?: boolean;
    rollbackOnError?: boolean;
    runAllTests?: boolean;
    runTests?: string[];
    singlePackage?:	boolean;
}

  interface ValueTypeField {
    fields: ValueTypeField[];
    foreignKeyDomain: string;
    isForeignKey: boolean;
    isNameField: boolean;
    minOccurs: number;
    name: string;
    picklistValues: PicklistEntry[];
    soapType: string;
    valueRequired: boolean;
  }

  interface DescribeValueTypeResult {
    apiCreatable: boolean;
    apiDeletable: boolean;
    apiReadable: boolean;
    apiUpdatable: boolean;
    parentField: ValueTypeField;
    valueTypeFields: ValueTypeField[];
  }

export class AsyncResultLocator<T> extends EventEmitter implements PromiseLike<T> {
    check(callback?: Callback<T>): Promise<T>

    complete(callback?: Callback<T>): Promise<T>

    poll(interval: number, timeout: number): void;

    then<TResult1, TResult2>(onfulfilled?: ((value: T) => (PromiseLike<TResult1> | TResult1)) | null | undefined,
                             onrejected?: ((reason: any) => (PromiseLike<TResult2> | TResult2)) | null | undefined): Promise<TResult1 | TResult2>;

    finally(onfinally?: () => void): Promise<T>;
}

export class DeployResultLocator<T> extends AsyncResultLocator<T> {
    complete(includeDetails?: boolean, callback?: Callback<T>): Promise<T>
    // The following overload is not really implemented but if we don't include it typescript
    // will not allow us to say this class extends AsyncResultLocator
    complete(callback?: Callback<T>): Promise<T>
}
export class RetrieveResultLocator<T> extends AsyncResultLocator<T> {}

export class Metadata {
    pollInterval: number;
    pollTimeout: number;

    constructor(conn: Connection);

    checkDeployStatus(id: string, includeDetails?: boolean, callback?: Callback<DeployResult>): Promise<DeployResult>

    checkRetrieveStatus(id: string, callback?: Callback<RetrieveResult>): Promise<RetrieveResult>

    checkStatus(ids: string | string[], callback?: Callback<AsyncResult | Array<AsyncResult>>): AsyncResultLocator<AsyncResult | Array<AsyncResult>>

    create(type: string, metadata: MetadataInfo | Array<MetadataInfo>, callback?: Callback<SaveResult | Array<SaveResult>>): Promise<SaveResult | Array<SaveResult>>

    createAsync(type: string, metadata: MetadataInfo | Array<MetadataInfo>, callback?: Callback<SaveResult | Array<SaveResult>>): Promise<SaveResult | Array<SaveResult>>

    createSync(type: string, metadata: MetadataInfo | Array<MetadataInfo>,  callback?: Callback<SaveResult | Array<SaveResult>>): Promise<SaveResult | Array<SaveResult>>;

    delete(type: string, fullNames: string | string[], callback?: Callback<SaveResult | Array<SaveResult>>): Promise<SaveResult | Array<SaveResult>>;

    deleteAsync(type: string, metadata: string | string[] | MetadataInfo | Array<MetadataInfo>, callback?: Callback<AsyncResult | Array<AsyncResult>>): AsyncResultLocator<AsyncResult | Array<AsyncResult>>

    deleteSync(type: string, fullNames: string | string[], callback?: Callback<SaveResult | Array<SaveResult>>): Promise<SaveResult | Array<SaveResult>>;

    deploy(zipInput: Stream | Buffer | string, options: DeployOptions, callback?:Callback<DeployResult>): DeployResultLocator<DeployResult>;

    describe(version?: string, callback?: Callback<DescribeMetadataResult>): Promise<DescribeMetadataResult>;

    describeValueType(type: string, version?: string, callback?: Callback<DescribeValueTypeResult>): Promise<DescribeValueTypeResult>
    
    list(queries: ListMetadataQuery | Array<ListMetadataQuery>, version?: string, callback?: Callback<Array<FileProperties>>): Promise<Array<FileProperties>>;

    read(type: string, fullNames: string | string[], callback?: Callback<MetadataInfo | Array<MetadataInfo>>): Promise<MetadataInfo | Array<MetadataInfo>>;

    readSync(type: string, fullNames: string | string[], callback?: Callback<MetadataInfo | Array<MetadataInfo>>): Promise<MetadataInfo | Array<MetadataInfo>>;

    rename(type: string, oldFullName: string, newFullName: string, callback?: Callback<SaveResult>): Promise<SaveResult>

    retrieve(request: RetrieveRequest, callback: Callback<RetrieveResult>): RetrieveResultLocator<RetrieveResult>

    update(type: string, updateMetadata: MetadataInfo | Array<MetadataInfo>, callback?: Callback<SaveResult | Array<SaveResult>>): Promise<SaveResult | Array<SaveResult>>

    updateAsync(type: string, updateMetadata: MetadataInfo, callback?: Callback<AsyncResult | Array<AsyncResult>>): AsyncResultLocator<AsyncResult | Array<AsyncResult>>

    updateSync(type: string, updateMetadata: MetadataInfo | Array<MetadataInfo>, callback?: Callback<SaveResult | Array<SaveResult>>): Promise<SaveResult | Array<SaveResult>>

    upsert(type: string, metadata: MetadataInfo | Array<MetadataInfo>, callback?: Callback<UpsertResult | Array<UpsertResult>>): Promise<UpsertResult | Array<UpsertResult>>
}
