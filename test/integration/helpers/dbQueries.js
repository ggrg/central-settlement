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
const Db = require('../../../src/models')

module.exports = {
  // TODO: add where params to all queries, instead of looping the resultset.
  // Utilize array.filter only when it is better suited to the test than the previous
  // Underscore _ was added to the currently unused methods, please remove later
  transferByParams_: async function () {
    try {
      return Db.transfer.query(async (builder) => {
        return builder.select('*').orderBy('createdDate', 'desc')
      })
    } catch (e) {
      throw e
    }
  },

  settlementByParams: async function () {
    try {
      return Db.settlement.query(async (builder) => {
        return builder.select('*').orderBy('createdDate', 'desc')
      })
    } catch (e) {
      throw e
    }
  },

  settlementStateChangeByParams: async function () {
    try {
      return Db.settlementStateChange.query(async (builder) => {
        return builder.select('*').orderBy('settlementId', 'desc')
      })
    } catch (e) {
      throw e
    }
  },

  settlementWindowStateChangeByParams: async function (arr = []) {
    try {
      return Db.settlementWindowStateChange.query(async (builder) => {
        let res = builder.select('*').orderBy('settlementWindowId', 'Desc')
        if (arr) {
          builder.whereIn('settlementWindowId', arr)
        }
        return res
      })
    } catch (e) {
      throw e
    }
  },

  settlementParticipantCurrencyByParams_: async function () {
    try {
      return Db.settlementParticipantCurrency.query(async (builder) => {
        return builder.select('*').orderBy('1', 'desc')
      })
    } catch (e) {
      throw e
    }
  },

  settlementParticipantCurrencyStateChangeByParams_: async function () {
    try {
      return Db.settlementParticipantCurrencyStateChange.query(async (builder) => {
        return builder.select('*').orderBy('createdDate', 'desc')
      })
    } catch (e) {
      throw e
    }
  },

  transferDuplicateCheckByParams_: async function () {
    try {
      return Db.transferDuplicateCheck.query(async (builder) => {
        return builder.select('*').orderBy('createdDate', 'desc')
      })
    } catch (e) {
      throw e
    }
  },

  transferFulfilmentByParams_: async function () {
    try {
      return Db.transferFulfilment.query(async (builder) => {
        return builder
          // TODO: human-readable result is not needed. Remove all unnecessary alias and joins as you go
          .select('SUBSTRING(transferId, -20) AS trasnferId_20, SUBSTRING(transferFulfilmentId, -20) AS transferFulfilmentId_20,ilpFulfilment, completedDate, isValid, settlementWindowId, createdDate')
          .orderBy('createdDate', 'desc')
      })
    } catch (e) {
      throw e
    }
  },

  transferParticipantByParams_: async function () {
    try {
      return Db.transferParticipant.query(async (builder) => {
        return builder
          // TODO: human-readable result is not needed. Remove all unnecessary alias and joins as you go
          .innerjoin('participantCurrency as pc', 'pc.participantCurrencyId', 'transferParticipant.participantCurrencyId')
          .innerjoin('ledgerAccountType as lat', 'lat.ledgerAccountTypeId', 'pc.ledgerAccountTypeId')
          .innerjoin('participant as p', 'p.participantId', 'pc.participantId')
          .innerjoin('transferParticipantRoleType as tprt', 'tprt.transferParticipantRoleTypeId', 'transferParticipant.transferParticipantRoleTypeId')
          .innerjoin('ledgerEntryType as let', 'let.ledgerEntryTypeId', 'transferParticipant.ledgerEntryTypeId')
          .select(`transferParticipant.transferParticipantId AS id, transferParticipant.transferId, 
                CONCAT(transferParticipant.participantCurrencyId, '-', p.name, '-', lat.name) AS participantCurrencyId,
                CONCAT(transferParticipant.transferParticipantRoleTypeId, '-', tprt.name) AS transferParticipantRoleTypeId,
                CONCAT(transferParticipant.ledgerEntryTypeId, '-', let.name) AS ledgerEntryTypeId, tp.amount, tp.createdDate`)
          .orderBy('transferParticipant.transferParticipantId', 'desc')
      })
    } catch (e) {
      throw e
    }
  },

  transferParticipantByAccountByParams_: async function () {
    try {
      return Db.transferParticipant.query(async (builder) => {
        return builder.select('*')
          // TODO: human-readable result is not needed. Remove all unnecessary alias and joins as you go
          .innerjoin('participantCurrency as pc', 'pc.participantCurrencyId', 'transferParticipant.participantCurrencyId')
          .innerjoin('ledgerAccountType as lat', 'lat.ledgerAccountTypeId', 'pc.ledgerAccountTypeId')
          .innerjoin('participant as p', 'p.participantId', 'pc.participantId')
          .groupByRaw(`CONCAT(transferParticipant.participantCurrencyId, '-', p.name, '-', lat.name)`)
          .orderBy('1', 'desc')
          .select(`CONCAT(transferParticipant.participantCurrencyId, '-', p.name, '-', lat.name) AS participantCurrencyId, SUM(tp.amount) AS SUM_amount`)
      })
    } catch (e) {
      throw e
    }
  },

  transferStateChangeByParams_: async function () {
    try {
      return Db.transferStateChange.query(async (builder) => {
        return builder.select('*').orderBy('1', 'desc')
      })
    } catch (e) {
      throw e
    }
  },

  participantPositionByParams_: async function () {
    try {
      return Db.participantPosition.query(async (builder) => {
        return builder
          // TODO: human-readable result is not needed. Remove all unnecessary alias and joins as you go
          .select(`participantPosition.participantPositionId AS id,
                 CONCAT(participantPosition.participantCurrencyId, '-', p.name, '-', lat.name) AS participantCurrencyId,
                 participantPosition.value, participantPosition.reservedValue, participantPosition.changedDate`)
          .innerjoin('participantCurrency as pc', 'pc.participantCurrencyId', 'participantPosition.participantCurrencyId')
          .innerjoin('ledgerAccountType as lat', 'lat.ledgerAccountTypeId', 'pc.ledgerAccountTypeId')
          .innerjoin('participant as p', 'p.participantId', 'pc.participantId')
          .orderBy('1', 'desc')
      })
    } catch (e) {
      throw e
    }
  },

  participantPositionChangeByParams_: async function () {
    try {
      return Db.participantPositionChange.query(async (builder) => {
        return builder
          // TODO: human-readable result is not needed. Remove all unnecessary alias and joins as you go
          .select(`participantPositionChange.participantPositionChangeId AS id,
                 CONCAT(participantPositionChange.participantPositionId, '-', p.name, '-', lat.name) AS participantPositionId,
                 CONCAT(participantPositionChange.transferStateChangeId, '-', tsc.transferStateId, '-', tsc.transferId) transferStateChangeId,
                 participantPositionChange.value, participantPositionChange.reservedValue, participantPositionChange.createdDate`)
          .innerjoin('participantPosition as pp', 'pp.participantPositionId', 'participantPositionChange.participantPositionId')
          .innerjoin('participantCurrency as pc', 'pc.participantCurrencyId', 'pp.participantCurrencyId')
          .innerjoin('ledgerAccountType as lat', 'lat.ledgerAccountTypeId', 'pc.ledgerAccountTypeId')
          .innerjoin('participant as p', 'p.participantId', 'pc.participantId')
          .innerjoin('transferStateChange as tsc', 'tsc.transferStateChangeId', 'participantPositionChange.transferStateChangeId')
          .orderBy('1', 'desc')
      })
    } catch (e) {
      throw e
    }
  },

  participantLimitByParams_: async () => {
    try {
      return Db.participantLimit.query(async (builder) => {
        return builder
          // TODO: human-readable result is not needed. Remove all unnecessary alias and joins as you go
          .select(`participantLimit.participantLimitId AS id,
                 CONCAT(participantLimit.participantCurrencyId, '-', p.name, '-', lat.name) AS participantCurrencyId,
                 CONCAT(participantLimit.participantLimitTypeId, '-', plt.name) AS participantLimitTypeId,
                 participantLimit.value, participantLimit.thresholdAlarmPercentage, participantLimit.startAfterParticipantPositionChangeId,
                 participantLimit.isActive, participantLimit.createdDate, participantLimit.createdBy`)
          .innerjoin('participantCurrency as pc', 'pc.participantCurrencyId', 'participantLimit.participantCurrencyId')
          .innerjoin('ledgerAccountType as lat', 'lat.ledgerAccountTypeId', 'pc.ledgerAccountTypeId')
          .innerjoin('participant as p', 'p.participantId', 'pc.participantId')
          .innerjoin('participantLimitType as plt', 'plt.participantLimitTypeId', 'participantLimit.participantLimitTypeId')
          .orderBy('1', 'Desc')
      })
    } catch (e) {
      throw e
    }
  }
}
