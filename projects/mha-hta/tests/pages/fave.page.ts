import { FavePage as AtsFavePage } from '@shared/mha-ats/pages/fave.page';

/** HTA FAVE page: asset IDs come from each row's own "Asset ID:" label (see the shared FavePage). */
export class FavePage extends AtsFavePage {
  protected override readonly assetIdByLabel = true;
}