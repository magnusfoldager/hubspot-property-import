require('dotenv').config()
const util = require('util')

const csv = require('csv-parser')
const fs = require('fs')
const hubspot = require('@hubspot/api-client');

const hubspotClient = new hubspot.Client({ "accessToken": process.env.PROD_ACCESS_TOKEN });

const objectType = 'deal'
const fileName = 'INSERT_FILE_NAME.csv'

let inputs = []

const addProperty = (row) => {
  if (row.fieldType == "number") return addNumber(row)
  if (row.fieldType == "select") return addSelect(row)
  if (row.fieldType == "checkbox") return addCheckbox(row)
  if (row.fieldType == "string") return addString(row)
  if (row.fieldType == "multi") return addMulti(row)
  if (row.fieldType == "owner") return addOwner(row)
  if (row.fieldType == "date") return addDate(row)
  console.log(`Unsupported Field Type: "${row.fieldType}"`)
}

const addNumber = (row) => {
  console.log(`Adding Number "${row.label}"`)

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
  console.log(`Adding Select "${row.label}"`)

  const fixedOptions = row.options.replace(/FALSE/g,'false')

  inputs.push(
    {
      "name": row.name,
      "label": row.label,
      "description": row.description,
      "type": "enumeration",
      "fieldType": "select",
      "groupName": row.groupName,
      "options": JSON.parse(fixedOptions)
    }
  )
}

const addCheckbox = (row) => {
  console.log(`Adding Checkbox "${row.label}"`)

  const fixedOptions = row.options.replace(/FALSE/g,'false')

  inputs.push(
    {
      "name": row.name,
      "label": row.label,
      "description": row.description,
      "type": "enumeration",
      "fieldType": "checkbox",
      "groupName": row.groupName,
      "options": JSON.parse(fixedOptions)
    }
  )
}

const addString = (row) => {
  console.log(`Adding String "${row.label}"`)

  inputs.push(
    {
      "name": row.name,
      "label": row.label,
      "description": row.description,
      "type": "string",
      "fieldType": "text",
      "groupName": row.groupName
    }
  )
}

const addMulti = (row) => {
  console.log(`Adding Multi "${row.label}"`)

  inputs.push(
    {
      "name": row.name,
      "label": row.label,
      "description": row.description,
      "type": "string",
      "fieldType": "textarea",
      "groupName": row.groupName
    }
  )
}

const addDate = (row) => {
  console.log(`Adding Date "${row.label}"`)

  inputs.push(
    {
      "name": row.name,
      "label": row.label,
      "description": row.description,
      "type": "date",
      "fieldType": "date",
      "groupName": row.groupName
    }
  )
}

const addOwner = (row) => {
  console.log(`Adding Owner "${row.label}"`)

  inputs.push(
    {
      "name": row.name,
      "label": row.label,
      "description": row.description,
      "type": "enumeration",
      "fieldType": "select",
      "groupName": row.groupName,
      "externalOptions": true,
      "referencedObjectType": "OWNER"
    }
  )
}


fs.createReadStream(fileName)
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
