'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var common30385a2e_node = require('./common-1409c9f9.node.cjs.js');
require('@firebase/app');
require('@firebase/util');
require('@firebase/webchannel-wrapper/bloom-blob');
require('@firebase/logger');
require('util');
require('crypto');
require('@grpc/grpc-js');
require('@grpc/proto-loader');
require('re2js');

/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Represents the results of a Firestore pipeline execution.
 *
 * A `PipelineSnapshot` contains zero or more {@link @firebase/firestore/pipelines#PipelineResult} objects
 * representing the documents returned by a pipeline query. It provides methods
 * to iterate over the documents and access metadata about the query results.
 *
 * @example
 * ```typescript
 * const snapshot: PipelineSnapshot = await firestore
 *   .pipeline()
 *   .collection('myCollection')
 *   .where(field('value').greaterThan(10))
 *   .execute();
 *
 * snapshot.results.forEach(doc => {
 *   console.log(doc.id, '=>', doc.data());
 * });
 * ```
 */
class PipelineSnapshot {
    constructor(pipeline, results, executionTime) {
        this._pipeline = pipeline;
        this._executionTime = executionTime;
        this._results = results;
    }
    /**
     * An array of all the results in the `PipelineSnapshot`.
     */
    get results() {
        return this._results;
    }
    /**
     * The time at which the pipeline producing this result is executed.
     *
     * @readonly
     *
     */
    get executionTime() {
        if (this._executionTime === undefined) {
            throw new Error("'executionTime' is expected to exist, but it is undefined");
        }
        return this._executionTime;
    }
}
/**
 *
 * A PipelineResult contains data read from a Firestore Pipeline. The data can be extracted with the
 * {@link @firebase/firestore/pipelines#PipelineResult.data} or {@link @firebase/firestore/pipelines#PipelineResult.(get:1)} methods.
 *
 * <p>If the PipelineResult represents a non-document result, `ref` will return a undefined
 * value.
 */
class PipelineResult {
    /**
     * @private
     * @internal
     *
     * @param userDataWriter - The serializer used to encode/decode protobuf.
     * @param fields - The fields of the Firestore `Document` Protobuf backing
     * this document.
     * @param ref - The reference to the document.
     * @param createTime - The time when the document was created if the result is a document, undefined otherwise.
     * @param updateTime - The time when the document was last updated if the result is a document, undefined otherwise.
     * @param metadata
     * @param listenOptions
     */
    constructor(userDataWriter, fields, ref, createTime, updateTime, metadata, listenOptions) {
        this._ref = ref;
        this._userDataWriter = userDataWriter;
        this._createTime = createTime;
        this._updateTime = updateTime;
        this._fields = fields;
        this._metadata = metadata;
        this._listenOptions = listenOptions;
    }
    /**
     * @private
     * @internal
     * @param userDataWriter
     * @param doc
     * @param ref
     * @param metadata
     * @param listenOptions
     */
    static fromDocument(userDataWriter, doc, ref, metadata, listenOptions) {
        return new PipelineResult(userDataWriter, doc.data, ref, doc.createTime.toTimestamp(), doc.version.toTimestamp(), metadata, listenOptions);
    }
    /**
     * The reference of the document, if it is a document; otherwise `undefined`.
     */
    get ref() {
        return this._ref;
    }
    /**
     * The ID of the document for which this PipelineResult contains data, if it is a document; otherwise `undefined`.
     *
     * @readonly
     *
     */
    get id() {
        return this._ref?.id;
    }
    /**
     * The time the document was created. Undefined if this result is not a document.
     *
     * @readonly
     */
    get createTime() {
        return this._createTime;
    }
    /**
     * The time the document was last updated (at the time the snapshot was
     * generated). Undefined if this result is not a document.
     *
     * @readonly
     */
    get updateTime() {
        return this._updateTime;
    }
    /**
     * Retrieves all fields in the result as an object.
     *
     * @returns An object containing all fields in the document or
     * 'undefined' if the document doesn't exist.
     *
     * @example
     * ```
     * let p = firestore.pipeline().collection('col');
     *
     * p.execute().then(results => {
     *   let data = results[0].data();
     *   console.log(`Retrieved data: ${JSON.stringify(data)}`);
     * });
     * ```
     */
    data() {
        return this._userDataWriter.convertValue(this._fields.value, this._listenOptions?.serverTimestampBehavior);
    }
    /**
     * @internal
     * @private
     *
     * Retrieves all fields in the result as a proto value.
     *
     * @returns An `Object` containing all fields in the result.
     */
    _fieldsProto() {
        // Return a cloned value to prevent manipulation of the Snapshot's data
        return this._fields.clone().value.mapValue.fields;
    }
    /**
     * Retrieves the field specified by `field`.
     *
     * @param field - The field path
     * (e.g. 'foo' or 'foo.bar') to a specific field.
     * @returns The data at the specified field location or `undefined` if no
     * such field exists.
     *
     * @example
     * ```
     * let p = firestore.pipeline().collection('col');
     *
     * p.execute().then(results => {
     *   let field = results[0].get('a.b');
     *   console.log(`Retrieved field value: ${field}`);
     * });
     * ```
     */
    // We deliberately use `any` in the external API to not impose type-checking
    // on end users.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    get(fieldPath) {
        if (this._fields === undefined) {
            return undefined;
        }
        if (common30385a2e_node.isField(fieldPath)) {
            fieldPath = fieldPath.fieldName;
        }
        const value = this._fields.field(common30385a2e_node.fieldPathFromArgument('DocumentSnapshot.get', fieldPath));
        if (value !== null) {
            return this._userDataWriter.convertValue(value, this._listenOptions?.serverTimestampBehavior);
        }
    }
}
/**
 * Test equality of two PipelineResults.
 * @param left - First PipelineResult to compare.
 * @param right - Second PipelineResult to compare.
 */
function pipelineResultEqual(left, right) {
    if (left === right) {
        return true;
    }
    return (common30385a2e_node.isOptionalEqual(left._ref, right._ref, common30385a2e_node.refEqual) &&
        common30385a2e_node.isOptionalEqual(left._fields, right._fields, (l, r) => l.isEqual(r)));
}

/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @deprecated use selectablesToObject instead
 * @param selectables
 */
