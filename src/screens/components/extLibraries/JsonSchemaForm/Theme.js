import FieldTemplate from './fields/FieldTemplate'
import ObjectFieldTemplate from './fields/ObjectFieldTemplate'
import ArrayFieldTemplate from './fields/ArrayFieldTemplate'
import ErrorList from './ErrorList'
import { MockHTMLForm } from './MockHTMLForm'
import { Widgets } from './widgets/Widgets'
import { Fields } from './fields/Fields'

const Theme = {
  widgets: Widgets,
  fields: Fields,
  FieldTemplate,
  ObjectFieldTemplate,
  ArrayFieldTemplate,
  ErrorList,
  tagName: MockHTMLForm
}

export {
  Theme,
  FieldTemplate,
  ObjectFieldTemplate,
  ArrayFieldTemplate,
  ErrorList,
  MockHTMLForm
}
