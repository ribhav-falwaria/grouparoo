import TitleField from './TitleField'
import MultiSchemaField from './MultiSchemaField'
import BooleanField from './BooleanField'
import NullField from './NullField.js'
import NumberField from './NumberField'
import StringField from './StringField'
import SchemaField from './SchemaField'
import UnsupportedField from './UnsupportedField'
import DescriptionField from './DescriptionField'
import ObjectField from './ObjectField'
import ArrayField from './ArrayField'
export const Fields = {
  TitleField,
  AnyOfField: MultiSchemaField,
  OneOfField: MultiSchemaField,
  BooleanField,
  NullField,
  NumberField,
  StringField,
  SchemaField,
  UnsupportedField,
  DescriptionField,
  ObjectField,
  ArrayField
}