function selectablesToMap(selectables) {
    return new Map(Object.entries(selectablesToObject(selectables)));
}
function selectablesToObject(selectables) {
    const result = {};
    for (const selectable of selectables) {
        let alias;
        let expression;
        if (typeof selectable === 'string') {
            alias = selectable;
            expression = common30385a2e_node.field(selectable);
        }
        else if (selectable instanceof common30385a2e_node.Field) {
            alias = selectable.alias;
            expression = selectable.expr;
        }
        else if (selectable instanceof common30385a2e_node.AliasedExpression) {
            alias = selectable.alias;
            expression = selectable.expr;
        }
        else {
            common30385a2e_node.fail(0x5319, { selectable });
        }
        if (result[alias] !== undefined) {
            throw new common30385a2e_node.FirestoreError('invalid-argument', `Duplicate alias or field '${alias}'`);
        }
        result[alias] = expression;
    }
    return result;
}
function aliasedAggregateToMap(aliasedAggregatees) {
    return aliasedAggregatees.reduce((map, selectable) => {
        if (map.get(selectable.alias) !== undefined) {
            throw new common30385a2e_node.FirestoreError('invalid-argument', `Duplicate alias or field '${selectable.alias}'`);
        }
        map.set(selectable.alias, selectable.aggregate);
        return map;
    }, new Map());
}
/**
 * Converts a value to an Expression, Returning either a Constant, MapFunction,
 * ArrayFunction, or the input itself (if it's already an expression).
 *
 * @private
 * @internal
 * @param value
 */
function vectorToExpr(value) {
    if (value instanceof common30385a2e_node.Expression) {
        return value;
    }
    else if (value instanceof common30385a2e_node.VectorValue) {
        const result = common30385a2e_node.constant(value);
        return result;
    }
    else if (Array.isArray(value)) {
        const result = common30385a2e_node.constant(common30385a2e_node.vector(value));
        return result;
    }
    else {
        throw new Error('Unsupported value: ' + typeof value);
    }
}
/**
 * Converts a value to an Expression, Returning either a Constant, MapFunction,
 * ArrayFunction, or the input itself (if it's already an expression).
 * If the input is a string, it is assumed to be a field name, and a
 * field(value) is returned.
 *
 * @private
 * @internal
 * @param value
 */
function fieldOrExpression(value) {
    if (common30385a2e_node.isString$1(value)) {
        const result = common30385a2e_node.field(value);
        return result;
    }
    else {
        return valueToDefaultExpr(value);
    }
}
/**
 * Converts a value to an Expression, Returning either a Constant, MapFunction,
 * ArrayFunction, or the input itself (if it's already an expression).
 *
 * @private
 * @internal
 * @param value
 */
function valueToDefaultExpr(value) {
    let result;
    if (common30385a2e_node.isFirestoreValue(value)) {
        return common30385a2e_node.constant(value);
    }
    if (value instanceof common30385a2e_node.Expression) {
        return value;
    }
    else if (common30385a2e_node.isPlainObject(value)) {
        result = common30385a2e_node.map(value);
    }
    else if (value instanceof Array) {
        result = common30385a2e_node.array(value);
    }
    else if (isPipeline$1(value)) {
        result = common30385a2e_node.pipelineValue(value);
    }
    else {
        result = common30385a2e_node._constant(value, undefined);
    }
    return result;
}
/**
 * Checks if a value is a Pipeline object.
 *
 * We use duck typing here to avoid a circular dependency between pipeline.ts and pipeline_util.ts.
 */
function isPipeline$1(value) {
    return (typeof value === 'object' &&
        value !== null &&
        typeof value.toArrayExpression === 'function');
}

/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 *
 * The Pipeline class provides a flexible and expressive framework for building complex data
 * transformation and query pipelines for Firestore.
 *
 * A pipeline takes data sources, such as Firestore collections or collection groups, and applies
 * a series of stages that are chained together. Each stage takes the output from the previous stage
 * (or the data source) and produces an output for the next stage (or as the final output of the
 * pipeline).
 *
 * Expressions can be used within each stage to filter and transform data through the stage.
 *
 * NOTE: The chained stages do not prescribe exactly how Firestore will execute the pipeline.
 * Instead, Firestore only guarantees that the result is the same as if the chained stages were
 * executed in order.
 *
 * @example
 * ```typescript
 * const db: Firestore; // Assumes a valid firestore instance.
 *
 * // Example 1: Select specific fields and rename 'rating' to 'bookRating'
 * const results1 = await execute(db.pipeline()
 *     .collection("books")
 *     .select("title", "author", field("rating").as("bookRating")));
 *
 * // Example 2: Filter documents where 'genre' is "Science Fiction" and 'published' is after 1950
 * const results2 = await execute(db.pipeline()
 *     .collection("books")
 *     .where(and(field("genre").equal("Science Fiction"), field("published").greaterThan(1950))));
 *
 * // Example 3: Calculate the average rating of books published after 1980
 * const results3 = await execute(db.pipeline()
 *     .collection("books")
 *     .where(field("published").greaterThan(1980))
 *     .aggregate(average(field("rating")).as("averageRating")));
 * ```
 */
