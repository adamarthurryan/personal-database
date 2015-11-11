'use strict';

import alt from 'components/Dispatcher';
import { EntryStore } from 'stores//EntryStore';
import AltTestingUtils from 'alt/utils/AltTestingUtils';

describe('EntryStore', () => {

  let storeClass;

  // Clean up localStorage before each try
  beforeEach(() => {
    storeClass = AltTestingUtils.makeStoreTestable(alt, EntryStore);
  });
});
