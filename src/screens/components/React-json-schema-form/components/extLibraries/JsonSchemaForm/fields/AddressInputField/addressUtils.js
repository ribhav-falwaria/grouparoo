import { JsonMapper } from "json-data-mapper";
import isEmpty from "lodash.isempty";
import * as flat from "flat";
import crashlytics from "@react-native-firebase/crashlytics";
import ErrorUtil from "../../../../../../../Errors/ErrorUtil";
const gstnAddressSchema = {
  isList: true,
  format: {
    roadStreetLane: {
      sourceField: "pradr.addr.st",
    },
    villageTown: {
      sourceField: "pradr.addr.loc",
    },
    block: {
      sourceField: "pradr.addr.bno",
    },
    state: {
      sourceField: "pradr.addr.stcd",
    },
    district: {
      sourceField: "pradr.addr.dst",
    },
    flatDoorBlockNo: {
      sourceField: "pradr.addr.flno",
    },
    pin: {
      sourceField: "pradr.addr.pncd",
    },
    city: {
      sourceField: "pradr.addr.city",
    },
  },
};
const udyamAddrSchema = {
  isList: false,
  format: {
    roadStreetLane: {
      sourceField: "officialAddressOfEnterprise.roadStreetLane",
    },
    villageTown: {
      sourceField: "officialAddressOfEnterprise.villageTown",
    },
    block: {
      sourceField: "officialAddressOfEnterprise.block",
    },
    state: {
      sourceField: "officialAddressOfEnterprise.state",
    },
    district: {
      sourceField: "officialAddressOfEnterprise.district",
    },
    flatDoorBlockNo: {
      sourceField: "officialAddressOfEnterprise.flatDoorBlockNo",
    },
    pin: {
      sourceField: "officialAddressOfEnterprise.pin",
    },
    mobile: {
      sourceField: "officialAddressOfEnterprise.mobile",
    },
    email: {
      sourceField: "officialAddressOfEnterprise.email",
    },
    nameOfPremisesBuilding: {
      sourceField: "officialAddressOfEnterprise.nameOfPremisesBuilding",
    },
    city: {
      sourceField: "officialAddressOfEnterprise.city",
    },
  },
};
const addressMapper = (addressData, sourceDisplay) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "addressMapper method starts here ",
      { addressData, sourceDisplay },
      "addressMapper()",
      "addressUtils.js"
    )
  );
  const {
    flatDoorBlockNo,
    block,
    roadStreetLane,
    villageTown,
    district,
    city,
    state,
    pin,
  } = addressData;
  return {
    source: sourceDisplay,
    address1: `${flatDoorBlockNo}, ${block}`,
    address2: `${roadStreetLane}, ${villageTown}, ${district}`,
    city: city && city.length > 0 ? city : district,
    state,
    zipCode: pin,
  };
};
export const transformData = (data, sourceType = "gstn", sourceDisplay) => {
  crashlytics().log(
    ErrorUtil.createLog(
      "transformData method starts here ",
      { data, sourceType, sourceDisplay },
      "transformData()",
      "addressUtils.js"
    )
  );
  if (isEmpty(data)) {
    return [];
  }
  let schema;
  if (sourceType === "gstn") {
    schema = JSON.parse(JSON.stringify(gstnAddressSchema));
  } else {
    schema = JSON.parse(JSON.stringify(udyamAddrSchema));
  }
  if (Array.isArray(data) && data.length > 0) {
    schema.isList = true;
  }
  const addresses = [];
  const transformData = JsonMapper.formatToSchema(schema, flat.flatten(data));
  if (Array.isArray(transformData)) {
    transformData.forEach((td) => {
      addresses.push(addressMapper(td, sourceDisplay));
    });
  } else {
    addresses.push(addressMapper(transformData, sourceDisplay));
  }
  return addresses;
};
