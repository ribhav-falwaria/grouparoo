import { AuthenticatedAction } from "../classes/actions/authenticatedAction";
import { SetupStep } from "../models/SetupStep";
import { Setting } from "../models/Setting";
import { AsyncReturnType } from "type-fest";

export class SetupStepsList extends AuthenticatedAction {
  constructor() {
    super();
    this.name = "setupSteps:list";
    this.description = "List the SetupSteps and their status";
    this.permission = { topic: "setupStep", mode: "read" };
    this.outputExample = {};
  }

  isWriteTransaction() {
    // setupStep.performCheck() can do an update
    return true;
  }

  async runWithinTransaction() {
    const setupSteps = await SetupStep.findAll({
      order: [["position", "asc"]],
    });

    const responseSetupSteps: Array<
      AsyncReturnType<typeof SetupStep.prototype.apiData>
    > = [];

    for (const i in setupSteps) {
      await setupSteps[i].performCheck();
      responseSetupSteps.push(await setupSteps[i].apiData());
    }

    const setting = await Setting.findOne({
      where: { key: "display-startup-steps" },
    });

    const toDisplay = setting.value === "true";

    return { toDisplay, setupSteps: responseSetupSteps };
  }
}

export class SetupStepEdit extends AuthenticatedAction {
  constructor() {
    super();
    this.name = "setupStep:edit";
    this.description = "List the SetupSteps and their status";
    this.permission = { topic: "setupStep", mode: "write" };
    this.outputExample = {};
    this.inputs = {
      id: { required: true },
      skipped: { required: false },
    };
  }

  async runWithinTransaction({ params }) {
    const setupStep = await SetupStep.findById(params.id);

    if (params.skipped !== null) {
      await setupStep.update({ skipped: params.skipped });
    }

    await setupStep.performCheck();
    return { setupStep: await setupStep.apiData() };
  }
}
