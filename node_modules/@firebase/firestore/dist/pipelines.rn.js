import { b9 as l, ba as u, bb as w, a4 as wt, l as E, bc as x, aW as y, bd as A, aT as D, be as F, bf as z, bg as Q, bh as X, bi as se, bj as ae, bk as ne, bl as ie, bm as re, bn as oe, bo as le, bp as ue, bq as pe, br as he, bs as be, bt as me, bu as fe, bv as we, bw as ge, bx as _e, by as Te, bz as Pe, bA as xe, bB as ye, bC as Ee, bD as Ae, bE as Re, bF as Ie, bG as ve, bH as Me, bI as Oe, bJ as Ve, bK as De, bL as Se, bM as Fe, bN as $e, bO as je, bP as qe, d as p, bQ as Le, aM as Ce, bR as Ne, bS as Ue, bT as We, bU as Ge, D as d, bV as ke, bW as ze, m as C, aL as Be, bX as He, y as j, F as a, z as U, f as m, H as K, bY as Ke, bZ as Je, b_ as Qe } from "./common-6f0c4090.rn.js";

export { bN as AggregateFunction, ea as AliasedAggregate, bb as AliasedExpression, e9 as BooleanExpression, bc as Expression, ba as Field, br as FunctionExpression, e8 as Ordering, eb as _internalPipelineToExecutePipelineRequestProto, dU as abs, b$ as add, d9 as and, bi as array, df as arrayAgg, dg as arrayAggDistinct, ca as arrayConcat, cb as arrayContains, cd as arrayContainsAll, cc as arrayContainsAny, ce as arrayFilter, ch as arrayFirst, ci as arrayFirstN, cj as arrayGet, cl as arrayIndexOf, cm as arrayIndexOfAll, cn as arrayLast, co as arrayLastIndexOf, cp as arrayLastN, cq as arrayLength, cr as arrayMaximum, cs as arrayMaximumN, ct as arrayMinimum, cu as arrayMinimumN, ck as arraySlice, e0 as arraySum, cf as arrayTransform, cg as arrayTransformWithIndex, dv as ascending, d8 as average, cG as byteLength, dH as ceil, cH as charLength, dZ as coalesce, dN as collectionId, dV as concat, cA as conditional, bd as constant, dh as cosineDistance, d6 as count, d5 as countAll, dG as countDistinct, dx as countIf, e5 as currentDocument, dW as currentTimestamp, dw as descending, c2 as divide, dD as documentId, bE as documentMatches, di as dotProduct, cP as endsWith, c4 as equal, cv as equalAny, dj as euclideanDistance, cE as exists, dJ as exp, b9 as field, dd as first, dI as floor, e7 as geoDistance, c8 as greaterThan, c9 as greaterThanOrEqual, dX as ifAbsent, dz as ifError, dY as ifNull, dA as isAbsent, dy as isError, cW as isType, d_ as join, de as last, dT as length, c6 as lessThan, c7 as lessThanOrEqual, cI as like, dO as ln, dP as log, d$ as log10, cC as logicalMaximum, cD as logicalMinimum, cT as ltrim, bh as map, d4 as mapEntries, d0 as mapGet, d2 as mapKeys, dC as mapMerge, dB as mapRemove, d1 as mapSet, d3 as mapValues, dc as maximum, db as minimum, c3 as mod, c1 as multiply, cy as nor, cB as not, c5 as notEqual, cw as notEqualAny, da as or, dE as parent, dK as pow, dL as rand, cJ as regexContains, cK as regexFind, cL as regexFindAll, cM as regexMatch, cF as reverse, dM as round, cU as rtrim, e6 as score, e3 as split, dQ as sqrt, cO as startsWith, cX as stringConcat, cN as stringContains, cY as stringIndexOf, cZ as stringRepeat, c_ as stringReplaceAll, c$ as stringReplaceOne, dS as stringReverse, dF as substring, c0 as subtract, d7 as sum, cz as switchOn, ds as timestampAdd, du as timestampDiff, e2 as timestampExtract, dt as timestampSubtract, dm as timestampToUnixMicros, dp as timestampToUnixMillis, dr as timestampToUnixSeconds, e1 as timestampTruncate, cQ as toLower, cR as toUpper, cS as trim, dR as trunc, cV as type, dl as unixMicrosToTimestamp, dn as unixMillisToTimestamp, dq as unixSecondsToTimestamp, e4 as variable, dk as vectorLength, cx as xor } from "./common-6f0c4090.rn.js";

