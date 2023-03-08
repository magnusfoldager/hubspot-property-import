require('dotenv').config()

const csv = require('csv-parser')
const fs = require('fs')
const hubspot = require('@hubspot/api-client');

const hubspotClient = new hubspot.Client({ "accessToken": process.env.ACCESS_TOKEN });

const objectType = 'company'

let inputs = []

const addProperty = (row) => {
  if (row.fieldType == "number") return addNumber(row)
  if (row.fieldType == "select") return addSelect(row)
  console.log(`Unsupported Field Type: "${row.fieldType}"`)
}

const addSelect = (row) => {
  console.log(`Adding Select "${row.label}"`)

  inputs.push(
    {
      "name": row.name,
      "label": row.label,
      "description": row.description,
      "type": "number",
      "fieldType": "number",
      "groupName": row.groupName
    }
  )
}

const addNumber = (row) => {
  console.log(`Adding Number "${row.label}"`)

  inputs.push(
    {
      "name": row.name,
      "label": row.label,
      "description": row.description,
      "type": "enumeration",
      "fieldType": "select",
      "groupName": row.groupName,
      "options": row.options
    }
  )
}


fs.createReadStream('inputs.csv')
  .pipe(csv())
  .on('data', (row) => results.push(row))
  .on('end', () => {


    const BatchInputPropertyCreate = {
      inputs
    }

    /*
    hubspotClient.crm.properties.batchApi.create(objectType, BatchInputPropertyCreate).then(res => {

    }).catch(err => {

    }).finally(() => {

    })
    */
  });





const BatchInputPropertyCreate = { inputs: [{ "label": "My Contact Property", "type": "enumeration", "fieldType": "select", "groupName": "contactinformation", "hidden": false, "displayOrder": 2, "hasUniqueValue": false, "formField": true, "options": [{ "label": "Option A", "description": "Choice number one", "value": "A", "displayOrder": 1, "hidden": false }, { "label": "Option B", "description": "Choice number two", "value": "B", "displayOrder": 2, "hidden": false }] }] };

