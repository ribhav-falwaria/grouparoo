import dayjs from "dayjs";
import orderBy from "lodash.orderby";
import isUndefined from "lodash.isundefined";
import minBy from "lodash.minby";
import humanizeDuration from "humanize-duration";
import { rupeeFormatter } from "../../utils";
import apiService from "../../apiService";
import { config } from "../../config";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../../../screens/Errors/ErrorUtil";
const formatAmount = (amount) => rupeeFormatter(parseFloat(amount));
/*************** loanApplicationId and loanId are used interchangably here *************/
const dayjsMapper = {
  [config.FREQ_MONTHLY]: "month",
  [config.FREQ_DAILY]: "day",
  [config.FREQ_WEEKLY]: "week",
  [config.FREQ_YEARLY]: "year",
  [config.FREQ_HALFYEARLY]: "year",
};
const humanize = (inDays, language) => {
  const diff = inDays * 1000 * 60 * 60 * 24;
  if (inDays > 365) {
    return humanizeDuration(diff, {
      units: ["y"],
      round: false,
      language,
    });
  } else if (inDays > 30) {
    return humanizeDuration(diff, {
      units: ["m", "w", "d"],
      round: true,
      language,
    });
  } else if (inDays > 7) {
    return humanizeDuration(diff, {
      units: ["w", "d"],
      round: true,
      language,
    });
  } else {
    return humanizeDuration(diff, {
      units: ["d"],
      round: true,
      language,
    });
  }
};

