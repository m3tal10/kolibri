import { UserKinds, NavComponentSections } from 'kolibri.coreVue.vuex.constants';
import logger from 'kolibri.lib.logging';

const logging = logger.getLogger(__filename);

const navComponents = [];

function checkDeclared(property) {
  return typeof property !== 'undefined' && property !== null;
}

function validatePriority(priority) {
  // Optional, must be an integer between 0 and +inf.
  // Note: closer to 0 is 'higher priority'
  return (
    !checkDeclared(priority) ||
    (typeof priority === 'number' && priority >= 0 && Number.isInteger(priority))
  );
}

function validateRole(role) {
  // Optional, must be one of the defined UserKinds
  return !checkDeclared(role) || Object.values(UserKinds).includes(role);
}

function validateSection(section) {
  // Optional, must be one of the defined NavComponentSections
  return !checkDeclared(section) || Object.values(NavComponentSections).includes(section);
}

function validateComponent(component) {
  return (
    validatePriority(component.priority) &&
    validateRole(component.role) &&
    validateSection(component.section)
  );
}

navComponents.register = component => {
  // take a secondary argument, undefined or array of configuration options
  // component, keyed by component name
  // this is the place where we read the bottom bar and the urls
  // follow the lookup in coremenu option for current state (which elements should we be looking at)
  // app bar page is responsible for if we should show the bottom bar or not
  // the actual bottom bar just worries about showing the components
  if (!navComponents.includes(component)) {
    if (validateComponent(component)) {
      navComponents.push(component);
    } else {
      logging.error('Component has invalid priority, role, or section');
    }
  } else {
    logging.warn('Component has already been registered');
  }
};

export default navComponents;
