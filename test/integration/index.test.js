/*****
 License
 --------------
 Copyright © 2017 Bill & Melinda Gates Foundation
 The Mojaloop files are made available by the Bill & Melinda Gates Foundation under the Apache License, Version 2.0 (the "License") and you may not use these files except in compliance with the License. You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, the Mojaloop files are distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 Contributors
 --------------
 This is the official list of the Mojaloop project contributors for this file.
 Names of the original copyright holders (individuals or organizations)
 should be listed with a '*' in the first column. People who have
 contributed from an organization can be listed under the organization
 that actually holds the copyright for their contributions (see the
 Gates Foundation organization for an example). Those individuals should have
 their names indented and be marked with a '-'. Email address can be added
 optionally within square brackets <email>.
 * Gates Foundation
 - Name Surname <name.surname@gatesfoundation.com>

 * Georgi Georgiev <georgi.georgiev@modusbox.com>
 --------------
 ******/

'use strict'

const Test = require('tapes')(require('tape'))
const Sinon = require('sinon')
const Logger = require('@mojaloop/central-services-shared').Logger
const fetch = require('node-fetch')
// const ParticipantCurrencyModel = require('../../../../src/models/settlement/participantCurrency')
// const Db = require('../../../../src/models')

Test('Settlements', async (settlementsTest) => {
  let sandbox
  const CENTRAL_LEDGER_ADMIN_URI_PREFIX = 'http'
  const CENTRAL_LEDGER_ADMIN_HOST = '127.0.0.1'
  const CENTRAL_LEDGER_ADMIN_PORT = 3001
  const CENTRAL_LEDGER_ADMIN_BASE = ''
  

  settlementsTest.beforeEach(test => {
    sandbox = Sinon.createSandbox()
    test.end()
  })

  settlementsTest.afterEach(test => {
    sandbox.restore()
    test.end()
  })

  await settlementsTest.test('init should', async settlementsInitTest => {
    try {
      await settlementsInitTest.test('create HUB_RECONCILIATION account', async test => {
        try {
          let url = `${CENTRAL_LEDGER_ADMIN_URI_PREFIX}://${CENTRAL_LEDGER_ADMIN_HOST}:${CENTRAL_LEDGER_ADMIN_PORT}${CENTRAL_LEDGER_ADMIN_BASE}/participants/Hub/accounts`
          let headers = {
            'Content-Type': 'application/json'
          }
          let body = {
            currency: 'USD',
            type: 'HUB_RECONCILIATION'
          }
          let opts = {
            method: 'POST',
            headers,
            body: JSON.stringify(body)
          }
          let res = await fetch(url, opts)
          test.equal(res.status, 201, 'POST request returned 201 Created')
          test.end()
        } catch (err) {
          Logger.error(`settlementsInitTest failed with error - ${err}`)
          test.fail()
          test.end()
        }
      })

      await settlementsInitTest.test('create HUB_MULTILATERAL_SETTLEMENT account', async test => {
        try {
          let url = `${CENTRAL_LEDGER_ADMIN_URI_PREFIX}://${CENTRAL_LEDGER_ADMIN_HOST}:${CENTRAL_LEDGER_ADMIN_PORT}${CENTRAL_LEDGER_ADMIN_BASE}/participants/Hub/accounts`
          let headers = {
            'Content-Type': 'application/json'
          }
          let body = {
            currency: 'USD',
            type: 'HUB_MULTILATERAL_SETTLEMENT'
          }
          let opts = {
            method: 'POST',
            headers,
            body: JSON.stringify(body)
          }
          let res = await fetch(url, opts)
          test.equal(res.status, 201, 'POST request returned 201 Created')
          test.end()
        } catch (err) {
          Logger.error(`settlementsInitTest failed with error - ${err}`)
          test.fail()
          test.end()
        }
      })

      await settlementsInitTest.end()
    } catch (err) {
      Logger.error(`settlementsTest failed with error - ${err}`)
      settlementsInitTest.fail()
      settlementsInitTest.end()
    }
  })

  await settlementsTest.end()
})
