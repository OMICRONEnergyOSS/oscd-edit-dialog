import { Wizard } from '../foundation.js';

import { createBayWizard, editBayWizard } from './bay.js';
import {
  createConductingEquipmentWizard,
  editConductingEquipmentWizard,
} from './conductingequipment.js';
import {
  createConnectedApWizard,
  editConnectedApWizard,
} from './connectedap.js';
import { createDaWizard, editDAWizard } from './da.js';
import { createDoWizard, editDoWizard } from './do.js';
import { createEnumValWizard, editEnumValWizard } from './enumval.js';
import { createEqFunctionWizard, editEqFunctionWizard } from './eqfunction.js';
import {
  createEqSubFunctionWizard,
  editEqSubFunctionWizard,
} from './eqsubfunction.js';
import { createFunctionWizard, editFunctionWizard } from './function.js';
import {
  createGeneralEquipmentWizard,
  editGeneralEquipmentWizard,
} from './generalEquipment.js';
import { createLineWizard, editLineWizard } from './line.js';
import {
  createPowerTransformerWizard,
  editPowerTransformerWizard,
} from './powertransformer.js';
import { createProcessWizard, editProcessWizard } from './process.js';
import { createSDoWizard, editSDoWizard } from './sdo.js';
import {
  createSubEquipmentWizard,
  editSubEquipmentWizard,
} from './subequipment.js';
import {
  createSubFunctionWizard,
  editSubFunctionWizard,
} from './subfunction.js';
import { createSubNetworkWizard, editSubNetworkWizard } from './subnetwork.js';
import { createSubstationWizard, editSubstationWizard } from './substation.js';
import { createTapChangerWizard, editTapChangerWizard } from './tapchanger.js';
import { createTextWizard, editTextWizard } from './text.js';
import {
  createTransformerWindingWizard,
  editTransformerWindingWizard,
} from './transformerWinding.js';
import {
  createVoltageLevelWizard,
  editVoltageLevelWizard,
} from './voltagelevel.js';

import { editGseWizard } from './gse.js';
import { editIEDWizard } from './ied.js';
import { editLDeviceWizard } from './ldevice.js';
import { editSMvWizard } from './smv.js';

import { createDOTypeWizard } from './dotype.js';
import { createEnumTypeWizard } from './enumtype.js';
import { createLNodeTypeWizard } from './lnodetype.js';
import { createLNodeWizard } from './lnode.js';
import { editBDaWizard } from './bda.js';

type SclElementWizard = (
  element: Element,
  subWizard?: boolean,
  instanceElement?: Element,
) => Wizard | undefined;

export function emptyWizard(): Wizard | undefined {
  return undefined;
}

export const wizards: Record<
  string,
  {
    edit: SclElementWizard;
    create: SclElementWizard;
  }
> = {
  AccessControl: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  AccessPoint: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  Address: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  Association: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  Authentication: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  Bay: {
    edit: editBayWizard,
    create: createBayWizard,
  },
  BDA: {
    edit: editBDaWizard,
    create: emptyWizard,
  },
  BitRate: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  ClientLN: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  ClientServices: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  CommProt: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  Communication: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  ConductingEquipment: {
    edit: editConductingEquipmentWizard,
    create: createConductingEquipmentWizard,
  },
  ConfDataSet: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  ConfLdName: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  ConfLNs: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  ConfLogControl: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  ConfReportControl: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  ConfSG: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  ConfSigRef: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  ConnectedAP: {
    edit: editConnectedApWizard,
    create: createConnectedApWizard,
  },
  DA: {
    edit: editDAWizard,
    create: createDaWizard,
  },
  DAType: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  DO: {
    edit: editDoWizard,
    create: createDoWizard,
  },
  DOI: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  DOType: {
    edit: emptyWizard,
    create: createDOTypeWizard,
  },
  DataObjectDirectory: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  DataSet: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  DataSetDirectory: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  DataTypeTemplates: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  DynAssociation: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  DynDataSet: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  EnumType: {
    edit: emptyWizard,
    create: createEnumTypeWizard,
  },
  EnumVal: {
    edit: editEnumValWizard,
    create: createEnumValWizard,
  },
  EqFunction: {
    edit: editEqFunctionWizard,
    create: createEqFunctionWizard,
  },
  EqSubFunction: {
    edit: editEqSubFunctionWizard,
    create: createEqSubFunctionWizard,
  },
  ExtRef: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  FileHandling: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  Function: {
    edit: editFunctionWizard,
    create: createFunctionWizard,
  },
  GeneralEquipment: {
    edit: editGeneralEquipmentWizard,
    create: createGeneralEquipmentWizard,
  },
  GetCBValues: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  GetDataObjectDefinition: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  GetDataSetValue: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  GetDirectory: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  GOOSE: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  GOOSESecurity: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  GSE: {
    edit: editGseWizard,
    create: emptyWizard,
  },
  GSEDir: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  GSESettings: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  GSSE: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  Header: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  History: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  Hitem: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  IED: {
    edit: editIEDWizard,
    create: emptyWizard,
  },
  IEDName: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  Inputs: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  IssuerName: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  KDC: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  LDevice: {
    edit: editLDeviceWizard,
    create: emptyWizard,
  },
  LN: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  LN0: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  LNode: {
    edit: emptyWizard,
    create: createLNodeWizard,
  },
  LNodeType: {
    edit: emptyWizard,
    create: createLNodeTypeWizard,
  },
  Line: {
    edit: editLineWizard,
    create: createLineWizard,
  },
  Log: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  LogControl: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  LogSettings: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  MaxTime: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  McSecurity: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  MinTime: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  NeutralPoint: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  P: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  PhysConn: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  PowerTransformer: {
    edit: editPowerTransformerWizard,
    create: createPowerTransformerWizard,
  },
  Private: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  Process: {
    edit: editProcessWizard,
    create: createProcessWizard,
  },
  ProtNs: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  Protocol: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  ReadWrite: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  RedProt: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  ReportControl: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  ReportSettings: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  RptEnabled: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  SamplesPerSec: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  SecPerSamples: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  SCL: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  SDI: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  SDO: {
    edit: editSDoWizard,
    create: createSDoWizard,
  },
  Server: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  ServerAt: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  Services: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  SetDataSetValue: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  SettingControl: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  SettingGroups: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  SGEdit: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  SmpRate: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  SMV: {
    edit: editSMvWizard,
    create: emptyWizard,
  },
  SmvOpts: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  SMVsc: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  SMVSecurity: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  SMVSettings: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  SubEquipment: {
    edit: editSubEquipmentWizard,
    create: createSubEquipmentWizard,
  },
  SubFunction: {
    edit: editSubFunctionWizard,
    create: createSubFunctionWizard,
  },
  SubNetwork: {
    edit: editSubNetworkWizard,
    create: createSubNetworkWizard,
  },
  Subject: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  Substation: {
    edit: editSubstationWizard,
    create: createSubstationWizard,
  },
  SupSubscription: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  TapChanger: {
    edit: editTapChangerWizard,
    create: createTapChangerWizard,
  },
  Text: {
    edit: editTextWizard,
    create: createTextWizard,
  },
  TimerActivatedControl: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  TimeSyncProt: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  TransformerWinding: {
    edit: editTransformerWindingWizard,
    create: createTransformerWindingWizard,
  },
  Val: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  ValueHandling: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  Voltage: {
    edit: emptyWizard,
    create: emptyWizard,
  },
  VoltageLevel: {
    edit: editVoltageLevelWizard,
    create: createVoltageLevelWizard,
  },
};
