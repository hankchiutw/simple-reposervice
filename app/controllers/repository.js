'use strict';

const cn = require('co-nextware');

/**
 * Set controllers
 */
module.exports = function(repoService){

    /**
     * Controller - getNew
     */
    repoService.getNew = cn(function *(req, res, next){
        if(!req.query.deviceType) return next(logger.E('deviceType not set')); 

        const ret = yield _getNew.bind(repoService)(req.query);
        
        return res.ok(ret);
    });

};

/**
 * Check if there is new version
 * @param {Object} params
 * @param {String} params.deviceType
 * @param {Number} params.versionCode
 * @param {Number} params.majorVersion
 * @param {Number} params.minorVersion
 * @param {Number} params.patchVersion
 * @return {Object} Repository object
 * @private
 */
function *_getNew(params){
    // validate params
    const keys = ['versionCode', 'majorVersion', 'minorVersion', 'patchVersion'];
    keys.forEach(function(key){
        params[key] = parseInt(params[key]) || 0;
    });    

    // filled as 4,2,2,2 digits string
    const fullVersionCode = (parseInt(params.versionCode)+10000).toString().slice(-4);
    const fullMajorVersion = (parseInt(params.majorVersion)+100).toString().slice(-2);
    const fullMinorVersion = (parseInt(params.minorVersion)+100).toString().slice(-2);
    const fullPatchVersion = (parseInt(params.patchVersion)+100).toString().slice(-2);

    // concat together
    const currentCode = `${params.deviceType}-${fullVersionCode}${fullMajorVersion}${fullMinorVersion}${fullPatchVersion}`;
    console.log('(simple-reposervice) currentCode: ', currentCode);

    /** scan table */
    const tableName = this.config.repoTable || 'repo-table-01';
    const scanParams = {
        TableName: tableName,
        ExpressionAttributeValues: {
            ":deviceType": {"S": params.deviceType },
            ":currentCode": { "S": currentCode }
        },
        FilterExpression: "objectId > :currentCode and begins_with (objectId, :deviceType)"
    };

    const data = yield _p(this.db.scan)(this.db, scanParams);
    if(!data.Items[0]) throw new Error('no new version');

    /** format output */
    let ret = {};
    for(let attr in data.Items[0]){
        ret[attr] = parseInt(data.Items[0][attr].N) || data.Items[0][attr].S;
    };

    return ret;
}

// tmp
function _p(fn){
    return function(parent){
        let args = Array.prototype.slice.apply(arguments, [1]);
        return new Promise(function(resolve, reject){
            args[args.length] = function(err, data){
                if(err) reject(err);
                else resolve(data);
            };
            fn.apply(parent, args);
        });
    };
}