const loans = {
  name: "loans",
  state: {},
  selectors: {
    // loanId and loanApplicationId used fungably
    getLoanById:
      (select) =>
      (rootState, { loanApplicationId }) => {
        crashlytics().log(
          ErrorUtil.createLog(
            " getLoanById method starts here",
            { loanApplicationId, rootState },
            "getLoanById()",
            "loans.js"
          )
        );
        return rootState.loans[loanApplicationId];
      },
    hasActiveLoan: (select) => (rootState) => {
      crashlytics().log(
        ErrorUtil.createLog(
          " hasActiveLoan method starts here",
          { rootState },
          "hasActiveLoan()",
          "loans.js"
        )
      );
      return Object.keys(rootState.loans)
        .map((rs) => rs.status === config.LOAN_DISBURSED_STATUS)
        .some((v) => v === true);
    },
    getById: (select) => (rootState, loanApplicationId) => {
      crashlytics().log(
        ErrorUtil.createLog(
          " getById method starts here",
          { rootState, loanApplicationId },
          "getById()",
          "loans.js"
        )
      );
      return rootState.loans[loanApplicationId];
    },
    list: (select) => (rootState) => {
      crashlytics().log(
        ErrorUtil.createLog(
          " list method starts here",
          { rootState },
          "list()",
          "loans.js"
        )
      );
      const loans = rootState.loans;
      return Object.keys(loans).map((ky) => loans[ky]);
    },
    getDpdSchedule:
      (select) =>
      (rootState, { loanId }) => {
        crashlytics().log(
          ErrorUtil.createLog(
            " getDpdSchedule method starts here",
            { rootState, loanId },
            "getDpdSchedule()",
            "loans.js"
          )
        );
        const loan = select.loans.getById(rootState, loanId);
        const schedule = loan.repayment.filter(
          (schedule) => !schedule.isTxnSettled
        );
        // .filter(
        //   schedule => {
        //     console.log(dayjs().diff(dayjs(parseInt(schedule.installmentDate)), 'day', true))
        //     return dayjs().diff(dayjs(parseInt(schedule.installmentDate)), 'day', true) > 1
        //   }
        // )
        const display = schedule.map((np, ix) => ({
          installmentDate: dayjs(np.installmentDate).format(
            config.APP_DATE_FORMAT
          ),
          installmentAmount: rupeeFormatter(np.installmentAmount),
          ix,
        }));
        return {
          schedule,
          display,
        };
      },
    getNextInstallment:
      (select) =>
      (rootState, { loanId }) => {
        crashlytics().log(
          ErrorUtil.createLog(
            " getNextInstallment method starts here",
            { rootState, loanId },
            "getNextInstallment()",
            "loans.js"
          )
        );
        const loan = select.loans.getById(rootState, loanId);
        const nextInstallment = minBy(
          loan.repayment.filter((rp) => rp.installmentDate > dayjs().valueOf()),
          "installmentDate"
        );
        if (loan.basicDetails.outstanding.pastDueDays > 0) {
          const {
            principalDueAmount,
            interestDueAmount,
            pastDueDays,
            penalDueAmount,
            totalDueAmount,
          } = loan.basicDetails.outstanding;
          const pendingRepayment = {
            pastDueDays: pastDueDays,
            principal: principalDueAmount,
            interest: interestDueAmount,
            penalty: penalDueAmount,
            total: totalDueAmount,
          };
          return pendingRepayment;
        } else {
          if (nextInstallment.length === 0) {
            return nextInstallment;
          }
          const diff = dayjs(nextInstallment.installmentDate).diff(dayjs());
          const inDays = dayjs.duration(diff).days();
          const language = select.settings.getLanguage(rootState);
          return {
            pastDueDays: 0,
            principal: nextInstallment.principalAmount,
            interest: nextInstallment.interestAmount,
            penalty: 0,
            total: nextInstallment.installmentAmount,
            installmentDate: dayjs(nextInstallment.installmentDate).format(
              config.APP_DATE_FORMAT
            ),
            humanize: humanize(inDays, language),
            inDays,
          };
        }
      },
    getTotalDpdAmount:
      (select) =>
      (rootState, { loanId }) => {
        crashlytics().log(
          ErrorUtil.createLog(
            " getTotalDpdAmount method starts here",
            { rootState, loanId },
            "getTotalDpdAmount()",
            "loans.js"
          )
        );
        const loan = select.loans.getById(rootState, loanId);
        /*
      {
      "interestDueAmount": null,
      "totalDueAmount": -126.92,
      "principalDueAmount": 0,
      "penalDueAmount": 126.92,
      "pastDueDays": 96,
      "numInstallmentsPaid": 4
    },
      */
        return loan.basicDetails.outstanding;
      },
    getActiveLoans: (select) => (rootState) => {
      crashlytics().log(
        ErrorUtil.createLog(
          " getActiveLoans method starts here",
          { rootState },
          "getActiveLoans()",
          "loans.js"
        )
      );
      return select.loans
        .list(rootState)
        .filter((loan) => loan.status === config.LOAN_DISBURSED_STATUS);
    },
    getProductName:
      (select) =>
      (rootState, { loanId }) => {
        crashlytics().log(
          ErrorUtil.createLog(
            " getProductName method starts here",
            { rootState, loanId },
            "getProductName()",
            "loans.js"
          )
        );
        const loan = select.loans.getById(rootState, loanId);
        if (!isUndefined(loan)) {
          const displayName = select.loanProducts.getProductDisplayName(
            rootState,
            {
              schemeCode: loan.basicDetails.schemeCode,
              schemeName: loan.basicDetails.schemeName,
            }
          );
          return displayName;
        }
      },
    getLoanAccountNumber:
      (select) =>
      (rootState, { loanId }) => {
        crashlytics().log(
          ErrorUtil.createLog(
            " getLoanAccountNumber method starts here",
            { rootState, loanId },
            "getLoanAccountNumber()",
            "loans.js"
          )
        );
        // Since loan Account Number will be the same as the loanApplicationId
        return loanId;
        // return rootState.loans[loanId].externalLoanId
      },
    getLoanAmount:
      (select) =>
      (rootState, { loanId }) => {
        crashlytics().log(
          ErrorUtil.createLog(
            " getLoanAmount method starts here",
            { rootState, loanId },
            "getLoanAmount()",
            "loans.js"
          )
        );
        const loan = select.loans.getById(rootState, loanId);
        return loan.basicDetails.loanAmount;
      },
    getMaturityDate:
      (select) =>
      (rootState, { loanId }) => {
        crashlytics().log(
          ErrorUtil.createLog(
            " getMaturityDate method starts here",
            { rootState, loanId },
            "getMaturityDate()",
            "loans.js"
          )
        );
        const loan = select.loans.getById(rootState, loanId);
        return dayjs(loan.basicDetails.maturityDate).format(
          config.APP_DATE_FORMAT
        );
      },
    getCurrentRepayment:
      (select) =>
      (rootState, { loanId }) => {
        crashlytics().log(
          ErrorUtil.createLog(
            " getCurrentRepayment method starts here",
            { rootState, loanId },
            "getCurrentRepayment()",
            "loans.js"
          )
        );
        const loan = select.loans.getById(rootState, loanId);
        const lower = dayjs()
          .startOf(dayjsMapper[loan.repaymentFrequency])
          .valueOf();
        const upper = dayjs()
          .endOf(dayjsMapper[loan.repaymentFrequency])
          .valueOf();
        const currentRepayment = loan.repayment.find(
          (s) => s.installmentDate >= lower && s.installmentDate <= upper
        );
        return currentRepayment;
      },
    // FIXME: this is incorrect. navneet to populate this field.
    getRemainingPrincipal:
      (select) =>
      (rootState, { loanId, formatted }) => {
        crashlytics().log(
          ErrorUtil.createLog(
            " getRemainingPrincipal method starts here",
            { rootState, loanId, formatted },
            "getRemainingPrincipal()",
            "loans.js"
          )
        );
        const currentStatement = select.loans.getCurrentRepayment(rootState, {
          loanId,
        });
        if (isUndefined(currentStatement)) {
          return 0;
        }
        if (formatted) {
          return rupeeFormatter(currentStatement.principalOutstanding);
        } else {
          return currentStatement.principalOutstanding;
        }
      },
    getHasOutstandingRepayment:
      (select) =>
      (rootState, { loanId }) => {
        crashlytics().log(
          ErrorUtil.createLog(
            " getHasOutstandingRepayment method starts here",
            { rootState, loanId },
            "getHasOutstandingRepayment()",
            "loans.js"
          )
        );
        const loan = select.loans.getById(rootState, loanId);
        return loan.basicDetails.outstanding.pastDueDays > 0;
      },
    getRemainingTenure:
      (select) =>
      (rootState, { loanId }) => {
        crashlytics().log(
          ErrorUtil.createLog(
            " getRemainingTenure method starts here",
            { rootState, loanId },
            "getRemainingTenure()",
            "loans.js"
          )
        );
        const language = select.settings.getLanguage(rootState);
        const loan = select.loans.getById(rootState, loanId);
        const maturityDate = loan.basicDetails.maturityDate;
        const diff = dayjs(maturityDate).diff(dayjs());
        const inDays = dayjs.duration(diff).days();
        return humanize(inDays, language);
      },
    getInterestDetails:
      (select) =>
      (rootState, { loanId }) => {
        crashlytics().log(
          ErrorUtil.createLog(
            " getInterestDetails method starts here",
            { rootState, loanId },
            "getInterestDetails()",
            "loans.js"
          )
        );
        const loan = select.loans.getById(rootState, loanId);
        const interestRate = loan.basicDetails.interestRate;
        const interestFrequency = select.loanProducts.getInterestFrequency(
          rootState,
          {
            schemeCode: loan.basicDetails.schemeCode,
            schemeName: loan.basicDetails.schemeName,
          }
        );
        return {
          interestRate: `${interestRate}`,
          interestAmount: loan.isUpFrontInterest
            ? `${formatAmount(
                loan.upfrontInterestAmount
              )} ${interestFrequency}}`
            : undefined,
        };
      },
    getAmortizationDetails:
      (select) =>
      (rootState, { loanId }) => {
        crashlytics().log(
          ErrorUtil.createLog(
            " getAmortizationDetails method starts here",
            { rootState, loanId },
            "getAmortizationDetails()",
            "loans.js"
          )
        );
        const loan = select.loans.getById(rootState, loanId);
        // first find the repayment schedule for this installment
        // FIXME: this is wrong. Need to verify with Navneet
        return {
          amount: loan.basicDetails.nextInstallmentAmount,
          units: `period.per.${loan.basicDetails.repaymentFrequency}`,
        };
      },
    getDisbursementDate:
      (select) =>
      (rootState, { loanId }) => {
        crashlytics().log(
          ErrorUtil.createLog(
            " getDisbursementDate method starts here",
            { rootState, loanId },
            "getDisbursementDate()",
            "loans.js"
          )
        );
        const loan = select.loans.getById(rootState, loanId);
        // FIXME: remove this once navneet adds actual disbursement date
        return dayjs(
          loan.basicDetails.dusbursementDate ||
            loan.basicDetails.expectedDisbursementDate
        ).format(config.APP_DATE_FORMAT);
      },
    getIsPrepayEnabled:
      (select) =>
      (rootState, { loanId }) => {
        crashlytics().log(
          ErrorUtil.createLog(
            " getIsPrepayEnabled method starts here",
            { rootState, loanId },
            "getIsPrepayEnabled()",
            "loans.js"
          )
        );
        const loan = select.loans.getById(rootState, loanId);
        const product = select.loanProducts.getProductBySchemeCode(rootState, {
          schemeCode: loan.basicDetails.schemeCode,
          schemeName: loan.basicDetails.schemeName,
        });
        return product.canPrepay;
      },

    getLoanDetailsForDisplay:
      (select) =>
      (rootState, { loanId }) => {
        crashlytics().log(
          ErrorUtil.createLog(
            " getLoanDetailsForDisplay method starts here",
            { rootState, loanId },
            "getLoanDetailsForDisplay()",
            "loans.js"
          )
        );
        const loan = select.loans.getById(rootState, loanId);
        const loanDetailsForDisplay = {
          loanApplicationNumber: loanId,
          finalApprovedAmount: rupeeFormatter(loan.basicDetails.loanAmount),
          disbursalDate: dayjs(
            loan.basicDetails.disbursalDate,
            config.APP_DATE_FORMAT
          ).format(config.APP_DATE_FORMAT),
          principalOutstanding: rupeeFormatter(
            loan.basicDetails.principalOutstanding
          ),
          nextRepaymentDate: dayjs(
            loan.basicDetails.nextInstallmentDate,
            config.APP_DATE_FORMAT
          ).format(config.APP_DATE_FORMAT),
          emi: rupeeFormatter(loan.basicDetails.nextInstallmentAmount),
          repayment: select.product.getRepaymentFrequencyForDisplay(rootState, {
            schemeCode: loan.basicDetails.schemeCode,
            schemeName: loan.basicDetails.schemeName,
          }),
          displayName: select.product.getProductDisplayName(rootState, {
            schemeCode: loan.basicDetails.schemeCode,
            schemeName: loan.basicDetails.schemeName,
          }),
          tenure: loan.basicDetails.term,
          tenureUnit: `period.${loan.basicDetails.repaymentFrequency}s`,
        };
        return loanDetailsForDisplay;
      },
    getRepaymentSchedule:
      (select) =>
      (rootState, { loanId }) => {
        crashlytics().log(
          ErrorUtil.createLog(
            " getRepaymentSchedule method starts here",
            { rootState, loanId },
            "getRepaymentSchedule()",
            "loans.js"
          )
        );
        const loan = select.loans.getById(rootState, loanId);
        const { mode, ...descriptions } =
          select.loanProducts.getRepaymentDescription(rootState, {
            schemeCode: loan.basicDetails.schemeCode,
            schemeName: loan.basicDetails.schemeName,
          });
        return orderBy(
          loan.repayment.filter(
            (rd) => rd.installmentDate <= dayjs().valueOf()
          ),
          "installmentDate",
          ["desc"]
        ).map((rd) => {
          const {
            installmentAmount,
            interestAmount,
            principalAmount,
            installmentDate,
            isTxnSettled,
          } = rd;
          if (isUndefined(installmentAmount) || installmentAmount === 0) {
            return {};
          }
          const principal = isUndefined(principalAmount) ? 0 : principalAmount;
          const interest = isUndefined(interestAmount) ? 0 : interestAmount;
          let description;
          const isFullyPaid =
            installmentDate < dayjs().valueOf() ? isTxnSettled : true;
          let amount;
          if (
            mode === config.REPAYMENT_UPFRONT_AMORTIZED ||
            mode === config.REPAYMENT_UPFRONT_EQUATED
          ) {
            if (principal > 0 && interest > 0) {
              description = descriptions.principalAndInterest;
              amount = installmentAmount;
            } else if (principal > 0) {
              description = descriptions.principal;
              amount = principal;
            } else if (interest > 0) {
              description = descriptions.interest;
              amount = interest;
            }
          } else if (
            mode === config.REPAYMENT_AMORTIZED ||
            mode === config.REPAYMNET_EQUATED
          ) {
            description = descriptions.description;
            amount = installmentAmount;
          } else if (mode === config.REPAYMENT_BULLET_BEGINNING) {
            description = descriptions.principal;
            amount = principal;
          } else if (mode === config.REPAYMENT_BULLET_END) {
            description = descriptions.description;
            amount = installmentAmount + interestAmount;
          }
          return {
            amount,
            isFullyPaid,
            description,
            interest,
            principal,
            repaymentDate: dayjs(installmentDate).format(
              config.REPAYMENT_DATE_FORMAT
            ),
          };
        });
      },
    getUpcomingRepayment:
      (select) =>
      (rootState, { loanId }) => {
        crashlytics().log(
          ErrorUtil.createLog(
            " getUpcomingRepayment method starts here",
            { rootState, loanId },
            "getUpcomingRepayment()",
            "loans.js"
          )
        );
        const repaymentSchedule = select.loans.getRepaymentSchedule(rootState, {
          loanId,
        });
        const upcomingRepayment = orderBy(
          repaymentSchedule.filter(
            (rp) =>
              rp.installmentDate > dayjs().valueOf() &&
              rp.status === config.REPAYMENT_PENDIND_STATUS
          ),
          ["repaymentDate"],
          ["desc"]
        );
        return upcomingRepayment[0];
      },
    // FIXME: we need to handle this
    getPendingRepayment:
      (select) =>
      (rootState, { loanId }) => {
        crashlytics().log(
          ErrorUtil.createLog(
            " getPendingRepayment method starts here",
            { rootState, loanId },
            "getPendingRepayment()",
            "loans.js"
          )
        );
        const loan = select.loans.getById(rootState, loanId);
        const { basicDetails, repayment } = loan;
        const {
          principalDueAmount,
          interestDueAmount,
          pastDueDays,
          penalDueAmount,
          totalDueAmount,
        } = basicDetails.outstanding;
        const pendingRepayment = {
          pastDueDays: pastDueDays,
          principal: principalDueAmount,
          interest: interestDueAmount,
          penalty: penalDueAmount,
          total: totalDueAmount,
        };
        const today = dayjs().valueOf();
        const repaymentTillNow = orderBy(
          repayment.filter(
            (rp) => rp.installmentDate < dayjs().valueOf() && !rp.isTxnSettled
          ),
          ["installmentDate"],
          ["desc"]
        );
        if (repaymentTillNow.length > 0) {
          // There can be both interest and principal or principal
          const repaymentAmount = repaymentTillNow.reduce(
            (o, v) => {
              v.principal = v.principal + o.principalOverdueAmount;
              v.interest = v.interest + o.interestOverdueAmount;
              v.penalty = v.penalty + o.penaltyAccruedAmount;
              v.total =
                v.total +
                o.penaltyAccruedAmount +
                o.interestOverdueAmount +
                o.principalOverdueAmount;
              return v;
            },
            {
              principal: 0,
              interest: 0,
              penalty: 0,
              total: 0,
            }
          );
          return {
            repaymentAmount,
            repaymentDetails: repaymentTillNow,
          };
        } else {
          return {};
        }
      },
  },
  reducers: {
    addAllLoans: (state, { allLoans }) => {
      if (isUndefined(allLoans)) {
        return state;
      }
      allLoans.forEach((al) => {
        al.loanId = al.loanApplicationId;
        state[al.loanApplicationId] = al;
      });
      return state;
    },
  },
  effects: (dispatch) => ({
    async getAllLoans(_, rootState) {
      crashlytics().log(
        ErrorUtil.createLog(
          " getAllLoans method starts here",
          { _, rootState },
          "getAllLoans()",
          "loans.js"
        )
      );
      const { customer } = rootState;
      try {
        const executionId = await apiService.appApi.loans.getAllLoans.execute(
          customer.customerDetails.$id
        );
        let allLoans = await apiService.appApi.loans.getAllLoans.get(
          executionId
        );
        allLoans = allLoans.filter(
          (al) =>
            rootState.loanProducts.schemeCodes.indexOf(
              al.basicDetails.schemeCode
            ) > -1
        );
        dispatch.loans.addAllLoans({ allLoans });
      } catch (e) {
        crashlytics().log(
          ErrorUtil.createError(
            e,
            e.message,
            e.message,
            { _, rootState },
            "getAllLoans()",
            "loans.js"
          )
        );
        console.log(e.stack);
        console.log(e.message);
      }
    },
  }),
};
export default loans;