class Pipeline$1 {
    /**
     * @internal
     * @private
     * @param _db
     * @param userDataReader
     * @param _userDataWriter
     * @param stages
     */
    constructor(
    /**
     * @internal
     * @private
     */
    _db, 
    /**
     * @internal
     * @private
     */
    userDataReader, 
    /**
     * @internal
     * @private
     */
    _userDataWriter, 
    /**
     * @internal
     * @private
     */
    stages) {
        this._db = _db;
        this.userDataReader = userDataReader;
        this._userDataWriter = _userDataWriter;
        this.stages = stages;
    }
    _readUserData(context) {
        this.stages.forEach(stage => {
            const subContext = context.contextWith({
                methodName: stage._name
            });
            stage._readUserData(subContext);
        });
    }
    addFields(fieldOrOptions, ...additionalFields) {
        // Process argument union(s) from method overloads
        let fields;
        let options;
        if (common30385a2e_node.isSelectable(fieldOrOptions)) {
            fields = [fieldOrOptions, ...additionalFields];
            options = {};
        }
        else {
            ({ fields, ...options } = fieldOrOptions);
        }
        // Convert user land convenience types to internal types
        const normalizedFields = selectablesToMap(fields);
        // Create stage object
        const stage = new common30385a2e_node.AddFields(normalizedFields, options);
        // Add stage to the pipeline
        return this._addStage(stage);
    }
    removeFields(fieldValueOrOptions, ...additionalFields) {
        // Process argument union(s) from method overloads
        const options = common30385a2e_node.isField(fieldValueOrOptions) || common30385a2e_node.isString$1(fieldValueOrOptions)
            ? {}
            : fieldValueOrOptions;
        const fields = common30385a2e_node.isField(fieldValueOrOptions) || common30385a2e_node.isString$1(fieldValueOrOptions)
            ? [fieldValueOrOptions, ...additionalFields]
            : fieldValueOrOptions.fields;
        // Convert user land convenience types to internal types
        const convertedFields = fields.map(f => common30385a2e_node.isString$1(f) ? common30385a2e_node.field(f) : f);
        // Create stage object
        const stage = new common30385a2e_node.RemoveFields(convertedFields, options);
        // Add stage to the pipeline
        return this._addStage(stage);
    }
    define(aliasedExpressionOrOptions, ...additionalExpressions) {
        // Process argument union(s) from method overloads
        const options = common30385a2e_node.isAliasedExpr(aliasedExpressionOrOptions)
            ? {}
            : aliasedExpressionOrOptions;
        const aliasedExpressions = common30385a2e_node.isAliasedExpr(aliasedExpressionOrOptions)
            ? [aliasedExpressionOrOptions, ...additionalExpressions]
            : aliasedExpressionOrOptions.variables;
        const convertedExpressions = selectablesToMap(aliasedExpressions);
        // Create stage object
        const stage = new common30385a2e_node.Define(convertedExpressions, options);
        return this._addStage(stage);
    }
    /**
     * Converts this Pipeline into an expression that evaluates to an array of results.
     *
     * <p>Result Unwrapping:</p>
     * <ul>
     *  <li>If the items have a single field, their values are unwrapped and returned directly in the array.</li>
     *  <li>If the items have multiple fields, they are returned as objects in the array</li>
     * </ul>
     *
     * @example
     * ```typescript
     * // Get a list of reviewers for each book
     * db.pipeline().collection("books")
     *     .define(field("id").as("book_id"))
     *     .addFields(
     *         db.pipeline().collection("reviews")
     *             .where(field("book_id").equal(variable("book_id")))
     *             .select(field("reviewer"))
     *             .toArrayExpression()
     *             .as("reviewers")
     *     )
     * ```
     *
     * Output:
     * ```json
     * [
     *   {
     *     "id": "1",
     *     "title": "1984",
     *     "reviewers": ["Alice", "Bob"]
     *   }
     * ]
     * ```
     *
     * Multiple Fields:
     * ```typescript
     * // Get a list of reviews (reviewer and rating) for each book
     * db.pipeline().collection("books")
     *     .define(field("id").as("book_id"))
     *     .addFields(
     *         db.pipeline().collection("reviews")
     *             .where(field("book_id").equal(variable("book_id")))
     *             .select(field("reviewer"), field("rating"))
     *             .toArrayExpression()
     *             .as("reviews"))
     * ```
     *
     * Output:
     * ```json
     * [
     *   {
     *     "id": "1",
     *     "title": "1984",
     *     "reviews": [
     *       { "reviewer": "Alice", "rating": 5 },
     *       { "reviewer": "Bob", "rating": 4 }
     *     ]
     *   }
     * ]
     * ```
     *
     * @returns An `Expression` representing the execution of this pipeline.
     */
    toArrayExpression() {
        return new common30385a2e_node.FunctionExpression('array', [fieldOrExpression(this)]);
    }
    /**
     * Converts this Pipeline into an expression that evaluates to a single scalar result.
     *
     * <p><b>Runtime Validation:</b> The runtime validates that the result set contains zero or one item. If
     * zero items, it evaluates to `null`.</p>
     *
     * <p>Result Unwrapping:</p>
     * <ul>
     *  <li>If the item has a single field, its value is unwrapped and returned directly.</li>
     *  <li>If the item has multiple fields, they are returned as an object.</li>
     * </ul>
     *
     * @example
     * ```typescript
     * // Calculate average rating for a restaurant
     * db.pipeline().collection("restaurants").addFields(
     *   db.pipeline().collection("reviews")
     *     .where(field("restaurant_id").equal(variable("rid")))
     *     .aggregate(average("rating").as("avg"))
     *     // Unwraps the single "avg" field to a scalar double
     *     .toScalarExpression().as("average_rating")
     * )
     * ```
     *
     * Output:
     * ```json
     * {
     *   "name": "The Burger Joint",
     *   "average_rating": 4.5
     * }
     * ```
     *
     * Multiple Fields:
     * ```typescript
     * // Calculate average rating AND count for a restaurant
     * db.pipeline().collection("restaurants").addFields(
     *   db.pipeline().collection("reviews")
     *     .where(field("restaurant_id").equal(variable("rid")))
     *     .aggregate(
     *       average("rating").as("avg"),
     *       count().as("count")
     *     )
     *     // Returns an object with "avg" and "count" fields
     *     .toScalarExpression().as("stats")
     * )
     * ```
     *
     * Output:
     * ```json
     * {
     *   "name": "The Burger Joint",
     *   "stats": {
     *     "avg": 4.5,
     *     "count": 100
     *   }
     * }
     * ```
     *
     * @returns An `Expression` representing the execution of this pipeline.
     */
    toScalarExpression() {
        return new common30385a2e_node.FunctionExpression('scalar', [fieldOrExpression(this)]);
    }
    select(selectionOrOptions, ...additionalSelections) {
        // Process argument union(s) from method overloads
        const options = common30385a2e_node.isSelectable(selectionOrOptions) || common30385a2e_node.isString$1(selectionOrOptions)
            ? {}
            : selectionOrOptions;
        const selections = common30385a2e_node.isSelectable(selectionOrOptions) || common30385a2e_node.isString$1(selectionOrOptions)
            ? [selectionOrOptions, ...additionalSelections]
            : selectionOrOptions.selections;
        // Convert user land convenience types to internal types
        const normalizedSelections = selectablesToMap(selections);
        // Create stage object
        const stage = new common30385a2e_node.Select(normalizedSelections, options);
        // Add stage to the pipeline
        return this._addStage(stage);
    }
    where(conditionOrOptions) {
        // Process argument union(s) from method overloads
        const options = common30385a2e_node.isBooleanExpr(conditionOrOptions) ? {} : conditionOrOptions;
        const condition = common30385a2e_node.isBooleanExpr(conditionOrOptions)
            ? conditionOrOptions
            : conditionOrOptions.condition;
        // Create stage object
        const stage = new common30385a2e_node.Where(condition, options);
        // Add stage to the pipeline
        return this._addStage(stage);
    }
    offset(offsetOrOptions) {
        // Process argument union(s) from method overloads
        let options;
        let offset;
        if (common30385a2e_node.isNumber$1(offsetOrOptions)) {
            options = {};
            offset = offsetOrOptions;
        }
        else {
            options = offsetOrOptions;
            offset = offsetOrOptions.offset;
        }
        // Create stage object
        const stage = new common30385a2e_node.Offset(offset, options);
        // Add stage to the pipeline
        return this._addStage(stage);
    }
    limit(limitOrOptions) {
        // Process argument union(s) from method overloads
        const options = common30385a2e_node.isNumber$1(limitOrOptions) ? {} : limitOrOptions;
        const limit = common30385a2e_node.isNumber$1(limitOrOptions)
            ? limitOrOptions
            : limitOrOptions.limit;
        // Create stage object
        const stage = new common30385a2e_node.Limit(limit, options);
        // Add stage to the pipeline
        return this._addStage(stage);
    }
    distinct(groupOrOptions, ...additionalGroups) {
        // Process argument union(s) from method overloads
        const options = common30385a2e_node.isString$1(groupOrOptions) || common30385a2e_node.isSelectable(groupOrOptions)
            ? {}
            : groupOrOptions;
        const groups = common30385a2e_node.isString$1(groupOrOptions) || common30385a2e_node.isSelectable(groupOrOptions)
            ? [groupOrOptions, ...additionalGroups]
            : groupOrOptions.groups;
        // Convert user land convenience types to internal types
        const convertedGroups = selectablesToMap(groups);
        // Create stage object
        const stage = new common30385a2e_node.Distinct(convertedGroups, options);
        // Add stage to the pipeline
        return this._addStage(stage);
    }
    aggregate(targetOrOptions, ...rest) {
        // Process argument union(s) from method overloads
        const options = common30385a2e_node.isAliasedAggregate(targetOrOptions) ? {} : targetOrOptions;
        const accumulators = common30385a2e_node.isAliasedAggregate(targetOrOptions)
            ? [targetOrOptions, ...rest]
            : targetOrOptions.accumulators;
        const groups = common30385a2e_node.isAliasedAggregate(targetOrOptions)
            ? []
            : targetOrOptions.groups ?? [];
        // Convert user land convenience types to internal types
        const convertedAccumulators = aliasedAggregateToMap(accumulators);
        const convertedGroups = selectablesToMap(groups);
        // Create stage object
        const stage = new common30385a2e_node.Aggregate(convertedGroups, convertedAccumulators, options);
        // Add stage to the pipeline
        return this._addStage(stage);
    }
    /**
     * Performs a vector proximity search on the documents from the previous stage, returning the
     * K-nearest documents based on the specified query `vectorValue` and `distanceMeasure`. The
     * returned documents will be sorted in order from nearest to furthest from the query `vectorValue`.
     *
     * @example
     * ```typescript
     * // Find the 10 most similar books based on the book description.
     * const bookDescription = "Lorem ipsum...";
     * const queryVector: number[] = ...; // compute embedding of `bookDescription`
     *
     * firestore.pipeline().collection("books")
     *     .findNearest({
     *       field: 'embedding',
     *       vectorValue: queryVector,
     *       distanceMeasure: 'euclidean',
     *       limit: 10,                        // optional
     *       distanceField: 'computedDistance' // optional
     *     });
     * ```
     *
     * @param options - An object that specifies required and optional parameters for the stage.
     * @returns A new {@link @firebase/firestore/pipelines#Pipeline} object with this stage appended to the stage list.
     */
    findNearest(options) {
        // Convert user land convenience types to internal types
        const field = common30385a2e_node.toField(options.field);
        const vectorValue = vectorToExpr(options.vectorValue);
        const distanceField = options.distanceField
            ? common30385a2e_node.toField(options.distanceField)
            : undefined;
        const internalOptions = {
            distanceField,
            limit: options.limit,
            rawOptions: options.rawOptions
        };
        // Create stage object
        const stage = new common30385a2e_node.FindNearest(vectorValue, field, options.distanceMeasure, internalOptions);
        // Add stage to the pipeline
        return this._addStage(stage);
    }
    // TODO(search) link to external documentation citing list of supported
    // expressions, when that documentation is created. List is not maintained
    // in the SDK because the list will change as the backend enables support.
    /**
     * Add a search stage to the Pipeline. The search stage supports
     * full-text search and geo search expressions.
     *
     * @remarks
     * This must be the first stage of the pipeline. A limited set of expressions are supported in the search stage.
     *
     * @example
     * ```typescript
     * // Full-text search example
     * firestore.pipeline().collection("restaurants")
     * .search({
     *   query: documentMatches("waffles OR pancakes"),
     *   sort: [
     *     score().descending(),
     *   ],
     *   addFields: [
     *     score().as("searchScore"),
     *   ]
     * })
     * ```
     *
     * @example
     * ```typescript
     * // Geo distance search example
     * const queryLocation = new GeoPoint(0, 0);
     * db.pipeline().collection('restaurants').search({
     *   query: field('location').geoDistance(queryLocation).lessThanOrEqual(1000),
     *   sort: [
     *     score().descending(),
     *   ],
     * })
     * ```
     *
     * @param options - An object that specifies parameters for the stage.
     * @return A new `Pipeline` object with this stage appended to the stage list.
     * @beta
     */
    search(options) {
        // Convert user land convenience types to internal types
        const addFields = options.addFields
            ? selectablesToObject(options.addFields)
            : undefined;
        const query = common30385a2e_node.isExpr(options.query)
            ? options.query
            : common30385a2e_node.documentMatches(options.query);
        const sort = common30385a2e_node.isOrdering(options.sort)
            ? [options.sort]
            : options.sort;
        const select = undefined;
        // TODO(search) enable with backend support
        // select = options.select
        //   ? selectablesToObject(options.select)
        //   : undefined;
        const internalOptions = {
            ...options,
            addFields,
            select,
            query,
            sort
        };
        // Create stage object
        const stage = new common30385a2e_node.Search(internalOptions);
        // Add stage to the pipeline
        return this._addStage(stage);
    }
    sort(orderingOrOptions, ...additionalOrderings) {
        // Process argument union(s) from method overloads
        const options = common30385a2e_node.isOrdering(orderingOrOptions) ? {} : orderingOrOptions;
        const orderings = common30385a2e_node.isOrdering(orderingOrOptions)
            ? [orderingOrOptions, ...additionalOrderings]
            : orderingOrOptions.orderings;
        // Create stage object
        const stage = new common30385a2e_node.Sort(orderings, options);
        // Add stage to the pipeline
        return this._addStage(stage);
    }
    replaceWith(valueOrOptions) {
        // Process argument union(s) from method overloads
        const options = common30385a2e_node.isString$1(valueOrOptions) || common30385a2e_node.isExpr(valueOrOptions) ? {} : valueOrOptions;
        const fieldNameOrExpr = common30385a2e_node.isString$1(valueOrOptions) || common30385a2e_node.isExpr(valueOrOptions)
            ? valueOrOptions
            : valueOrOptions.map;
        // Convert user land convenience types to internal types
        const mapExpr = fieldOrExpression(fieldNameOrExpr);
        // Create stage object
        const stage = new common30385a2e_node.Replace(mapExpr, options);
        // Add stage to the pipeline
        return this._addStage(stage);
    }
    sample(documentsOrOptions) {
        // Process argument union(s) from method overloads
        const options = common30385a2e_node.isNumber$1(documentsOrOptions) ? {} : documentsOrOptions;
        let rate;
        let mode;
        if (common30385a2e_node.isNumber$1(documentsOrOptions)) {
            rate = documentsOrOptions;
            mode = 'documents';
        }
        else if (common30385a2e_node.isNumber$1(documentsOrOptions.documents)) {
            rate = documentsOrOptions.documents;
            mode = 'documents';
        }
        else {
            rate = documentsOrOptions.percentage;
            mode = 'percent';
        }
        // Create stage object
        const stage = new common30385a2e_node.Sample(rate, mode, options);
        // Add stage to the pipeline
        return this._addStage(stage);
    }
    union(otherOrOptions) {
        // Process argument union(s) from method overloads
        let options;
        let otherPipeline;
        if (isPipeline(otherOrOptions)) {
            options = {};
            otherPipeline = otherOrOptions;
        }
        else {
            ({ other: otherPipeline, ...options } = otherOrOptions);
        }
        // Create stage object
        const stage = new common30385a2e_node.Union(otherPipeline, options);
        // Add stage to the pipeline
        return this._addStage(stage);
    }
    unnest(selectableOrOptions, indexField) {
        // Process argument union(s) from method overloads
        let options;
        let selectable;
        let indexFieldName;
        if (common30385a2e_node.isSelectable(selectableOrOptions)) {
            options = {};
            selectable = selectableOrOptions;
            indexFieldName = indexField;
        }
        else {
            ({
                selectable,
                indexField: indexFieldName,
                ...options
            } = selectableOrOptions);
        }
        // Convert user land convenience types to internal types
        const alias = selectable.alias;
        const expr = selectable.expr;
        if (common30385a2e_node.isString$1(indexFieldName)) {
            options.indexField = common30385a2e_node._field(indexFieldName, 'unnest');
        }
        // Create stage object
        const stage = new common30385a2e_node.Unnest(alias, expr, options);
        // Add stage to the pipeline
        return this._addStage(stage);
    }
    /**
     * Adds a raw stage to the pipeline.
     *
     * <p>This method provides a flexible way to extend the pipeline's functionality by adding custom
     * stages. Each raw stage is defined by a unique `name` and a set of `params` that control its
     * behavior.
     *
     * <p>Example (Assuming there is no 'where' stage available in SDK):
     *
     * @example
     * ```typescript
     * // Assume we don't have a built-in 'where' stage
     * firestore.pipeline().collection('books')
     *     .rawStage('where', [field('published').lessThan(1900)]) // Custom 'where' stage
     *     .select('title', 'author');
     * ```
     *
     * @param name - The unique name of the raw stage to add.
     * @param params - A list of parameters to configure the raw stage's behavior.
     * @param options - An object of key value pairs that specifies optional parameters for the stage.
     * @returns A new {@link @firebase/firestore/pipelines#Pipeline} object with this stage appended to the stage list.
     */
    rawStage(name, params, options) {
        // Convert user land convenience types to internal types
        const expressionParams = params.map((value) => {
            if (value instanceof common30385a2e_node.Expression) {
                return value;
            }
            else if (value instanceof common30385a2e_node.AggregateFunction) {
                return value;
            }
            else if (common30385a2e_node.isPlainObject(value)) {
                return common30385a2e_node._mapValue(value);
            }
            else {
                return common30385a2e_node._constant(value, 'rawStage');
            }
        });
        // Create stage object
        const stage = new common30385a2e_node.RawStage(name, expressionParams, options ?? {});
        // Add stage to the pipeline
        return this._addStage(stage);
    }
    /**
     * @internal
     * @private
     */
    _toProto(jsonProtoSerializer) {
        const stages = this.stages.map(stage => stage._toProto(jsonProtoSerializer));
        return { stages };
    }
    _addStage(stage) {
        const copy = this.stages.map(s => s);
        copy.push(stage);
        return this.newPipeline(this._db, copy);
    }
    /**
     * @internal
     * @private
     * @param db
     * @param userDataReader
     * @param userDataWriter
     * @param stages
     * @protected
     */
    newPipeline(db, stages) {
        return new Pipeline$1(db, this.userDataReader, this._userDataWriter, stages);
    }
}
function isPipeline(val) {
    return val instanceof Pipeline$1;
}

