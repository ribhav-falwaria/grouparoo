import * as Masks from "./masks";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../../../../../../screens/Errors/ErrorUtil";

let maskKeys = Object.keys(Masks);

export default class MaskResolver {
  static resolve(type) {
    crashlytics().log(
      ErrorUtil.createLog(
        "resolve method starts here ",
        { type },
        "resolve()",
        "MaskResolver.js"
      )
    );
    const maskKey = maskKeys.find((m) => {
      const thisHandler = Masks[m];
      return (
        thisHandler && thisHandler.getType && thisHandler.getType() === type
      );
    });

    const handler = Masks[maskKey];

    if (!handler) {
      throw new Error("Mask type not supported.");
    }

    return new handler();
  }
}
