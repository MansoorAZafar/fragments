const {
  writeFragment,
  readFragment,
  writeFragmentData,
  readFragmentData,
  deleteFragment,
} = require('../../src/model/data/memory/index');

function uniqueId() {
  const uuid = crypto.randomUUID();
  return uuid;
}

describe('UniqueID', () => {
  test('uniqueID should never give the same ID', () => {
    const numTests = 50;
    for (let i = 0; i < numTests; ++i) {
      expect(uniqueId()).not.toEqual(uniqueId());
    }
  });
});

describe('MemoryDB Fragment Functions', () => {
  //put some dummy data
  const fragments = [
    { ownerId: 'mansoor', id: '320' },
    { ownerId: 'fussin', id: '2' },
    { ownerId: 'broski', id: '56' },
  ];

  const fragmentDatas = [
    { ownerId: 'elmo', id: '1', buffer: { street: 'sesame st', age: 3 } },
    { ownerId: 'joe', id: '15', buffer: { age: 15, iq: '102' } },
    {
      ownerId: 'rm -rf',
      id: '100',
      buffer: { manual: 'removes recursively', warn: 'use with caution' },
    },
  ];

  beforeEach(async () => {
    await writeFragment(fragments[0]);
    await writeFragment(fragments[1]);

    // write this one to normal fragment to test delete with an existing one
    await writeFragment({ ownerId: fragmentDatas[1].ownerId, id: fragmentDatas[1].id });

    await writeFragmentData(fragmentDatas[0].ownerId, fragmentDatas[0].id, fragmentDatas[0].buffer);
    await writeFragmentData(fragmentDatas[1].ownerId, fragmentDatas[1].id, fragmentDatas[1].buffer);
  });

  test('writeFragment(fragment) should store fragments metadata to db', async () => {
    const fragment = { ownerId: 'yuh', id: '102' };

    await writeFragment(fragment);
    const storedFragment = await readFragment(fragment.ownerId, fragment.id);
    expect(storedFragment).toEqual(fragment);
  });

  test('readFragment(ownerId, id) should store raw JSON data', async () => {
    const storedFragment = await readFragment(fragments[0].ownerId, fragments[0].id);
    expect(storedFragment).toEqual(fragments[0]);
  });

  test('readFragment(ownerId, id) should return nothing if fragment doesnt exist in db', async () => {
    const storedFragment = await readFragment(fragments[2].ownerId, fragments[2].id);
    expect(storedFragment).toEqual(undefined);
  });

  test('writeFragmentData(ownerId, id, buffer) should write the fragments data buffer to the db', async () => {
    const ownerId = 'ba ba black sheep';
    const id = '50';
    const buffer = { wool: false, bags_full: 3 };

    await writeFragmentData(ownerId, id, buffer);
    const storedFragment = await readFragmentData(ownerId, id);
    expect(storedFragment).toEqual(buffer);
  });

  test('readFragmentData(ownerId, id) should return the fragments buffer', async () => {
    const storedFragment = [
      await readFragmentData(fragmentDatas[1].ownerId, fragmentDatas[1].id),
      await readFragmentData(fragmentDatas[0].ownerId, fragmentDatas[0].id),
    ];

    expect(storedFragment[0]).toEqual(fragmentDatas[1].buffer);
    expect(storedFragment[1]).toEqual(fragmentDatas[0].buffer);
  });

  test('readFragmentData(ownerId, id) should return undefined if not in db', async () => {
    const storedFragment = await readFragmentData(fragmentDatas[2].ownerId, fragmentDatas[2].id);
    expect(storedFragment).toEqual(undefined);
  });

  test('deleteFragment(ownerId, id) should delete the data from the db for a newly added item', async () => {
    const fragment = { ownerId: 'I should be deleted', id: '-55', buffer: { deletable: true } };
    // Write the fragment into BOTH db's
    //  - delete needs it to be written in both db's ...
    await writeFragment(fragment);
    await writeFragmentData(fragment.ownerId, fragment.id, fragment.buffer);
    let storedFragment = await readFragment(fragment.ownerId, fragment.id);
    // ensure the fragment is there
    expect(storedFragment).toEqual(fragment);

    //ensure the buffer data is correct too
    storedFragment = await readFragmentData(fragment.ownerId, fragment.id);
    expect(storedFragment).toEqual(fragment.buffer);

    await deleteFragment(fragment.ownerId, fragment.id);
    storedFragment = await readFragment(fragment.ownerId, fragment.id);

    //Ensure the fragment is deleted
    expect(storedFragment).toEqual(undefined);
  });

  test('deleteFragment(ownerId, id) deleting an already existing data', async () => {
    //make sure the data's there
    let storedFragment = await readFragment(fragmentDatas[1].ownerId, fragmentDatas[1].id);
    expect(storedFragment).toEqual({ ownerId: fragmentDatas[1].ownerId, id: fragmentDatas[1].id });

    storedFragment = await readFragmentData(fragmentDatas[1].ownerId, fragmentDatas[1].id);
    expect(storedFragment).toEqual(fragmentDatas[1].buffer);

    // Delete the data
    await deleteFragment(fragmentDatas[1].ownerId, fragmentDatas[1].id);
    storedFragment = await readFragment(fragmentDatas[1].ownerId, fragmentDatas[1].id);

    // ensure its undefined (means its deleted)
    expect(storedFragment).toEqual(undefined);
  });
});