/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Provides the entry point for defining the data source of a Firestore {@link @firebase/firestore/pipelines#Pipeline}.
 *
 * Use the methods of this class (e.g., {@link @firebase/firestore/pipelines#PipelineSource.(collection:1)}, {@link @firebase/firestore/pipelines#PipelineSource.(collectionGroup:1)},
 * {@link @firebase/firestore/pipelines#PipelineSource.(database:1)}, or {@link @firebase/firestore/pipelines#PipelineSource.(documents:1)}) to specify the initial data
 * for your pipeline, such as a collection, a collection group, the entire database, or a set of specific documents.
 */
class PipelineSource {
    /**
     * @internal
     * @private
     * @param databaseId
     * @param userDataReader
     * @param _createPipeline
     */
    constructor(databaseId, userDataReader, 
    /**
     * @internal
     * @private
     */
    _createPipeline) {
        this.databaseId = databaseId;
        this.userDataReader = userDataReader;
        this._createPipeline = _createPipeline;
    }
    collection(collectionOrOptions) {
        // Process argument union(s) from method overloads
        const options = common30385a2e_node.isString$1(collectionOrOptions) ||
            common30385a2e_node.isCollectionReference(collectionOrOptions)
            ? {}
            : collectionOrOptions;
        const collectionRefOrString = common30385a2e_node.isString$1(collectionOrOptions) ||
            common30385a2e_node.isCollectionReference(collectionOrOptions)
            ? collectionOrOptions
            : collectionOrOptions.collection;
        // Validate that a user provided reference is for the same Firestore DB
        if (common30385a2e_node.isCollectionReference(collectionRefOrString)) {
            this._validateReference(collectionRefOrString);
        }
        // Convert user land convenience types to internal types
        const normalizedCollection = common30385a2e_node.isString$1(collectionRefOrString)
            ? collectionRefOrString
            : collectionRefOrString.path;
        // Create stage object
        const stage = new common30385a2e_node.CollectionSource(normalizedCollection, options);
        // User data must be read in the context of the API method to
        // provide contextual errors
        const parseContext = this.userDataReader.createContext(3 /* UserDataSource.Argument */, 'collection');
        stage._readUserData(parseContext);
        // Add stage to the pipeline
        return this._createPipeline([stage]);
    }
    collectionGroup(collectionIdOrOptions) {
        // Process argument union(s) from method overloads
        let collectionId;
        let options;
        if (common30385a2e_node.isString$1(collectionIdOrOptions)) {
            collectionId = collectionIdOrOptions;
            options = {};
        }
        else {
            ({ collectionId, ...options } = collectionIdOrOptions);
        }
        // Create stage object
        const stage = new common30385a2e_node.CollectionGroupSource(collectionId, options);
        // User data must be read in the context of the API method to
        // provide contextual errors
        const parseContext = this.userDataReader.createContext(3 /* UserDataSource.Argument */, 'collectionGroup');
        stage._readUserData(parseContext);
        // Add stage to the pipeline
        return this._createPipeline([stage]);
    }
    database(options) {
        // Process argument union(s) from method overloads
        options = options ?? {};
        // Create stage object
        const stage = new common30385a2e_node.DatabaseSource(options);
        // User data must be read in the context of the API method to
        // provide contextual errors
        const parseContext = this.userDataReader.createContext(3 /* UserDataSource.Argument */, 'database');
        stage._readUserData(parseContext);
        // Add stage to the pipeline
        return this._createPipeline([stage]);
    }
    documents(docsOrOptions) {
        // Process argument union(s) from method overloads
        let options;
        let docs;
        if (Array.isArray(docsOrOptions)) {
            docs = docsOrOptions;
            options = {};
        }
        else {
            ({ docs, ...options } = docsOrOptions);
        }
        // Validate that all user provided references are for the same Firestore DB
        docs
            .filter(v => v instanceof common30385a2e_node.DocumentReference)
            .forEach(dr => this._validateReference(dr));
        // Convert user land convenience types to internal types
        const normalizedDocs = docs.map(doc => common30385a2e_node.isString$1(doc) ? doc : doc.path);
        // Create stage object
        const stage = new common30385a2e_node.DocumentsSource(normalizedDocs, options);
        // User data must be read in the context of the API method to
        // provide contextual errors
        const parseContext = this.userDataReader.createContext(3 /* UserDataSource.Argument */, 'documents');
        stage._readUserData(parseContext);
        // Add stage to the pipeline
        return this._createPipeline([stage]);
    }
    /**
     * Convert the given Query into an equivalent Pipeline.
     *
     * @param query - A Query to be converted into a Pipeline.
     *
     * @throws `FirestoreError` Thrown if any of the provided DocumentReferences target a different project or database than the pipeline.
     */
    createFrom(query) {
        return this._createPipeline(common30385a2e_node.toPipelineStages(query._query, query.firestore));
    }
    _validateReference(reference) {
        const refDbId = reference.firestore._databaseId;
        if (!refDbId.isEqual(this.databaseId)) {
            throw new common30385a2e_node.FirestoreError(common30385a2e_node.Code.INVALID_ARGUMENT, `Invalid ${reference instanceof common30385a2e_node.CollectionReference
                ? 'CollectionReference'
                : 'DocumentReference'}. ` +
                `The project ID ("${refDbId.projectId}") or the database ("${refDbId.database}") does not match ` +
                `the project ID ("${this.databaseId.projectId}") and database ("${this.databaseId.database}") of the target database of this Pipeline.`);
        }
    }
}
function subcollection(pathOrOptions) {
    // Process argument union(s) from method overloads
    let path;
    let options;
    if (common30385a2e_node.isString$1(pathOrOptions)) {
        path = pathOrOptions;
        options = {};
    }
    else {
        ({ path, ...options } = pathOrOptions);
    }
    // Create stage object
    const stage = new common30385a2e_node.SubcollectionSource(path, options);
    return new Pipeline$1(undefined, undefined, undefined, [stage]);
}

/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Pipeline extends Pipeline$1 {
    /**
     * @internal
     * @private
     * @param db
     * @param userDataReader
     * @param userDataWriter
     * @param stages
     * @param converter
     * @protected
     */
    newPipeline(db, stages) {
        return new Pipeline(db, this.userDataReader, this._userDataWriter, stages);
    }
}

/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function execute(pipelineOrOptions) {
    const options = !(pipelineOrOptions instanceof Pipeline$1)
        ? pipelineOrOptions
        : {
            pipeline: pipelineOrOptions
        };
    const { pipeline, rawOptions, ...rest } = options;
    if (!pipeline._db) {
        return Promise.reject(new common30385a2e_node.FirestoreError(common30385a2e_node.Code.FAILED_PRECONDITION, 'This pipeline was created without a database (e.g., as a subcollection pipeline) and cannot be executed directly. It can only be used as part of another pipeline.'));
    }
    const firestore = common30385a2e_node.cast(pipeline._db, common30385a2e_node.Firestore);
    const client = common30385a2e_node.ensureFirestoreConfigured(firestore);
    const userDataReader = common30385a2e_node.newUserDataReader(firestore);
    const context = userDataReader.createContext(3 /* UserDataSource.Argument */, 'execute');
    pipeline._readUserData(context);
    const userDataWriter = new common30385a2e_node.ExpUserDataWriter(firestore);
    const structuredPipelineOptions = new common30385a2e_node.StructuredPipelineOptions(rest, rawOptions);
    structuredPipelineOptions._readUserData(context);
    const structuredPipeline = new common30385a2e_node.StructuredPipeline(pipeline, structuredPipelineOptions);
    return common30385a2e_node.firestoreClientExecutePipeline(client, structuredPipeline).then(result => {
        // Get the execution time from the first result.
        // firestoreClientExecutePipeline returns at least one PipelineStreamElement
        // even if the returned document set is empty.
        const executionTime = result.length > 0 ? result[0].executionTime?.toTimestamp() : undefined;
        const docs = result
            // Currently ignore any response from ExecutePipeline that does
            // not contain any document data in the `fields` property.
            .filter(element => !!element.fields)
            .map(element => new PipelineResult(userDataWriter, element.fields, element.key?.path
            ? new common30385a2e_node.DocumentReference(firestore, null, element.key)
            : undefined, element.createTime?.toTimestamp(), element.updateTime?.toTimestamp()));
        return new PipelineSnapshot(pipeline, docs, executionTime);
    });
}
/**
 * @beta
 * Creates and returns a new PipelineSource, which allows specifying the source stage of a {@link @firebase/firestore/pipelines#Pipeline}.
 *
 * @example
 * ```typescript
 * let myPipeline: Pipeline = firestore.pipeline().collection('books');
 * ```
 */
// Augment the Firestore class with the pipeline() factory method
common30385a2e_node.Firestore.prototype.pipeline = function () {
    const userDataReader = common30385a2e_node.newUserDataReader(this);
    return new PipelineSource(this._databaseId, userDataReader, (stages) => {
        return new Pipeline(this, userDataReader, new common30385a2e_node.ExpUserDataWriter(this), stages);
    });
};

exports.AggregateFunction = common30385a2e_node.AggregateFunction;
exports.AliasedAggregate = common30385a2e_node.AliasedAggregate;
exports.AliasedExpression = common30385a2e_node.AliasedExpression;
exports.BooleanExpression = common30385a2e_node.BooleanExpression;
exports.Expression = common30385a2e_node.Expression;
exports.Field = common30385a2e_node.Field;
exports.FunctionExpression = common30385a2e_node.FunctionExpression;
exports.Ordering = common30385a2e_node.Ordering;
exports._internalPipelineToExecutePipelineRequestProto = common30385a2e_node._internalPipelineToExecutePipelineRequestProto;
exports.abs = common30385a2e_node.abs;
exports.add = common30385a2e_node.add;
exports.and = common30385a2e_node.and;
exports.array = common30385a2e_node.array;
exports.arrayAgg = common30385a2e_node.arrayAgg;
exports.arrayAggDistinct = common30385a2e_node.arrayAggDistinct;
exports.arrayConcat = common30385a2e_node.arrayConcat;
exports.arrayContains = common30385a2e_node.arrayContains;
exports.arrayContainsAll = common30385a2e_node.arrayContainsAll;
exports.arrayContainsAny = common30385a2e_node.arrayContainsAny;
exports.arrayFilter = common30385a2e_node.arrayFilter;
exports.arrayFirst = common30385a2e_node.arrayFirst;
exports.arrayFirstN = common30385a2e_node.arrayFirstN;
exports.arrayGet = common30385a2e_node.arrayGet;
exports.arrayIndexOf = common30385a2e_node.arrayIndexOf;
exports.arrayIndexOfAll = common30385a2e_node.arrayIndexOfAll;
exports.arrayLast = common30385a2e_node.arrayLast;
exports.arrayLastIndexOf = common30385a2e_node.arrayLastIndexOf;
exports.arrayLastN = common30385a2e_node.arrayLastN;
exports.arrayLength = common30385a2e_node.arrayLength;
exports.arrayMaximum = common30385a2e_node.arrayMaximum;
exports.arrayMaximumN = common30385a2e_node.arrayMaximumN;
exports.arrayMinimum = common30385a2e_node.arrayMinimum;
exports.arrayMinimumN = common30385a2e_node.arrayMinimumN;
exports.arraySlice = common30385a2e_node.arraySlice;
exports.arraySum = common30385a2e_node.arraySum;
exports.arrayTransform = common30385a2e_node.arrayTransform;
exports.arrayTransformWithIndex = common30385a2e_node.arrayTransformWithIndex;
exports.ascending = common30385a2e_node.ascending;
exports.average = common30385a2e_node.average;
exports.byteLength = common30385a2e_node.byteLength;
exports.ceil = common30385a2e_node.ceil;
exports.charLength = common30385a2e_node.charLength;
exports.coalesce = common30385a2e_node.coalesce;
exports.collectionId = common30385a2e_node.collectionId;
exports.concat = common30385a2e_node.concat;
exports.conditional = common30385a2e_node.conditional;
exports.constant = common30385a2e_node.constant;
exports.cosineDistance = common30385a2e_node.cosineDistance;
exports.count = common30385a2e_node.count;
exports.countAll = common30385a2e_node.countAll;
exports.countDistinct = common30385a2e_node.countDistinct;
exports.countIf = common30385a2e_node.countIf;
exports.currentDocument = common30385a2e_node.currentDocument;
exports.currentTimestamp = common30385a2e_node.currentTimestamp;
exports.descending = common30385a2e_node.descending;
exports.divide = common30385a2e_node.divide;
exports.documentId = common30385a2e_node.documentId;
exports.documentMatches = common30385a2e_node.documentMatches;
exports.dotProduct = common30385a2e_node.dotProduct;
exports.endsWith = common30385a2e_node.endsWith;
exports.equal = common30385a2e_node.equal;
exports.equalAny = common30385a2e_node.equalAny;
exports.euclideanDistance = common30385a2e_node.euclideanDistance;
exports.exists = common30385a2e_node.exists;
exports.exp = common30385a2e_node.exp;
exports.field = common30385a2e_node.field;
exports.first = common30385a2e_node.first;
exports.floor = common30385a2e_node.floor;
exports.geoDistance = common30385a2e_node.geoDistance;
exports.greaterThan = common30385a2e_node.greaterThan;
exports.greaterThanOrEqual = common30385a2e_node.greaterThanOrEqual;
exports.ifAbsent = common30385a2e_node.ifAbsent;
exports.ifError = common30385a2e_node.ifError;
exports.ifNull = common30385a2e_node.ifNull;
exports.isAbsent = common30385a2e_node.isAbsent;
exports.isError = common30385a2e_node.isError;
exports.isType = common30385a2e_node.isType;
exports.join = common30385a2e_node.join;
exports.last = common30385a2e_node.last;
exports.length = common30385a2e_node.length;
exports.lessThan = common30385a2e_node.lessThan;
exports.lessThanOrEqual = common30385a2e_node.lessThanOrEqual;
exports.like = common30385a2e_node.like;
exports.ln = common30385a2e_node.ln;
exports.log = common30385a2e_node.log;
exports.log10 = common30385a2e_node.log10;
exports.logicalMaximum = common30385a2e_node.logicalMaximum;
exports.logicalMinimum = common30385a2e_node.logicalMinimum;
exports.ltrim = common30385a2e_node.ltrim;
exports.map = common30385a2e_node.map;
exports.mapEntries = common30385a2e_node.mapEntries;
exports.mapGet = common30385a2e_node.mapGet;
exports.mapKeys = common30385a2e_node.mapKeys;
exports.mapMerge = common30385a2e_node.mapMerge;
exports.mapRemove = common30385a2e_node.mapRemove;
exports.mapSet = common30385a2e_node.mapSet;
exports.mapValues = common30385a2e_node.mapValues;
exports.maximum = common30385a2e_node.maximum;
exports.minimum = common30385a2e_node.minimum;
exports.mod = common30385a2e_node.mod;
exports.multiply = common30385a2e_node.multiply;
exports.nor = common30385a2e_node.nor;
exports.not = common30385a2e_node.not;
exports.notEqual = common30385a2e_node.notEqual;
exports.notEqualAny = common30385a2e_node.notEqualAny;
exports.or = common30385a2e_node.or;
exports.parent = common30385a2e_node.parent;
exports.pow = common30385a2e_node.pow;
exports.rand = common30385a2e_node.rand;
exports.regexContains = common30385a2e_node.regexContains;
exports.regexFind = common30385a2e_node.regexFind;
exports.regexFindAll = common30385a2e_node.regexFindAll;
exports.regexMatch = common30385a2e_node.regexMatch;
exports.reverse = common30385a2e_node.reverse;
exports.round = common30385a2e_node.round;
exports.rtrim = common30385a2e_node.rtrim;
exports.score = common30385a2e_node.score;
exports.split = common30385a2e_node.split;
exports.sqrt = common30385a2e_node.sqrt;
exports.startsWith = common30385a2e_node.startsWith;
exports.stringConcat = common30385a2e_node.stringConcat;
exports.stringContains = common30385a2e_node.stringContains;
exports.stringIndexOf = common30385a2e_node.stringIndexOf;
exports.stringRepeat = common30385a2e_node.stringRepeat;
exports.stringReplaceAll = common30385a2e_node.stringReplaceAll;
exports.stringReplaceOne = common30385a2e_node.stringReplaceOne;
exports.stringReverse = common30385a2e_node.stringReverse;
exports.substring = common30385a2e_node.substring;
exports.subtract = common30385a2e_node.subtract;
exports.sum = common30385a2e_node.sum;
exports.switchOn = common30385a2e_node.switchOn;
exports.timestampAdd = common30385a2e_node.timestampAdd;
exports.timestampDiff = common30385a2e_node.timestampDiff;
exports.timestampExtract = common30385a2e_node.timestampExtract;
exports.timestampSubtract = common30385a2e_node.timestampSubtract;
exports.timestampToUnixMicros = common30385a2e_node.timestampToUnixMicros;
exports.timestampToUnixMillis = common30385a2e_node.timestampToUnixMillis;
exports.timestampToUnixSeconds = common30385a2e_node.timestampToUnixSeconds;
exports.timestampTruncate = common30385a2e_node.timestampTruncate;
exports.toLower = common30385a2e_node.toLower;
exports.toUpper = common30385a2e_node.toUpper;
exports.trim = common30385a2e_node.trim;
exports.trunc = common30385a2e_node.trunc;
exports.type = common30385a2e_node.type;
exports.unixMicrosToTimestamp = common30385a2e_node.unixMicrosToTimestamp;
exports.unixMillisToTimestamp = common30385a2e_node.unixMillisToTimestamp;
exports.unixSecondsToTimestamp = common30385a2e_node.unixSecondsToTimestamp;
exports.variable = common30385a2e_node.variable;
exports.vectorLength = common30385a2e_node.vectorLength;
exports.xor = common30385a2e_node.xor;
exports.Pipeline = Pipeline;
exports.PipelineResult = PipelineResult;
exports.PipelineSnapshot = PipelineSnapshot;
exports.PipelineSource = PipelineSource;
exports.execute = execute;
exports.pipelineResultEqual = pipelineResultEqual;
exports.subcollection = subcollection;
//# sourceMappingURL=pipelines.node.cjs.js.map
