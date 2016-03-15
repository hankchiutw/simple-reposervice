'use strict';

const AWS = require('aws-sdk');
const defaultConfig = require('./config/config');

/**
 * Repository service using AWS DynamoDB
 */
class RepoService {
    /**
     * Construct repository service on express app
     * @param {Object} app Express app
     * @param {Object} config
     * @param {String} config.region DynamoDB service region
     * @param {String} config.apiPath API prefix
     * @param {String} config.repoTable Table name
     */
    constructor(app, config){
        // TODO: filter out not specified attributes
        config = Object.assign({}, defaultConfig, config);

        this.db = new AWS.DynamoDB(config);
        this.app = app;
        this.config = config;

        require('./app/controllers/repository')(this);
        require('./app/routes/repository')(this);
    }


    /**
     * Service factory
     */
    static create(app, config){
        const repoService = new this(app, config);

        return repoService;
    }

}

module.exports = RepoService;
