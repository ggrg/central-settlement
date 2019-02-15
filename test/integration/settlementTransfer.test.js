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
const SettlementWindowStateChangeModel = require('../../src/models/settlementWindow/settlementWindowStateChange')
const SettlementModel = require('../../src/models/settlement/settlement')
const SettlementStateChangeModel = require('../../src/models/settlement/settlementStateChange')
const SettlementParticipantCurrencyModel = require('../../src/models/settlement/settlementParticipantCurrency')
const TransferModel = require('@mojaloop/central-ledger/src/models/transfer/transfer')
const TransferStateChangeModel = require('@mojaloop/central-ledger/src/models/transfer/transferStateChange')
// require('leaked-handles').set({ fullStack: true, timeout: 15000, debugSockets: true })

const currency = 'USD'
let netSettlementSenderId
let netSenderAccountId
let netSettlementRecipientId
let netRecipientAccountId
let netSettlementAmount
let netSenderSettlementTransferId
let netRecipientSettlementTransferId

const hubId = 1
const transferAmount = 100
const expectedRecordsAfterPsTransferRecordedForPayer = 6
const expectedRecordsAfterPsTransferRecordedForPayee = 8
let expectedTransferStateChangeRecords = 1
let expectedSettlementStateChangeRecords = 1
let expectedSettlementParticipantCurrencyStateRecords = 2

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

      let closedWindow = await SettlementWindowStateChangeModel.getBySettlementWindowId(settlementWindowId)
      let openWindow = await SettlementWindowStateChangeModel.getBySettlementWindowId(res.settlementWindowId)
      test.equal(closedWindow.settlementWindowStateId, enums.settlementWindowStates.CLOSED, `window id ${settlementWindowId} is CLOSED`)
      test.equal(openWindow.settlementWindowStateId, enums.settlementWindowStates.OPEN, `window id ${res.settlementWindowId} is OPEN`)

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

      let settlementWindow = await SettlementWindowStateChangeModel.getBySettlementWindowId(settlementWindowId)
      test.equal(settlementWindow.settlementWindowStateId, enums.settlementWindowStates.PENDING_SETTLEMENT, `window id ${settlementWindowId} is PENDING_SETTLEMENT`)

      let settlement = await SettlementModel.getById(settlementData.id)
      test.ok(settlement, `create settlement with id ${settlementData.id}`)

      let settlementState = await SettlementStateChangeModel.getBySettlementId(settlementData.id)
      test.equal(settlementState.settlementStateId, enums.settlementStates.PENDING_SETTLEMENT, `settlement state is PENDING_SETTLEMENT`)
      test.end()
    } catch (err) {
      Logger.error(`settlementTransferTest failed with error - ${err}`)
      test.fail()
      test.end()
    }
  })

  await settlementTransferTest.test('PS_TRANSFERS_RECORDED for PAYER', async test => {
    try {
      // read and store settlement participant and account data needed in remaining tests
      let participantFilter = settlementData.participants.filter(participant => {
        return participant.accounts.find(account => {
          if (account.netSettlementAmount.currency === currency && account.netSettlementAmount.amount > 0) {
            netSenderAccountId = account.id
            netSettlementAmount = account.netSettlementAmount.amount
            return true
          }
        })
      })
      netSettlementSenderId = participantFilter[0].id
      participantFilter = settlementData.participants.filter(participant => {
        return participant.accounts.find(account => {
          if (account.netSettlementAmount.currency === currency && account.netSettlementAmount.amount < 0) {
            netRecipientAccountId = account.id
            return true
          }
        })
      })
      netSettlementRecipientId = participantFilter[0].id
      // data retrieved and stored into module scope variables

      let params = {
        participants: [
          {
            id: netSettlementSenderId,
            accounts: [
              {
                id: netSenderAccountId,
                reason: 'Transfers recorded for payer',
                state: enums.settlementStates.PS_TRANSFERS_RECORDED
              }
            ]
          }
        ]
      }
      await SettlementService.putById(settlementData.id, params, enums)

      const settlementParticipantCurrencyRecord = await SettlementParticipantCurrencyModel.getBySettlementAndAccount(settlementData.id, netSenderAccountId)
      test.equal(settlementParticipantCurrencyRecord.settlementStateId, enums.settlementStates.PS_TRANSFERS_RECORDED, 'record for payer changed to PS_TRANSFERS_RECORDED state')

      netSenderSettlementTransferId = settlementParticipantCurrencyRecord.settlementTransferId
      const transferRecord = await TransferModel.getById(netSenderSettlementTransferId)
      test.ok(transferRecord, 'settlement transfer is created for payer')

      const transferStateChangeRecord = await TransferStateChangeModel.getByTransferId(netSenderSettlementTransferId)
      test.equal(transferStateChangeRecord.transferStateId, enums.transferStates.RECEIVED_PREPARE, 'settlement transfer for payer is RECEIVED_PREPARE')

      const transferParticipantRecords = await DbQueries.getTransferParticipantsByTransferId(netSenderSettlementTransferId)
      const hubTransferParticipant = transferParticipantRecords.find(record => {
        return record.transferParticipantRoleTypeId === enums.transferParticipantRoleTypes.HUB
      })
      const payerTransferParticipant = transferParticipantRecords.find(record => {
        return record.transferParticipantRoleTypeId === enums.transferParticipantRoleTypes.DFSP_POSITION
      })
      test.ok(payerTransferParticipant.amount < 0, `DR settlement transfer for SETTLEMENT_NET_SENDER is negative for payer ${payerTransferParticipant.amount}`)
      test.ok(hubTransferParticipant.amount > 0, `CR settlement transfer for SETTLEMENT_NET_SENDER is positive for hub ${hubTransferParticipant.amount}`)
      test.end()
    } catch (err) {
      Logger.error(`settlementTransferTest failed with error - ${err}`)
      test.fail()
      test.end()
    }
  })

  await settlementTransferTest.test('PS_TRANSFERS_RECORDED for PAYEE', async test => {
    try {
      expectedSettlementStateChangeRecords++
      expectedSettlementParticipantCurrencyStateRecords += 2
      let params = {
        participants: [
          {
            id: settlementData.participants[1].id,
            accounts: [
              {
                id: settlementData.participants[1].accounts[0].id,
                reason: 'Transfers recorded for payee',
                state: enums.settlementStates.PS_TRANSFERS_RECORDED,
                externalReference: 'tr0123456789'
              }
            ]
          }
        ]
      }
      /* let res = */ await SettlementService.putById(settlementData.id, params, enums)
      // As PS_TRANSFERS_RECORDED was sent for the second account another settlement transfer has been created."
      // "settlementTransferId column was populated."
      let settlementParticipantCurrencyArray = await DbQueries.settlementParticipantCurrencyByParams({ settlementId: settlementData.id })
      test.ok(settlementParticipantCurrencyArray[0].settlementTransferId !== null, 'settlement transfer not affected for payee')
      test.ok(settlementParticipantCurrencyArray[1].settlementTransferId !== null, 'settlement transfer created for payer')

      // Payee's settlement account has been also changed to PS_TRANSFERS_RECORDED. externalReference recorded.
      let settlementParticipantCurrencyStateChangeArray = await DbQueries.settlementParticipantCurrencyStateChangeByParams()
      let settlementStateChangeArray = await DbQueries.settlementStateChangeByParams()
      let transferParticipantArray = await DbQueries.transferParticipantByParams()
      test.equal(settlementParticipantCurrencyStateChangeArray.length, expectedSettlementParticipantCurrencyStateRecords, `expecting ${expectedSettlementParticipantCurrencyStateRecords} records`)
      test.equal(settlementParticipantCurrencyStateChangeArray[0].settlementStateId, enums.settlementStates.PS_TRANSFERS_RECORDED, `transfer changed to ${enums.settlementStates.PS_TRANSFERS_RECORDED} state`)
      test.equal(settlementParticipantCurrencyStateChangeArray[1].settlementStateId, enums.settlementStates.PS_TRANSFERS_RECORDED, `transfer changed to ${enums.settlementStates.PS_TRANSFERS_RECORDED} state`)
      test.notEqual(settlementParticipantCurrencyStateChangeArray[0].externalReference, null, `external reference recorded for payee`)

      // As all 2 settlement accounts has been PS_TRANSFERS_RECORDED, entire settlment is PS_TRANSFERS_RECORDED.
      // "Showing 2 records."
      test.equal(settlementStateChangeArray.length, expectedSettlementStateChangeRecords, `expected ${expectedSettlementStateChangeRecords} records`)
      test.equal(settlementStateChangeArray[0].settlementStateId, enums.settlementStates.PS_TRANSFERS_RECORDED, `settlement is ${enums.settlementStates.PS_TRANSFERS_RECORDED}`)

      // Transfer participants are inserted for the prepared settlement transfer. 2 records inserted. Showing 8 records."
      // The settlement transfer is for the SETTLEMENT_NET_RECIPIENT, thus: DR HUB_MULTILATERAL_SETTLEMENT -800 / CR POSITION 800."
      let hms = transferParticipantArray.filter(record => {
        return record.ledgerAccountTypeId === enums.ledgerAccountTypes.HUB_MULTILATERAL_SETTLEMENT &&
          record.ledgerEntryTypeId === enums.ledgerEntryTypes.SETTLEMENT_NET_RECIPIENT
      })
      let recipient = transferParticipantArray.filter(record => {
        return record.ledgerAccountTypeId === enums.ledgerAccountTypes.POSITION &&
          record.ledgerEntryTypeId === enums.ledgerEntryTypes.SETTLEMENT_NET_RECIPIENT
      })
      test.equal(transferParticipantArray.length, expectedRecordsAfterPsTransferRecordedForPayee, '4 transferParticipant records expected')
      test.equal(hms[0].amount, -transferAmount, 'correct amount for hub')
      test.equal(recipient[0].amount, transferAmount, 'correct amount for sender')
      test.end()
    } catch (err) {
      Logger.error(`settlementTransferTest failed with error - ${err}`)
      test.fail()
      test.end()
    }
  })

  await settlementTransferTest.test('PS_TRANSFERS_RESERVED for PAYER & PAYEE', async test => {
    try {
      expectedTransferStateChangeRecords = 12
      expectedSettlementStateChangeRecords++
      expectedSettlementParticipantCurrencyStateRecords += 2
      let params = {
        participants: [
          {
            id: settlementData.participants[0].id,
            accounts: [
              {
                id: settlementData.participants[0].accounts[0].id,
                reason: 'Transfers recorded for payer & payee',
                state: enums.settlementStates.PS_TRANSFERS_RESERVED,
                externalReference: 'tr1212121212'
              }
            ]
          },
          {
            id: settlementData.participants[1].id,
            accounts: [
              {
                id: settlementData.participants[1].accounts[0].id,
                reason: 'Transfers recorded for payer & payee',
                state: enums.settlementStates.PS_TRANSFERS_RESERVED
              }
            ]
          }
        ]
      }
      let res = await SettlementService.putById(settlementData.id, params, enums)

      // Both settlement accounts are now PS_TRANSFERS_RESERVED. Showing 6 records (previously 4). externalReference recorded for payer only.
      let settlementParticipantCurrencyStateChangeArray = await DbQueries.settlementParticipantCurrencyStateChangeByParams()
      test.equal(settlementParticipantCurrencyStateChangeArray.length, expectedSettlementParticipantCurrencyStateRecords, `expecting ${expectedSettlementParticipantCurrencyStateRecords} records`)
      test.equal(settlementParticipantCurrencyStateChangeArray[0].settlementStateId, enums.settlementStates.PS_TRANSFERS_RESERVED, `transfer changed to ${enums.settlementStates.PS_TRANSFERS_RESERVED} state`)
      test.equal(settlementParticipantCurrencyStateChangeArray[1].settlementStateId, enums.settlementStates.PS_TRANSFERS_RESERVED, `transfer changed to ${enums.settlementStates.PS_TRANSFERS_RESERVED} state`)
      test.notEqual(settlementParticipantCurrencyStateChangeArray[1].externalReference, null, `external reference recorded for payer`)

      let settlementStateChangeArray = await DbQueries.settlementStateChangeByParams()
      // Settlement state has changed also to PS_TRANSFERS_RESERVED. Showing 3 records (previously 2).
      test.equal(settlementStateChangeArray.length, expectedSettlementStateChangeRecords, `expected ${expectedSettlementStateChangeRecords} records`)
      test.equal(settlementStateChangeArray[0].settlementStateId, enums.settlementStates.PS_TRANSFERS_RESERVED, `settlement is ${enums.settlementStates.PS_TRANSFERS_RESERVED}`)

      // records have been inserted - both settlement transfers are RESERVED. Showing total 12 records (previously 10)."
      let transferStateChangeArray = await DbQueries.transferStateChangeByParams()
      test.equal(transferStateChangeArray[0].transferStatesId, enums.transferStates.RESERVED, `record is in ${enums.transferStates.RESERVED}`)
      test.equal(transferStateChangeArray[1].transferStatesId, enums.transferStates.RESERVED, `record is in ${enums.transferStates.RESERVED}`)
      test.equal(transferStateChangeArray.length, expectedTransferStateChangeRecords, `${expectedTransferStateChangeRecords} record expected`)

      // "TODO => EXPECTED RESULT: NET_SETTLEMENT_RECIPIENT's position has been adjusted for the settlement transfer reservation."
      // "The change also affected the position of the HMLNS account."
      /* let participantPositionByParamsArray = */ await DbQueries.participantPositionByParams()
      // test.equal(participantPositionByParamsArray[6], -transferAmount, `HMS expected amount ${-transferAmount}`)

      test.ok(res)
      test.end()
    } catch (err) {
      Logger.error(`settlementTransferTest failed with error - ${err}`)
      test.fail()
      test.end()
    }
  })

  // await settlementTransferTest.test('PS_TRANSFERS_COMMITTED for PAYER & PAYEE', async test => {
  //   try {
  //     let params = {
  //       participants: [
  //         {
  //           id: settlementData.participants[0].id,
  //           accounts: [
  //             {
  //               id: settlementData.participants[0].accounts[0].id,
  //               reason: 'Transfers recorded for payer',
  //               state: enums.settlementStates.PS_TRANSFERS_COMMITTED
  //             }
  //           ]
  //         },
  //         {
  //           id: settlementData.participants[1].id,
  //           accounts: [
  //             {
  //               id: settlementData.participants[1].accounts[0].id,
  //               reason: 'Transfers recorded for payer',
  //               state: enums.settlementStates.PS_TRANSFERS_COMMITTED
  //             }
  //           ]
  //         }
  //       ]
  //     }
  //     let res = await SettlementService.putById(settlementData.id, params, enums)
  //     test.ok(res)
  //     // TODO: check 21scenario-part4-results-- TODOs and write tests accordingly
  //     test.end()
  //   } catch (err) {
  //     Logger.error(`settlementTransferTest failed with error - ${err}`)
  //     test.fail()
  //     test.end()
  //   }
  // })

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
