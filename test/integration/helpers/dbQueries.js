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

  // TODO: fix
  settlementStateChangeByParams: async function (params) {
    try {
      return Db.settlementStateChange.findOne()
    } catch (e) {
      throw e
    }
  },

  settlementParticipantCurrencyByParams: async function () {
    try {
      return Db.settlementParticipantCurrency.query(async (builder) => {
        return builder.select('*')
          .orderBy('settlementId', 'desc')
          .limit(2)
      })
    } catch (e) {
      throw e
    }
  },

  settlementParticipantCurrencyStateChangeByParams: async function () {
    try {
      return Db.settlementParticipantCurrencyStateChange.query(async (builder) => {
        return builder.select('*').orderBy('settlementParticipantCurrencyStateChangeId', 'desc').limit(1)
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

  // get by participants id and hub id
  transferParticipantByParams: async function (idList = [], limit = null) {
    try {
      return Db.transferParticipant.query(async (builder) => {
        let res = builder
          .innerJoin('participantCurrency as pc', 'pc.participantCurrencyId', 'transferParticipant.participantCurrencyId')
          .innerJoin('participant as p', 'p.participantId', 'pc.participantId')
          .select('*')
          .orderBy('transferParticipantId', 'desc')
          .limit(limit)
        if (idList.length > 0) {
          builder.whereIn('p.participantId', idList)
        }
        return res
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
          .innerJoin('participantCurrency as pc', 'pc.participantCurrencyId', 'transferParticipant.participantCurrencyId')
          .innerJoin('ledgerAccountType as lat', 'lat.ledgerAccountTypeId', 'pc.ledgerAccountTypeId')
          .innerJoin('participant as p', 'p.participantId', 'pc.participantId')
          .groupByRaw(`CONCAT(transferParticipant.participantCurrencyId, '-', p.name, '-', lat.name)`)
          .orderBy('1', 'desc')
          .select(`CONCAT(transferParticipant.participantCurrencyId, '-', p.name, '-', lat.name) AS participantCurrencyId, SUM(tp.amount) AS SUM_amount`)
      })
    } catch (e) {
      throw e
    }
  },

  transferStateChangeByParams: async function () {
    try {
      return Db.transferStateChange.query(async (builder) => {
        return builder.select('*')
          .orderBy('transferStateChangeId', 'desc')
          .limit(1)
      })
    } catch (e) {
      throw e
    }
  },
  // TODO: crash
  participantPositionByParams: async function () {
    try {
      return Db.participantPosition.query(async (builder) => {
        return builder
          .select('participantPosition.participantPositionId, participantPosition.value, participantPosition.reservedValue, participantPosition.changedDate')
          .innerJoin('participantCurrency as pc', 'pc.participantCurrencyId', 'participantPosition.participantCurrencyId')
          .innerJoin('participant as p', 'p.participantId', 'pc.participantId')
          .orderBy('participantPosition.participantPositionId', 'desc')
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
          .innerJoin('participantPosition as pp', 'pp.participantPositionId', 'participantPositionChange.participantPositionId')
          .innerJoin('participantCurrency as pc', 'pc.participantCurrencyId', 'pp.participantCurrencyId')
          .innerJoin('ledgerAccountType as lat', 'lat.ledgerAccountTypeId', 'pc.ledgerAccountTypeId')
          .innerJoin('participant as p', 'p.participantId', 'pc.participantId')
          .innerJoin('transferStateChange as tsc', 'tsc.transferStateChangeId', 'participantPositionChange.transferStateChangeId')
          .orderBy('1', 'desc')
      })
    } catch (e) {
      throw e
    }
  },

  participantLimitByParams: async (params) => {
    let { idList } = params
    try {
      return Db.participantLimit.query(async (builder) => {
        let result = builder
          .select(`participantLimit.participantLimitId AS id,
                 participantLimit.value, participantLimit.thresholdAlarmPercentage, participantLimit.startAfterParticipantPositionChangeId,
                 participantLimit.isActive, participantLimit.createdDate, participantLimit.createdBy`)
          .innerJoin('participantCurrency as pc', 'pc.participantCurrencyId', 'participantLimit.participantCurrencyId')
          .innerJoin('participant as p', 'p.participantId', 'pc.participantId')
        if (idList.length > 0) {
          builder.whereIn('p.participantId', idList)
        }
        return result
      })
    } catch (e) {
      throw e
    }
  }
}
