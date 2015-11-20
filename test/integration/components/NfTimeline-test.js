import React, { addons, findDOMNode } from 'react';
import { TestUtils } from 'react-addon-testutils';
import NfTimeline from 'etui/components/NfTimeline';
import NfTimelineEvent from 'etui/components/NfTimelineEvent';

//const { TestUtils } = addons;

describe('NfTimeline integration', () => {
  it('should do things', () => {
    const timeline = TestUtils.renderIntoDocument(<NfTimeline>
      <NfTimelineEvent />
    </NfTimeline>);
    throw 'bad';
    (findDOMNode(timeline).firstChild instanceof HTMLDivElement).should.equal(true);
  });
});