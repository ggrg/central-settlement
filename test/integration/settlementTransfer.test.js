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
const PrepareTransferData = require('./helpers/transferData')
const DbQueries = require('./helpers/dbQueries')
const Config = require('../../src/lib/config')
const Db = require('../../src/models')
const SettlementWindowService = require('../../src/domain/settlementWindow')
const SettlementService = require('../../src/domain/settlement')
const Enums = require('../../src/models/lib/enums')
// require('leaked-handles').set({ fullStack: true, timeout: 15000, debugSockets: true })

const getEnums = async () => {
  return {
    settlementWindowStates: await Enums.settlementWindowStates(),
    settlementStates: await Enums.settlementStates(),
    transferStates: await Enums.transferStates(),
    ledgerAccountTypes: await Enums.ledgerAccountTypes(),
    ledgerEntryTypes: await Enums.ledgerEntryTypes(),
    transferParticipantRoleTypes: await Enums.transferParticipantRoleTypes(),
    participantLimitTypes: await Enums.participantLimitTypes()
  }
}

PrepareTransferData()

Test('SettlementTransfer should', async settlementTransferTest => {
  await Db.connect(Config.DATABASE_URI)
  let enums = await getEnums()
  let settlementWindowId
  let settlementData

  let sandbox
  settlementTransferTest.beforeEach(test => {
    sandbox = Sinon.createSandbox()
    test.end()
  })
  settlementTransferTest.afterEach(test => {
    sandbox.restore()
    test.end()
  })

  await settlementTransferTest.test('close current window should', async test => {
    try {
      let params = { query: { state: enums.settlementWindowStates.OPEN } }
      let res = await SettlementWindowService.getByParams(params)
      settlementWindowId = res[0].settlementWindowId
      test.ok(settlementWindowId > 0, 'retrieve the OPEN window')

      params = { settlementWindowId: settlementWindowId, state: enums.settlementWindowStates.CLOSED, reason: 'text' }
      res = await SettlementWindowService.close(params, enums.settlementWindowStates)
      test.ok(res, `close operation returned result`)

      let dbData = await DbQueries.settlementWindowStateChangeByParams([settlementWindowId, res.settlementWindowId])
      let closedWindow = dbData.filter(window => {
        return window.settlementWindowId === settlementWindowId && window.settlementWindowStateId === enums.settlementWindowStates.CLOSED
      })
      let openWindow = dbData.filter(window => {
        return window.settlementWindowId === res.settlementWindowId && window.settlementWindowStateId === enums.settlementWindowStates.OPEN
      })
      test.ok(closedWindow, `close window id ${settlementWindowId}`)
      test.ok(openWindow, `open window id ${res.settlementWindowId}`)
      test.end()
    } catch (err) {
      Logger.error(`settlementTransferTest failed with error - ${err}`)
      test.fail()
      test.end()
    }
  })

  await settlementTransferTest.test('create settlement should', async test => {
    try {
      let params = {
        reason: 'reason',
        settlementWindows: [
          {
            id: settlementWindowId
          }
        ]
      }
      settlementData = await SettlementService.settlementEventTrigger(params, enums)

      let dbData = await DbQueries.settlementWindowStateChangeByParams([settlementWindowId])
      let pendingWindow = dbData.filter(window => {
        return window.settlementWindowId === settlementWindowId && window.settlementWindowStateId === enums.settlementWindowStates.PENDING_SETTLEMENT
      })
      test.ok(pendingWindow, `change window with id ${settlementWindowId} to ${enums.settlementWindowStates.PENDING_SETTLEMENT} state`) // ALWAYS OK!

      dbData = await DbQueries.settlementByParams()
      let createdSettlement = dbData.filter(settlement => {
        return settlement.settlementId === settlementData.id && settlement.createdDate === settlementData.createdDate // equal objects?!
      })
      test.ok(createdSettlement, `create settlement with id ${SettlementService.settlementId}`) // not working properly

      dbData = await DbQueries.settlementStateChangeByParams()
      let changedSettlementState = dbData.filter(stateChange => {
        return stateChange.settlementId === settlementData.id && stateChange.settlementStateId === enums.settlementStates.PENDING_SETTLEMENT
      })
      test.ok(changedSettlementState, `change settlement state to ${enums.settlementStates.PENDING_SETTLEMENT}`)
      test.end()
    } catch (err) {
      Logger.error(`settlementTransferTest failed with error - ${err}`)
      test.fail()
      test.end()
    }
  })

  // Done: repair
  await settlementTransferTest.test('PS_TRANSFERS_RECORDED for PAYER, (separate test) FOR PAYEE ', async test => {
    try {
      let params = {
        participants: [
          {
            id: settlementData.participants[0].id,
            accounts: [
              {
                id: settlementData.participants[0].accounts[0].id,
                reason: 'Transfers recorded for payer',
                state: enums.settlementStates.PS_TRANSFERS_RECORDED
              }
            ]
          }
        ]
      }
      let res = await SettlementService.putById(settlementData.id, params, enums) // insufficient enums missing ledgerAccountTypes.HUB_MULTILATERAL_SETTLEMENT
      // DONE: load enums dynamically
      // TODO: test the first one is changed to PS_TRANSFERS_RECORDED
      // TODO: test settlement transfer is created for the first one
      // TODO: The settlement transfer is for the SETTLEMENT_NET_SENDER, thus: DR POSITION -800 / CR HUB_MULTILATERAL_SETTLEMENT 800 (2 transferParticipant recs to test)
      // TODO: The last record for the settlement transfer is RECEIVED_PREPARE

      // TODO: start new test here for payee (11scenario-part2)
      // TODO: add externalReference to account payload (check script)
      params = {
        participants: [
          {
            id: settlementData.participants[1].id,
            accounts: [
              {
                id: settlementData.participants[1].accounts[0].id,
                reason: 'Transfers recorded for payee',
                state: enums.settlementStates.PS_TRANSFERS_RECORDED
              }
            ]
          }
        ]
      }

      res = await SettlementService.putById(settlementData.id, params, enums)
      test.ok(res)
      // TODO: check 21scenario-part2-results-- TODOs and write tests accordingly
      test.end()
    } catch (err) {
      Logger.error(`settlementTransferTest failed with error - ${err}`)
      test.fail()
      test.end()
    }
  })

  await settlementTransferTest.test('PS_TRANSFERS_RESERVED for PAYER & PAYEE', async test => {
    try {
      let params = {
        participants: [
          {
            id: settlementData.participants[0].id,
            accounts: [
              {
                id: settlementData.participants[0].accounts[0].id,
                reason: 'Transfers recorded for payer',
                state: enums.settlementStates.PS_TRANSFERS_RESERVED
              }
            ]
          },
          {
            id: settlementData.participants[1].id,
            accounts: [
              {
                id: settlementData.participants[1].accounts[0].id,
                reason: 'Transfers recorded for payer',
                state: enums.settlementStates.PS_TRANSFERS_RESERVED
              }
            ]
          }
        ]
      }
      let res = await SettlementService.putById(settlementData.id, params, enums)
      test.ok(res)
      // TODO: check 21scenario-part3-results-- TODOs and write tests accordingly
      test.end()
    } catch (err) {
      Logger.error(`settlementTransferTest failed with error - ${err}`)
      test.fail()
      test.end()
    }
  })

  await settlementTransferTest.test('PS_TRANSFERS_COMMITTED for PAYER & PAYEE', async test => {
    try {
      let params = {
        participants: [
          {
            id: settlementData.participants[0].id,
            accounts: [
              {
                id: settlementData.participants[0].accounts[0].id,
                reason: 'Transfers recorded for payer',
                state: enums.settlementStates.PS_TRANSFERS_COMMITTED
              }
            ]
          },
          {
            id: settlementData.participants[1].id,
            accounts: [
              {
                id: settlementData.participants[1].accounts[0].id,
                reason: 'Transfers recorded for payer',
                state: enums.settlementStates.PS_TRANSFERS_COMMITTED
              }
            ]
          }
        ]
      }
      let res = await SettlementService.putById(settlementData.id, params, enums)
      test.ok(res)
      // TODO: check 21scenario-part4-results-- TODOs and write tests accordingly
      test.end()
    } catch (err) {
      Logger.error(`settlementTransferTest failed with error - ${err}`)
      test.fail()
      test.end()
    }
  })

  await settlementTransferTest.test('finally disconnect database', async test => {
    try {
      await Db.disconnect()
      test.pass('done')
      test.end()
    } catch (err) {
      Logger.error(`settlementTransferTest failed with error - ${err}`)
      test.fail()
      test.end()
    }
  })

  /*
  await settlementTransferTest.test('', async test => {
    try {
      test.end()
    } catch (err) {
      Logger.error(`settlementTransferTest failed with error - ${err}`)
      test.fail()
      test.end()
    }
  })
  */

  settlementTransferTest.end()
})
