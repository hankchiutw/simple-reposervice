'use strict';

/**
 * Set routes
 */
module.exports = function(repoService){
    const app = repoService.app;

    app.get(`${repoService.config.apiPath}/getNew`, repoService.getNew);


};


/**
 * @api {get} /repositories/getNew Check if there is new version
 * @apiName GetRepository
 * @apiGroup Repository
 * @apiVersion 2.0.0
 *
 * @apiParam {Number} versionCode apk or ipa version code.
 * @apiParam {Number} majorVersion
 * @apiParam {Number} minorVersion
 * @apiParam {Number} patchVersion
 * @apiParam {String="ios","android"} deviceType ios or android
 *
 * @apiSuccess (CommonSuccess) {String} result Description.
 * @apiSuccessExample Example
 *HTTP/1.1 200 OK
 * {
 *  "result": {
 *      "isSuccess": true,
 *      "result": {
 *        "deviceType": "ios",
 *        "downloadLink": "http://a",
 *        "majorVersion": 1
 *        "minorVersion": 2
 *        "patchVersion": 3
 *        "versionCode": 4
 *      }
 *  }
 * }
 *
 * @apiErrorExample Example
 * # no new version
 * {
 *  "result": {
 *      "isSuccess": false,
 *      "errorCode": 404,
 *      "errorMessage": "Object not found",
 *      "errorData": "no new version"
 *  }
 * }
 *
 */
