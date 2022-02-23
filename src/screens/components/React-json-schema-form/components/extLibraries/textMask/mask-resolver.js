import * as Masks from './masks'

let maskKeys = Object.keys(Masks)

export default class MaskResolver {
  static resolve (type) {
    const maskKey = maskKeys.find(m => {
      const thisHandler = Masks[m]
      return thisHandler && thisHandler.getType && thisHandler.getType() === type
    })

    const handler = Masks[maskKey]

    if (!handler) {
      throw new Error('Mask type not supported.')
    }

    return new handler()
  }
}
