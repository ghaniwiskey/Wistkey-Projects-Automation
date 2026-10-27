import { AssignmentCreatePage as AtsAssignmentCreatePage } from '@shared/mha-ats/pages/assignment-create.page';

export type { AssignmentType, NewAssignment } from '@shared/mha-ats/pages/assignment-create.page';

/**
 * HTA assignment wizard: HTA UAT has assets whose group belongs to another cost centre (e.g. a 338000 asset in
 * "CCS - EMSB"), so the location step can open with an empty Group / NPC / Base; then the first offered group
 * is picked (see the shared AssignmentCreatePage).
 */
export class AssignmentCreatePage extends AtsAssignmentCreatePage {
  protected override fillsEmptyLocationGroup = true;
}