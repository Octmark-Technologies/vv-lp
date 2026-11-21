"use client";

import { BuildScene } from "../lp1/BuildScene";
import { PayAside } from "./PayAside";

/** LP2 signature scene: the LP1 build scene in "pay" mode, with the payment meter beside the rising tower. */
export function PayScene() {
  return <BuildScene mode="pay" aside={(s) => <PayAside {...s} />} />;
}
