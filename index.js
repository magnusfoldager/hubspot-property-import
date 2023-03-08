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

const addNumber = (row) => {
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

const addSelect = (row) => {
  console.log(`Adding Number "${row.label}"`)

  console.log(row.options)

  inputs.push(
    {
      "name": row.name,
      "label": row.label,
      "description": row.description,
      "type": "enumeration",
      "fieldType": "select",
      "groupName": row.groupName,
      "options": JSON.parse(row.options)
    }
  )
}


fs.createReadStream('input.csv')
  .pipe(csv())
  .on('data', (row) => addProperty(row))
  .on('end', () => {

    const BatchInputPropertyCreate = {
      inputs
    }

    hubspotClient.crm.properties.batchApi.create(objectType, BatchInputPropertyCreate).then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    }).finally(() => {
      console.log('Finished')
    })
  })
