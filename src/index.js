'use strict';

const _ = require('lodash');
const fs = require('fs');
const { BlocksInTableValidator, FrameTokenValidator } = require('@emartech/content-blocks-template-validator');
const templateModel = require('./model/templates');
const db = require('./lib/database');

const validators = [
    new BlocksInTableValidator(),
    new FrameTokenValidator({ token: '#body#', parentSelectors: ['body'] }),
    new FrameTokenValidator({ token: '#style#', parentSelectors: ['head', 'body']})
];

db.once('open', () => {
    templateModel.find()
    .then((templates) => {
        const validationResults = validateAllTemplates(templates);
        printStatistics(validationResults);

        db.close();
    })
    .catch((err) => {
        console.error(err);
        db.close();
    })
});

function validateAllTemplates(templates) {
    return _.map(templates, template => {
        return {
            id: template._id,
            name: template.name,
            errors: validateSingleTemplate(template)
        }
    });
}

function validateSingleTemplate(template) {
    let errors = [];

    validators.forEach(validator => {
        errors = errors.concat(validator.validate(template));
    })

    return errors;
}

function printStatistics(validationResults) {
    const { true: validTemplates, false: invalidTemplates } =
        _.groupBy(validationResults, result => result.errors.length === 0);

    printGeneralStatistics(validTemplates, invalidTemplates);
    printStatisticsByErrorCode(validationResults, invalidTemplates);

    fs.writeFileSync('invalidTemplates.json', JSON.stringify(invalidTemplates, null, '  '));
}

function printGeneralStatistics(validTemplates, invalidTemplates) {
    const invalidTemplatesPercentage = 
        invalidTemplates.length * 100 /
        (invalidTemplates.length + validTemplates.length);

    console.log(`Number of invalid templates: ${invalidTemplates.length}`);
    console.log(`Number of valid templates: ${validTemplates.length}`);
    console.log(`Percentage of invalid templates: ${invalidTemplatesPercentage}%\n`);
}

function printStatisticsByErrorCode(validationResults, invalidTemplates) {
    const invalidTemplatesCountByErrorCode = countInvalidTemplatesByErrorCodes(validationResults);

    for(var errorCode in invalidTemplatesCountByErrorCode) {
        const currentErrorCodeInvalidTemplatesCount = invalidTemplatesCountByErrorCode[errorCode];
        const invalidTemplatesPercentage = 
            currentErrorCodeInvalidTemplatesCount * 100 /
            invalidTemplates.length;

        console.log(`Error code ${errorCode}:`);
        console.log(`\tNumber of invalid templates: ${currentErrorCodeInvalidTemplatesCount}`);
        console.log(`\tPercentage of current errors compared to all invalid templates: ${invalidTemplatesPercentage}%`);
    }
}

function countInvalidTemplatesByErrorCodes(validationResults) {
    const errorCodes = collectErrorCodes(validationResults);

    return mapInvalidTemplatesCountToErrorCodes(validationResults, errorCodes);
}

function collectErrorCodes(validationResults) {
    return _.chain(validationResults)
        .map('errors')
        .flatten()
        .map('code')
        .uniq()
        .value();
}

function mapInvalidTemplatesCountToErrorCodes(validationResults, errorCodes) {
    return _.reduce(errorCodes, (invalidTemplatesByErrorCode, errorCode) => {
        invalidTemplatesByErrorCode[errorCode] = getTemplatesWithErrorCode(validationResults, errorCode).length;

        return invalidTemplatesByErrorCode;
    }, {});
}

function getTemplatesWithErrorCode(validationResults, errorCode) {
    return _.filter(validationResults,
        validationResult => _.some(validationResult.errors, error => error.code === errorCode)
    );
}