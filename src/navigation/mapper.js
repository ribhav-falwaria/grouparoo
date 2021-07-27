// @scripts
import HomeContainer from '../containers/HomeContainer'
import MyLoansContainer from '../containers/MyLoansContainer'

const components = {
  HomeContainer,
  MyLoansContainer
};

/**
 * @param {string} componentName
 * @returns {function}
 */
export const mapComponent = componentName =>
    components[componentName];