import "@firebase/app";

import "@firebase/util";

import "@firebase/webchannel-wrapper/bloom-blob";

import "@firebase/logger";

import "@firebase/webchannel-wrapper/webchannel-blob";

import "re2js";

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
 */ function __PRIVATE_selectablesToMap(e) {
    return new Map(Object.entries(__PRIVATE_selectablesToObject(e)));
}

function __PRIVATE_selectablesToObject(e) {
    const s = {};
    for (const a of e) {
        let e, t;
        if ("string" == typeof a ? (e = a, t = l(a)) : a instanceof u || a instanceof w ? (e = a.alias, 
        t = a.expr) : wt(21273, {
            selectable: a
        }), void 0 !== s[e]) throw new E("invalid-argument", `Duplicate alias or field '${e}'`);
        s[e] = t;
    }
    return s;
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
function __PRIVATE_fieldOrExpression(e) {
    if (F(e)) {
        return l(e);
    }
    /**
 * Converts a value to an Expression, Returning either a Constant, MapFunction,
 * ArrayFunction, or the input itself (if it's already an expression).
 *
 * @private
 * @internal
 * @param value
 */
    return function __PRIVATE_valueToDefaultExpr(e) {
        let s;
        if (z(e)) return A(e);
        if (e instanceof x) return e;
        s = Q(e) ? X(e) : e instanceof Array ? se(e) : 
        /**
 * Checks if a value is a Pipeline object.
 *
 * We use duck typing here to avoid a circular dependency between pipeline.ts and pipeline_util.ts.
 */
        function __PRIVATE_isPipeline$1(e) {
            return "object" == typeof e && null !== e && "function" == typeof e.toArrayExpression;
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
 */ (e) ? ae(e) : ne(e, void 0);
        return s;
    }(e);
}

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
    e, 
    /**
     * @internal
     * @private
     */
    s, 
    /**
     * @internal
     * @private
     */
    a, 
    /**
     * @internal
     * @private
     */
    t) {
        this._db = e, this.userDataReader = s, this._userDataWriter = a, this.stages = t;
    }
    _readUserData(e) {
        this.stages.forEach((s => {
            const a = e.contextWith({
                methodName: s._name
            });
            s._readUserData(a);
        }));
    }
    addFields(e, ...s) {
        // Process argument union(s) from method overloads
        let a, t;
        ie(e) ? (a = [ e, ...s ], t = {}) : ({fields: a, ...t} = e);
        // Convert user land convenience types to internal types
                const n = __PRIVATE_selectablesToMap(a), i = new re(n, t);
        // Create stage object
                // Add stage to the pipeline
        return this._addStage(i);
    }
    removeFields(e, ...s) {
        // Process argument union(s) from method overloads
        const a = oe(e) || F(e) ? {} : e, t = (oe(e) || F(e) ? [ e, ...s ] : e.fields).map((e => F(e) ? l(e) : e)), n = new le(t, a);
        // Add stage to the pipeline
        return this._addStage(n);
    }
    define(e, ...s) {
        // Process argument union(s) from method overloads
        const a = ue(e) ? {} : e, t = __PRIVATE_selectablesToMap(ue(e) ? [ e, ...s ] : e.variables), n = new pe(t, a);
        return this._addStage(n);
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
     */    toArrayExpression() {
        return new he("array", [ __PRIVATE_fieldOrExpression(this) ]);
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
     */    toScalarExpression() {
        return new he("scalar", [ __PRIVATE_fieldOrExpression(this) ]);
    }
    select(e, ...s) {
        // Process argument union(s) from method overloads
        const a = ie(e) || F(e) ? {} : e, t = __PRIVATE_selectablesToMap(ie(e) || F(e) ? [ e, ...s ] : e.selections), n = new be(t, a);
        // Add stage to the pipeline
        return this._addStage(n);
    }
    where(e) {
        // Process argument union(s) from method overloads
        const s = me(e) ? {} : e, a = me(e) ? e : e.condition, t = new fe(a, s);
        // Add stage to the pipeline
        return this._addStage(t);
    }
    offset(e) {
        // Process argument union(s) from method overloads
        let s, a;
        we(e) ? (s = {}, a = e) : (s = e, a = e.offset);
        // Create stage object
                const t = new ge(a, s);
        // Add stage to the pipeline
                return this._addStage(t);
    }
    limit(e) {
        // Process argument union(s) from method overloads
        const s = we(e) ? {} : e, a = we(e) ? e : e.limit, t = new _e(a, s);
        // Add stage to the pipeline
        return this._addStage(t);
    }
    distinct(e, ...s) {
        // Process argument union(s) from method overloads
        const a = F(e) || ie(e) ? {} : e, t = __PRIVATE_selectablesToMap(F(e) || ie(e) ? [ e, ...s ] : e.groups), n = new Te(t, a);
        // Add stage to the pipeline
        return this._addStage(n);
    }
    aggregate(e, ...s) {
        // Process argument union(s) from method overloads
        const a = Pe(e) ? {} : e, t = Pe(e) ? [ e, ...s ] : e.accumulators, n = Pe(e) ? [] : e.groups ?? [], i = function __PRIVATE_aliasedAggregateToMap(e) {
            return e.reduce(((e, s) => {
                if (void 0 !== e.get(s.alias)) throw new E("invalid-argument", `Duplicate alias or field '${s.alias}'`);
                return e.set(s.alias, s.aggregate), e;
            }), new Map);
        }
        /**
 * Converts a value to an Expression, Returning either a Constant, MapFunction,
 * ArrayFunction, or the input itself (if it's already an expression).
 *
 * @private
 * @internal
 * @param value
 */ (t), r = __PRIVATE_selectablesToMap(n), o = new xe(r, i, a);
        // Add stage to the pipeline
        return this._addStage(o);
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
     */    findNearest(e) {
        // Convert user land convenience types to internal types
        const s = ye(e.field), a = function __PRIVATE_vectorToExpr(e) {
            if (e instanceof x) return e;
            if (e instanceof y) return A(e);
            if (Array.isArray(e)) return A(D(e));
            throw new Error("Unsupported value: " + typeof e);
        }(e.vectorValue), t = {
            distanceField: e.distanceField ? ye(e.distanceField) : void 0,
            limit: e.limit,
            rawOptions: e.rawOptions
        }, n = new Ee(a, s, e.distanceMeasure, t);
        // Add stage to the pipeline
        return this._addStage(n);
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
    search(e) {
        // Convert user land convenience types to internal types
        const s = e.addFields ? __PRIVATE_selectablesToObject(e.addFields) : void 0, a = Ae(e.query) ? e.query : Re(e.query), t = Ie(e.sort) ? [ e.sort ] : e.sort, n = {
            ...e,
            addFields: s,
            select: undefined,
            query: a,
            sort: t
        }, i = new ve(n);
        // Add stage to the pipeline
        return this._addStage(i);
    }
    sort(e, ...s) {
        // Process argument union(s) from method overloads
        const a = Ie(e) ? {} : e, t = Ie(e) ? [ e, ...s ] : e.orderings, n = new Me(t, a);
        // Add stage to the pipeline
        return this._addStage(n);
    }
    replaceWith(e) {
        // Process argument union(s) from method overloads
        const s = F(e) || Ae(e) ? {} : e, a = __PRIVATE_fieldOrExpression(F(e) || Ae(e) ? e : e.map), t = new Oe(a, s);
        // Add stage to the pipeline
        return this._addStage(t);
    }
    sample(e) {
        // Process argument union(s) from method overloads
        const s = we(e) ? {} : e;
        let a, t;
        we(e) ? (a = e, t = "documents") : we(e.documents) ? (a = e.documents, t = "documents") : (a = e.percentage, 
        t = "percent");
        // Create stage object
                const n = new Ve(a, t, s);
        // Add stage to the pipeline
                return this._addStage(n);
    }
    union(e) {
        // Process argument union(s) from method overloads
        let s, a;
        !function __PRIVATE_isPipeline(e) {
            return e instanceof Pipeline$1;
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
 */ (e) ? ({other: a, ...s} = e) : (s = {}, a = e);
        // Create stage object
                const t = new De(a, s);
        // Add stage to the pipeline
                return this._addStage(t);
    }
    unnest(e, s) {
        // Process argument union(s) from method overloads
        let a, t, n;
        ie(e) ? (a = {}, t = e, n = s) : ({selectable: t, indexField: n, ...a} = e);
        // Convert user land convenience types to internal types
                const i = t.alias, r = t.expr;
        F(n) && (a.indexField = Se(n, "unnest"));
        // Create stage object
                const o = new Fe(i, r, a);
        // Add stage to the pipeline
                return this._addStage(o);
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
     */    rawStage(e, s, a) {
        // Convert user land convenience types to internal types
        const t = s.map((e => e instanceof x || e instanceof $e ? e : Q(e) ? je(e) : ne(e, "rawStage"))), n = new qe(e, t, a ?? {});
        // Create stage object
                // Add stage to the pipeline
        return this._addStage(n);
    }
    /**
     * @internal
     * @private
     */    _toProto(e) {
        return {
            stages: this.stages.map((s => s._toProto(e)))
        };
    }
    _addStage(e) {
        const s = this.stages.map((e => e));
        return s.push(e), this.newPipeline(this._db, s);
    }
    /**
     * @internal
     * @private
     * @param db
     * @param userDataReader
     * @param userDataWriter
     * @param stages
     * @protected
     */    newPipeline(e, s) {
        return new Pipeline$1(e, this.userDataReader, this._userDataWriter, s);
    }
}

class PipelineSnapshot {
    constructor(e, s, a) {
        this._pipeline = e, this._executionTime = a, this._results = s;
    }
    /**
     * An array of all the results in the `PipelineSnapshot`.
     */    get results() {
        return this._results;
    }
    /**
     * The time at which the pipeline producing this result is executed.
     *
     * @readonly
     *
     */    get executionTime() {
        if (void 0 === this._executionTime) throw new Error("'executionTime' is expected to exist, but it is undefined");
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
 */ class PipelineResult {
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
    constructor(e, s, a, t, n, i, r) {
        this._ref = a, this._userDataWriter = e, this._createTime = t, this._updateTime = n, 
        this._fields = s, this._metadata = i, this._listenOptions = r;
    }
    /**
     * @private
     * @internal
     * @param userDataWriter
     * @param doc
     * @param ref
     * @param metadata
     * @param listenOptions
     */    static fromDocument(e, s, a, t, n) {
        return new PipelineResult(e, s.data, a, s.createTime.toTimestamp(), s.version.toTimestamp(), t, n);
    }
    /**
     * The reference of the document, if it is a document; otherwise `undefined`.
     */    get ref() {
        return this._ref;
    }
    /**
     * The ID of the document for which this PipelineResult contains data, if it is a document; otherwise `undefined`.
     *
     * @readonly
     *
     */    get id() {
        return this._ref?.id;
    }
    /**
     * The time the document was created. Undefined if this result is not a document.
     *
     * @readonly
     */    get createTime() {
        return this._createTime;
    }
    /**
     * The time the document was last updated (at the time the snapshot was
     * generated). Undefined if this result is not a document.
     *
     * @readonly
     */    get updateTime() {
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
     */    data() {
        return this._userDataWriter.convertValue(this._fields.value, this._listenOptions?.serverTimestampBehavior);
    }
    /**
     * @internal
     * @private
     *
     * Retrieves all fields in the result as a proto value.
     *
     * @returns An `Object` containing all fields in the result.
     */    _fieldsProto() {
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
    get(e) {
        if (void 0 === this._fields) return;
        oe(e) && (e = e.fieldName);
        const s = this._fields.field(p("DocumentSnapshot.get", e));
        return null !== s ? this._userDataWriter.convertValue(s, this._listenOptions?.serverTimestampBehavior) : void 0;
    }
}

/**
 * Test equality of two PipelineResults.
 * @param left - First PipelineResult to compare.
 * @param right - Second PipelineResult to compare.
 */ function pipelineResultEqual(e, s) {
    return e === s || Le(e._ref, s._ref, Ce) && Le(e._fields, s._fields, ((e, s) => e.isEqual(s)));
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
 */ class PipelineSource {
    /**
     * @internal
     * @private
     * @param databaseId
     * @param userDataReader
     * @param _createPipeline
     */
    constructor(e, s, 
    /**
     * @internal
     * @private
     */
    a) {
        this.databaseId = e, this.userDataReader = s, this._createPipeline = a;
    }
    collection(e) {
        // Process argument union(s) from method overloads
        const s = F(e) || Ne(e) ? {} : e, a = F(e) || Ne(e) ? e : e.collection;
        // Validate that a user provided reference is for the same Firestore DB
        Ne(a) && this._validateReference(a);
        // Convert user land convenience types to internal types
                const t = F(a) ? a : a.path, n = new Ue(t, s), i = this.userDataReader.createContext(3 /* UserDataSource.Argument */ , "collection");
        // Create stage object
                // Add stage to the pipeline
        return n._readUserData(i), this._createPipeline([ n ]);
    }
    collectionGroup(e) {
        // Process argument union(s) from method overloads
        let s, a;
        F(e) ? (s = e, a = {}) : ({collectionId: s, ...a} = e);
        // Create stage object
                const t = new We(s, a), n = this.userDataReader.createContext(3 /* UserDataSource.Argument */ , "collectionGroup");
        // User data must be read in the context of the API method to
        // provide contextual errors
                // Add stage to the pipeline
        return t._readUserData(n), this._createPipeline([ t ]);
    }
    database(e) {
        // Create stage object
        const s = new Ge(
        // Process argument union(s) from method overloads
        e = e ?? {}), a = this.userDataReader.createContext(3 /* UserDataSource.Argument */ , "database");
        // User data must be read in the context of the API method to
        // provide contextual errors
                // Add stage to the pipeline
        return s._readUserData(a), this._createPipeline([ s ]);
    }
    documents(e) {
        // Process argument union(s) from method overloads
        let s, a;
        Array.isArray(e) ? (a = e, s = {}) : ({docs: a, ...s} = e), 
        // Validate that all user provided references are for the same Firestore DB
        a.filter((e => e instanceof d)).forEach((e => this._validateReference(e)));
        // Convert user land convenience types to internal types
        const t = a.map((e => F(e) ? e : e.path)), n = new ke(t, s), i = this.userDataReader.createContext(3 /* UserDataSource.Argument */ , "documents");
        // Create stage object
                // Add stage to the pipeline
        return n._readUserData(i), this._createPipeline([ n ]);
    }
    /**
     * Convert the given Query into an equivalent Pipeline.
     *
     * @param query - A Query to be converted into a Pipeline.
     *
     * @throws `FirestoreError` Thrown if any of the provided DocumentReferences target a different project or database than the pipeline.
     */    createFrom(e) {
        return this._createPipeline(ze(e._query, e.firestore));
    }
    _validateReference(e) {
        const s = e.firestore._databaseId;
        if (!s.isEqual(this.databaseId)) throw new E(C.INVALID_ARGUMENT, `Invalid ${e instanceof Be ? "CollectionReference" : "DocumentReference"}. The project ID ("${s.projectId}") or the database ("${s.database}") does not match the project ID ("${this.databaseId.projectId}") and database ("${this.databaseId.database}") of the target database of this Pipeline.`);
    }
}

function subcollection(e) {
    // Process argument union(s) from method overloads
    let s, a;
    F(e) ? (s = e, a = {}) : ({path: s, ...a} = e);
    // Create stage object
        const t = new He(s, a);
    return new Pipeline$1(void 0, void 0, void 0, [ t ]);
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
 */ class Pipeline extends Pipeline$1 {
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
    newPipeline(e, s) {
        return new Pipeline(e, this.userDataReader, this._userDataWriter, s);
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
 */ function execute(e) {
    const s = e instanceof Pipeline$1 ? {
        pipeline: e
    } : e, {pipeline: t, rawOptions: n, ...i} = s;
    if (!t._db) return Promise.reject(new E(C.FAILED_PRECONDITION, "This pipeline was created without a database (e.g., as a subcollection pipeline) and cannot be executed directly. It can only be used as part of another pipeline."));
    const r = j(t._db, a), o = U(r), c = m(r).createContext(3 /* UserDataSource.Argument */ , "execute");
    t._readUserData(c);
    const l = new K(r), u = new Ke(i, n);
    u._readUserData(c);
    const p = new Je(t, u);
    return Qe(o, p).then((e => {
        // Get the execution time from the first result.
        // firestoreClientExecutePipeline returns at least one PipelineStreamElement
        // even if the returned document set is empty.
        const s = e.length > 0 ? e[0].executionTime?.toTimestamp() : void 0, a = e.filter((e => !!e.fields)).map((e => new PipelineResult(l, e.fields, e.key?.path ? new d(r, null, e.key) : void 0, e.createTime?.toTimestamp(), e.updateTime?.toTimestamp())));
        return new PipelineSnapshot(t, a, s);
    }));
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
a.prototype.pipeline = function() {
    const e = m(this);
    return new PipelineSource(this._databaseId, e, (s => new Pipeline(this, e, new K(this), s)));
};

export { Pipeline, PipelineResult, PipelineSnapshot, PipelineSource, execute, pipelineResultEqual, subcollection };
//# sourceMappingURL=pipelines.rn.js.map
