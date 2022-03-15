import apiService from "../../apiService";
import { config } from "../../config";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../../../screens/Errors/ErrorUtil";
const loanProducts = {
  name: "loanProducts",
  state: {},
  selectors: {
    list: (select) => (rootState) => {
      const { loanProducts } = rootState;
      return Object.keys(loanProducts).map((ky) => loanProducts[ky]);
    },
    getProductBySchemeCode:
      (select) =>
      (rootState, { schemeCode, schemeName }) => {
        crashlytics().log(
          ErrorUtil.createLog(
            " getProductBySchemeCode method starts here",
            { schemeCode, schemeName, rootState },
            "getProductBySchemeCode()",
            "loanProducts.js"
          )
        );
        const lps = select.loanProducts.list(rootState);
        return lps.find((lp) => lp.schemeCode === schemeCode);
      },
    getProductDisplayName:
      (select) =>
      (rootState, { schemeCode, productCode }) => {
        crashlytics().log(
          ErrorUtil.createLog(
            " getProductDisplayName method starts here",
            { schemeCode, productCode, rootState },
            "getProductDisplayName()",
            "loanProducts.js"
          )
        );
        const product = select.loanProducts.getProductBySchemeCode(rootState, {
          schemeCode,
          productCode,
        });
        const name = product.loanType.name;
        return name;
      },
    getInterestFrequency:
      (select) =>
      (rootState, { schemeCode, schemeName }) => {
        crashlytics().log(
          ErrorUtil.createLog(
            " getInterestFrequency method starts here",
            { schemeCode, schemeName, rootState },
            "getInterestFrequency()",
            "loanProducts.js"
          )
        );
        const product = select.loanProducts.getProductBySchemeCode(rootState, {
          schemeCode,
          schemeName,
        });
        const rpMode = product.repaymentMode.repaymentMode;
        let interestFrequency;
        if (
          rpMode === config.REPAYMENT_UPFRONT_EQUATED ||
          rpMode === config.REPAYMENT_UPFRONT_AMORTIZED
        ) {
          interestFrequency = `period.${interestFrequency}ly.upfront`;
        } else if (rpMode === config.REPAYMENT_BULLET_BEGINNING) {
          interestFrequency = "period.paidUpfront";
        } else if (rpMode === config.REPAYMENT_BULLET_END) {
          interestFrequency = "period.paidAtend";
        }
        return interestFrequency;
      },
    getRepaymentDescription:
      (select) =>
      (rootState, { schemeCode, schemeName }) => {
        crashlytics().log(
          ErrorUtil.createLog(
            " getRepaymentDescription method starts here",
            { schemeCode, schemeName, rootState },
            "getRepaymentDescription()",
            "loanProducts.js"
          )
        );
        const product = select.loanProducts.getProductBySchemeCode(rootState, {
          schemeCode,
          schemeName,
        });
        const rpMode = product.repaymentMode.repaymentMode;

        if (
          rpMode === config.REPAYMENT_AMORTIZED ||
          rpMode === config.REPAYMNET_EQUATED
        ) {
          return {
            description: "loan.amortization",
            mode: rpMode,
          };
        } else if (
          rpMode === config.REPAYMENT_UPFRONT_EQUATED ||
          rpMode === config.REPAYMENT_UPFRONT_EQUATED
        ) {
          return {
            principal: "loan.principalAmount",
            pincipalAndInterest: "loan.principalAndInterest",
            interest: "loan.interestAmount",
            mode: rpMode,
          };
        } else if (rpMode === config.REPAYMENT_BULLET_END) {
          return {
            description: "loan.repaymentAmount",
            principal: "loan.principalAmount",
            interest: "loan.interestAmount",
            mode: rpMode,
          };
        } else if (
          product.interestRepaymentMode === config.REPAYMENT_BULLET_BEGINNING
        ) {
          return {
            principal: "loan.principalAmount",
            mode: rpMode,
          };
        }
      },
    getRepaymentFrequencyForDisplay:
      (select) =>
      (rootState, { schemeCode, schemeName }) => {
        crashlytics().log(
          ErrorUtil.createLog(
            " getRepaymentFrequencyForDisplay method starts here",
            { schemeCode, schemeName, rootState },
            "getRepaymentFrequencyForDisplay()",
            "loanProducts.js"
          )
        );
        const product = select.loanProducts.getProductBySchemeCode(rootState, {
          schemeCode,
          schemeName,
        });
        if (product.interestRepaymentMode === config.REPAYMENT_AMORTIZED) {
          return {
            repaymentFrequency: `period.per.${product.interestFrequency}`,
            repaymentMode: `product.repayment.${product.interestRepaymentMode}`,
          };
        } else if (product.interestRepaymentMode === config.REPAYMNET_UPFRONT) {
          return {
            repaymentMode: `product.repayment.${product.interestRepaymentMode}`,
            interestFrequency: `period.per.${product.interestFrequency}`,
            principalFrequency: `period.per.${product.principalFrequency}`,
            repaymentModeInterest: `product.repayment.interest.${product.interestRepaymentMode}`,
            repaymentModePrincipal: `product.repayment.principal.${product.interestRepaymentMode}`,
          };
        } else if (
          product.interestRepaymentMode === config.REPAYMENT_BULLET_END
        ) {
          return {
            repaymentMode: `product.repayment.${product.interestRepaymentMode}`,
            repaymentModeInterest: `product.repayment.interest.${product.interestRepaymentMode}`,
            repaymentModePrincipal: `product.repayment.principal.${product.interestRepaymentMode}`,
          };
        } else if (
          product.interestRepaymentMode === config.REPAYMENT_BULLET_BEGINNING
        ) {
          return {
            repaymentMode: `product.repayment.${product.interestRepaymentMode}`,
            repaymentFrequency: `product.repayment.interest.${product.interestRepaymentMode}`,
          };
        } else {
          return {};
        }
      },
  },
  reducers: {
    setLoanProducts: (state, { products }) => {
      crashlytics().log(
        ErrorUtil.createLog(
          " setLoanProducts method starts here",
          { state, products },
          "setLoanProducts()",
          "loanProducts.js"
        )
      );
      products.forEach((pr) => {
        state[pr.id] = pr;
      });
      state.schemeCodes = products.map((p) => p.schemeCode);
      return state;
    },
  },
  effects: (dispatch) => ({
    async getAllProducts(_, rootState) {
      crashlytics().log(
        ErrorUtil.createLog(
          " getAllProducts method starts here",
          { _, rootStates },
          "getAllProducts()",
          "loanProducts.js"
        )
      );
      try {
        const executionId =
          await apiService.appApi.loanProducts.getAll.execute();
        const products = await apiService.appApi.loanProducts.getAll.get(
          executionId
        );
        dispatch.loanProducts.setLoanProducts({ products });
      } catch (e) {
        crashlytics().log(
          ErrorUtil.createError(
            e,
            e.message,
            e.message,
            { _, rootStates },
            "getAllProducts()",
            "loanProducts.js"
          )
        );
        throw new Error(e.message);
      }
    },
  }),
};

export default loanProducts;
